package com.tanasi.mangajap.fragments.manga

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
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.databinding.FragmentMangaChaptersBinding
import com.tanasi.mangajap.models.Chapter
import kotlinx.coroutines.launch

class MangaChaptersFragment : Fragment() {

    private var _binding: FragmentMangaChaptersBinding? = null
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
        _binding = FragmentMangaChaptersBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        initializeMangaChapters()

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.chapters.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED).collect { state ->
                when (state) {
                    MangaViewModel.ChaptersState.Loading -> binding.isLoading.apply {
                        root.visibility = View.VISIBLE
                        pbIsLoading.visibility = View.VISIBLE
                        gIsLoadingRetry.visibility = View.GONE
                    }

                    is MangaViewModel.ChaptersState.SuccessLoading -> {
                        displayMangaChapters(state.chapters)
                        binding.isLoading.root.visibility = View.GONE
                    }

                    is MangaViewModel.ChaptersState.FailedLoading -> {
                        Toast.makeText(
                            requireContext(),
                            state.error.message ?: "",
                            Toast.LENGTH_SHORT
                        ).show()
                        binding.isLoading.apply {
                            pbIsLoading.visibility = View.GONE
                            gIsLoadingRetry.visibility = View.VISIBLE
                            btnIsLoadingRetry.setOnClickListener {
                                viewModel.getMangaChapters(viewModel.id)
                            }
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


    private fun initializeMangaChapters() {
        binding.rvMangaChapters.apply {
            adapter = appAdapter
        }
    }

    private fun displayMangaChapters(chapters: List<Chapter>) {
        appAdapter.submitList(chapters.onEach {
            it.itemType = AppAdapter.Type.CHAPTER_ITEM
        })
    }
}