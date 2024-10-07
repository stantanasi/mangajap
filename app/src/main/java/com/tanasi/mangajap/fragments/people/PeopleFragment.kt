package com.tanasi.mangajap.fragments.people

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.tabs.TabLayout
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.databinding.FragmentPeopleBinding
import com.tanasi.mangajap.fragments.recyclerView.RecyclerViewFragment
import com.tanasi.mangajap.models.People
import com.tanasi.mangajap.utils.extensions.add
import com.tanasi.mangajap.utils.extensions.contains
import com.tanasi.mangajap.utils.extensions.setToolbar

class PeopleFragment : Fragment() {

    private enum class PeopleTab(
        val stringId: Int,
        var fragment: RecyclerViewFragment = RecyclerViewFragment(),
        var list: MutableList<AppAdapter.Item> = mutableListOf()
    ) {
        Manga(R.string.manga),
        Anime(R.string.anime);
    }

    private var _binding: FragmentPeopleBinding? = null
    private val binding: FragmentPeopleBinding get() = _binding!!

    private val viewModel: PeopleViewModel by viewModels()

    private val args: PeopleFragmentArgs by navArgs()

    private lateinit var people: People

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentPeopleBinding.inflate(inflater, container, false)
        viewModel.getPeople(args.peopleId)
        PeopleTab.values().forEach {
            it.fragment = RecyclerViewFragment()
            it.list = mutableListOf()
        }
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setToolbar(args.peopleName, "")

        PeopleTab.values().forEach {
            it.fragment.setList(it.list, LinearLayoutManager(requireContext()))
        }

        viewModel.state.observe(viewLifecycleOwner) { state ->
            when (state) {
                PeopleViewModel.State.Loading -> binding.isLoading.root.visibility = View.VISIBLE
                is PeopleViewModel.State.SuccessLoading -> {
                    people = state.people
                    displayPeople()
                    binding.isLoading.root.visibility = View.GONE
                }
                is PeopleViewModel.State.FailedLoading -> when (state.error) {
                    is JsonApiResponse.Error.ServerError -> state.error.body.errors.map {
                        Toast.makeText(requireContext(), it.title, Toast.LENGTH_SHORT).show()
                    }
                    is JsonApiResponse.Error.NetworkError -> Toast.makeText(
                        requireContext(),
                        state.error.error.message ?: "",
                        Toast.LENGTH_SHORT
                    ).show()
                    is JsonApiResponse.Error.UnknownError -> Toast.makeText(
                        requireContext(),
                        state.error.error.message ?: "",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }


    private fun displayPeople() {
        setMangaFragment()
        setAnimeFragment()

        binding.tlPeople.apply {
            addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
                override fun onTabSelected(tab: TabLayout.Tab) {
                    PeopleTab.values()
                        .find { getString(it.stringId) == tab.text.toString() }
                        ?.let {
                            showTab(it)
                        }
                }

                override fun onTabUnselected(tab: TabLayout.Tab) {}
                override fun onTabReselected(tab: TabLayout.Tab) {}
            })
            getTabAt(selectedTabPosition)?.apply {
                select()
                PeopleTab.values()
                    .find { getString(it.stringId) == text.toString() }
                    ?.let {
                        showTab(it)
                    }
            }
        }
    }

    private fun setMangaFragment() {
        PeopleTab.Manga.list.apply {
            clear()
            people.mangaStaff
                    .sortedByDescending { it.manga?.startDate }
                    .map {staff ->
                        add(staff.also { it.itemType = AppAdapter.Type.STAFF_PEOPLE })
                    }
        }

        if (PeopleTab.Manga.list.isNotEmpty()) {
            if (PeopleTab.Manga.fragment.isAdded) PeopleTab.Manga.fragment.adapter?.notifyDataSetChanged()
            addTab(PeopleTab.Manga)
        }
    }

    private fun setAnimeFragment() {
        PeopleTab.Anime.list.apply {
            clear()
            people.animeStaff
                    .sortedByDescending { it.anime?.startDate }
                    .map {staff ->
                        add(staff.also { it.itemType = AppAdapter.Type.STAFF_PEOPLE })
                    }
        }

        if (PeopleTab.Anime.list.isNotEmpty()) {
            if (PeopleTab.Anime.fragment.isAdded) PeopleTab.Anime.fragment.adapter?.notifyDataSetChanged()
            addTab(PeopleTab.Anime)
        }
    }

    private fun addTab(peopleTab: PeopleTab) {
        val ft: FragmentTransaction = childFragmentManager.beginTransaction()

        if (!binding.tlPeople.contains(getString(peopleTab.stringId))) {
            binding.tlPeople.add(getString(peopleTab.stringId))
            if (peopleTab.fragment.isAdded) {
                ft.detach(peopleTab.fragment)
                ft.attach(peopleTab.fragment)
            } else {
                ft.add(binding.flPeople.id, peopleTab.fragment)
            }
        }

        ft.commitAllowingStateLoss()
    }

    private fun showTab(peopleTab: PeopleTab) {
        val ft: FragmentTransaction = childFragmentManager.beginTransaction()

        PeopleTab.values().forEach {
            when (peopleTab) {
                it -> ft.show(peopleTab.fragment)
                else -> ft.hide(it.fragment)
            }
        }

        ft.commitAllowingStateLoss()
    }
}