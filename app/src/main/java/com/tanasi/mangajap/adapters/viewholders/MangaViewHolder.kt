package com.tanasi.mangajap.adapters.viewholders

import android.content.Context
import androidx.navigation.findNavController
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.bumptech.glide.Glide
import com.tanasi.mangajap.databinding.ItemMangaBinding
import com.tanasi.mangajap.databinding.ItemMangaGridBinding
import com.tanasi.mangajap.fragments.home.HomeFragment
import com.tanasi.mangajap.fragments.home.HomeFragmentDirections
import com.tanasi.mangajap.fragments.search.SearchFragment
import com.tanasi.mangajap.fragments.search.SearchFragmentDirections
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.utils.getCurrentFragment
import com.tanasi.mangajap.utils.toActivity

class MangaViewHolder(
    private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
    _binding.root
) {

    private val context: Context = itemView.context

    private lateinit var manga: Manga

    fun bind(manga: Manga) {
        this.manga = manga
        when (_binding) {
            is ItemMangaBinding -> displayItem(_binding)
            is ItemMangaGridBinding -> displayGridItem(_binding)
        }
    }


    private fun displayItem(binding: ItemMangaBinding) {
        binding.root.apply {
            setOnClickListener {
                when (context.toActivity()?.getCurrentFragment()) {
                    is HomeFragment -> findNavController().navigate(
                        HomeFragmentDirections.actionHomeToManga(
                            id = manga.id,
                        )
                    )
                }
            }
        }

        Glide.with(context)
            .load(manga.coverImage)
            .centerCrop()
            .into(binding.ivMangaPoster)

        binding.tvMangaTitle.text = manga.title
    }

    private fun displayGridItem(binding: ItemMangaGridBinding) {
        binding.root.apply {
            setOnClickListener {
                when (context.toActivity()?.getCurrentFragment()) {
                    is SearchFragment -> findNavController().navigate(
                        SearchFragmentDirections.actionSearchToManga(
                            id = manga.id,
                        )
                    )
                }
            }
        }

        Glide.with(context)
            .load(manga.coverImage)
            .centerCrop()
            .into(binding.ivMangaPoster)

        binding.tvMangaTitle.text = manga.title
    }
}