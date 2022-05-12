package com.tanasi.mangajap.fragments.search

import android.content.Context
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.tabs.TabLayout
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.MainActivity
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.databinding.FragmentSearchBinding
import com.tanasi.mangajap.fragments.recyclerView.RecyclerViewFragment
import com.tanasi.mangajap.models.Ad
import com.tanasi.mangajap.models.Anime
import com.tanasi.mangajap.models.LoadMore
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.utils.extensions.add
import com.tanasi.mangajap.utils.extensions.addOrLast
import com.tanasi.mangajap.utils.extensions.contains
import com.tanasi.mangajap.utils.extensions.runOnUiThread
import com.tanasi.mangajap.utils.preferences.GeneralPreference
import java.util.*

class SearchFragment : Fragment() {

    private enum class SearchTab(
            val stringId: Int,
            var fragment: RecyclerViewFragment = RecyclerViewFragment(),
            var list: MutableList<MangaJapAdapter.Item> = mutableListOf(),
            var loadMore: LoadMore = LoadMore(),
            var nextLink: String = "",
    ) {
        Manga(R.string.manga),
        Anime(R.string.anime),
        Users(R.string.users);
    }

    private var _binding: FragmentSearchBinding? = null
    private val binding: FragmentSearchBinding get() = _binding!!

    val viewModel: SearchViewModel by viewModels()

    private lateinit var generalPreference: GeneralPreference

    private lateinit var currentTab: SearchTab

    var query = ""
    

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentSearchBinding.inflate(inflater, container, false)
        SearchTab.values().forEach {
            it.fragment = RecyclerViewFragment()
            it.list = mutableListOf()
            it.loadMore = LoadMore()
            it.fragment.setList(it.list, LinearLayoutManager(requireContext()))
            addTab(it)
        }
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        generalPreference = GeneralPreference(requireContext())

        if (!this::currentTab.isInitialized) {
            currentTab = when (generalPreference.displayFirst) {
                GeneralPreference.DisplayFirst.Manga -> SearchTab.Manga
                GeneralPreference.DisplayFirst.Anime -> SearchTab.Anime
            }
        }
        when (currentTab) {
            SearchTab.Manga -> viewModel.getMangas(query)
            SearchTab.Anime -> viewModel.getAnimes(query)
            SearchTab.Users -> viewModel.getUsers(query)
        }

        binding.toolbar.also {
            (requireActivity() as MainActivity).setSupportActionBar(it)
            it.setNavigationOnClickListener { findNavController().navigateUp() }
        }
        binding.etSearch.also {
            it.requestFocus()
            val imm = requireContext().getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
            imm.showSoftInput(it, InputMethodManager.SHOW_IMPLICIT)
        }

