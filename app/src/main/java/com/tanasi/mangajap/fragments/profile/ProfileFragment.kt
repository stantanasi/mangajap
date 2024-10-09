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
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.flowWithLifecycle
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
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
import com.tanasi.mangajap.databinding.FragmentProfileBinding
import com.tanasi.mangajap.fragments.follow.FollowFragment
import com.tanasi.mangajap.models.Follow
import com.tanasi.mangajap.models.User
import com.tanasi.mangajap.utils.extensions.viewModelsFactory
import com.tanasi.mangajap.utils.preferences.GeneralPreference
import kotlinx.coroutines.launch
import java.util.Locale

class ProfileFragment : Fragment() {

    private enum class ProfileTab(val stringId: Int) {
        MANGA(R.string.manga),
        ANIME(R.string.anime);
    }

    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!

    private val args by navArgs<ProfileFragmentArgs>()

    private val viewModel by viewModelsFactory {
        ProfileViewModel(args.userId ?: Firebase.auth.uid!!)
    }

    private lateinit var generalPreference: GeneralPreference

    private var currentTab = ProfileTab.entries.first()
    private val mangaFragment by lazy { binding.fProfileManga.getFragment<ProfileMangaFragment>() }
    private val animeFragment by lazy { binding.fProfileAnime.getFragment<ProfileAnimeFragment>() }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        (requireActivity() as MainActivity).showBottomNavView(args.userId == null)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        generalPreference = GeneralPreference(requireContext())

        initializeProfile()

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.state.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED).collect { state ->
                when (state) {
                    ProfileViewModel.State.Loading -> binding.isLoading.apply {
                        root.visibility = View.VISIBLE
                    }

                    is ProfileViewModel.State.SuccessLoading -> {
                        displayProfile(state.user, state.followed, state.follower)
                        binding.isLoading.root.visibility = View.GONE
                    }

                    is ProfileViewModel.State.FailedLoading -> {
                        when (state.error) {
                            is JsonApiResponse.Error.ServerError -> state.error.body.errors.map {
                                Toast.makeText(requireContext(), it.title, Toast.LENGTH_SHORT)
                                    .show()
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


    private fun initializeProfile() {
        binding.tlProfile.apply {
            ProfileTab.entries
                .map { newTab().setText(getString(it.stringId)) }
                .forEach { addTab(it) }
        }

        currentTab = when (generalPreference.displayFirst) {
            GeneralPreference.DisplayFirst.Manga -> ProfileTab.MANGA
            GeneralPreference.DisplayFirst.Anime -> ProfileTab.ANIME
        }

        binding.ivProfileNavigationIcon.apply {
            setOnClickListener { findNavController().navigateUp() }
            visibility = when {
                args.userId == null -> View.GONE
                else -> View.VISIBLE
            }
        }
    }

    private fun displayProfile(user: User, isFollowed: Follow?, isFollowing: Follow?) {
        binding.ivProfileSettings.apply {
            setOnClickListener {
                findNavController().navigate(
                    ProfileFragmentDirections.actionProfileToSettings()
                )
            }
            visibility = when (args.userId) {
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
            text = user.about
            visibility = when {
                user.about.isNotEmpty() -> View.VISIBLE
                else -> View.GONE
            }
        }

        binding.tvProfileUserEdit.apply {
            setOnClickListener {
                findNavController().navigate(
                    ProfileFragmentDirections.actionProfileToProfileEdit()
                )
            }
            visibility = when (args.userId) {
                null, Firebase.auth.uid -> View.VISIBLE
                else -> View.GONE
            }
        }

        binding.llProfileFollow.apply {
            if (isFollowed != null) {
                setBackgroundResource(R.drawable.bg_btn_follow)
                setOnClickListener {
                    viewModel.unfollow(isFollowed)
                    setOnClickListener(null)
                    binding.pbProfileIsFollowing.visibility = View.VISIBLE
                }
            } else {
                setBackgroundResource(R.drawable.bg_btn_unfollow)
                setOnClickListener {
                    viewModel.follow(Follow().also {
                        it.follower = User(id = Firebase.auth.uid)
                        it.followed = user
                    })
                    setOnClickListener(null)
                    binding.pbProfileIsFollowing.visibility = View.VISIBLE
                }
            }
            visibility = when (args.userId) {
                null, Firebase.auth.uid -> View.GONE
                else -> View.VISIBLE
            }
        }

        binding.pbProfileIsFollowing.apply {
            indeterminateTintList = when {
                isFollowed != null -> ColorStateList.valueOf(Color.WHITE)
                else -> ContextCompat.getColorStateList(context, R.color.color_app)
            }
            visibility = View.GONE
        }

        binding.tvProfileYouFollowUser.apply {
            if (isFollowed != null) {
                text = requireContext().resources.getString(R.string.following)
                setTextColor(Color.WHITE)
            } else {
                text = requireContext().resources.getString(R.string.follow)
                setTextColor(ContextCompat.getColor(requireContext(), R.color.color_app))
            }
        }

        binding.tvProfileUserIsFollowingYou.visibility = when {
            isFollowing == null -> View.GONE
            else -> View.VISIBLE
        }

        binding.vProfileFollowers.setOnClickListener {
            findNavController().navigate(
                ProfileFragmentDirections.actionProfileToFollow(
                    user.id!!,
                    user.pseudo,
                    FollowFragment.FollowType.Followers
                )
            )
        }

        binding.tvProfileFollowersCount.text = String.format(
            Locale.getDefault(),
            "%d",
            user.followersCount
        )

        binding.vProfileFollowing.setOnClickListener {
            findNavController().navigate(
                ProfileFragmentDirections.actionProfileToFollow(
                    user.id!!,
                    user.pseudo,
                    FollowFragment.FollowType.Following
                )
            )
        }

        binding.tvProfileFollowingCount.text = String.format(
            Locale.getDefault(),
            "%d",
            user.followingCount
        )

        binding.tlProfile.apply {
            addOnTabSelectedListener(object : OnTabSelectedListener {
                override fun onTabSelected(tab: TabLayout.Tab) {
                    currentTab = ProfileTab.entries[tab.position]
                    generalPreference.displayFirst = when (currentTab) {
                        ProfileTab.MANGA -> GeneralPreference.DisplayFirst.Manga
                        ProfileTab.ANIME -> GeneralPreference.DisplayFirst.Anime
                    }
                    showTab(user)
                }

                override fun onTabUnselected(tab: TabLayout.Tab) {}
                override fun onTabReselected(tab: TabLayout.Tab) {}
            })
            getTabAt(currentTab.ordinal)?.apply {
                select()
                showTab(user)
            }
        }
    }

    private fun showTab(user: User) {
        binding.tvProfileMediaFollowed.text = when (currentTab) {
            ProfileTab.MANGA -> getString(R.string.manga)
            ProfileTab.ANIME -> getString(R.string.anime)
        }

        binding.tvProfileMediaFollowedCount.text = when (currentTab) {
            ProfileTab.MANGA -> user.followedMangaCount.toString()
            ProfileTab.ANIME -> user.followedAnimeCount.toString()
        }

        childFragmentManager.beginTransaction().apply {
            when (currentTab) {
                ProfileTab.MANGA -> show(mangaFragment)
                else -> hide(mangaFragment)
            }
            when (currentTab) {
                ProfileTab.ANIME -> show(animeFragment)
                else -> hide(animeFragment)
            }
            commitAllowingStateLoss()
        }
    }
}