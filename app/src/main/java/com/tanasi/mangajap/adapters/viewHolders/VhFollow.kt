package com.tanasi.mangajap.adapters.viewHolders

import android.content.Context
import androidx.navigation.Navigation
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.squareup.picasso.MemoryPolicy
import com.squareup.picasso.NetworkPolicy
import com.squareup.picasso.Picasso
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.databinding.ItemFollowBinding
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
            is ItemFollowBinding -> displayFollow(_binding)
        }
    }

    private fun displayFollow(binding: ItemFollowBinding) {
        binding.root.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                FollowFragmentDirections.actionFollowToProfile(
                    userId = when (follow.typeLayout) {
                        AppAdapter.Type.FOLLOWERS -> follow.follower?.id ?: ""
                        AppAdapter.Type.FOLLOWING -> follow.followed?.id ?: ""
                        else -> ""
                    }
                )
            )
        }

        binding.civFollowUserProfilePic.apply {
            Picasso.get()
                .load(
                    when (follow.typeLayout) {
                        AppAdapter.Type.FOLLOWERS -> follow.follower?.avatar?.tiny
                        AppAdapter.Type.FOLLOWING -> follow.followed?.avatar?.tiny
                        else -> null
                    }
                )
                .placeholder(R.drawable.default_user_avatar)
                .error(R.drawable.default_user_avatar)
                .networkPolicy(NetworkPolicy.NO_CACHE)
                .memoryPolicy(MemoryPolicy.NO_CACHE)
                .into(this)
        }

        binding.tvFollowUserPseudo.apply {
            text = when (follow.typeLayout) {
                AppAdapter.Type.FOLLOWERS -> follow.follower?.pseudo ?: ""
                AppAdapter.Type.FOLLOWING -> follow.followed?.pseudo ?: ""
                else -> ""
            }
        }
    }
}