        viewModel.state.observe(viewLifecycleOwner) { state ->
            when (state) {
                SearchViewModel.State.Loading -> binding.isLoading.root.visibility = View.VISIBLE
                is SearchViewModel.State.SuccessLoadingManga -> {
                    SearchTab.Manga.list.apply {
                        clear()
                        addAll(state.mangaList)
                        if (size < 15) add(Manga("").also { it.typeLayout = MangaJapAdapter.Type.MANGA_SEARCH_ADD })
                        addOrLast(3, Ad().also { it.typeLayout = MangaJapAdapter.Type.AD_SEARCH })
                        add(SearchTab.Manga.loadMore)
                    }
                    SearchTab.Manga.nextLink = state.nextLink
                    SearchTab.Manga.loadMore.isMoreDataAvailable = (SearchTab.Manga.nextLink != "")

                    if (SearchTab.Manga.fragment.isAdded) {
                        SearchTab.Manga.fragment.mangaJapAdapter?.setOnLoadMoreListener {
                            if (SearchTab.Manga.nextLink != "") viewModel.loadMoreManga(SearchTab.Manga.nextLink)
                        }
                        SearchTab.Manga.fragment.mangaJapAdapter?.notifyDataSetChanged()
                    }
                    binding.isLoading.root.visibility = View.GONE
                }
                is SearchViewModel.State.SuccessLoadingAnime -> {
                    SearchTab.Anime.list.apply {
                        clear()
                        addAll(state.animeList)
                        if (size < 15) add(Anime("").also { it.typeLayout = MangaJapAdapter.Type.ANIME_SEARCH_ADD })
                        addOrLast(3, Ad().also { it.typeLayout = MangaJapAdapter.Type.AD_SEARCH })
                        add(SearchTab.Anime.loadMore)
                    }
                    SearchTab.Anime.nextLink = state.nextLink
                    SearchTab.Anime.loadMore.isMoreDataAvailable = (SearchTab.Anime.nextLink != "")

                    if (SearchTab.Anime.fragment.isAdded) {
                        SearchTab.Anime.fragment.mangaJapAdapter?.setOnLoadMoreListener {
                            if (SearchTab.Anime.nextLink != "") viewModel.loadMoreAnime(SearchTab.Anime.nextLink)
                        }
                        SearchTab.Anime.fragment.mangaJapAdapter?.notifyDataSetChanged()
                    }
                    binding.isLoading.root.visibility = View.GONE
                }
                is SearchViewModel.State.SuccessLoadingUsers -> {
                    SearchTab.Users.list.apply {
                        clear()
                        addAll(state.userList)
                        addOrLast(3, Ad().also { it.typeLayout = MangaJapAdapter.Type.AD_SEARCH })
                        add(SearchTab.Users.loadMore)
                    }
                    SearchTab.Users.nextLink = state.nextLink
                    SearchTab.Users.loadMore.isMoreDataAvailable = (SearchTab.Users.nextLink != "")

                    if (SearchTab.Users.fragment.isAdded) {
                        SearchTab.Users.fragment.mangaJapAdapter?.setOnLoadMoreListener {
                            if (SearchTab.Users.nextLink != "") viewModel.loadMoreUser(SearchTab.Users.nextLink)
                        }
                        SearchTab.Users.fragment.mangaJapAdapter?.notifyDataSetChanged()
                    }
                    binding.isLoading.root.visibility = View.GONE
                }
                is SearchViewModel.State.FailedLoading -> when (state.error) {
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

                SearchViewModel.State.LoadingMore -> {
                    when (currentTab) {
                        SearchTab.Manga -> SearchTab.Manga.loadMore.isLoading = true
                        SearchTab.Anime -> SearchTab.Anime.loadMore.isLoading = true
                        SearchTab.Users -> SearchTab.Users.loadMore.isLoading = true
                    }
                }
                is SearchViewModel.State.SuccessLoadingMoreManga -> {
                    SearchTab.Manga.list.apply {
                        addAll(state.mangaList)
                        remove(SearchTab.Manga.loadMore)
                        add(SearchTab.Manga.loadMore)
                    }
                    SearchTab.Manga.nextLink = state.nextLink
                    if (SearchTab.Manga.fragment.isAdded) {
                        SearchTab.Manga.loadMore.isMoreDataAvailable = (SearchTab.Manga.nextLink != "")
                        SearchTab.Manga.loadMore.isLoading = false
                        SearchTab.Manga.fragment.mangaJapAdapter?.notifyDataSetChanged()
                    }
                }
                is SearchViewModel.State.SuccessLoadingMoreAnime -> {
                    SearchTab.Anime.list.apply {
                        addAll(state.animeList)
                        remove(SearchTab.Anime.loadMore)
                        add(SearchTab.Anime.loadMore)
                    }
                    SearchTab.Anime.nextLink = state.nextLink
                    if (SearchTab.Anime.fragment.isAdded) {
                        SearchTab.Anime.loadMore.isMoreDataAvailable = (SearchTab.Anime.nextLink != "")
                        SearchTab.Anime.loadMore.isLoading = false
                        SearchTab.Anime.fragment.mangaJapAdapter?.notifyDataSetChanged()
                    }
                }
                is SearchViewModel.State.SuccessLoadingMoreUsers -> {
                    SearchTab.Users.list.apply {
                        addAll(state.userList)
                        remove(SearchTab.Users.loadMore)
                        add(SearchTab.Users.loadMore)
                    }
                    SearchTab.Users.nextLink = state.nextLink
                    if (SearchTab.Users.fragment.isAdded) {
                        SearchTab.Users.loadMore.isMoreDataAvailable = (SearchTab.Users.nextLink != "")
                        SearchTab.Users.loadMore.isLoading = false
                        SearchTab.Users.fragment.mangaJapAdapter?.notifyDataSetChanged()
                    }
                }
                is SearchViewModel.State.FailedLoadingMore -> when (state.error) {
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

                SearchViewModel.State.Saving -> {
                }
                is SearchViewModel.State.SuccessSaving -> currentTab.fragment.mangaJapAdapter?.notifyDataSetChanged()
                is SearchViewModel.State.FailedSaving -> when (state.error) {
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

                is SearchViewModel.State.SuccessRequest -> Toast.makeText(requireContext(), getString(R.string.media_will_be_added, state.request.data), Toast.LENGTH_SHORT).show()
                is SearchViewModel.State.FailedRequest -> Toast.makeText(requireContext(), getString(R.string.error), Toast.LENGTH_SHORT).show()
            }
        }

        displaySearch()
    }

    override fun onResume() {
        super.onResume()
        binding.etSearch.addTextChangedListener(object : TextWatcher {
            private var timer: Timer = Timer()
            override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {
                binding.isLoading.root.visibility = View.VISIBLE
                timer.cancel()
            }

            override fun afterTextChanged(s: Editable) {
                query = s.toString().trim { it <= ' ' }
                timer = Timer()
                timer.schedule(object : TimerTask() {
                    override fun run() {
                        this@SearchFragment.runOnUiThread {
                            when (currentTab) {
                                SearchTab.Manga -> viewModel.getMangas(query)
                                SearchTab.Anime -> viewModel.getAnimes(query)
                                SearchTab.Users -> viewModel.getUsers(query)
                            }
                        }
                    }
                }, 1000)
            }
        })
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }


    private fun displaySearch() {
        binding.tbSearch.apply {
            getTabAt(currentTab.ordinal)?.apply {
                select()
                showTab(currentTab)
            }
            addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
                override fun onTabSelected(tab: TabLayout.Tab) {
                    currentTab = SearchTab.values()[tab.position]
                    showTab(currentTab)
                    when (currentTab) {
                        SearchTab.Manga -> viewModel.getMangas(query)
                        SearchTab.Anime -> viewModel.getAnimes(query)
                        SearchTab.Users -> viewModel.getUsers(query)
                    }
                }

                override fun onTabUnselected(tab: TabLayout.Tab) {}
                override fun onTabReselected(tab: TabLayout.Tab) {}
            })
        }
    }

    private fun addTab(searchTab: SearchTab) {
        val ft: FragmentTransaction = childFragmentManager.beginTransaction()

        if (!binding.tbSearch.contains(getString(searchTab.stringId))) {
            binding.tbSearch.add(getString(searchTab.stringId))
            if (searchTab.fragment.isAdded) {
                ft.detach(searchTab.fragment)
                ft.attach(searchTab.fragment)
            } else {
                ft.add(binding.flSearch.id, searchTab.fragment)
            }
        }

        ft.commitAllowingStateLoss()
    }

    private fun showTab(searchTab: SearchTab) {
        val ft: FragmentTransaction = childFragmentManager.beginTransaction()

        SearchTab.values().map {
            if (searchTab == it) {
                ft.show(searchTab.fragment)
            } else {
                ft.hide(it.fragment)
            }
        }

        ft.commitAllowingStateLoss()
    }
}