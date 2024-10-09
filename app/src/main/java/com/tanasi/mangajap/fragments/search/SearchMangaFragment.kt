package com.tanasi.mangajap.fragments.search

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.flowWithLifecycle
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.databinding.FragmentRecyclerViewBinding
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.models.MangaEntry
import com.tanasi.mangajap.models.Request
import kotlinx.coroutines.launch

class SearchMangaFragment : Fragment() {

    private var _binding: FragmentRecyclerViewBinding? = null
    private val binding get() = _binding!!

    private val viewModel by viewModels<SearchMangaViewModel>()

    private val appAdapter = AppAdapter()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentRecyclerViewBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        initializeSearchManga()

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.state.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED).collect { state ->
                when (state) {
                    SearchMangaViewModel.State.Loading -> binding.isLoading.apply {
                        root.visibility = View.VISIBLE
                    }

                    SearchMangaViewModel.State.LoadingMore -> appAdapter.isLoading = true

                    is SearchMangaViewModel.State.SuccessLoading -> {
                        displaySearchManga(state.mangaList, state.nextLink)
                        appAdapter.isLoading = false
                        binding.isLoading.root.visibility = View.GONE
                    }

                    is SearchMangaViewModel.State.FailedLoading -> {
                        when (state.error) {
                            is JsonApiResponse.Error.ServerError -> state.error.body.errors.map {
                                Toast.makeText(
                                    requireContext(),
                                    it.title,
                                    Toast.LENGTH_SHORT
                                ).show()
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
        }
    }


    private fun initializeSearchManga() {
        binding.recyclerView.apply {
            adapter = appAdapter
            layoutManager = LinearLayoutManager(requireContext())
        }
    }

    private fun displaySearchManga(mangaList: List<Manga>, nextLink: String) {
        appAdapter.submitList(mangaList.onEach {
            it.itemType = AppAdapter.Type.MANGA_SEARCH_ITEM
        })

        if (nextLink != "") {
            appAdapter.setOnLoadMoreListener {
                viewModel.loadMore(nextLink)
            }
        } else {
            appAdapter.setOnLoadMoreListener(null)
        }
    }

    fun search(query: String) {
        viewModel.search(query)
    }

    fun saveMangaEntry(manga: Manga, mangaEntry: MangaEntry) {
        viewModel.saveMangaEntry(manga, mangaEntry)
    }

    fun saveRequest(request: Request) {
        viewModel.saveRequest(request)
    }
}