package com.tanasi.mangajap.fragments.discover

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
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearSnapHelper
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.databinding.FragmentDiscoverBinding
import com.tanasi.mangajap.models.Anime
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.models.People
import com.tanasi.mangajap.ui.SpacingItemDecoration
import kotlinx.coroutines.launch

class DiscoverFragment : Fragment() {

    private var _binding: FragmentDiscoverBinding? = null
    private val binding: FragmentDiscoverBinding get() = _binding!!

    val viewModel: DiscoverViewModel by viewModels()

    private val peopleAdapter: AppAdapter = AppAdapter()
    private val mangaRecentAdapter: AppAdapter = AppAdapter()
    private val animeRecentAdapter: AppAdapter = AppAdapter()


    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentDiscoverBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        initializeDiscover()

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.state.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED).collect { state ->
                when (state) {
                    DiscoverViewModel.State.Loading -> binding.isLoading.apply {
                        root.visibility = View.VISIBLE
                    }

                    is DiscoverViewModel.State.SuccessLoading -> {
                        displayDiscover(
                            state.peoples,
                            state.anime,
                            state.manga,
                        )
                        binding.isLoading.root.visibility = View.GONE
                    }

                    is DiscoverViewModel.State.FailedLoading -> {
                        when (state.error) {
                            is JsonApiResponse.Error.ServerError -> state.error.body.errors.map {
                                Toast.makeText(requireContext(), it.title, Toast.LENGTH_SHORT)
                                    .show()
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

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }


    private fun initializeDiscover() {
        binding.llSearch.setOnClickListener {
            findNavController().navigate(
                DiscoverFragmentDirections.actionDiscoverToSearch()
            )
        }

        binding.rvDiscoverPeople.apply {
            adapter = peopleAdapter
            LinearSnapHelper().attachToRecyclerView(this)
            addItemDecoration(
                SpacingItemDecoration(
                    spacing = (resources.getDimension(R.dimen.discover_spacing) * 1).toInt()
                )
            )
        }

        binding.rvDiscoverRecentManga.apply {
            adapter = mangaRecentAdapter
            addItemDecoration(
                SpacingItemDecoration(
                    spacing = (resources.getDimension(R.dimen.discover_spacing) * 0.4).toInt()
                )
            )
        }

        binding.rvDiscoverRecentAnime.apply {
            adapter = animeRecentAdapter
            addItemDecoration(
                SpacingItemDecoration(
                    spacing = (resources.getDimension(R.dimen.discover_spacing) * 0.4).toInt()
                )
            )
        }
    }

    private fun displayDiscover(peoples: List<People>, anime: List<Anime>, manga: List<Manga>) {
        peopleAdapter.submitList(peoples.onEach {
            it.itemType = AppAdapter.Type.PEOPLE_DISCOVER_ITEM
        })

        animeRecentAdapter.submitList(anime.onEach {
            it.itemType = AppAdapter.Type.ANIME_DISCOVER_ITEM
        })

        mangaRecentAdapter.submitList(manga.onEach {
            it.itemType = AppAdapter.Type.MANGA_DISCOVER_ITEM
        })
    }
}