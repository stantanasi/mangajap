package com.tanasi.mangajap.fragments.anime

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.flowWithLifecycle
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.databinding.FragmentRecyclerViewBinding
import com.tanasi.mangajap.models.Anime
import com.tanasi.mangajap.models.Season
import com.tanasi.mangajap.ui.SpacingItemDecoration
import kotlinx.coroutines.launch

class AnimeEpisodesFragment : Fragment() {

    private var _binding: FragmentRecyclerViewBinding? = null
    private val binding get() = _binding!!

    private val viewModel by viewModels<AnimeViewModel>(
        ownerProducer = { requireParentFragment() }
    )

    private lateinit var anime: Anime
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

        initializeAnimeEpisodes()

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.state.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED).collect { state ->
                when (state) {
                    is AnimeViewModel.State.SuccessLoading -> {
                        anime = state.anime
                        displayAnimeEpisodes(state.anime)
                    }

                    else -> {}
                }
            }
        }
    }

    private fun initializeAnimeEpisodes() {
        binding.recyclerView.apply {
            adapter = appAdapter
            layoutManager = LinearLayoutManager(requireContext())
            addItemDecoration(
                SpacingItemDecoration(
                    spacing = resources.getDimension(R.dimen.anime_spacing).toInt()
                )
            )
            setPadding(
                resources.getDimension(R.dimen.anime_spacing).toInt(),
                resources.getDimension(R.dimen.anime_spacing).toInt(),
                resources.getDimension(R.dimen.anime_spacing).toInt(),
                resources.getDimension(R.dimen.anime_spacing).toInt(),
            )
        }
    }

    private fun displayAnimeEpisodes(anime: Anime) {
        val list = mutableListOf<AppAdapter.Item>(
            Season("").apply { itemType = AppAdapter.Type.SEASON_ANIME_HEADER }
        )
        anime.seasons.forEach { season ->
            list.add(season.also { it.itemType = AppAdapter.Type.SEASON_ITEM })

            if (season.isShowingEpisodes) {
                list.addAll(season.episodes.onEach {
                    it.itemType = AppAdapter.Type.EPISODE_ITEM
                })
            }
        }
        appAdapter.submitList(list)
    }

    fun reload() {
        displayAnimeEpisodes(anime)
    }
}