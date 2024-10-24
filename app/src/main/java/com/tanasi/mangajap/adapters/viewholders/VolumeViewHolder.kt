package com.tanasi.mangajap.adapters.viewholders

import android.content.Context
import androidx.navigation.findNavController
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.bumptech.glide.Glide
import com.tanasi.mangajap.databinding.ItemVolumeBinding
import com.tanasi.mangajap.fragments.manga.MangaFragmentDirections
import com.tanasi.mangajap.fragments.reader.ReaderFragment
import com.tanasi.mangajap.models.Volume
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
}