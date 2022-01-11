package com.tanasi.mangajap.fragments.anime

import android.content.Context
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.*
import android.widget.LinearLayout
import android.widget.PopupWindow
import android.widget.Toast
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.tabs.TabLayout
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.MainActivity
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.databinding.FragmentAnimeBinding
import com.tanasi.mangajap.databinding.PopupAnimeBinding
import com.tanasi.mangajap.fragments.recyclerView.RecyclerViewFragment
import com.tanasi.mangajap.models.Anime
import com.tanasi.mangajap.models.AnimeEntry
import com.tanasi.mangajap.models.Season
import com.tanasi.mangajap.models.User
import com.tanasi.mangajap.utils.extensions.add
import com.tanasi.mangajap.utils.extensions.contains
import com.tanasi.mangajap.utils.extensions.setToolbar
import com.tanasi.mangajap.utils.extensions.shareText

class AnimeFragment : Fragment() {

    private enum class AnimeTab(
        val stringId: Int,
        val fragment: RecyclerViewFragment = RecyclerViewFragment(),
        val list: MutableList<MangaJapAdapter.Item> = mutableListOf()
    ) {
        About(R.string.about),
        Episodes(R.string.episodes);
    }

    private var _binding: FragmentAnimeBinding? = null
    private val binding: FragmentAnimeBinding get() = _binding!!

    val viewModel: AnimeViewModel by viewModels()

    private val args: AnimeFragmentArgs by navArgs()

    private lateinit var anime: Anime


    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentAnimeBinding.inflate(inflater, container, false)
        viewModel.getAnime(args.animeId)
        AnimeTab.values().forEach {
            it.fragment.setList(it.list, LinearLayoutManager(requireContext()))
            addTab(it)
        }
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setToolbar(args.animeTitle, "")
        setHasOptionsMenu(true)

