package com.tanasi.mangajap.adapters.viewholders

import android.view.View
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.databinding.ItemStatsPreviewBinding
import com.tanasi.mangajap.databinding.ItemStatsTimeSpentPreviewBinding
import com.tanasi.mangajap.models.User
import com.tanasi.mangajap.utils.extensions.withSuffix

class UserStatsViewHolder(
        private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
        _binding.root
) {

    private val context = itemView.context
    private lateinit var userStats: User.Stats

    fun setVhUserStats(userStats: User.Stats) {
        this.userStats = userStats
        when (_binding) {
            is ItemStatsPreviewBinding -> displayPreview(_binding)
            is ItemStatsTimeSpentPreviewBinding -> displayTimeSpentPreview(_binding)
        }
    }

    private fun displayPreview(binding: ItemStatsPreviewBinding) {
        binding.tvStatsPreviewTitle.apply {
            text = when (userStats.typeLayout) {
                AppAdapter.Type.STATS_PREVIEW_MANGA_FOLLOWED -> context.resources.getString(R.string.mangasFollows)
                AppAdapter.Type.STATS_PREVIEW_MANGA_VOLUMES -> context.resources.getString(R.string.volumesRead)
                AppAdapter.Type.STATS_PREVIEW_MANGA_CHAPTERS -> context.resources.getString(R.string.chaptersRead)

                AppAdapter.Type.STATS_PREVIEW_ANIME_FOLLOWED -> context.resources.getString(R.string.animeFollows)
                AppAdapter.Type.STATS_PREVIEW_ANIME_EPISODES -> context.resources.getString(R.string.episodes_watched)
                else -> ""
            }
        }

        binding.tvStatsPreviewBody.apply {
            text = when (userStats.typeLayout) {
                AppAdapter.Type.STATS_PREVIEW_MANGA_FOLLOWED -> userStats.user.followedMangaCount.withSuffix()
                AppAdapter.Type.STATS_PREVIEW_MANGA_VOLUMES -> userStats.user.mangaVolumeRead.withSuffix()
                AppAdapter.Type.STATS_PREVIEW_MANGA_CHAPTERS -> userStats.user.mangaChapterRead.withSuffix()

                AppAdapter.Type.STATS_PREVIEW_ANIME_FOLLOWED -> userStats.user.followedAnimeCount.withSuffix()
                AppAdapter.Type.STATS_PREVIEW_ANIME_EPISODES -> userStats.user.animeEpisodeWatch.withSuffix()
                else -> ""
            }
        }

        binding.tvStatsPreviewDetails.apply {
            text = when (userStats.typeLayout) {
                else -> ""
            }
            visibility = when (userStats.typeLayout) {
                else -> View.GONE
            }
        }
    }

    private fun displayTimeSpentPreview(binding: ItemStatsTimeSpentPreviewBinding) {
        binding.tvStatsPreviewTitle.text = when (userStats.typeLayout) {
            AppAdapter.Type.STATS_PREVIEW_ANIME_TIME_SPENT -> context.getString(R.string.timeSpentOnAnime)
            else -> ""
        }

        binding.tvStatsPreviewMonths.text = when (userStats.typeLayout) {
            AppAdapter.Type.STATS_PREVIEW_ANIME_TIME_SPENT -> userStats.user.timeSpentOnAnime.let { String.format("%02d", it / 43800) }
            else -> ""
        }

        binding.tvStatsPreviewDays.text = when (userStats.typeLayout) {
            AppAdapter.Type.STATS_PREVIEW_ANIME_TIME_SPENT -> userStats.user.timeSpentOnAnime.let { String.format("%02d", it / 1440 % 30) }
            else -> ""
        }

        binding.tvStatsPreviewHours.text = when (userStats.typeLayout) {
            AppAdapter.Type.STATS_PREVIEW_ANIME_TIME_SPENT -> userStats.user.timeSpentOnAnime.let { String.format("%02d", it / 60 % 24) }
            else -> ""
        }
    }
}