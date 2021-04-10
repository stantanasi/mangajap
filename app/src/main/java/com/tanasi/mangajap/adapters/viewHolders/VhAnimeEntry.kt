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
import com.tanasi.mangajap.databinding.ItemAnimeToWatchBinding
import com.tanasi.mangajap.databinding.ItemMediaLibraryBinding
import com.tanasi.mangajap.databinding.ItemMediaPreviewBinding
import com.tanasi.mangajap.fragments.agenda.AgendaFragmentDirections
import com.tanasi.mangajap.fragments.library.LibraryFragment
import com.tanasi.mangajap.fragments.library.LibraryFragmentDirections
import com.tanasi.mangajap.fragments.profile.ProfileFragmentDirections
import com.tanasi.mangajap.models.AnimeEntry
import com.tanasi.mangajap.utils.extensions.getCurrentFragment

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
            is ItemMediaPreviewBinding -> displayPreview(_binding)
            is ItemMediaLibraryBinding -> displayLibrary(_binding)
            is ItemAnimeToWatchBinding -> displayToWatch(_binding)
        }
    }

    private fun updateAnimeEntry(animeEntry: AnimeEntry) {
        if (context is MainActivity) {
            when (val fragment = context.getCurrentFragment()) {
                is LibraryFragment -> fragment.viewModel.updateAnimeEntry(animeEntry)
            }
        }
    }

    private fun displayPreview(binding: ItemMediaPreviewBinding) {
        binding.media.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                    ProfileFragmentDirections.actionProfileToAnime(
                            animeEntry.anime!!.id,
                            animeEntry.anime!!.canonicalTitle
                    )
            )
        }

        binding.mediaCoverImageView.apply {
            Picasso.get()
                    .load(animeEntry.anime!!.coverImage)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .into(this)
        }

        binding.mediaIsAddCheckBox.apply {
            visibility = if (animeEntry.isAdd) View.GONE else View.VISIBLE
            isChecked = animeEntry.isAdd
            setOnClickListener {
                updateAnimeEntry(animeEntry.also {
                    it.putAdd(isChecked)
                })
            }
        }

        binding.mediaProgressProgressBar.apply {
            progress = animeEntry.getProgress(animeEntry.anime!!)
            progressTintList = ContextCompat.getColorStateList(context, animeEntry.getProgressColor(animeEntry.anime!!))
        }
    }

    private fun displayLibrary(binding: ItemMediaLibraryBinding) {
        binding.media.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                    LibraryFragmentDirections.actionLibraryToAnime(
                            animeEntry.anime!!.id,
                            animeEntry.anime!!.canonicalTitle
                    )
            )
        }

        binding.mediaCoverImageView.apply {
            Picasso.get()
                    .load(animeEntry.anime!!.coverImage)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .into(this)
        }

        binding.mediaTitleTextView.text = animeEntry.anime!!.canonicalTitle

        binding.mediaIsAddCheckBox.apply {
            visibility = if (animeEntry.isAdd) View.GONE else View.VISIBLE
            isChecked = animeEntry.isAdd
            setOnClickListener {
                updateAnimeEntry(animeEntry.also {
                    it.putAdd(isChecked)
                })
            }
        }

        binding.mediaProgressProgressBar.apply {
            progress = animeEntry.getProgress(animeEntry.anime!!)
            progressTintList = ContextCompat.getColorStateList(context, animeEntry.getProgressColor(animeEntry.anime!!))
        }
    }

    private fun displayToWatch(binding: ItemAnimeToWatchBinding) {
        binding.anime.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                    AgendaFragmentDirections.actionAgendaToAnime(
                            animeEntry.anime!!.id,
                            animeEntry.anime!!.canonicalTitle
                    )
            )
        }

        binding.ivAnimeCover.apply {
            Picasso.get()
                    .load(animeEntry.anime!!.coverImage)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .into(this)
        }

        binding.tvAnimeTitle.text = animeEntry.anime!!.canonicalTitle

        binding.tvEpisodeToWatch.apply {
            text = context.getString(R.string.episode_number, animeEntry.episodesWatch + 1)
        }

        binding.tvEpisodeRemainingCount.apply {
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