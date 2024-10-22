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
import com.bumptech.glide.Glide
import com.google.android.material.tabs.TabLayout
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.FragmentMangaBinding
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.utils.extensions.viewModelsFactory
import kotlinx.coroutines.launch

class MangaFragment : Fragment() {

    private enum class MangaTab(val stringId: Int) {
        CHAPTERS(R.string.manga_tab_chapters),
        VOLUMES(R.string.manga_tab_volumes);
    }

    private var _binding: FragmentMangaBinding? = null
    private val binding get() = _binding!!

    private val args by navArgs<MangaFragmentArgs>()
    private val viewModel by viewModelsFactory { MangaViewModel(args.id) }

    private val chaptersFragment by lazy { binding.fMangaChapters.getFragment<MangaChaptersFragment>() }
    private val volumesFragment by lazy { binding.fMangaVolumes.getFragment<MangaVolumesFragment>() }

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
        binding.tlManga.apply {
            MangaTab.entries
                .map { newTab().setText(getString(it.stringId)) }
                .forEach { addTab(it) }

            addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
                override fun onTabSelected(tab: TabLayout.Tab) {
                    showTab(MangaTab.entries[tab.position])
                }

                override fun onTabUnselected(tab: TabLayout.Tab) {}
                override fun onTabReselected(tab: TabLayout.Tab) {}
            })
            getTabAt(selectedTabPosition)?.apply {
                select()
                showTab(MangaTab.entries[selectedTabPosition])
            }
        }
    }

    private fun displayManga(manga: Manga) {
        binding.ivMangaPoster.run {
            Glide.with(context)
                .load(manga.coverImage)
                .into(this)
            visibility = when {
                manga.coverImage.isNullOrEmpty() -> View.GONE
                else -> View.VISIBLE
            }
        }

        binding.tvMangaTitle.text = manga.title
    }

    private fun showTab(mangaTab: MangaTab) {
        childFragmentManager.beginTransaction().apply {
            when (mangaTab) {
                MangaTab.CHAPTERS -> show(chaptersFragment)
                else -> hide(chaptersFragment)
            }
            when (mangaTab) {
                MangaTab.VOLUMES -> show(volumesFragment)
                else -> hide(volumesFragment)
            }
            commitAllowingStateLoss()
        }
    }
}
