package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import org.json.JSONObject
import kotlin.math.max
import kotlin.math.min

@JsonApiType("seasons")
class Season(
    val id: String,

    titles: JSONObject? = null,
    val number: Int = 0,
    val episodeCount: Int = 0,

    var anime: Anime? = null,
    val episodes: MutableList<Episode> = mutableListOf(),
) : AppAdapter.Item {

    val titles: Titles = Titles.from(titles)

    val title: String
        get() = when {
            titles.fr != "" -> titles.fr
            titles.en != "" -> titles.en
            titles.en_jp != "" -> titles.en_jp
            titles.ja_jp != "" -> titles.ja_jp
            else -> ""
        }
    val episodeWatched: Int
        get() {
            return max(
                min(
                    (anime?.animeEntry?.episodesWatch ?: 0) - (anime?.seasons
                        ?.filter { it.number < number }
                        ?.map { it.episodeCount }
                        ?.sum() ?: 0),
                    episodeCount
                ),
                0
            )
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


    var isLoadingEpisodes = false
    var isShowingEpisodes = false


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


    override var typeLayout: AppAdapter.Type = AppAdapter.Type.SEASON_ANIME
}