package com.tanasi.mangajap.fragments.profile

import android.app.AlertDialog
import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.appcompat.view.ContextThemeWrapper
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.PagerSnapHelper
import com.google.android.material.tabs.TabLayout
import com.google.android.material.tabs.TabLayout.OnTabSelectedListener
import com.squareup.picasso.MemoryPolicy
import com.squareup.picasso.NetworkPolicy
import com.squareup.picasso.Picasso
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.LauncherActivity
import com.tanasi.mangajap.activities.MainActivity
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.databinding.FragmentProfileBinding
import com.tanasi.mangajap.fragments.follow.FollowFragment
import com.tanasi.mangajap.fragments.library.LibraryFragment
import com.tanasi.mangajap.models.*
import com.tanasi.mangajap.utils.extensions.addOrLast
import com.tanasi.mangajap.utils.extensions.contains
import com.tanasi.mangajap.utils.preferences.GeneralPreference
import com.tanasi.mangajap.utils.preferences.UserPreference

class ProfileFragment : Fragment() {

    private enum class TabType(
        val stringId: Int,
        val statsList: MutableList<User.Stats> = mutableListOf(),
        val libraryList: MutableList<MangaJapAdapter.Item> = mutableListOf(),
        val favoritesList: MutableList<MangaJapAdapter.Item> = mutableListOf()
    ) {
        Manga(R.string.manga),
        Anime(R.string.anime);
    }

    private var _binding: FragmentProfileBinding? = null
    private val binding: FragmentProfileBinding get() = _binding!!

    private val args: ProfileFragmentArgs by navArgs()

    private val viewModel: ProfileViewModel by viewModels()

    private lateinit var generalPreference: GeneralPreference
    private lateinit var userPreference: UserPreference

    private var userId: String? = null
    private var actualTab: TabType = TabType.values()[0]

    private lateinit var user: User
    private var followed: Follow? = null
    private var follower: Follow? = null

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        userId = args.userId
        viewModel.getProfile(userId)
        (requireActivity() as MainActivity).showBottomNavView(userId == null)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        generalPreference = GeneralPreference(requireContext())
        userPreference = UserPreference(requireContext())

        actualTab = when (generalPreference.displayFirst) {
            GeneralPreference.DisplayFirst.Manga -> TabType.Manga
            GeneralPreference.DisplayFirst.Anime -> TabType.Anime
        }

        binding.navigation.apply {
            visibility = userId?.let {
                setOnClickListener { findNavController().navigateUp() }
                View.VISIBLE
            } ?: View.GONE
        }

