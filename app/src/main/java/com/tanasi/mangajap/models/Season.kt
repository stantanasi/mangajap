package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar
import org.json.JSONObject
import kotlin.math.max
import kotlin.math.min

@JsonApiType("seasons")
class Season(
    val id: String,

    val titles: JSONObject? = null,
    val number: Int = 0,
    val episodeCount: Int = 0,
    createdAt: String? = null,
    updatedAt: String? = null,

    var anime: Anime? = null,
    val episodes: List<Episode> = emptyList(),
) : AppAdapter.Item {

    val title: String
        get() = titles?.optString("fr")
            ?: titles?.optString("en")
            ?: titles?.optString("en_jp")
            ?: titles?.optString("ja_jp")
            ?: ""
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
    val createdAt = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")


    var isLoadingEpisodes = false
    var isShowingEpisodes = false


    override var itemType: AppAdapter.Type = AppAdapter.Type.SEASON_ITEM

    fun copy(
        id: String = this.id,
        titles: JSONObject? = this.titles,
        number: Int = this.number,
        episodeCount: Int = this.episodeCount,
        createdAt: String? = this.createdAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        updatedAt: String? = this.updatedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        anime: Anime? = this.anime,
        episodes: List<Episode> = this.episodes,
    ) = Season(
        id = id,
        titles = titles,
        number = number,
        episodeCount = episodeCount,
        createdAt = createdAt,
        updatedAt = updatedAt,
        anime = anime,
        episodes = episodes,
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Season

        if (id != other.id) return false
        if (titles != other.titles) return false
        if (number != other.number) return false
        if (episodeCount != other.episodeCount) return false
        if (anime != other.anime) return false
        if (episodes != other.episodes) return false
        if (createdAt != other.createdAt) return false
        if (updatedAt != other.updatedAt) return false
        if (isLoadingEpisodes != other.isLoadingEpisodes) return false
        if (isShowingEpisodes != other.isShowingEpisodes) return false
        if (itemType != other.itemType) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + (titles?.hashCode() ?: 0)
        result = 31 * result + number
        result = 31 * result + episodeCount
        result = 31 * result + (anime?.hashCode() ?: 0)
        result = 31 * result + episodes.hashCode()
        result = 31 * result + (createdAt?.hashCode() ?: 0)
        result = 31 * result + (updatedAt?.hashCode() ?: 0)
        result = 31 * result + isLoadingEpisodes.hashCode()
        result = 31 * result + isShowingEpisodes.hashCode()
        result = 31 * result + itemType.hashCode()
        return result
    }
}