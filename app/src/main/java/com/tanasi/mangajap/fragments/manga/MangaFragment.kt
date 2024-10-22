package com.tanasi.mangajap.fragments.manga

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.flowWithLifecycle
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.navArgs
import com.tanasi.mangajap.databinding.FragmentMangaBinding
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.utils.extensions.viewModelsFactory
import kotlinx.coroutines.launch

class MangaFragment : Fragment() {

    private var _binding: FragmentMangaBinding? = null
    private val binding get() = _binding!!

    private val args by navArgs<MangaFragmentArgs>()
    private val viewModel by viewModelsFactory { MangaViewModel(args.id) }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentMangaBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        initializeManga()

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.state.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED).collect { state ->
                when (state) {
                    MangaViewModel.State.Loading -> binding.isLoading.apply {
                        root.visibility = View.VISIBLE
                        pbIsLoading.visibility = View.VISIBLE
                        gIsLoadingRetry.visibility = View.GONE
                    }

                    is MangaViewModel.State.SuccessLoading -> {
                        displayManga(state.manga)
                        binding.isLoading.root.visibility = View.GONE
                    }

                    is MangaViewModel.State.FailedLoading -> {
                        Toast.makeText(
                            requireContext(),
                            state.error.message ?: "",
                            Toast.LENGTH_SHORT
                        ).show()
                        binding.isLoading.apply {
                            pbIsLoading.visibility = View.GONE
                            gIsLoadingRetry.visibility = View.VISIBLE
                            btnIsLoadingRetry.setOnClickListener {
                                viewModel.getManga(args.id)
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


    private fun initializeManga() {
    }

    private fun displayManga(manga: Manga) {
    }
}
