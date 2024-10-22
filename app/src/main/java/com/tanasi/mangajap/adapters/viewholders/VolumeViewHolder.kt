package com.tanasi.mangajap.adapters.viewholders

import android.content.Context
import android.view.View
import androidx.navigation.findNavController
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.bumptech.glide.Glide
import com.squareup.picasso.Callback
import com.squareup.picasso.Picasso
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.ItemVolumeBinding
import com.tanasi.mangajap.databinding.ItemVolumeMangaBinding
import com.tanasi.mangajap.databinding.ItemVolumeMangaDetailsBinding
import com.tanasi.mangajap.fragments.manga.MangaFragmentDirections
import com.tanasi.mangajap.fragments.reader.ReaderFragment
import com.tanasi.mangajap.models.Volume
import com.tanasi.mangajap.utils.extensions.format
import java.util.Locale

class VolumeViewHolder(
        private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
        _binding.root
) {

    private val context: Context = itemView.context
    private lateinit var volume: Volume

    fun bind(volume: Volume) {
        this.volume = volume
        when (_binding) {
            is ItemVolumeBinding -> displayItem(_binding)
            is ItemVolumeMangaBinding -> displayVolume(_binding)
            is ItemVolumeMangaDetailsBinding -> displayVolumeDetails(_binding)
        }
    }


    private fun displayItem(binding: ItemVolumeBinding) {
        binding.root.apply {
            setOnClickListener {
                findNavController().navigate(
                    MangaFragmentDirections.actionMangaToReader(
                        id = volume.id,
                        readerType = ReaderFragment.ReaderType.VOLUME,
                    )
                )
            }
        }

        Glide.with(context)
            .load(volume.coverImage)
            .centerCrop()
            .into(binding.ivVolumeCover)

        binding.tvVolumeTitle.text = String.format(Locale.ROOT, "%d", volume.number)
    }

    private fun displayVolume(binding: ItemVolumeMangaBinding) {
        binding.root.setOnClickListener {
//            when (val fragment = context.toActivity()?.getCurrentFragment()) {
//                is MangaFragment -> fragment.also {
//                    if (it.showDetailsVolume == volume) it.showDetailsVolume = null
//                    else it.showDetailsVolume = volume
//                    it.displayManga()
//                }
//            }
        }

        binding.ivVolumeCover.apply {
            clipToOutline = true
            Picasso.get()
                    .load(volume.coverImage)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .into(this, object : Callback {
                        override fun onSuccess() {
                            binding.tvVolumeNumberPlaceholder.visibility = View.GONE
                        }

                        override fun onError(e: Exception?) {
                            binding.tvVolumeNumberPlaceholder.visibility = View.VISIBLE
                        }
                    })
        }

        binding.tvVolumeNumberPlaceholder.text = volume.number.toString()

        binding.tvVolumeTitle.apply {
            text = context.resources.getString(R.string.volume, volume.number)
        }

        binding.tvVolumePublishedDate.apply {
            text = volume.published?.format("dd-MM-yyyy") ?: ""
        }
    }

    private fun displayVolumeDetails(binding: ItemVolumeMangaDetailsBinding) {
        binding.ivVolumeCover.apply {
            Picasso.get()
                    .load(volume.coverImage)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .into(this)
        }

        binding.tvVolumeNumber.apply {
            text = context.resources.getString(R.string.volume, volume.number)
            visibility = when (volume.title) {
                "" -> View.GONE
                else -> View.VISIBLE
            }
        }

        binding.tvVolumeTitle.apply {
            text = when (volume.title) {
                "" -> context.resources.getString(R.string.volume, volume.number)
                else -> volume.title
            }
        }

        binding.tvVolumePublishedDate.apply {
            text = volume.published?.format("dd MMMM yyyy") ?: ""
        }

        binding.tvChapterRange.apply {
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