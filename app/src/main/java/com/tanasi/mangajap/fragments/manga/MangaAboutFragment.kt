package com.tanasi.mangajap.fragments.manga

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
import com.tanasi.mangajap.models.Manga
import kotlinx.coroutines.launch

class MangaAboutFragment : Fragment() {

    private var _binding: FragmentRecyclerViewBinding? = null
    private val binding get() = _binding!!

    private val viewModel by viewModels<MangaViewModel>(
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

        initializeMangaAbout()

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.state.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED).collect { state ->
                when (state) {
                    is MangaViewModel.State.SuccessLoading -> {
                        displayMangaAbout(state.manga)
                    }

                    else -> {}
                }
            }
        }
    }


    private fun initializeMangaAbout() {
        binding.recyclerView.apply {
            adapter = appAdapter
            layoutManager = LinearLayoutManager(requireContext())
        }
    }

    private fun displayMangaAbout(manga: Manga) {
        appAdapter.submitList(
            listOfNotNull(
                manga.copy().apply { itemType = AppAdapter.Type.MANGA },
                manga.copy().apply { itemType = AppAdapter.Type.MANGA_SUMMARY },
                manga.mangaEntry?.let {
                    manga.copy().apply { itemType = AppAdapter.Type.MANGA_PROGRESSION }
                },
                manga.franchises.isNotEmpty().takeIf { it }.let {
                    manga.copy().apply { itemType = AppAdapter.Type.MANGA_FRANCHISES }
                },
                manga.copy().apply { itemType = AppAdapter.Type.MANGA_REVIEWS },
            )
        )
    }
}