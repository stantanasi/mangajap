package com.tanasi.mangajap.adapters.viewHolders

import android.view.View
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.databinding.ItemStatsPreviewBinding
import com.tanasi.mangajap.databinding.ItemStatsTimeSpentPreviewBinding
import com.tanasi.mangajap.models.UserStats
import com.tanasi.mangajap.utils.extensions.withSuffix

class VhUserStats(
        private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
        _binding.root
) {

    private lateinit var userStats: UserStats

    fun setVhUserStats(userStats: UserStats) {
        this.userStats = userStats
        when (_binding) {
            is ItemStatsPreviewBinding -> displayPreview(_binding)
            is ItemStatsTimeSpentPreviewBinding -> displayTimeSpentPreview(_binding)
        }
    }

    private fun displayPreview(binding: ItemStatsPreviewBinding) {
        binding.title.apply {
            text = when (userStats.typeLayout) {
                MangaJapAdapter.Type.STATS_PREVIEW_MANGA_FOLLOWED -> context.resources.getString(R.string.mangasFollows)
                MangaJapAdapter.Type.STATS_PREVIEW_MANGA_VOLUMES -> context.resources.getString(R.string.volumesRead)
                MangaJapAdapter.Type.STATS_PREVIEW_MANGA_CHAPTERS -> context.resources.getString(R.string.chaptersRead)

                MangaJapAdapter.Type.STATS_PREVIEW_ANIME_FOLLOWED -> context.resources.getString(R.string.animeFollows)
                MangaJapAdapter.Type.STATS_PREVIEW_ANIME_EPISODES -> context.resources.getString(R.string.episodes_watched)
                else -> ""
            }
        }

        binding.body.apply {
            text = when (userStats.typeLayout) {
                MangaJapAdapter.Type.STATS_PREVIEW_MANGA_FOLLOWED -> userStats.user.followedMangaCount.withSuffix()
                MangaJapAdapter.Type.STATS_PREVIEW_MANGA_VOLUMES -> userStats.user.mangaVolumeRead.withSuffix()
                MangaJapAdapter.Type.STATS_PREVIEW_MANGA_CHAPTERS -> userStats.user.mangaChapterRead.withSuffix()

                MangaJapAdapter.Type.STATS_PREVIEW_ANIME_FOLLOWED -> userStats.user.followedAnimeCount.withSuffix()
                MangaJapAdapter.Type.STATS_PREVIEW_ANIME_EPISODES -> userStats.user.animeEpisodeWatch.withSuffix()
                else -> ""
            }
        }

        binding.details.apply {
            text = when (userStats.typeLayout) {
                else -> ""
            }
            visibility = when (userStats.typeLayout) {
                else -> View.GONE
            }
        }
    }

    private fun displayTimeSpentPreview(binding: ItemStatsTimeSpentPreviewBinding) {
        binding.title.apply {
            text = when (userStats.typeLayout) {
                MangaJapAdapter.Type.STATS_PREVIEW_ANIME_TIME_SPENT -> context.resources.getString(R.string.timeSpentOnAnime)
                else -> ""
            }
        }

        binding.timeMonthTextView.apply {
            text = when (userStats.typeLayout) {
                MangaJapAdapter.Type.STATS_PREVIEW_ANIME_TIME_SPENT -> userStats.user.timeSpentOnAnime.let { String.format("%02d", it / 43800) }
                else -> ""
            }
        }

        binding.timeDaysTextView.apply {
            text = when (userStats.typeLayout) {
                MangaJapAdapter.Type.STATS_PREVIEW_ANIME_TIME_SPENT -> userStats.user.timeSpentOnAnime.let { String.format("%02d", it / 1440 % 30) }
                else -> ""
            }
        }

        binding.timeHoursTextView.apply {
            text = when (userStats.typeLayout) {
                MangaJapAdapter.Type.STATS_PREVIEW_ANIME_TIME_SPENT -> userStats.user.timeSpentOnAnime.let { String.format("%02d", it / 60 % 24) }
                else -> ""
            }
        }
    }
}