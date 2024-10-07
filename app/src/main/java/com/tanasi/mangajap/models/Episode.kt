package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiRelationship
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar
import org.json.JSONObject

@JsonApiType("episodes")
class Episode(
    val id: String,

    val titles: JSONObject? = null,
    val relativeNumber: Int = 0,
    val number: Int = 0,
    airDate: String? = null,
    episodeType: String = "",
    createdAt: String? = null,
    updatedAt: String? = null,

    val anime: Anime? = null,
    var season: Season? = null,
    @JsonApiRelationship("episode-entry")
    var episodeEntry: EpisodeEntry? = null,
) : AppAdapter.Item {

    val title: String
        get() = titles?.optString("fr")
            ?: titles?.optString("en")
            ?: titles?.optString("en_jp")
            ?: titles?.optString("ja_jp")
            ?: ""
    val airDate = airDate?.toCalendar("yyyy-MM-dd")
    val episodeType = EpisodeType.entries.find { it.key == episodeType }
    val createdAt = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")


    enum class EpisodeType(val key: String, val stringId: Int) {
        OVA("ova", R.string.animeTypeOva),
    }


    override lateinit var itemType: AppAdapter.Type

    fun copy(
        id: String = this.id,
        titles: JSONObject? = this.titles,
        relativeNumber: Int = this.relativeNumber,
        number: Int = this.number,
        airDate: String? = this.airDate?.format("yyyy-MM-dd"),
        episodeType: String = this.episodeType?.key ?: "",
        createdAt: String? = this.createdAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        updatedAt: String? = this.updatedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        anime: Anime? = this.anime,
        season: Season? = this.season,
        episodeEntry: EpisodeEntry? = this.episodeEntry,
    ) = Episode(
        id = id,
        titles = titles,
        relativeNumber = relativeNumber,
        number = number,
        airDate = airDate,
        episodeType = episodeType,
        createdAt = createdAt,
        updatedAt = updatedAt,
        anime = anime,
        season = season,
        episodeEntry = episodeEntry,
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Episode

        if (id != other.id) return false
        if (titles != other.titles) return false
        if (relativeNumber != other.relativeNumber) return false
        if (number != other.number) return false
        if (anime != other.anime) return false
        if (season != other.season) return false
        if (episodeEntry != other.episodeEntry) return false
        if (airDate != other.airDate) return false
        if (episodeType != other.episodeType) return false
        if (createdAt != other.createdAt) return false
        if (updatedAt != other.updatedAt) return false
        if (itemType != other.itemType) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + (titles?.hashCode() ?: 0)
        result = 31 * result + relativeNumber
        result = 31 * result + number
        result = 31 * result + (anime?.hashCode() ?: 0)
        result = 31 * result + (season?.hashCode() ?: 0)
        result = 31 * result + (episodeEntry?.hashCode() ?: 0)
        result = 31 * result + (airDate?.hashCode() ?: 0)
        result = 31 * result + (episodeType?.hashCode() ?: 0)
        result = 31 * result + (createdAt?.hashCode() ?: 0)
        result = 31 * result + (updatedAt?.hashCode() ?: 0)
        result = 31 * result + itemType.hashCode()
        return result
    }
}