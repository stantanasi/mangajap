package com.tanasi.mangajap.fragments.profile

import android.content.res.ColorStateList
import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.PagerSnapHelper
import com.google.android.material.tabs.TabLayout
import com.google.android.material.tabs.TabLayout.OnTabSelectedListener
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.squareup.picasso.MemoryPolicy
import com.squareup.picasso.NetworkPolicy
import com.squareup.picasso.Picasso
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.MainActivity
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.databinding.FragmentProfileBinding
import com.tanasi.mangajap.fragments.follow.FollowFragment
import com.tanasi.mangajap.fragments.library.LibraryFragment
import com.tanasi.mangajap.models.*
import com.tanasi.mangajap.utils.extensions.add
import com.tanasi.mangajap.utils.extensions.addOrLast
import com.tanasi.mangajap.utils.extensions.contains
import com.tanasi.mangajap.utils.preferences.GeneralPreference

class ProfileFragment : Fragment() {

    private enum class ProfileTab(
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

    private var userId: String? = null
    private var currentTab: ProfileTab = ProfileTab.values().first()

    private lateinit var user: User
    private var followed: Follow? = null
    private var follower: Follow? = null

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        userId = args.userId
        viewModel.getProfile(userId ?: Firebase.auth.uid!!)
        (requireActivity() as MainActivity).showBottomNavView(userId == null)
        ProfileTab.values().forEach {
            addTab(it)
        }
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        generalPreference = GeneralPreference(requireContext())

        currentTab = when (generalPreference.displayFirst) {
            GeneralPreference.DisplayFirst.Manga -> ProfileTab.Manga
            GeneralPreference.DisplayFirst.Anime -> ProfileTab.Anime
        }

        binding.ivProfileNavigationIcon.apply {
            setOnClickListener { findNavController().navigateUp() }
            visibility = when (userId) {
                null -> View.GONE
                else -> View.VISIBLE
            }
        }

        viewModel.state.observe(viewLifecycleOwner) { state ->
            when (state) {
                ProfileViewModel.State.Loading -> binding.isLoading.root.visibility = View.VISIBLE
                is ProfileViewModel.State.SuccessLoading -> {
                    user = state.user
                    followed = state.followed
                    follower = state.follower

                    displayProfile()
                    binding.isLoading.root.visibility = View.GONE
                }
                is ProfileViewModel.State.FailedLoading -> when (state.error) {
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

                ProfileViewModel.State.UpdatingFollowed -> {
                    binding.llProfileFollow.setOnClickListener(null)
                    binding.pbProfileIsFollowing.visibility = View.VISIBLE
                }
                is ProfileViewModel.State.SuccessUpdatingFollowed -> {
                    followed = state.followed
                    displayFollow()
                }
                is ProfileViewModel.State.FailedUpdatingFollowed -> when (state.error) {
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


    private fun displayProfile() {
        binding.ivProfileSettings.apply {
            setOnClickListener {
                findNavController().navigate(
                    ProfileFragmentDirections.actionProfileToSettings()
                )
            }
            visibility = when (userId) {
                null, Firebase.auth.uid -> View.VISIBLE
                else -> View.GONE
            }
        }

        binding.civProfileUserPic.apply {
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

        binding.tvProfileUserPseudo.text = user.pseudo

        binding.tvProfileUserAbout.apply {
            if (user.about == "") {
                visibility = View.GONE
            } else {
                visibility = View.VISIBLE
                text = user.about
            }
        }

        binding.tvProfileUserEdit.apply {
            if (userId == null || userId == Firebase.auth.uid) {
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

        binding.vProfileFollowers.setOnClickListener {
            findNavController().navigate(
                ProfileFragmentDirections.actionProfileToFollow(
                    user.id!!,
                    user.pseudo,
                    FollowFragment.FollowType.Followers
                )
            )
        }

        binding.tvProfileFollowersCount.text = user.followersCount.toString()

        binding.vProfileFollowing.setOnClickListener {
            findNavController().navigate(
                ProfileFragmentDirections.actionProfileToFollow(
                    user.id!!,
                    user.pseudo,
                    FollowFragment.FollowType.Following
                )
            )
        }

        binding.tvProfileFollowingCount.text = user.followingCount.toString()

        binding.tlProfile.apply {
            addOnTabSelectedListener(object : OnTabSelectedListener {
                override fun onTabSelected(tab: TabLayout.Tab) {
                    currentTab = ProfileTab.values()[tab.position]
                    generalPreference.displayFirst = when (currentTab) {
                        ProfileTab.Manga -> GeneralPreference.DisplayFirst.Manga
                        ProfileTab.Anime -> GeneralPreference.DisplayFirst.Anime
                    }
                    displayList()
                }

                override fun onTabUnselected(tab: TabLayout.Tab) {}
                override fun onTabReselected(tab: TabLayout.Tab) {}
            })
            getTabAt(currentTab.ordinal)?.apply {
                select()
                displayList()
            }
        }

        binding.rvProfileUserStats.apply {
            val pagerSnapHelper = PagerSnapHelper()
            pagerSnapHelper.attachToRecyclerView(this)
        }
    }


    private fun displayFollow() {
        if (userId == null || userId == Firebase.auth.uid) {
            binding.llProfileFollow.visibility = View.GONE
            binding.tvProfileUserIsFollowingYou.visibility = View.GONE
            return
        }

        binding.llProfileFollow.apply {
            visibility = View.VISIBLE
            followed?.let { followed ->
                setBackgroundResource(R.drawable.bg_btn_follow)
                setOnClickListener {
                    viewModel.deleteFollow(followed)
                }
            } ?: let {
                setBackgroundResource(R.drawable.bg_btn_unfollow)
                setOnClickListener {
                    viewModel.follow(Follow().also {
                        it.follower = User(id = Firebase.auth.uid)
                        it.followed = user
                    })
                }
            }
        }

        binding.pbProfileIsFollowing.apply {
            visibility = View.GONE
            followed?.let {
                indeterminateTintList = ColorStateList.valueOf(Color.WHITE)
            } ?: let {
                indeterminateTintList = ContextCompat.getColorStateList(context, R.color.color_app)
            }
        }

        binding.tvProfileYouFollowUser.apply {
            followed?.let {
                text = requireContext().resources.getString(R.string.following)
                setTextColor(Color.WHITE)
            } ?: let {
                text = requireContext().resources.getString(R.string.follow)
                setTextColor(ContextCompat.getColor(requireContext(), R.color.color_app))
            }
        }

        if (follower == null) {
            binding.tvProfileUserIsFollowingYou.visibility = View.GONE
        } else {
            binding.tvProfileUserIsFollowingYou.visibility = View.VISIBLE
        }
    }

    private fun displayList() {
        binding.tvProfileMediaFollowed.apply {
            text = when (currentTab) {
                ProfileTab.Manga -> getString(R.string.manga)
                ProfileTab.Anime -> getString(R.string.anime)
            }
        }

        binding.tvProfileMediaFollowedCount.apply {
            text = when (currentTab) {
                ProfileTab.Manga -> user.followedMangaCount.toString()
                ProfileTab.Anime -> user.followedAnimeCount.toString()
            }
        }

        binding.tvProfileUserLibrary.apply {
            text = when (currentTab) {
                ProfileTab.Manga -> getString(R.string.mangaList)
                ProfileTab.Anime -> getString(R.string.animeList)
            }
        }

        binding.tvProfileUserLibraryFavorites.apply {
            text = when (currentTab) {
                ProfileTab.Manga -> getString(R.string.favoritesManga)
                ProfileTab.Anime -> getString(R.string.favoritesAnime)
            }
        }


        when (currentTab) {
            ProfileTab.Manga -> ProfileTab.Manga.let { tab ->
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
            ProfileTab.Anime -> ProfileTab.Anime.let { tab ->
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



        binding.rvProfileUserStats.apply {
            adapter = MangaJapAdapter(currentTab.statsList)
        }



        binding.llProfileUserLibrary.setOnClickListener {
            findNavController().navigate(
                    ProfileFragmentDirections.actionProfileToLibrary(
                            user.id!!,
                            user.pseudo,
                            when (currentTab) {
                                ProfileTab.Manga -> LibraryFragment.LibraryType.MangaList
                                ProfileTab.Anime -> LibraryFragment.LibraryType.AnimeList
                            }
                    )
            )
        }

        binding.rvProfileUserLibrary.apply {
            if (currentTab.libraryList.isEmpty()) {
                visibility = View.GONE
            } else {
                visibility = View.VISIBLE
                currentTab.libraryList.apply {
                    subList(if (size < PREVIEW_SIZE) size else PREVIEW_SIZE, size).clear()
                }
                for (item in currentTab.libraryList) {
                    when (item) {
                        is MangaEntry -> item.typeLayout = MangaJapAdapter.Type.MANGA_ENTRY_PREVIEW
                        is AnimeEntry -> item.typeLayout = MangaJapAdapter.Type.ANIME_ENTRY_PREVIEW
                    }
                }
                adapter = MangaJapAdapter(currentTab.libraryList)
            }
        }



        binding.groupProfileUserLibraryFavorites.visibility = when {
            currentTab.favoritesList.isEmpty() -> View.GONE
            else -> View.VISIBLE
        }

        binding.llProfileUserLibraryFavorites.setOnClickListener {
            findNavController().navigate(
                    ProfileFragmentDirections.actionProfileToLibrary(
                            user.id!!,
                            user.pseudo,
                            when (currentTab) {
                                ProfileTab.Manga -> LibraryFragment.LibraryType.MangaFavoritesList
                                ProfileTab.Anime -> LibraryFragment.LibraryType.AnimeFavoritesList
                            }
                    )
            )
        }

        binding.rvProfileUserLibraryFavorites.apply {
            if (currentTab.favoritesList.isEmpty()) {
                visibility = View.GONE
            } else {
                visibility = View.VISIBLE
                currentTab.favoritesList.apply {
                    subList(if (size < PREVIEW_SIZE) size else PREVIEW_SIZE, size).clear()
                }
                for (item in currentTab.favoritesList) {
                    when (item) {
                        is MangaEntry -> item.typeLayout = MangaJapAdapter.Type.MANGA_ENTRY_PREVIEW
                        is AnimeEntry -> item.typeLayout = MangaJapAdapter.Type.ANIME_ENTRY_PREVIEW
                    }
                }
                adapter = MangaJapAdapter(currentTab.favoritesList)
            }
        }
    }

    private fun addTab(profileTab: ProfileTab) {
        if (!binding.tlProfile.contains(getString(profileTab.stringId))) {
            binding.tlProfile.add(getString(profileTab.stringId))
        }
    }


    companion object {
        private const val PREVIEW_SIZE = 15
    }
}