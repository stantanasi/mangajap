package com.tanasi.mangajap.adapters.viewHolders

import android.content.Context
import androidx.navigation.Navigation
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.squareup.picasso.MemoryPolicy
import com.squareup.picasso.NetworkPolicy
import com.squareup.picasso.Picasso
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.databinding.ItemUserBinding
import com.tanasi.mangajap.fragments.follow.FollowFragmentDirections
import com.tanasi.mangajap.models.Follow

class VhFollow(
        private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
        _binding.root
) {

    private val context: Context = itemView.context
    private lateinit var follow: Follow
    fun setVhFollow(follow: Follow) {
        this.follow = follow
        when (_binding) {
            is ItemUserBinding -> displayFollow(_binding)
        }
    }

    private fun displayFollow(binding: ItemUserBinding) {
        binding.user.apply {
            when (follow.typeLayout) {
                MangaJapAdapter.Type.FOLLOWERS -> {
                    setOnClickListener {
                        Navigation.findNavController(binding.root).navigate(
                                FollowFragmentDirections.actionFollowToProfile(
                                        follow.follower?.id ?: ""
                                )
                        )
                    }
                }
                MangaJapAdapter.Type.FOLLOWING -> {
                    setOnClickListener {
                        Navigation.findNavController(binding.root).navigate(
                                FollowFragmentDirections.actionFollowToProfile(
                                        follow.followed?.id ?: ""
                                )
                        )
                    }
                }
                else -> {}
            }
        }

        binding.userProfilePicCircleImageView.apply {
            when (follow.typeLayout) {
                MangaJapAdapter.Type.FOLLOWERS -> {
                    Picasso.get()
                            .load(follow.follower?.avatar?.tiny)
                            .placeholder(R.drawable.default_user_avatar)
                            .error(R.drawable.default_user_avatar)
                            .networkPolicy(NetworkPolicy.NO_CACHE)
                            .memoryPolicy(MemoryPolicy.NO_CACHE)
                            .into(this)
                }
                MangaJapAdapter.Type.FOLLOWING -> {
                    Picasso.get()
                            .load(follow.followed?.avatar?.tiny)
                            .placeholder(R.drawable.default_user_avatar)
                            .error(R.drawable.default_user_avatar)
                            .networkPolicy(NetworkPolicy.NO_CACHE)
                            .memoryPolicy(MemoryPolicy.NO_CACHE)
                            .into(this)
                }
                else -> {}
            }
        }

        binding.userPseudoTextView.apply {
            text = when (follow.typeLayout) {
                MangaJapAdapter.Type.FOLLOWERS -> follow.follower?.pseudo ?: ""
                MangaJapAdapter.Type.FOLLOWING -> follow.followed?.pseudo ?: ""
                else -> ""
            }
        }
    }
}