package com.tanasi.mangajap.adapters.viewHolders

import android.content.Context
import android.view.View
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.MainActivity
import com.tanasi.mangajap.databinding.ItemSeasonAnimeBinding
import com.tanasi.mangajap.databinding.ItemSeasonAnimeHeaderBinding
import com.tanasi.mangajap.fragments.anime.AnimeFragment
import com.tanasi.mangajap.models.AnimeEntry
import com.tanasi.mangajap.models.Season
import com.tanasi.mangajap.utils.extensions.getCurrentFragment

class VhSeason(
        private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
        _binding.root
) {

    private val context: Context = itemView.context
    private lateinit var season: Season

    fun setVhSeason(season: Season) {
        this.season = season
        when (_binding) {
            is ItemSeasonAnimeHeaderBinding -> displaySeasonHeader(_binding)
            is ItemSeasonAnimeBinding -> displaySeasonAnime(_binding)
        }
    }


    private fun updateAnimeEntry(animeEntry: AnimeEntry) {
        if (context is MainActivity) {
            when (val fragment = context.getCurrentFragment()) {
                is AnimeFragment -> fragment.viewModel.updateAnimeEntry(animeEntry)
            }
        }
    }


    private fun displaySeasonHeader(binding: ItemSeasonAnimeHeaderBinding) {}

    private fun displaySeasonAnime(binding: ItemSeasonAnimeBinding) {
        binding.season.also {
            it.setOnClickListener {
                if (context is MainActivity) {
                    when (val fragment = context.getCurrentFragment()) {
                        is AnimeFragment -> {
                            if (fragment.showSeason.contains(season.number)) {
                                fragment.showSeason.remove(season.number)
                            } else {
                                fragment.showSeason.add(season.number)
                            }
                            fragment.displayAnime()
                        }
                    }
                }
            }
        }

        binding.seasonNumberTextView.text = context.resources.getString(R.string.seasonNumber, season.number)

        binding.seasonEpisodesIsVisibleImageView.also {
            if (context is MainActivity) {
                when (val fragment = context.getCurrentFragment()) {
                    is AnimeFragment -> {
                        if (fragment.showSeason.contains(season.number)) {
                            it.setImageResource(R.drawable.ic_arrow_drop_down_24dp)
                        } else {
                            it.setImageResource(R.drawable.ic_arrow_drop_up_24dp)
                        }
                    }
                }
            }
        }

        binding.seasonProgressTextView.apply {
            season.episodes.firstOrNull()?.anime?.animeEntry?.let {
                text = context.getString(R.string.season_episodes_progress, season.episodeWatched, season.episodeCount)
            } ?: let {
                text =context.getString(R.string.season_episodes_progress, 0, season.episodeCount)
            }
        }

        binding.seasonIsWatchCheckBox.apply {
            season.episodes.firstOrNull()?.anime?.animeEntry?.let { animeEntry ->
                visibility = View.VISIBLE
                isChecked = season.isWatched
                setOnClickListener {
                    animeEntry.putEpisodesWatch(season.episodes.last().number)
                    updateAnimeEntry(animeEntry)
                }
            } ?: let {
                visibility = View.GONE
            }
        }

        binding.pbSeasonProgress.apply {
            season.episodes.firstOrNull()?.anime?.animeEntry?.let {
                visibility = View.VISIBLE
                progress = season.progress
                progressTintList = ContextCompat.getColorStateList(context, season.progressColor)
            } ?: let {
                visibility = View.GONE
            }
        }
    }
}