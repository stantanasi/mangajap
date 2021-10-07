package com.tanasi.mangajap.adapters.viewHolders

import android.content.Context
import android.view.View
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.squareup.picasso.Picasso
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.MainActivity
import com.tanasi.mangajap.databinding.ItemVolumeMangaBinding
import com.tanasi.mangajap.databinding.ItemVolumeMangaDetailsBinding
import com.tanasi.mangajap.fragments.manga.MangaFragment
import com.tanasi.mangajap.models.Volume
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.getCurrentFragment

class VhVolume(
        private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
        _binding.root
) {

    private val context: Context = itemView.context
    private lateinit var volume: Volume

    fun setVhVolume(volume: Volume) {
        this.volume = volume
        when (_binding) {
            is ItemVolumeMangaBinding -> displayVolume(_binding)
            is ItemVolumeMangaDetailsBinding -> displayVolumeDetails(_binding)
        }
    }

    private fun displayVolume(binding: ItemVolumeMangaBinding) {
        binding.volume.setOnClickListener {
            if (context is MainActivity) {
                when (val fragment = context.getCurrentFragment()) {
                    is MangaFragment -> fragment.also {
                        if (it.showDetailsVolume == volume) it.showDetailsVolume = null
                        else it.showDetailsVolume = volume
                        it.displayManga()
                    }
                }
            }
        }

        binding.volumeNumberTextView.run {
            text = volume.number.toString()
            visibility = when (volume.coverImage) {
                null -> View.VISIBLE
                else -> View.GONE
            }
        }

        binding.volumeCoverImageView.apply {
            Picasso.get()
                    .load(volume.coverImage)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .into(this)
        }

        binding.volumeTitleTextView.apply {
            text = context.resources.getString(R.string.volume, volume.number)
        }

        binding.volumePublishedTextView.apply {
            text = volume.published?.format("dd-MM-yyyy") ?: ""
        }
    }

    private fun displayVolumeDetails(binding: ItemVolumeMangaDetailsBinding) {
        binding.volumeCoverImageView.apply {
            Picasso.get()
                    .load(volume.coverImage)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .into(this)
        }

        binding.volumeNumberTextView.apply {
            when (volume.titles.fr) {
                "" -> visibility = View.GONE
                else -> {
                    visibility = View.VISIBLE
                    text = context.resources.getString(R.string.volume, volume.number)
                }
            }
        }

        binding.volumeTitleTextView.apply {
            text = when (volume.titles.fr) {
                "" -> context.resources.getString(R.string.volume, volume.number)
                else -> volume.titles.fr
            }
        }

        binding.volumePublishedTextView.apply {
            text = volume.published?.format("dd MMMM yyyy") ?: ""
        }

        binding.tvChaptersFromTo.apply {
            when {
                volume.startChapter == null && volume.endChapter == null -> visibility = View.GONE
                else -> {
                    visibility = View.VISIBLE
                    text = context.resources.getString(R.string.chaptersFromTo, volume.startChapter?.toString() ?: "?", volume.endChapter?.toString() ?: "?")
                }
            }
        }
    }
}