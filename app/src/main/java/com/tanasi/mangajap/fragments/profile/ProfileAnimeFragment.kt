package com.tanasi.mangajap.fragments.profile

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.flowWithLifecycle
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.PagerSnapHelper
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.databinding.FragmentProfileTabBinding
import com.tanasi.mangajap.fragments.library.LibraryFragment
import com.tanasi.mangajap.models.User
import com.tanasi.mangajap.ui.SpacingItemDecoration
import kotlinx.coroutines.launch

class ProfileAnimeFragment : Fragment() {

    private var _binding: FragmentProfileTabBinding? = null
    private val binding get() = _binding!!

    private val viewModel by viewModels<ProfileViewModel>(
        ownerProducer = { requireParentFragment() }
    )

    private val userStatsAdapter = AppAdapter()
    private val profileLibraryAdapter = AppAdapter()
    private val profileLibraryFavoritesAdapter = AppAdapter()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProfileTabBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        initializeProfileTab()

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.state.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED).collect { state ->
                when (state) {
                    is ProfileViewModel.State.SuccessLoading -> {
                        displayProfileTab(state.user)
                    }
                    else -> {}
                }
            }
        }
    }


    private fun initializeProfileTab() {
        binding.rvProfileUserStats.apply {
            adapter = userStatsAdapter
            PagerSnapHelper().attachToRecyclerView(this)
            addItemDecoration(
                SpacingItemDecoration(
                    spacing = (resources.getDimension(R.dimen.profile_spacing) * 1.2).toInt()
                )
            )
        }

        binding.tvProfileUserLibrary.apply {
            text = getString(R.string.animeList)
        }

        binding.rvProfileUserLibrary.apply {
            adapter = profileLibraryAdapter
            addItemDecoration(
                SpacingItemDecoration(
                    spacing = (resources.getDimension(R.dimen.profile_spacing) * 0.6).toInt()
                )
            )
        }

        binding.tvProfileUserLibraryFavorites.apply {
            text = getString(R.string.favoritesAnime)
        }

        binding.rvProfileUserLibraryFavorites.apply {
            adapter = profileLibraryFavoritesAdapter
            addItemDecoration(
                SpacingItemDecoration(
                    spacing = (resources.getDimension(R.dimen.profile_spacing) * 0.6).toInt()
                )
            )
        }
    }

    private fun displayProfileTab(user: User) {
        userStatsAdapter.submitList(
            listOf(
                User.Stats(user).also {
                    it.itemType = AppAdapter.Type.STATS_PROFILE_ANIME_FOLLOWED_ITEM
                },
                User.Stats(user).also {
                    it.itemType = AppAdapter.Type.STATS_PROFILE_ANIME_TIME_SPENT_ITEM
                },
                User.Stats(user).also {
                    it.itemType = AppAdapter.Type.STATS_PROFILE_ANIME_EPISODES_ITEM
                },
            )
        )

        binding.llProfileUserLibrary.setOnClickListener {
            findNavController().navigate(
                ProfileFragmentDirections.actionProfileToLibrary(
                    user.id!!,
                    user.pseudo,
                    LibraryFragment.LibraryType.AnimeList
                )
            )
        }

        profileLibraryAdapter.submitList(user.animeLibrary.onEach {
            it.itemType = AppAdapter.Type.ANIME_ENTRY_PROFILE_ITEM
        })

        binding.rvProfileUserLibrary.visibility = when {
            user.animeLibrary.isEmpty() -> View.GONE
            else -> View.VISIBLE
        }


        binding.groupProfileUserLibraryFavorites.visibility = when {
            user.animeFavorites.isEmpty() -> View.GONE
            else -> View.VISIBLE
        }

        binding.llProfileUserLibraryFavorites.setOnClickListener {
            findNavController().navigate(
                ProfileFragmentDirections.actionProfileToLibrary(
                    user.id!!,
                    user.pseudo,
                    LibraryFragment.LibraryType.AnimeFavoritesList
                )
            )
        }

        profileLibraryFavoritesAdapter.submitList(user.animeFavorites.onEach {
            it.itemType = AppAdapter.Type.ANIME_ENTRY_PROFILE_ITEM
        })

        binding.rvProfileUserLibraryFavorites.visibility = when {
            user.animeFavorites.isEmpty() -> View.GONE
            else -> View.VISIBLE
        }
    }
}