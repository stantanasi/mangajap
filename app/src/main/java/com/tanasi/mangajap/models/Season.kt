package com.tanasi.mangajap.models

import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.MangaJapAdapter
import org.json.JSONObject
import kotlin.math.max

class Season(
    val id: String = "",
    titles: JSONObject? = null,
    val number: Int = 0,
    val episodeCount: Int = 0,

    val anime: Anime? = null,
    val episodes: List<Episode> = listOf(),
) : MangaJapAdapter.Item {

    val titles: Titles = Titles.from(titles)
    val episodeWatched: Int
        get() {
            var episodeWatched = 0
            var episodesWatch = anime?.animeEntry?.episodesWatch ?: 0
            anime?.seasons?.forEach { season ->
                episodesWatch -= season.episodeCount
                if (season.number == number) {
                    when {
                        episodesWatch > 0 -> episodeWatched = season.episodeCount
                        episodesWatch < 0 -> episodeWatched = max(episodesWatch + episodeCount, 0)
                    }
                }
            }
            return episodeWatched
        }
    val isWatched: Boolean
        get() = episodeWatched >= episodeCount
    val progress: Int
        get() = (episodeWatched / episodeCount) * 100
    val progressColor: Int
        get() = when {
            progress < 100 -> R.color.animeEntryEpisodesWatching_color
            else -> R.color.animeEntryEpisodesCompleted_color
        }


    data class Titles(
        val fr: String,
        val en: String,
        val en_jp: String,
        val ja_jp: String,
    ) {
        companion object {
            fun from(json: JSONObject?): Titles {
                return Titles(
                    json?.optString("fr") ?: "",
                    json?.optString("en") ?: "",
                    json?.optString("en_jp") ?: "",
                    json?.optString("ja_jp") ?: ""
                )
            }
        }
    }


    override var typeLayout: MangaJapAdapter.Type = MangaJapAdapter.Type.SEASON_ANIME
}