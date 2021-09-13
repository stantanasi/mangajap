package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.utils.extensions.toCalendar
import org.json.JSONObject
import java.util.*

@JsonApiType("episodes")
class Episode(
    override var id: String = "",
    createdAt: String? = null,
    updatedAt: String? = null,
    titles: JSONObject? = null,
    val seasonNumber: Int = 0,
    val relativeNumber: Int = 0,
    val number: Int = 0,
    airDate: String? = null,
    episodeType: String = "",

    var anime: Anime? = null,
    var season: Season? = null,
) : JsonApiResource(), MangaJapAdapter.Item {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val titles: Titles? = Titles.create(titles)
    val airDate: Calendar? = airDate?.toCalendar("yyyy-MM-dd")
    val episodeType: EpisodeType? = EpisodeType.getByName(episodeType)


    data class Titles(
        val fr: String,
    ) {
        companion object {
            fun create(json: JSONObject?): Titles? {
                return if (json == null) null else Titles(
                    json.optString("fr") ?: ""
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


    override lateinit var typeLayout: MangaJapAdapter.Type
}