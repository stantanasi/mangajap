package com.tanasi.mangajap.adapters.viewHolders

import android.content.Context
import android.view.View
import androidx.core.content.ContextCompat
import androidx.navigation.Navigation
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.squareup.picasso.Picasso
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.MainActivity
import com.tanasi.mangajap.databinding.ItemMangaToReadBinding
import com.tanasi.mangajap.databinding.ItemMediaLibraryBinding
import com.tanasi.mangajap.databinding.ItemMediaPreviewBinding
import com.tanasi.mangajap.fragments.agenda.AgendaFragmentDirections
import com.tanasi.mangajap.fragments.library.LibraryFragment
import com.tanasi.mangajap.fragments.library.LibraryFragmentDirections
import com.tanasi.mangajap.fragments.profile.ProfileFragmentDirections
import com.tanasi.mangajap.models.MangaEntry
import com.tanasi.mangajap.utils.extensions.getCurrentFragment

class VhMangaEntry(
        private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
        _binding.root
) {

    private val context: Context = itemView.context
    private lateinit var mangaEntry: MangaEntry

    fun setVhMangaEntry(mangaEntry: MangaEntry) {
        this.mangaEntry = mangaEntry
        when (_binding) {
            is ItemMediaLibraryBinding -> displayLibrary(_binding)
            is ItemMediaPreviewBinding -> displayPreview(_binding)
            is ItemMangaToReadBinding -> displayToRead(_binding)
        }
    }

    private fun updateMangaEntry(mangaEntry: MangaEntry) {
        if (context is MainActivity) {
            when (val fragment = context.getCurrentFragment()) {
                is LibraryFragment -> fragment.viewModel.updateMangaEntry(mangaEntry)
            }
        }
    }

    private fun displayPreview(binding: ItemMediaPreviewBinding) {
        binding.media.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                    ProfileFragmentDirections.actionProfileToManga(
                            mangaEntry.manga?.id ?: "",
                            mangaEntry.manga?.title ?: ""
                    )
            )
        }

        binding.mediaCoverImageView.apply {
            Picasso.get()
                    .load(mangaEntry.manga?.coverImage)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .into(this)
        }

        binding.mediaIsAddCheckBox.apply {
            visibility = if (mangaEntry.isAdd) View.GONE else View.VISIBLE
            isChecked = mangaEntry.isAdd
            setOnClickListener {
                updateMangaEntry(mangaEntry.also {
                    it.putAdd(isChecked)
                })
            }
        }

        binding.mediaProgressProgressBar.apply {
            progress = mangaEntry.manga?.let { mangaEntry.getProgress(it) } ?: 0
            progressTintList = ContextCompat.getColorStateList(context, mangaEntry.manga?.let { mangaEntry.getProgressColor(it) } ?: MangaEntry.Status.reading.colorId)
        }
    }

    private fun displayLibrary(binding: ItemMediaLibraryBinding) {
        binding.media.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                    LibraryFragmentDirections.actionLibraryToManga(
                            mangaEntry.manga?.id ?: "",
                            mangaEntry.manga?.title ?: ""
                    )
            )
        }

        binding.mediaCoverImageView.apply {
            Picasso.get()
                    .load(mangaEntry.manga?.coverImage)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .into(this)
        }

        binding.mediaIsAddCheckBox.apply {
            visibility = if (mangaEntry.isAdd) View.GONE else View.VISIBLE
            isChecked = mangaEntry.isAdd
            setOnClickListener {
                updateMangaEntry(mangaEntry.also {
                    it.putAdd(isChecked)
                })
            }
        }

        binding.mediaProgressProgressBar.apply {
            progress = mangaEntry.manga?.let { mangaEntry.getProgress(it) } ?: 0
            progressTintList = ContextCompat.getColorStateList(context, mangaEntry.manga?.let { mangaEntry.getProgressColor(it) } ?: MangaEntry.Status.reading.colorId)
        }

        binding.mediaTitleTextView.text = mangaEntry.manga?.title ?: ""
    }

    private fun displayToRead(binding: ItemMangaToReadBinding) {
        binding.manga.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                    AgendaFragmentDirections.actionAgendaToManga(
                            mangaEntry.manga?.id ?: "",
                            mangaEntry.manga?.title ?: ""
                    )
            )
        }

        binding.ivMangaCover.apply {
            Picasso.get()
                    .load(mangaEntry.manga?.coverImage)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .into(this)
        }

        binding.tvMangaTitle.text = mangaEntry.manga?.title ?: ""

        binding.tvVolumesToRead.apply {
            if (mangaEntry.volumesRead < mangaEntry.manga?.volumeCount ?: 0) {
                visibility = View.VISIBLE
                text = context.getString(R.string.volume, mangaEntry.volumesRead+1)
            } else {
                visibility = View.GONE
            }
        }

        binding.tvVolumeRemainingCount.apply {
            val volumeRemainingCount = (mangaEntry.manga?.volumeCount ?: 0) - (mangaEntry.volumesRead + 1)
            if (volumeRemainingCount > 0) {
                visibility = View.VISIBLE
                text = " + $volumeRemainingCount"
            } else {
                visibility = View.GONE
            }
        }

        binding.tvChaptersToRead.apply {
            if (mangaEntry.chaptersRead < mangaEntry.manga?.chapterCount ?: 0) {
                visibility = View.VISIBLE
                text = context.getString(R.string.chapter, mangaEntry.chaptersRead+1)
            } else {
                visibility = View.GONE
            }
        }

        binding.tvChapterRemainingCount.apply {
            val chapterRemainingCount = (mangaEntry.manga?.chapterCount ?: 0) - (mangaEntry.chaptersRead + 1)
            if (chapterRemainingCount > 0) {
                visibility = View.VISIBLE
                text = " + $chapterRemainingCount"
            } else {
                visibility = View.GONE
            }
        }
    }
}