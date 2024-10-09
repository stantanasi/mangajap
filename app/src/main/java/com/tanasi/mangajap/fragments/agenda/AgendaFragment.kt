package com.tanasi.mangajap.fragments.agenda

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.google.android.material.tabs.TabLayout
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.FragmentAgendaBinding
import com.tanasi.mangajap.utils.preferences.GeneralPreference

class AgendaFragment : Fragment() {

    private enum class AgendaTab(val stringId: Int) {
        MANGA(R.string.read_list),
        ANIME(R.string.watch_list);
    }

    private var _binding: FragmentAgendaBinding? = null
    private val binding get() = _binding!!

    private lateinit var generalPreference: GeneralPreference

    private var currentTab = AgendaTab.entries.first()
    private val mangaFragment by lazy { binding.fAgendaManga.getFragment<AgendaMangaFragment>() }
    private val animeFragment by lazy { binding.fAgendaAnime.getFragment<AgendaAnimeFragment>() }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentAgendaBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        generalPreference = GeneralPreference(requireContext())

        initializeAgenda()
    }


    private fun initializeAgenda() {
        currentTab = when (generalPreference.displayFirst) {
            GeneralPreference.DisplayFirst.Manga -> AgendaTab.MANGA
            GeneralPreference.DisplayFirst.Anime -> AgendaTab.ANIME
        }

        binding.tlAgenda.apply {
            AgendaTab.entries
                .map { newTab().setText(getString(it.stringId)) }
                .forEach { addTab(it) }

            addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
                override fun onTabSelected(tab: TabLayout.Tab) {
                    currentTab = AgendaTab.entries[tab.position]
                    generalPreference.displayFirst = when (currentTab) {
                        AgendaTab.MANGA -> GeneralPreference.DisplayFirst.Manga
                        AgendaTab.ANIME -> GeneralPreference.DisplayFirst.Anime
                    }
                    showTab()
                }

                override fun onTabUnselected(tab: TabLayout.Tab) {}
                override fun onTabReselected(tab: TabLayout.Tab) {}
            })
            getTabAt(currentTab.ordinal)?.apply {
                select()
                showTab()
            }
        }
    }

    private fun showTab() {
        childFragmentManager.beginTransaction().apply {
            when (currentTab) {
                AgendaTab.MANGA -> show(mangaFragment)
                else -> hide(mangaFragment)
            }
            when (currentTab) {
                AgendaTab.ANIME -> show(animeFragment)
                else -> hide(animeFragment)
            }
            commitAllowingStateLoss()
        }
    }
}