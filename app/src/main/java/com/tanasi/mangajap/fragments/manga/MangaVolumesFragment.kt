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
import androidx.recyclerview.widget.GridLayoutManager
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.databinding.FragmentRecyclerViewBinding
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.ui.SpacingItemDecoration
import kotlinx.coroutines.launch

class MangaVolumesFragment : Fragment() {

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

        initializeMangaVolumes()

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.state.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED).collect { state ->
                when (state) {
                    is MangaViewModel.State.SuccessLoading -> {
                        displayMangaVolumes(state.manga)
                    }

                    else -> {}
                }
            }
        }
    }

    private fun initializeMangaVolumes() {
        binding.recyclerView.apply {
            adapter = appAdapter
            addItemDecoration(
                SpacingItemDecoration(
                    vertical = (resources.getDimension(R.dimen.manga_spacing) * 1.5).toInt() / 2,
                    horizontal = (resources.getDimension(R.dimen.manga_spacing) * 1.5).toInt(),
                )
            )
            layoutManager = GridLayoutManager(requireContext(), MANGA_VOLUME_SPAN_COUNT)
            setPadding(
                resources.getDimension(R.dimen.manga_spacing).toInt(),
                resources.getDimension(R.dimen.manga_spacing).toInt(),
                resources.getDimension(R.dimen.manga_spacing).toInt(),
                resources.getDimension(R.dimen.manga_spacing).toInt(),
            )
        }
    }

    private fun displayMangaVolumes(manga: Manga) {
        (binding.recyclerView.layoutManager as? GridLayoutManager)?.apply {
            spanSizeLookup = object : GridLayoutManager.SpanSizeLookup() {
                override fun getSpanSize(position: Int): Int {
                    return when (manga.volumes[position].itemType) {
                        AppAdapter.Type.VOLUME_DETAILS_ITEM -> spanCount
                        else -> 1
                    }
                }
            }
        }

        appAdapter.submitList(manga.volumes.onEach {
            it.itemType = AppAdapter.Type.VOLUME_ITEM
        })

//        showDetailsVolume?.let {
//            MangaTab.VOLUMES.list.addOrLast(
//                index = (MangaFragment.MANGA_VOLUME_SPAN_COUNT - MangaTab.VOLUMES.list.indexOf(it) % MangaFragment.MANGA_VOLUME_SPAN_COUNT)
//                        + MangaTab.VOLUMES.list.indexOf(it),
//                it.copy().apply { itemType = AppAdapter.Type.VOLUME_DETAILS_ITEM }
//            )
//        }
    }


    companion object {
        private const val MANGA_VOLUME_SPAN_COUNT: Int = 3
    }
}