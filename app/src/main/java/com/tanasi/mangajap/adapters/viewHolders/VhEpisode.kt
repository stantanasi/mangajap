package com.tanasi.mangajap.adapters.viewHolders

import android.content.Context
import android.view.View
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.MainActivity
import com.tanasi.mangajap.databinding.ItemEpisodeAnimeBinding
import com.tanasi.mangajap.fragments.anime.AnimeFragment
import com.tanasi.mangajap.models.AnimeEntry
import com.tanasi.mangajap.models.Episode
import com.tanasi.mangajap.utils.extensions.getCurrentFragment

class VhEpisode(
    private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
    _binding.root
) {

    private val context: Context = itemView.context
    private lateinit var episode: Episode

    fun setVhEpisode(episode: Episode) {
        this.episode = episode
        when (_binding) {
            is ItemEpisodeAnimeBinding -> displayEpisode(_binding)
        }
    }


    private fun updateAnimeEntry(animeEntry: AnimeEntry) {
        if (context is MainActivity) {
            when (val fragment = context.getCurrentFragment()) {
                is AnimeFragment -> fragment.viewModel.updateAnimeEntry(animeEntry)
            }
        }
    }


    private fun displayEpisode(binding: ItemEpisodeAnimeBinding) {
        binding.tvEpisodeNumber.text = episode.relativeNumber.toString()

        binding.tvEpisodeInfo.run {
            val seasonNumber = episode.season?.number?.toString()?.padStart(2, '0') ?: "0"
            val episodeRelativeNumber = episode.relativeNumber.toString().padStart(2, '0')
            val episodeNumber = episode.number.toString().padStart(2, '0')

            text = context.getString(
                R.string.episode_info,
                seasonNumber,
                episodeRelativeNumber,
                episodeNumber
            )
        }

        binding.tvEpisodeTitle.run {
            text = episode.title
            visibility = when (episode.title) {
                "" -> View.GONE
                else -> View.VISIBLE
            }
        }

        binding.cbEpisodeIsWatch.run {
            episode.season?.anime?.animeEntry?.let { animeEntry ->
                visibility = View.VISIBLE
                isChecked = animeEntry.episodesWatch >= episode.number
                setOnClickListener {
                    animeEntry.putEpisodesWatch(episode.number)
                    updateAnimeEntry(animeEntry)
                }
            } ?: let {
                visibility = View.GONE
            }
        }
    }
}