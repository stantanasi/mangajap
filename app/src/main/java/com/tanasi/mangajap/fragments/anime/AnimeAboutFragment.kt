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
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.databinding.FragmentRecyclerViewBinding
import com.tanasi.mangajap.models.Anime
import kotlinx.coroutines.launch

class AnimeAboutFragment : Fragment() {

    private var _binding: FragmentRecyclerViewBinding? = null
    private val binding get() = _binding!!

    private val viewModel by viewModels<AnimeViewModel>(
        ownerProducer = { requireParentFragment() }
    )

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

        initializeAnimeAbout()

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.state.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED).collect { state ->
                when (state) {
                    is AnimeViewModel.State.SuccessLoading -> {
                        displayAnimeAbout(state.anime)
                    }

                    else -> {}
                }
            }
        }
    }


    private fun initializeAnimeAbout() {
        binding.recyclerView.apply {
            adapter = appAdapter
            layoutManager = LinearLayoutManager(requireContext())
        }
    }

    private fun displayAnimeAbout(anime: Anime) {
        appAdapter.submitList(
            listOfNotNull(
                anime.copy().apply { itemType = AppAdapter.Type.ANIME },
                anime.copy().apply { itemType = AppAdapter.Type.ANIME_SUMMARY },
                anime.animeEntry?.let {
                    anime.copy().apply { itemType = AppAdapter.Type.ANIME_PROGRESSION }
                },
                anime.franchises.isNotEmpty().takeIf { it }.let {
                    anime.copy().apply { itemType = AppAdapter.Type.ANIME_FRANCHISES }
                },
                anime.copy().apply { itemType = AppAdapter.Type.ANIME_REVIEWS },
            )
        )
    }
}