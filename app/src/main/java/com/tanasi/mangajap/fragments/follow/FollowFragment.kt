package com.tanasi.mangajap.fragments.follow

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.navArgs
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.databinding.FragmentFollowBinding
import com.tanasi.mangajap.models.LoadMore
import com.tanasi.mangajap.utils.extensions.setToolbar

class FollowFragment : Fragment() {

    enum class FollowType {
        Followers, // Abonnés
        Following; // Abonnements
    }

    private var _binding: FragmentFollowBinding? = null
    private val binding: FragmentFollowBinding get() = _binding!!

    private val viewModel: FollowViewModel by viewModels()

    private val args: FollowFragmentArgs by navArgs()

    
    private lateinit var userId: String
    private lateinit var userPseudo: String
    private lateinit var followType: FollowType

    private val followsList: MutableList<AppAdapter.Item> = mutableListOf()
    private val adapter: AppAdapter = AppAdapter(followsList)

    private lateinit var nextLink: String

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentFollowBinding.inflate(inflater, container, false)
        userId = args.userId
        userPseudo = args.userPseudo
        followType = args.followType
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setToolbar(
            when (followType) {
                FollowType.Followers -> getString(R.string.followers)
                FollowType.Following -> getString(R.string.followed)
            },
            when (userId) {
                Firebase.auth.uid -> ""
                else -> userPseudo
            }
        )

        viewModel.state.observe(viewLifecycleOwner) { state ->
            when (state) {
                FollowViewModel.State.Loading -> binding.isLoading.root.visibility = View.VISIBLE
                is FollowViewModel.State.SuccessLoading -> {
                    followsList.apply {
                        clear()
                        addAll(state.followList)
                    }
                    nextLink = state.nextLink
                    displayFollows()
                    binding.isLoading.root.visibility = View.GONE
                }
                is FollowViewModel.State.FailedLoading -> when (state.error) {
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

                FollowViewModel.State.LoadingMore -> adapter.isLoading = true
                is FollowViewModel.State.SuccessLoadingMore -> {
                    followsList.apply {
                        addAll(state.followList)
                    }
                    nextLink = state.nextLink
                    adapter.notifyDataSetChanged()
                }
                is FollowViewModel.State.FailedLoadingMore -> when (state.error) {
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

        when (followType) {
            FollowType.Followers -> viewModel.getFollowers(userId)
            FollowType.Following -> viewModel.getFollowing(userId)
        }
    }


    private fun displayFollows() {
        binding.tvFollowUserHasAnyFollow.apply {
            if (followsList.none { it !is LoadMore } || followsList.isEmpty()) {
                visibility = View.VISIBLE
                text = when (followType) {
                    FollowType.Followers -> getString(R.string.anyFollowers, userPseudo)
                    FollowType.Following -> getString(R.string.anyFollowing, userPseudo)
                }
            } else {
                visibility = View.GONE
            }
        }

        binding.rvFollow.apply {
            if (followsList.none { it !is LoadMore } || followsList.isEmpty()) {
                adapter = this@FollowFragment.adapter.also { adapter ->
                    adapter.setOnLoadMoreListener(null)
                }
                visibility = View.GONE
            } else {
                visibility = View.VISIBLE
                adapter = this@FollowFragment.adapter.also { adapter ->
                    adapter.setOnLoadMoreListener {
                        post {
                            if (nextLink != "") {
                                when (followType) {
                                    FollowType.Followers -> viewModel.loadMoreFollowers(nextLink)
                                    FollowType.Following -> viewModel.loadMoreFollowing(nextLink)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}