package com.tanasi.mangajap.adapters.viewholders

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

class FollowViewHolder(
    private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
    _binding.root
) {

    private val context: Context = itemView.context
    private lateinit var follow: Follow

    fun bind(follow: Follow) {
        this.follow = follow
        when (_binding) {
            is ItemFollowBinding -> displayFollow(_binding)
        }
    }

    private fun displayFollow(binding: ItemFollowBinding) {
        binding.root.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                FollowFragmentDirections.actionFollowToProfile(
                    userId = when (follow.itemType) {
                        AppAdapter.Type.FOLLOWER_ITEM -> follow.follower?.id ?: ""
                        AppAdapter.Type.FOLLOWING_ITEM -> follow.followed?.id ?: ""
                        else -> ""
                    }
                )
            )
        }

        binding.civFollowUserProfilePic.apply {
            Picasso.get()
                .load(
                    when (follow.itemType) {
                        AppAdapter.Type.FOLLOWER_ITEM -> follow.follower?.avatar?.tiny
                        AppAdapter.Type.FOLLOWING_ITEM -> follow.followed?.avatar?.tiny
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
            text = when (follow.itemType) {
                AppAdapter.Type.FOLLOWER_ITEM -> follow.follower?.pseudo ?: ""
                AppAdapter.Type.FOLLOWING_ITEM -> follow.followed?.pseudo ?: ""
                else -> ""
            }
        }
    }
}