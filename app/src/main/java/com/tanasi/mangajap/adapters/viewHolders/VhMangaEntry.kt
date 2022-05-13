package com.tanasi.mangajap.adapters.viewHolders

import android.content.Context
import android.view.View
import androidx.core.content.ContextCompat
import androidx.navigation.Navigation
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.squareup.picasso.Callback
import com.squareup.picasso.Picasso
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.ItemAgendaMangaBinding
import com.tanasi.mangajap.databinding.ItemMediaLibraryBinding
import com.tanasi.mangajap.databinding.ItemMediaProfilePreviewBinding
import com.tanasi.mangajap.fragments.agenda.AgendaFragmentDirections
import com.tanasi.mangajap.fragments.library.LibraryFragment
import com.tanasi.mangajap.fragments.library.LibraryFragmentDirections
import com.tanasi.mangajap.fragments.profile.ProfileFragmentDirections
import com.tanasi.mangajap.models.MangaEntry
import com.tanasi.mangajap.utils.extensions.getCurrentFragment
import com.tanasi.mangajap.utils.extensions.toActivity
import java.lang.Exception

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
            is ItemMediaProfilePreviewBinding -> displayPreview(_binding)
            is ItemMediaLibraryBinding -> displayLibrary(_binding)
            is ItemAgendaMangaBinding -> displayToRead(_binding)
        }
    }

    private fun updateMangaEntry(mangaEntry: MangaEntry) {
        when (val fragment = context.toActivity()?.getCurrentFragment()) {
            is LibraryFragment -> fragment.viewModel.updateMangaEntry(mangaEntry)
        }
    }

    private fun displayPreview(binding: ItemMediaProfilePreviewBinding) {
        binding.root.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                    ProfileFragmentDirections.actionProfileToManga(
                            mangaEntry.manga?.id ?: "",
                            mangaEntry.manga?.title ?: ""
                    )
            )
        }

        binding.ivProfileMediaCover.apply {
            Picasso.get()
                    .load(mangaEntry.manga?.coverImage)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .into(this, object : Callback {
                        override fun onSuccess() {
                            binding.tvProfileMediaTitlePlaceholder.visibility = View.GONE
                        }

                        override fun onError(e: Exception?) {
                            binding.tvProfileMediaTitlePlaceholder.visibility = View.VISIBLE
                        }
                    })
        }

        binding.tvProfileMediaTitlePlaceholder.text = mangaEntry.manga?.title ?: ""

        binding.cbProfileMediaIsAdd.apply {
            visibility = if (mangaEntry.isAdd) View.GONE else View.VISIBLE
            isChecked = mangaEntry.isAdd
            setOnClickListener {
                updateMangaEntry(mangaEntry.also {
                    it.isAdd = isChecked
                })
            }
        }

        binding.pbProfileMediaProgress.apply {
            progress = mangaEntry.manga?.let { mangaEntry.getProgress(it) } ?: 0
            progressTintList = ContextCompat.getColorStateList(context, mangaEntry.manga?.let { mangaEntry.getProgressColor(it) } ?: MangaEntry.Status.reading.colorId)
        }
    }

    private fun displayLibrary(binding: ItemMediaLibraryBinding) {
        binding.root.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                    LibraryFragmentDirections.actionLibraryToManga(
                            mangaEntry.manga?.id ?: "",
                            mangaEntry.manga?.title ?: ""
                    )
            )
        }

        binding.ivLibraryMediaCover.apply {
            Picasso.get()
                    .load(mangaEntry.manga?.coverImage)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .into(this, object : Callback {
                        override fun onSuccess() {
                            binding.tvLibraryMediaTitlePlaceholder.visibility = View.GONE
                        }

                        override fun onError(e: Exception?) {
                            binding.tvLibraryMediaTitlePlaceholder.visibility = View.VISIBLE
                        }
                    })
        }

        binding.tvLibraryMediaTitlePlaceholder.text = mangaEntry.manga?.title ?: ""

        binding.cbLibraryMediaIsAdd.apply {
            visibility = if (mangaEntry.isAdd) View.GONE else View.VISIBLE
            isChecked = mangaEntry.isAdd
            setOnClickListener {
                updateMangaEntry(mangaEntry.also {
                    it.isAdd = isChecked
                })
            }
        }

        binding.pbLibraryMediaProgress.apply {
            progress = mangaEntry.manga?.let { mangaEntry.getProgress(it) } ?: 0
            progressTintList = ContextCompat.getColorStateList(context, mangaEntry.manga?.let { mangaEntry.getProgressColor(it) } ?: MangaEntry.Status.reading.colorId)
        }

        binding.tvLibraryMediaTitle.text = mangaEntry.manga?.title ?: ""
    }

    private fun displayToRead(binding: ItemAgendaMangaBinding) {
        binding.root.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                    AgendaFragmentDirections.actionAgendaToManga(
                            mangaEntry.manga?.id ?: "",
                            mangaEntry.manga?.title ?: ""
                    )
            )
        }

        binding.ivMangaToReadCover.apply {
            Picasso.get()
                    .load(mangaEntry.manga?.coverImage)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .into(this)
        }

        binding.tvMangaToReadTitle.text = mangaEntry.manga?.title ?: ""

        binding.tvMangaToReadNextVolume.apply {
            if (mangaEntry.volumesRead < mangaEntry.manga?.volumeCount ?: 0) {
                visibility = View.VISIBLE
                text = context.getString(R.string.volume, mangaEntry.volumesRead+1)
            } else {
                visibility = View.GONE
            }
        }

        binding.tvMangaToReadVolumeRemainingCount.apply {
            val volumeRemainingCount = (mangaEntry.manga?.volumeCount ?: 0) - (mangaEntry.volumesRead + 1)
            if (volumeRemainingCount > 0) {
                visibility = View.VISIBLE
                text = " + $volumeRemainingCount"
            } else {
                visibility = View.GONE
            }
        }

        binding.tvMangaToReadNextChapter.apply {
            if (mangaEntry.chaptersRead < mangaEntry.manga?.chapterCount ?: 0) {
                visibility = View.VISIBLE
                text = context.getString(R.string.chapter, mangaEntry.chaptersRead+1)
            } else {
                visibility = View.GONE
            }
        }

        binding.tvMangaToReadChapterRemainingCount.apply {
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