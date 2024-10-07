package com.tanasi.mangajap.adapters.viewholders

import android.content.Context
import androidx.navigation.Navigation
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.squareup.picasso.MemoryPolicy
import com.squareup.picasso.NetworkPolicy
import com.squareup.picasso.Picasso
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.ItemUserBinding
import com.tanasi.mangajap.fragments.search.SearchFragmentDirections
import com.tanasi.mangajap.models.User

class UserViewHolder(
        private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
        _binding.root
) {

    private val context: Context = itemView.context
    private lateinit var user: User
    fun bind(user: User) {
        this.user = user
        when (_binding) {
            is ItemUserBinding -> displayUser(_binding)
        }
    }

    private fun displayUser(binding: ItemUserBinding) {
        binding.root.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                    SearchFragmentDirections.actionSearchToProfile(
                            user.id
                    )
            )
        }

        binding.civUserProfilePic.apply {
            Picasso.get()
                    .load(user.avatar?.tiny)
                    .placeholder(R.drawable.default_user_avatar)
                    .error(R.drawable.default_user_avatar)
                    .networkPolicy(NetworkPolicy.NO_CACHE)
                    .memoryPolicy(MemoryPolicy.NO_CACHE)
                    .into(this)
        }

        binding.tvUserPseudo.text = user.pseudo
    }

}