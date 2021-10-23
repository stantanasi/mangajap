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
import com.tanasi.mangajap.activities.MainActivity
import com.tanasi.mangajap.databinding.ItemAnimeToWatchBinding
import com.tanasi.mangajap.databinding.ItemMediaLibraryBinding
import com.tanasi.mangajap.databinding.ItemMediaProfilePreviewBinding
import com.tanasi.mangajap.fragments.agenda.AgendaFragmentDirections
import com.tanasi.mangajap.fragments.library.LibraryFragment
import com.tanasi.mangajap.fragments.library.LibraryFragmentDirections
import com.tanasi.mangajap.fragments.profile.ProfileFragmentDirections
import com.tanasi.mangajap.models.AnimeEntry
import com.tanasi.mangajap.utils.extensions.getCurrentFragment
import com.tanasi.mangajap.utils.extensions.toActivity
import java.lang.Exception

class VhAnimeEntry(
        private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
        _binding.root
) {

    private val context: Context = itemView.context
    private lateinit var animeEntry: AnimeEntry

    fun setVhAnimeEntry(animeEntry: AnimeEntry) {
        this.animeEntry = animeEntry
        when (_binding) {
            is ItemMediaProfilePreviewBinding -> displayPreview(_binding)
            is ItemMediaLibraryBinding -> displayLibrary(_binding)
            is ItemAnimeToWatchBinding -> displayToWatch(_binding)
        }
    }

    private fun updateAnimeEntry(animeEntry: AnimeEntry) {
        when (val fragment = context.toActivity()?.getCurrentFragment()) {
            is LibraryFragment -> fragment.viewModel.updateAnimeEntry(animeEntry)
        }
    }

    private fun displayPreview(binding: ItemMediaProfilePreviewBinding) {
        binding.root.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                    ProfileFragmentDirections.actionProfileToAnime(
                            animeEntry.anime?.id ?: "",
                            animeEntry.anime?.title ?: ""
                    )
            )
        }

        binding.ivProfileMediaCover.apply {
            Picasso.get()
                    .load(animeEntry.anime?.coverImage)
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

        binding.tvProfileMediaTitlePlaceholder.text = animeEntry.anime?.title ?: ""

        binding.cbProfileMediaIsAdd.apply {
            visibility = if (animeEntry.isAdd) View.GONE else View.VISIBLE
            isChecked = animeEntry.isAdd
            setOnClickListener {
                updateAnimeEntry(animeEntry.also {
                    it.putAdd(isChecked)
                })
            }
        }

        binding.pbProfileMediaProgress.apply {
            progress = animeEntry.anime?.let { animeEntry.getProgress(it) } ?: 0
            progressTintList = ContextCompat.getColorStateList(context, animeEntry.anime?.let { animeEntry.getProgressColor(it) } ?: AnimeEntry.Status.watching.colorId)
        }
    }

    private fun displayLibrary(binding: ItemMediaLibraryBinding) {
        binding.root.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                    LibraryFragmentDirections.actionLibraryToAnime(
                            animeEntry.anime?.id ?: "",
                            animeEntry.anime?.title ?: ""
                    )
            )
        }

        binding.ivLibraryMediaCover.apply {
            Picasso.get()
                    .load(animeEntry.anime?.coverImage)
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

        binding.tvLibraryMediaTitlePlaceholder.text = animeEntry.anime?.title ?: ""

        binding.tvLibraryMediaTitle.text = animeEntry.anime?.title ?: ""

        binding.cbLibraryMediaIsAdd.apply {
            visibility = if (animeEntry.isAdd) View.GONE else View.VISIBLE
            isChecked = animeEntry.isAdd
            setOnClickListener {
                updateAnimeEntry(animeEntry.also {
                    it.putAdd(isChecked)
                })
            }
        }

        binding.pbLibraryMediaProgress.apply {
            progress = animeEntry.anime?.let { animeEntry.getProgress(it) } ?: 0
            progressTintList = ContextCompat.getColorStateList(context, animeEntry.anime?.let { animeEntry.getProgressColor(it) } ?: AnimeEntry.Status.watching.colorId)
        }
    }

    private fun displayToWatch(binding: ItemAnimeToWatchBinding) {
        binding.root.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                    AgendaFragmentDirections.actionAgendaToAnime(
                            animeEntry.anime?.id ?: "",
                            animeEntry.anime?.title ?: ""
                    )
            )
        }

        binding.ivAnimeToWatchCover.apply {
            Picasso.get()
                    .load(animeEntry.anime?.coverImage)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .into(this)
        }

        binding.tvAnimeToWatchTitle.text = animeEntry.anime?.title ?: ""

        binding.tvAnimeToWatchNextEpisode.apply {
            text = context.getString(R.string.episode_number, animeEntry.episodesWatch + 1)
        }

        binding.tvAnimeToWatchEpisodeRemainingCount.apply {
            val episodeRemainingCount = (animeEntry.anime?.episodeCount ?: 0) - (animeEntry.episodesWatch + 1)
            if (episodeRemainingCount > 0) {
                visibility = View.VISIBLE
                text = " + $episodeRemainingCount"
            } else {
                visibility = View.GONE
            }
        }
    }
}