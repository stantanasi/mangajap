package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiRelationship
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.toCalendar
import org.json.JSONObject
import java.util.*

@JsonApiType("episodes")
class Episode(
    val id: String,

    createdAt: String? = null,
    updatedAt: String? = null,
    titles: JSONObject? = null,
    val relativeNumber: Int = 0,
    val number: Int = 0,
    airDate: String? = null,
    episodeType: String = "",

    val anime: Anime? = null,
    var season: Season? = null,
    @JsonApiRelationship("episode-entry") val episodeEntry: EpisodeEntry? = null,
) : AppAdapter.Item {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val titles: Titles = Titles.create(titles)
    val airDate: Calendar? = airDate?.toCalendar("yyyy-MM-dd")
    val episodeType: EpisodeType? = EpisodeType.getByName(episodeType)


    val title: String
        get() = when {
            titles.fr != "" -> titles.fr
            titles.en != "" -> titles.en
            titles.en_jp != "" -> titles.en_jp
            titles.ja_jp != "" -> titles.ja_jp
            else -> ""
        }


    data class Titles(
        val fr: String,
        val en: String,
        val en_jp: String,
        val ja_jp: String,
    ) {
        companion object {
            fun create(json: JSONObject?): Titles {
                return Titles(
                    json?.optString("fr") ?: "",
                    json?.optString("en") ?: "",
                    json?.optString("en_jp") ?: "",
                    json?.optString("ja_jp") ?: "",
                )
            }
        }
    }

    enum class EpisodeType(val stringId: Int) {
        ova(R.string.animeTypeOva);

        companion object {
            fun getByName(name: String): EpisodeType? = try {
                valueOf(name)
            } catch (e: Exception) {
                null
            }
        }
    }


    override lateinit var typeLayout: AppAdapter.Type
}