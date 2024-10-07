package com.tanasi.mangajap.adapters.viewholders

import android.content.Context
import androidx.navigation.Navigation
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.squareup.picasso.Picasso
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.ItemFranchiseBinding
import com.tanasi.mangajap.fragments.anime.AnimeFragment
import com.tanasi.mangajap.fragments.anime.AnimeFragmentDirections
import com.tanasi.mangajap.fragments.manga.MangaFragment
import com.tanasi.mangajap.fragments.manga.MangaFragmentDirections
import com.tanasi.mangajap.models.Anime
import com.tanasi.mangajap.models.Franchise
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.utils.extensions.getCurrentFragment
import com.tanasi.mangajap.utils.extensions.toActivity

class FranchiseViewHolder(
    private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
    _binding.root
) {

    private val context: Context = itemView.context
    private lateinit var franchise: Franchise

    fun bind(franchise: Franchise) {
        this.franchise = franchise
        when (_binding) {
            is ItemFranchiseBinding -> displayFranchise(_binding)
        }
    }


    private fun displayFranchise(binding: ItemFranchiseBinding) {
        val destination = franchise.destination

        binding.root.setOnClickListener {
            val currentFragment = context.toActivity()?.getCurrentFragment()
            when {
                currentFragment is AnimeFragment && destination is Anime ->
                    Navigation.findNavController(binding.root).navigate(
                        AnimeFragmentDirections.actionAnimeToAnime(
                            destination.id,
                            destination.title
                        )
                    )
                currentFragment is AnimeFragment && destination is Manga ->
                    Navigation.findNavController(binding.root).navigate(
                        AnimeFragmentDirections.actionAnimeToManga(
                            destination.id,
                            destination.title
                        )
                    )
                currentFragment is MangaFragment && destination is Anime ->
                    Navigation.findNavController(binding.root).navigate(
                        MangaFragmentDirections.actionMangaToAnime(
                            destination.id,
                            destination.title
                        )
                    )
                currentFragment is MangaFragment && destination is Manga ->
                    Navigation.findNavController(binding.root).navigate(
                        MangaFragmentDirections.actionMangaToManga(
                            destination.id,
                            destination.title
                        )
                    )
            }
        }

        binding.ivFranchiseCover.apply {
            Picasso.get()
                .load(
                    when (destination) {
                        is Anime -> destination.coverImage
                        is Manga -> destination.coverImage
                        else -> null
                    }
                )
                .placeholder(R.drawable.placeholder)
                .error(R.drawable.placeholder)
                .into(this)
        }

        binding.tvFranchiseTitle.text = when (destination) {
            is Anime -> destination.title
            is Manga -> destination.title
            else -> ""
        }

        binding.tvFranchiseRole.text = context.getString(franchise.role.stringId)
    }
}
