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

    fun bind(userStats: User.Stats) {
        this.userStats = userStats
        when (_binding) {
            is ItemStatsPreviewBinding -> displayPreview(_binding)
            is ItemStatsTimeSpentPreviewBinding -> displayTimeSpentPreview(_binding)
        }
    }

    private fun displayPreview(binding: ItemStatsPreviewBinding) {
        binding.tvStatsPreviewTitle.apply {
            text = when (userStats.itemType) {
                AppAdapter.Type.STATS_PROFILE_MANGA_FOLLOWED_ITEM -> context.resources.getString(R.string.mangasFollows)
                AppAdapter.Type.STATS_PROFILE_MANGA_VOLUMES_ITEM -> context.resources.getString(R.string.volumesRead)
                AppAdapter.Type.STATS_PROFILE_MANGA_CHAPTERS_ITEM -> context.resources.getString(R.string.chaptersRead)

                AppAdapter.Type.STATS_PROFILE_ANIME_FOLLOWED_ITEM -> context.resources.getString(R.string.animeFollows)
                AppAdapter.Type.STATS_PROFILE_ANIME_EPISODES_ITEM -> context.resources.getString(R.string.episodes_watched)
                else -> ""
            }
        }

        binding.tvStatsPreviewBody.apply {
            text = when (userStats.itemType) {
                AppAdapter.Type.STATS_PROFILE_MANGA_FOLLOWED_ITEM -> userStats.user.followedMangaCount.withSuffix()
                AppAdapter.Type.STATS_PROFILE_MANGA_VOLUMES_ITEM -> userStats.user.mangaVolumeRead.withSuffix()
                AppAdapter.Type.STATS_PROFILE_MANGA_CHAPTERS_ITEM -> userStats.user.mangaChapterRead.withSuffix()

                AppAdapter.Type.STATS_PROFILE_ANIME_FOLLOWED_ITEM -> userStats.user.followedAnimeCount.withSuffix()
                AppAdapter.Type.STATS_PROFILE_ANIME_EPISODES_ITEM -> userStats.user.animeEpisodeWatch.withSuffix()
                else -> ""
            }
        }

        binding.tvStatsPreviewDetails.apply {
            text = when (userStats.itemType) {
                else -> ""
            }
            visibility = when (userStats.itemType) {
                else -> View.GONE
            }
        }
    }

    private fun displayTimeSpentPreview(binding: ItemStatsTimeSpentPreviewBinding) {
        binding.tvStatsPreviewTitle.text = when (userStats.itemType) {
            AppAdapter.Type.STATS_PROFILE_ANIME_TIME_SPENT_ITEM -> context.getString(R.string.timeSpentOnAnime)
            else -> ""
        }

        binding.tvStatsPreviewMonths.text = when (userStats.itemType) {
            AppAdapter.Type.STATS_PROFILE_ANIME_TIME_SPENT_ITEM -> userStats.user.timeSpentOnAnime.let { String.format("%02d", it / 43800) }
            else -> ""
        }

        binding.tvStatsPreviewDays.text = when (userStats.itemType) {
            AppAdapter.Type.STATS_PROFILE_ANIME_TIME_SPENT_ITEM -> userStats.user.timeSpentOnAnime.let { String.format("%02d", it / 1440 % 30) }
            else -> ""
        }

        binding.tvStatsPreviewHours.text = when (userStats.itemType) {
            AppAdapter.Type.STATS_PROFILE_ANIME_TIME_SPENT_ITEM -> userStats.user.timeSpentOnAnime.let { String.format("%02d", it / 60 % 24) }
            else -> ""
        }
    }
}