        viewModel.state.observe(viewLifecycleOwner) { state ->
            when (state) {
                AnimeViewModel.State.Loading -> binding.isLoading.root.visibility = View.VISIBLE
                is AnimeViewModel.State.SuccessLoading -> {
                    anime = state.anime
                    displayAnime()
                    binding.isLoading.root.visibility = View.GONE
                }
                is AnimeViewModel.State.FailedLoading -> when (state.error) {
                    is JsonApiResponse.Error.ServerError -> state.error.body.errors.map {
                        Toast.makeText(requireContext(), it.title, Toast.LENGTH_SHORT).show()
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

                is AnimeViewModel.State.LoadingEpisodes -> {
                    state.season.isLoadingEpisodes = true
                }
                is AnimeViewModel.State.SuccessLoadingEpisodes -> {
                    displayAnime()
                    state.season.isLoadingEpisodes = false
                }
                is AnimeViewModel.State.FailedLoadingEpisodes -> when (state.error) {
                    is JsonApiResponse.Error.ServerError -> state.error.body.errors.map {
                        Toast.makeText(requireContext(), it.title, Toast.LENGTH_SHORT).show()
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

                AnimeViewModel.State.AddingEntry -> {
                    binding.clAnimeProgressionAdd.setOnClickListener(null)
                    binding.ivAnimeProgressionAdd.visibility = View.GONE
                    binding.pbAnimeProgressionAdd.visibility = View.VISIBLE
                }
                is AnimeViewModel.State.SuccessAddingEntry -> {
                    binding.ivAnimeProgressionAdd.apply {
                        visibility = View.VISIBLE
                        setImageResource(R.drawable.ic_check_black_24dp)
                    }
                    binding.pbAnimeProgressionAdd.visibility = View.GONE
                    binding.tvAnimeProgressionAdd.text = getString(R.string.added_to_library)
                    anime.animeEntry = state.animeEntry
                    Handler(Looper.getMainLooper()).postDelayed({
                        displayAnime()
                    }, 1 * 1000.toLong())
                }
                is AnimeViewModel.State.FailedAddingEntry -> when (state.error) {
                    is JsonApiResponse.Error.ServerError -> state.error.body.errors.map {
                        Toast.makeText(requireContext(), it.title, Toast.LENGTH_SHORT).show()
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

                AnimeViewModel.State.Updating -> binding.isUpdating.root.visibility = View.VISIBLE
                is AnimeViewModel.State.SuccessUpdating -> {
                    anime.animeEntry = state.animeEntry
                    displayAnime()
                    binding.isUpdating.root.visibility = View.GONE
                }
                is AnimeViewModel.State.FailedUpdating -> when (state.error) {
                    is JsonApiResponse.Error.ServerError -> state.error.body.errors.map {
                        Toast.makeText(requireContext(), it.title, Toast.LENGTH_SHORT).show()
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


    fun displayAnime() {
        if (_binding == null) {
            (requireActivity() as MainActivity).reloadActivity()
            return
        }

        activity?.invalidateOptionsMenu()

        binding.pbAnimeProgressionProgress.apply {
            anime.animeEntry?.let { animeEntry ->
                progress = animeEntry.getProgress(anime)
                progressTintList = ContextCompat.getColorStateList(requireContext(), animeEntry.getProgressColor(anime))
            }
        }

        binding.clAnimeProgressionAdd.apply {
            anime.animeEntry?.let { animeEntry ->
                if (animeEntry.isAdd) {
                    visibility =  View.GONE
                } else {
                    visibility = View.VISIBLE
                    setOnClickListener { _ ->
                        viewModel.addAnimeEntry(animeEntry.also {
                            it.isAdd = true
                        })
                    }
                }
            } ?: also {
                visibility = View.VISIBLE
                setOnClickListener { _ ->
                    viewModel.addAnimeEntry(AnimeEntry().also {
                        it.isAdd = true
                        it.status = AnimeEntry.Status.watching
                        it.user = User(id = Firebase.auth.uid)
                        it.anime = anime
                    })
                }
            }
        }

        binding.ivAnimeProgressionAdd.setImageResource(R.drawable.ic_add_black_24dp)

        binding.pbAnimeProgressionAdd.visibility = View.GONE

        binding.tvAnimeProgressionAdd.text = getString(R.string.add_anime_to_library)

        setAnimeAboutFragment()
        setAnimeEpisodesFragment()

        binding.tlAnime.apply {
            addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
                override fun onTabSelected(tab: TabLayout.Tab) {
                    showTab(AnimeTab.values()[tab.position])
                }
                override fun onTabUnselected(tab: TabLayout.Tab) {}
                override fun onTabReselected(tab: TabLayout.Tab) {}
            })
            getTabAt(selectedTabPosition)?.apply {
                select()
                showTab(AnimeTab.values()[position])
            }
        }
    }

    private fun setAnimeAboutFragment() {
        AnimeTab.About.list.apply {
            clear()
            add(anime.clone().apply { typeLayout = MangaJapAdapter.Type.ANIME_HEADER })
            add(anime.clone().apply { typeLayout = MangaJapAdapter.Type.ANIME_SUMMARY })
            if (anime.animeEntry != null)
                add(anime.clone().apply { typeLayout = MangaJapAdapter.Type.ANIME_PROGRESSION })
            add(anime.clone().apply { typeLayout = MangaJapAdapter.Type.ANIME_REVIEWS })
        }

        if (AnimeTab.About.fragment.isAdded)
            AnimeTab.About.fragment.mangaJapAdapter?.notifyDataSetChanged()
    }

    private fun setAnimeEpisodesFragment() {
        AnimeTab.Episodes.list.apply {
            clear()
            add(Season("").apply { typeLayout = MangaJapAdapter.Type.SEASON_ANIME_HEADER })
        }
        for (season in anime.seasons) {
            AnimeTab.Episodes.list.add(season)
            if (season.isShowingEpisodes) {
                AnimeTab.Episodes.list.addAll(season.episodes.map { episode ->
                    episode.apply { typeLayout = MangaJapAdapter.Type.EPISODE_ANIME }
                })
            }
        }

        if (AnimeTab.Episodes.fragment.isAdded)
            AnimeTab.Episodes.fragment.mangaJapAdapter?.notifyDataSetChanged()

    }

    private fun addTab(animeTab: AnimeTab) {
        val ft: FragmentTransaction = childFragmentManager.beginTransaction()

        if (!binding.tlAnime.contains(getString(animeTab.stringId))) {
            binding.tlAnime.add(getString(animeTab.stringId))
            if (animeTab.fragment.isAdded) {
                ft.detach(animeTab.fragment)
                ft.attach(animeTab.fragment)
            } else {
                ft.add(binding.flAnime.id, animeTab.fragment)
            }
        }

        ft.commitAllowingStateLoss()
    }

    private fun showTab(animeTab: AnimeTab) {
        val ft: FragmentTransaction = childFragmentManager.beginTransaction()

        AnimeTab.values().forEach {
            when (animeTab) {
                it -> ft.show(animeTab.fragment)
                else -> ft.hide(it.fragment)
            }
        }

        ft.commitAllowingStateLoss()
    }

    private fun displayPopupWindow() {
        val layoutInflater = requireActivity().getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
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

        popupAnimeBinding.tvPopupAnimeStatus.text = getString(anime.animeEntry?.status?.stringId ?: AnimeEntry.Status.watching.stringId)

        popupAnimeBinding.vPopupAnimeDelete.setOnClickListener { _ ->
            anime.animeEntry?.let { animeEntry ->
                viewModel.updateAnimeEntry(animeEntry.apply {
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