        viewModel.state.observe(viewLifecycleOwner) { state ->
            when (state) {
                ProfileViewModel.State.Loading -> binding.isLoading.cslIsLoading.visibility = View.VISIBLE
                is ProfileViewModel.State.SuccessLoading -> {
                    user = state.user
                    followed = state.followed
                    follower = state.follower

                    displayProfile()
                    binding.isLoading.cslIsLoading.visibility = View.GONE
                }
                is ProfileViewModel.State.FailedLoading -> when (state.error) {
                    is JsonApiResponse.Error.ServerError -> Toast.makeText(requireContext(), getString(R.string.serverError), Toast.LENGTH_SHORT).show()
                    is JsonApiResponse.Error.NetworkError -> Toast.makeText(requireContext(), getString(R.string.serverError), Toast.LENGTH_SHORT).show()
                    is JsonApiResponse.Error.UnknownError -> if (userId == null) {
                        AlertDialog.Builder(ContextThemeWrapper(context, R.style.Widget_AppTheme_Dialog_Alert))
                                .setTitle(getString(R.string.error))
                                .setMessage(getString(R.string.error_occurs_logout))
                                .setPositiveButton(getString(R.string.confirm)) { _, _ ->
                                    userPreference.logout()
                                    startActivity(Intent(requireContext(), LauncherActivity::class.java))
                                    requireActivity().finish()
                                }
                                .setNegativeButton(getString(R.string.cancel)) { _, _ -> }
                                .show()
                    }
                }

                ProfileViewModel.State.UpdatingFollowed -> {
                    binding.follow.setOnClickListener(null)
                    binding.pbIsFollowing.visibility = View.VISIBLE
                }
                is ProfileViewModel.State.SuccessUpdatingFollowed -> {
                    followed = state.followed
                    displayFollow()
                }
                is ProfileViewModel.State.FailedUpdatingFollowed -> when (state.error) {
                    is JsonApiResponse.Error.ServerError -> Toast.makeText(requireContext(), getString(R.string.serverError), Toast.LENGTH_SHORT).show()
                    is JsonApiResponse.Error.NetworkError -> Toast.makeText(requireContext(), getString(R.string.serverError), Toast.LENGTH_SHORT).show()
                    is JsonApiResponse.Error.UnknownError -> Toast.makeText(requireContext(), getString(R.string.error), Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }


    private fun displayProfile() {
        binding.settings.apply {
            if (userId == null || userId == userPreference.selfId) {
                visibility = View.VISIBLE
                setOnClickListener {
                    findNavController().navigate(
                            ProfileFragmentDirections.actionProfileToSettings()
                    )
                }
            } else {
                visibility = View.GONE
            }
        }

        binding.profilePicCircleImageView.apply {
            Picasso.get()
                    .load(user.avatar?.medium)
                    .placeholder(R.drawable.default_user_avatar)
                    .error(R.drawable.default_user_avatar)
                    .networkPolicy(NetworkPolicy.NO_CACHE)
                    .memoryPolicy(MemoryPolicy.NO_CACHE)
                    .into(this)
            setOnClickListener {
                user.avatar?.original?.let { imagePath ->
                    findNavController().navigate(
                            ProfileFragmentDirections.actionProfileToImage(
                                    imagePath
                            )
                    )
                }
            }
        }

        binding.pseudoTextView.text = user.pseudo

        binding.aboutTextView.apply {
            if (user.about == "") {
                visibility = View.GONE
            } else {
                visibility = View.VISIBLE
                text = user.about
            }
        }

        binding.editProfileTextView.apply {
            if (userId == null || userId == userPreference.selfId) {
                visibility = View.VISIBLE
                setOnClickListener {
                    findNavController().navigate(
                            ProfileFragmentDirections.actionProfileToProfileEdit()
                    )
                }
            } else {
                visibility = View.GONE
            }
        }

        displayFollow()

        binding.followers.setOnClickListener {
            findNavController().navigate(
                    ProfileFragmentDirections.actionProfileToFollow(
                            user.id,
                            user.pseudo,
                            FollowFragment.FollowType.Followers
                    )
            )
        }

        binding.followersCountTextView.text = user.followersCount.toString()

        binding.following.setOnClickListener {
            findNavController().navigate(
                    ProfileFragmentDirections.actionProfileToFollow(
                            user.id,
                            user.pseudo,
                            FollowFragment.FollowType.Following
                    )
            )
        }

        binding.followingCountTextView.text = user.followingCount.toString()


        binding.profileTabLayout.apply {
            TabType.values().map {
                if (!contains(getString(it.stringId))) addTab(newTab().setText(getString(it.stringId)))
            }
            addOnTabSelectedListener(object : OnTabSelectedListener {
                override fun onTabSelected(tab: TabLayout.Tab) {
                    actualTab = TabType.values()[tab.position]
                    generalPreference.displayFirst = when (actualTab) {
                        TabType.Manga -> GeneralPreference.DisplayFirst.Manga
                        TabType.Anime -> GeneralPreference.DisplayFirst.Anime
                    }
                    displayList()
                }

                override fun onTabUnselected(tab: TabLayout.Tab) {}
                override fun onTabReselected(tab: TabLayout.Tab) {}
            })
            getTabAt(actualTab.ordinal)?.apply {
                select()
                displayList()
            }
        }

        binding.previewStatsRecyclerView.apply {
            val pagerSnapHelper = PagerSnapHelper()
            pagerSnapHelper.attachToRecyclerView(this)
        }
    }


    private fun displayFollow() {
        if (userId == null || userId == userPreference.selfId) {
            binding.follow.visibility = View.GONE
            binding.followsYouTextView.visibility = View.GONE
            return
        }

        binding.follow.apply {
            visibility = View.VISIBLE
            followed?.let { followed ->
                setBackgroundResource(R.drawable.bg_follow_btn)
                setOnClickListener {
                    viewModel.deleteFollow(followed)
                }
            } ?: let {
                setBackgroundResource(R.drawable.bg_follow_no_btn)
                setOnClickListener {
                    viewModel.follow(Follow().also {
                        it.putFollower(User().apply { id = UserPreference(requireContext()).selfId })
                        it.putFollowed(user)
                    })
                }
            }
        }

        binding.pbIsFollowing.apply {
            visibility = View.GONE
            followed?.let {
                indeterminateTintList = ContextCompat.getColorStateList(context, R.color.white)
            } ?: let {
                indeterminateTintList = ContextCompat.getColorStateList(context, R.color.follow_color)
            }
        }

        binding.followBtnTextView.apply {
            followed?.let {
                text = requireContext().resources.getString(R.string.following)
                setTextColor(Color.WHITE)
            } ?: let {
                text = requireContext().resources.getString(R.string.follow)
                setTextColor(ContextCompat.getColor(requireContext(), R.color.follow_color))
            }
        }

        if (follower == null) {
            binding.followsYouTextView.visibility = View.GONE
        } else {
            binding.followsYouTextView.visibility = View.VISIBLE
        }
    }

    private fun displayList() {
        binding.mediaFollowedTextView.apply {
            text = when (actualTab) {
                TabType.Manga -> getString(R.string.manga)
                TabType.Anime -> getString(R.string.anime)
            }
        }

        binding.mediaFollowedCountTextView.apply {
            text = when (actualTab) {
                TabType.Manga -> user.followedMangaCount.toString()
                TabType.Anime -> user.followedAnimeCount.toString()
            }
        }

        binding.previewLibraryTextView.apply {
            text = when (actualTab) {
                TabType.Manga -> getString(R.string.mangaList)
                TabType.Anime -> getString(R.string.animeList)
            }
        }

        binding.previewFavoritesTextView.apply {
            text = when (actualTab) {
                TabType.Manga -> getString(R.string.favoritesManga)
                TabType.Anime -> getString(R.string.favoritesAnime)
            }
        }


        when (actualTab) {
            TabType.Manga -> TabType.Manga.let { tab ->
                tab.statsList.apply {
                    clear()
                    add(User.Stats(user).also { it.typeLayout = MangaJapAdapter.Type.STATS_PREVIEW_MANGA_FOLLOWED })
                    add(User.Stats(user).also { it.typeLayout = MangaJapAdapter.Type.STATS_PREVIEW_MANGA_VOLUMES })
                    add(User.Stats(user).also { it.typeLayout = MangaJapAdapter.Type.STATS_PREVIEW_MANGA_CHAPTERS })
                }
                tab.libraryList.apply {
                    clear()
                    addAll(user.mangaLibrary)
                    addOrLast(2, Ad().also { it.typeLayout = MangaJapAdapter.Type.AD_PROFILE })
                }
                tab.favoritesList.apply {
                    clear()
                    addAll(user.mangaFavorites)
                }
            }
            TabType.Anime -> TabType.Anime.let { tab ->
                tab.statsList.apply {
                    clear()
                    add(User.Stats(user).also { it.typeLayout = MangaJapAdapter.Type.STATS_PREVIEW_ANIME_FOLLOWED })
                    add(User.Stats(user).also { it.typeLayout = MangaJapAdapter.Type.STATS_PREVIEW_ANIME_TIME_SPENT })
                    add(User.Stats(user).also { it.typeLayout = MangaJapAdapter.Type.STATS_PREVIEW_ANIME_EPISODES })
                }
                tab.libraryList.apply {
                    clear()
                    addAll(user.animeLibrary)
                    addOrLast(2, Ad().also { it.typeLayout = MangaJapAdapter.Type.AD_PROFILE })
                }
                tab.favoritesList.apply {
                    clear()
                    addAll(user.animeFavorites)
                }
            }
        }



        binding.previewStatsRecyclerView.apply {
            layoutManager = LinearLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false)
            adapter = MangaJapAdapter(actualTab.statsList)
        }



        binding.previewListTitle.setOnClickListener {
            findNavController().navigate(
                    ProfileFragmentDirections.actionProfileToLibrary(
                            user.id,
                            user.pseudo,
                            when (actualTab) {
                                TabType.Manga -> LibraryFragment.LibraryType.MangaList
                                TabType.Anime -> LibraryFragment.LibraryType.AnimeList
                            }
                    )
            )
        }

        binding.previewLibraryRecyclerView.apply {
            if (actualTab.libraryList.isEmpty()) {
                visibility = View.GONE
            } else {
                visibility = View.VISIBLE
                actualTab.libraryList.apply {
                    subList(if (size < PREVIEW_SIZE) size else PREVIEW_SIZE, size).clear()
                }
                for (item in actualTab.libraryList) {
                    when (item) {
                        is MangaEntry -> item.typeLayout = MangaJapAdapter.Type.MANGA_ENTRY_PREVIEW
                        is AnimeEntry -> item.typeLayout = MangaJapAdapter.Type.ANIME_ENTRY_PREVIEW
                    }
                }
                layoutManager = LinearLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false)
                adapter = MangaJapAdapter(actualTab.libraryList)
            }
        }



        binding.previewFavorites.apply {
            visibility = if (actualTab.favoritesList.isEmpty()) {
                View.GONE
            } else {
                View.VISIBLE
            }
        }

        binding.previewFavoritesTitle.setOnClickListener {
            findNavController().navigate(
                    ProfileFragmentDirections.actionProfileToLibrary(
                            user.id,
                            user.pseudo,
                            when (actualTab) {
                                TabType.Manga -> LibraryFragment.LibraryType.MangaFavoritesList
                                TabType.Anime -> LibraryFragment.LibraryType.AnimeFavoritesList
                            }
                    )
            )
        }

        binding.previewFavoritesRecyclerView.apply {
            if (actualTab.favoritesList.isEmpty()) {
                visibility = View.GONE
            } else {
                visibility = View.VISIBLE
                actualTab.favoritesList.apply {
                    subList(if (size < PREVIEW_SIZE) size else PREVIEW_SIZE, size).clear()
                }
                for (item in actualTab.favoritesList) {
                    when (item) {
                        is MangaEntry -> item.typeLayout = MangaJapAdapter.Type.MANGA_ENTRY_PREVIEW
                        is AnimeEntry -> item.typeLayout = MangaJapAdapter.Type.ANIME_ENTRY_PREVIEW
                    }
                }
                layoutManager = LinearLayoutManager(context, LinearLayoutManager.HORIZONTAL, false)
                adapter = MangaJapAdapter(actualTab.favoritesList)
            }
        }
    }


    companion object {
        private const val PREVIEW_SIZE = 15
    }
}