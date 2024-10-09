package com.tanasi.mangajap.fragments.anime

import android.content.Context
import android.os.Bundle
import android.view.Gravity
import android.view.LayoutInflater
import android.view.Menu
import android.view.MenuInflater
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.PopupWindow
import android.widget.Toast
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.flowWithLifecycle
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.navArgs
import com.google.android.material.tabs.TabLayout
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.FragmentAnimeBinding
import com.tanasi.mangajap.databinding.PopupAnimeBinding
import com.tanasi.mangajap.models.Anime
import com.tanasi.mangajap.models.AnimeEntry
import com.tanasi.mangajap.models.User
import com.tanasi.mangajap.utils.extensions.setToolbar
import com.tanasi.mangajap.utils.extensions.shareText
import com.tanasi.mangajap.utils.extensions.viewModelsFactory
import kotlinx.coroutines.launch

class AnimeFragment : Fragment() {

    private enum class AnimeTab(val stringId: Int) {
        ABOUT(R.string.about),
        EPISODES(R.string.episodes);
    }

    private var _binding: FragmentAnimeBinding? = null
    private val binding get() = _binding!!

    private val args by navArgs<AnimeFragmentArgs>()
    val viewModel by viewModelsFactory { AnimeViewModel(args.animeId) }

    private lateinit var anime: Anime
    private val aboutFragment by lazy { binding.fAnimeAbout.getFragment<AnimeAboutFragment>() }
    private val episodesFragment by lazy { binding.fAnimeEpisodes.getFragment<AnimeEpisodesFragment>() }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentAnimeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        initializeAnime()

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.state.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED).collect { state ->
                when (state) {
                    AnimeViewModel.State.Loading -> binding.isLoading.apply {
                        root.visibility = View.VISIBLE
                    }

                    is AnimeViewModel.State.SuccessLoading -> {
                        displayAnime(state.anime)
                        binding.isLoading.root.visibility = View.GONE
                    }

                    is AnimeViewModel.State.FailedLoading -> {
                        when (state.error) {
                            is JsonApiResponse.Error.ServerError -> state.error.body.errors.map {
                                Toast.makeText(
                                    requireContext(),
                                    it.title,
                                    Toast.LENGTH_SHORT
                                ).show()
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

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {
        if (this::anime.isInitialized) {
            anime.animeEntry?.let { animeEntry ->
                if (animeEntry.isAdd) inflater.inflate(R.menu.menu_fragment_anime, menu)
                else inflater.inflate(R.menu.menu_share, menu)
            } ?: let {
                inflater.inflate(R.menu.menu_share, menu)
            }
        }
        super.onCreateOptionsMenu(menu, inflater)
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            R.id.more -> {
                displayPopupWindow()
                return true
            }

            R.id.share -> {
                shareText(getString(R.string.shareAnime, anime.title))
                return true
            }
        }
        return super.onOptionsItemSelected(item)
    }


    private fun initializeAnime() {
        setToolbar(args.animeTitle, "")
        setHasOptionsMenu(true)

        binding.tlAnime.apply {
            AnimeTab.entries
                .map { newTab().setText(getString(it.stringId)) }
                .forEach { addTab(it) }

            addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
                override fun onTabSelected(tab: TabLayout.Tab) {
                    showTab(AnimeTab.entries[tab.position])
                }

                override fun onTabUnselected(tab: TabLayout.Tab) {}
                override fun onTabReselected(tab: TabLayout.Tab) {}
            })
            getTabAt(selectedTabPosition)?.apply {
                select()
                showTab(AnimeTab.entries[selectedTabPosition])
            }
        }
    }

    private fun displayAnime(anime: Anime) {
        this.anime = anime
        requireActivity().invalidateOptionsMenu()

        binding.pbAnimeProgressionProgress.apply {
            progress = anime.animeEntry?.getProgress(anime) ?: 0
            progressTintList = anime.animeEntry?.let {
                ContextCompat.getColorStateList(
                    requireContext(),
                    it.getProgressColor(anime)
                )
            }
        }

        binding.clAnimeProgressionAdd.apply {
            setOnClickListener {
                val animeEntry = anime.animeEntry?.also {
                    it.isAdd = true
                } ?: AnimeEntry().also {
                    it.isAdd = true
                    it.status = AnimeEntry.Status.WATCHING
                    it.user = User(id = Firebase.auth.uid)
                    it.anime = anime
                }

                viewModel.saveAnimeEntry(animeEntry)

                setOnClickListener(null)
                binding.ivAnimeProgressionAdd.visibility = View.GONE
                binding.pbAnimeProgressionAdd.visibility = View.VISIBLE
            }

            visibility = when {
                anime.animeEntry?.isAdd == true -> View.GONE
                else -> View.VISIBLE
            }
        }

        binding.ivAnimeProgressionAdd.visibility = View.VISIBLE

        binding.pbAnimeProgressionAdd.visibility = View.GONE

        binding.tvAnimeProgressionAdd.text = getString(R.string.add_anime_to_library)
    }

    fun reloadEpisodes() {
        episodesFragment.reload()
    }

    private fun showTab(animeTab: AnimeTab) {
        childFragmentManager.beginTransaction().apply {
            when (animeTab) {
                AnimeTab.ABOUT -> show(aboutFragment)
                else -> hide(aboutFragment)
            }
            when (animeTab) {
                AnimeTab.EPISODES -> show(episodesFragment)
                else -> hide(episodesFragment)
            }
            commitAllowingStateLoss()
        }
    }

    private fun displayPopupWindow() {
        val layoutInflater =
            requireActivity().getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val popupAnimeBinding = PopupAnimeBinding.inflate(layoutInflater)

        val popupWindow = PopupWindow(
            popupAnimeBinding.root,
            ConstraintLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT,
            true
        ).apply {
            elevation = 25f
            showAtLocation(popupAnimeBinding.root, Gravity.TOP or Gravity.END, 100, 200)
        }

        popupAnimeBinding.tvPopupAnimeStatus.text =
            getString(anime.animeEntry?.status?.stringId ?: AnimeEntry.Status.WATCHING.stringId)

        popupAnimeBinding.vPopupAnimeDelete.setOnClickListener { _ ->
            anime.animeEntry?.let { animeEntry ->
                viewModel.saveAnimeEntry(animeEntry.apply {
                    isAdd = false
                })
            }
            popupWindow.dismiss()
        }

        popupAnimeBinding.vPopupAnimeShare.setOnClickListener {
            shareText(getString(R.string.shareAnime, anime.title))
        }
    }


    companion object {
        const val ANIME_SYNOPSIS_MAX_LINES = 3
    }
}