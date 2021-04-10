package com.tanasi.mangajap.fragments.agenda

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.tabs.TabLayout
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.databinding.FragmentAgendaBinding
import com.tanasi.mangajap.fragments.profile.ProfileFragment
import com.tanasi.mangajap.fragments.recyclerView.RecyclerViewFragment
import com.tanasi.mangajap.models.Header
import com.tanasi.mangajap.utils.extensions.add
import com.tanasi.mangajap.utils.extensions.contains
import com.tanasi.mangajap.utils.jsonApi.JsonApiResponse
import com.tanasi.mangajap.utils.preferences.GeneralPreference
import com.tanasi.mangajap.utils.preferences.UserPreference

class AgendaFragment : Fragment() {

    private enum class AgendaTab(
            val stringId: Int,
            var fragment: RecyclerViewFragment = RecyclerViewFragment(),
            val list: MutableList<MangaJapAdapter.Item> = mutableListOf()
    ) {
        ReadList(R.string.read_list),
        WatchList(R.string.watch_list);
    }

    private var _binding: FragmentAgendaBinding? = null
    private val binding: FragmentAgendaBinding get() = _binding!!

    private val viewModel: AgendaViewModel by viewModels()

    private lateinit var generalPreference: GeneralPreference
    private lateinit var userPreference: UserPreference

    private lateinit var actualTab: AgendaTab

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentAgendaBinding.inflate(inflater, container, false)
        AgendaTab.values().map {
            it.fragment = RecyclerViewFragment()
            it.fragment.setList(it.list, LinearLayoutManager(requireContext()))
            addTab(it)
        }
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        generalPreference = GeneralPreference(requireContext())
        userPreference = UserPreference(requireContext())

        viewModel.state.observe(viewLifecycleOwner) { state ->
            when (state) {
                AgendaViewModel.State.Loading -> binding.isLoading.cslIsLoading.visibility = View.VISIBLE
                is AgendaViewModel.State.SuccessLoading -> {
                    AgendaTab.ReadList.list.apply {
                        clear()
                        add(Header(getString(R.string.read_list)).also { it.typeLayout = MangaJapAdapter.Type.HEADER_AGENDA })
                        addAll(state.readingManga.filter { it.getProgress(it.manga!!) < 100 })
                    }
                    AgendaTab.WatchList.list.apply {
                        clear()
                        add(Header(getString(R.string.watch_list)).also { it.typeLayout = MangaJapAdapter.Type.HEADER_AGENDA })
                        addAll(state.watchingAnime.filter { it.getProgress(it.anime!!) < 100 })
                    }
                    AgendaTab.values().map { it.fragment.mangaJapAdapter?.notifyDataSetChanged() }
                    binding.isLoading.cslIsLoading.visibility = View.GONE
                }
                is AgendaViewModel.State.FailedLoading -> when (state.error) {
                    is JsonApiResponse.Error.ServerError -> Toast.makeText(requireContext(), getString(R.string.serverError), Toast.LENGTH_SHORT).show()
                    is JsonApiResponse.Error.NetworkError -> Toast.makeText(requireContext(), getString(R.string.serverError), Toast.LENGTH_SHORT).show()
                    is JsonApiResponse.Error.UnknownError -> Toast.makeText(requireContext(), getString(R.string.error), Toast.LENGTH_SHORT).show()
                }
            }
        }

        viewModel.getAgenda(userPreference.selfId)

        if (!this::actualTab.isInitialized) {
            actualTab = when (generalPreference.savedProfileTab) {
                ProfileFragment.TabType.Manga -> AgendaTab.ReadList
                ProfileFragment.TabType.Anime -> AgendaTab.WatchList
            }
        }

        displayAgenda()
    }


    private fun displayAgenda() {
        binding.tlAgenda.apply {
            addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
                override fun onTabSelected(tab: TabLayout.Tab) {
                    actualTab = AgendaTab.values()[tab.position]
                    generalPreference.savedProfileTab = when (actualTab) {
                        AgendaTab.ReadList -> ProfileFragment.TabType.Manga
                        AgendaTab.WatchList -> ProfileFragment.TabType.Anime
                    }
                    showTab(actualTab)
                }

                override fun onTabUnselected(tab: TabLayout.Tab) {}
                override fun onTabReselected(tab: TabLayout.Tab) {}
            })
            getTabAt(actualTab.ordinal)?.apply {
                select()
                showTab(actualTab)
            }
        }
    }


    private fun addTab(agendaTab: AgendaTab) {
        val ft: FragmentTransaction = childFragmentManager.beginTransaction()

        if (!binding.tlAgenda.contains(getString(agendaTab.stringId))) {
            binding.tlAgenda.add(getString(agendaTab.stringId))
            if (agendaTab.fragment.isAdded) {
                ft.detach(agendaTab.fragment)
                ft.attach(agendaTab.fragment)
            } else {
                ft.add(binding.flAgenda.id, agendaTab.fragment)
            }
        }

        ft.commitAllowingStateLoss()
    }

    private fun showTab(agendaTab: AgendaTab) {
        val ft: FragmentTransaction = childFragmentManager.beginTransaction()

        AgendaTab.values().map {
            if (agendaTab == it) {
                ft.show(agendaTab.fragment)
            } else {
                ft.hide(it.fragment)
            }
        }

        ft.commitAllowingStateLoss()
    }
}