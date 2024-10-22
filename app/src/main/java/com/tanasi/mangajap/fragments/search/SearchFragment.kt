package com.tanasi.mangajap.fragments.search

import android.content.Context
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.google.android.material.tabs.TabLayout
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.main.MainActivity
import com.tanasi.mangajap.databinding.FragmentSearchBinding
import com.tanasi.mangajap.utils.extensions.runOnUiThread
import com.tanasi.mangajap.utils.preferences.GeneralPreference
import java.util.Timer
import java.util.TimerTask

class SearchFragment : Fragment() {

    private enum class SearchTab(val stringId: Int) {
        Manga(R.string.manga),
        Anime(R.string.anime),
        Users(R.string.users);
    }

    private var _binding: FragmentSearchBinding? = null
    private val binding get() = _binding!!

    private lateinit var generalPreference: GeneralPreference

    private lateinit var currentTab: SearchTab
    val mangaFragment by lazy { binding.fSearchManga.getFragment<SearchMangaFragment>() }
    val animeFragment by lazy { binding.fSearchAnime.getFragment<SearchAnimeFragment>() }
    val usersFragment by lazy { binding.fSearchUsers.getFragment<SearchUsersFragment>() }
    

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentSearchBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        generalPreference = GeneralPreference(requireContext())

        initializeSearch()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }


    private fun initializeSearch() {
        currentTab = when (generalPreference.displayFirst) {
            GeneralPreference.DisplayFirst.Manga -> SearchTab.Manga
            GeneralPreference.DisplayFirst.Anime -> SearchTab.Anime
        }

        binding.toolbar.also {
//            (requireActivity() as MainActivity).setSupportActionBar(it)
            it.setNavigationOnClickListener { findNavController().navigateUp() }
        }

        binding.etSearch.also {
            it.requestFocus()
            val imm = requireContext().getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
            imm.showSoftInput(it, InputMethodManager.SHOW_IMPLICIT)

            it.addTextChangedListener(object : TextWatcher {
                private var timer: Timer = Timer()
                override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
                override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {
                    timer.cancel()
                }

                override fun afterTextChanged(s: Editable) {
                    val query = s.toString().trim()
                    timer = Timer()
                    timer.schedule(object : TimerTask() {
                        override fun run() {
                            this@SearchFragment.runOnUiThread {
                                when (currentTab) {
                                    SearchTab.Manga -> mangaFragment.search(query)
                                    SearchTab.Anime -> animeFragment.search(query)
                                    SearchTab.Users -> usersFragment.search(query)
                                }
                            }
                        }
                    }, 1000)
                }
            })
        }

        binding.tbSearch.apply {
            SearchTab.entries
                .map { newTab().setText(getString(it.stringId)) }
                .forEach { addTab(it) }

            getTabAt(currentTab.ordinal)?.apply {
                select()
                showTab(currentTab)
            }
            addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
                override fun onTabSelected(tab: TabLayout.Tab) {
                    currentTab = SearchTab.entries[tab.position]
                    showTab(currentTab)
                }

                override fun onTabUnselected(tab: TabLayout.Tab) {}
                override fun onTabReselected(tab: TabLayout.Tab) {}
            })
        }
    }

    private fun showTab(searchTab: SearchTab) {
        childFragmentManager.beginTransaction().apply {
            when (searchTab) {
                SearchTab.Manga -> show(mangaFragment)
                else -> hide(mangaFragment)
            }
            when (searchTab) {
                SearchTab.Anime -> show(animeFragment)
                else -> hide(animeFragment)
            }
            when (searchTab) {
                SearchTab.Users -> show(usersFragment)
                else -> hide(usersFragment)
            }

            when (searchTab) {
                SearchTab.Manga -> mangaFragment.search(binding.etSearch.text.toString().trim())
                SearchTab.Anime -> animeFragment.search(binding.etSearch.text.toString().trim())
                SearchTab.Users -> usersFragment.search(binding.etSearch.text.toString().trim())
            }

            commitAllowingStateLoss()
        }
    }
}