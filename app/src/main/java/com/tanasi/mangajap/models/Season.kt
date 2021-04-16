package com.tanasi.mangajap.models

import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.MangaJapAdapter
import kotlin.math.max

class Season(
        val episodes: List<Episode>
) : MangaJapAdapter.Item {

    var isLast = false

    override var typeLayout: MangaJapAdapter.Type = MangaJapAdapter.Type.SEASON_ANIME


    val seasonNumber: Int
        get() = if (episodes.isEmpty()) 0 else episodes.first().seasonNumber

    val episodeCount: Int
        get() = episodes.size

    val episodeWatched: Int
        get() {
            return episodes.firstOrNull()?.anime?.animeEntry?.let { animeEntry ->
                var episodeWatched = max(animeEntry.episodesWatch - episodes.last().number + episodeCount, 0)
                if (animeEntry.episodesWatch >= episodes.last().number && !isLast) {
                    episodeWatched = episodeCount
                }
                return episodeWatched
            } ?: 0
        }

    val isWatched: Boolean
        get() = episodes[0].anime!!.animeEntry!!.episodesWatch >= episodes.last().number

    val progress: Int
        get() = ((episodeWatched.toDouble() / episodeCount) * 100).toInt()

    val progressColor: Int
        get() = when {
            progress < 100 -> R.color.animeEntryEpisodesWatching_color
            else -> R.color.animeEntryEpisodesCompleted_color
        }
}