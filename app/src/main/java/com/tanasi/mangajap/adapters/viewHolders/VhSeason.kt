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
import com.tanasi.mangajap.utils.extensions.toActivity

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
        when (val fragment = context.toActivity()?.getCurrentFragment()) {
            is AnimeFragment -> fragment.viewModel.updateAnimeEntry(animeEntry)
        }
    }

    private fun showEpisodes() {
        when (val fragment = context.toActivity()?.getCurrentFragment()) {
            is AnimeFragment -> {
                fragment.viewModel.getSeasonEpisodes(season)
                fragment.displayAnime()
            }
        }
    }


    private fun displaySeasonHeader(binding: ItemSeasonAnimeHeaderBinding) {}

    private fun displaySeasonAnime(binding: ItemSeasonAnimeBinding) {
        binding.root.setOnClickListener {
            season.isShowingEpisodes = !season.isShowingEpisodes
            showEpisodes()
        }

        binding.tvSeasonNumber.text = context.resources.getString(R.string.seasonNumber, season.number)

        binding.tvSeasonTitle.run {
            text = season.title
            visibility = when (season.title) {
                "" -> View.GONE
                else -> View.VISIBLE
            }
        }

        binding.ivSeasonIsShowingEpisodes.run {
            if (season.isShowingEpisodes) {
                setImageResource(R.drawable.ic_arrow_drop_down_24dp)
            } else {
                setImageResource(R.drawable.ic_arrow_drop_up_24dp)
            }
        }

        binding.pbSeasonIsLoadingEpisodes.run {
            visibility = when (season.isLoadingEpisodes) {
                true -> View.VISIBLE
                false -> View.GONE
            }

            binding.ivSeasonIsShowingEpisodes.visibility = when (season.isLoadingEpisodes) {
                true -> View.GONE
                false -> View.VISIBLE
            }
        }

        binding.tvSeasonProgress.apply {
            season.anime?.animeEntry?.let {
                text = context.getString(R.string.season_episodes_progress, season.episodeWatched, season.episodeCount)
            } ?: let {
                text =context.getString(R.string.season_episodes_progress, 0, season.episodeCount)
            }
        }

        binding.cbSeasonIsWatch.apply {
            season.anime?.animeEntry?.let { animeEntry ->
                visibility = View.VISIBLE
                isChecked = season.isWatched
                setOnClickListener {
                    animeEntry.episodesWatch = season.episodes.lastOrNull()?.number
                        ?: season.anime?.seasons?.let { seasons ->
                            seasons.subList(0, seasons.indexOf(season)+1).sumOf { it.episodeCount }
                        } ?: 0
                    updateAnimeEntry(animeEntry)
                }
            } ?: let {
                visibility = View.GONE
            }
        }

        binding.pbSeasonProgress.apply {
            season.anime?.animeEntry?.let {
                visibility = View.VISIBLE
                progress = season.progress
                progressTintList = ContextCompat.getColorStateList(context, season.progressColor)
            } ?: let {
                visibility = View.GONE
            }
        }
    }
}