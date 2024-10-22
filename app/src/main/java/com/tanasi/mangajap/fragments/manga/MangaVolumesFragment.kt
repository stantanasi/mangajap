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
import com.tanasi.mangajap.databinding.FragmentMangaVolumesBinding
import com.tanasi.mangajap.models.Volume
import kotlinx.coroutines.launch

class MangaVolumesFragment : Fragment() {

    private var _binding: FragmentMangaVolumesBinding? = null
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
        _binding = FragmentMangaVolumesBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        initializeMangaVolumes()

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.volumes.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED).collect { state ->
                when (state) {
                    MangaViewModel.VolumesState.Loading -> binding.isLoading.apply {
                        root.visibility = View.VISIBLE
                        pbIsLoading.visibility = View.VISIBLE
                        gIsLoadingRetry.visibility = View.GONE
                    }

                    is MangaViewModel.VolumesState.SuccessLoading -> {
                        displayMangaVolumes(state.volumes)
                        binding.isLoading.root.visibility = View.GONE
                    }

                    is MangaViewModel.VolumesState.FailedLoading -> {
                        Toast.makeText(
                            requireContext(),
                            state.error.message ?: "",
                            Toast.LENGTH_SHORT
                        ).show()
                        binding.isLoading.apply {
                            pbIsLoading.visibility = View.GONE
                            gIsLoadingRetry.visibility = View.VISIBLE
                            btnIsLoadingRetry.setOnClickListener {
                                viewModel.getMangaVolumes(viewModel.id)
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


    private fun initializeMangaVolumes() {
        binding.rvMangaVolumes.apply {
            adapter = appAdapter
        }
    }

    private fun displayMangaVolumes(volumes: List<Volume>) {
        appAdapter.submitList(volumes.onEach {
            it.itemType = AppAdapter.Type.VOLUME_ITEM
        })
    }
}