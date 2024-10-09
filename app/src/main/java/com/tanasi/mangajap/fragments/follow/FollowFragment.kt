package com.tanasi.mangajap.fragments.follow

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
import androidx.navigation.fragment.navArgs
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.databinding.FragmentFollowBinding
import com.tanasi.mangajap.models.Follow
import com.tanasi.mangajap.utils.extensions.setToolbar
import com.tanasi.mangajap.utils.extensions.viewModelsFactory
import kotlinx.coroutines.launch

class FollowFragment : Fragment() {

    enum class FollowType {
        Followers, // Abonnés
        Following; // Abonnements
    }

    private var _binding: FragmentFollowBinding? = null
    private val binding get() = _binding!!

    private val args by navArgs<FollowFragmentArgs>()
    private val viewModel by viewModelsFactory { FollowViewModel(args.userId, args.followType) }

    private val appAdapter = AppAdapter()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentFollowBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        initializeFollows()

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.state.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED).collect { state ->
                when (state) {
                    FollowViewModel.State.Loading -> binding.isLoading.apply {
                        root.visibility = View.VISIBLE
                    }

                    FollowViewModel.State.LoadingMore -> appAdapter.isLoading = true

                    is FollowViewModel.State.SuccessLoading -> {
                        displayFollows(state.followList, state.nextLink)
                        appAdapter.isLoading = false
                        binding.isLoading.root.visibility = View.GONE
                    }

                    is FollowViewModel.State.FailedLoading -> {
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


    private fun initializeFollows() {
        setToolbar(
            when (args.followType as FollowType) {
                FollowType.Followers -> getString(R.string.followers)
                FollowType.Following -> getString(R.string.followed)
            },
            when (args.userId) {
                Firebase.auth.uid -> ""
                else -> args.userPseudo
            }
        )

        binding.tvFollowUserHasAnyFollow.visibility = View.GONE

        binding.rvFollow.apply {
            adapter = appAdapter
        }
    }

    private fun displayFollows(followsList: List<Follow>, nextLink: String) {
        binding.tvFollowUserHasAnyFollow.apply {
            text = when (args.followType as FollowType) {
                FollowType.Followers -> getString(R.string.anyFollowers, args.userPseudo)
                FollowType.Following -> getString(R.string.anyFollowing, args.userPseudo)
            }
            visibility = when {
                followsList.isEmpty() -> View.VISIBLE
                else -> View.GONE
            }
        }

        binding.rvFollow.visibility = when {
            followsList.isEmpty() -> View.GONE
            else -> View.VISIBLE
        }

        appAdapter.submitList(followsList.onEach {
            it.itemType = when (args.followType as FollowType) {
                FollowType.Followers -> AppAdapter.Type.FOLLOWER_ITEM
                FollowType.Following -> AppAdapter.Type.FOLLOWING_ITEM
            }
        })

        if (nextLink != "") {
            appAdapter.setOnLoadMoreListener {
                when (args.followType as FollowType) {
                    FollowType.Followers -> viewModel.loadMoreFollowers(nextLink)
                    FollowType.Following -> viewModel.loadMoreFollowing(nextLink)
                }
            }
        } else {
            appAdapter.setOnLoadMoreListener(null)
        }
    }
}