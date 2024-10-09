package com.tanasi.mangajap.fragments.agenda

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
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.databinding.FragmentRecyclerViewBinding
import com.tanasi.mangajap.models.AnimeEntry
import com.tanasi.mangajap.ui.SpacingItemDecoration
import kotlinx.coroutines.launch

class AgendaAnimeFragment : Fragment() {

    private var _binding: FragmentRecyclerViewBinding? = null
    private val binding get() = _binding!!

    private val viewModel by viewModels<AgendaAnimeViewModel>()

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

        initializeAgendaAnime()

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.state.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED).collect { state ->
                when (state) {
                    AgendaAnimeViewModel.State.Loading -> binding.isLoading.apply {
                        root.visibility = View.VISIBLE
                    }

                    is AgendaAnimeViewModel.State.SuccessLoading -> {
                        displayAgendaAnime(state.watchingAnime)
                        binding.isLoading.root.visibility = View.GONE
                    }

                    is AgendaAnimeViewModel.State.FailedLoading -> {
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


    private fun initializeAgendaAnime() {
        binding.recyclerView.apply {
            adapter = appAdapter
            addItemDecoration(
                SpacingItemDecoration(
                    spacing = resources.getDimension(R.dimen.agenda_spacing).toInt()
                )
            )
            layoutManager = LinearLayoutManager(requireContext())
            setPadding(
                resources.getDimension(R.dimen.agenda_spacing).toInt(),
                resources.getDimension(R.dimen.agenda_spacing).toInt(),
                resources.getDimension(R.dimen.agenda_spacing).toInt(),
                resources.getDimension(R.dimen.agenda_spacing).toInt(),
            )
        }
    }

    private fun displayAgendaAnime(watchingAnime: List<AnimeEntry>) {
        appAdapter.submitList(
            watchingAnime
                .filter { it.anime?.let { anime -> it.getProgress(anime) < 100 } ?: false }
                .onEach {
                    it.itemType = AppAdapter.Type.ANIME_ENTRY_TO_WATCH_ITEM
                }
        )
    }
}