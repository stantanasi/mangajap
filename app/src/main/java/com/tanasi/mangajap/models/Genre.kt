package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.adapters.MangaJapAdapter
import org.json.JSONObject

@JsonApiType("genres")
class Genre(
        override var id: String = "",
        var createdAt: String? = null,
        var updatedAt: String? = null,
        titles: JSONObject? = null,
        var description: String? = null,

        var manga: List<Manga> = listOf(),
        var anime: List<Anime> = listOf(),
) : JsonApiResource(), MangaJapAdapter.Item {

    val titles: Titles? = Titles.create(titles)

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


    override lateinit var typeLayout: MangaJapAdapter.Type
}