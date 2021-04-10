package com.tanasi.mangajap.models

import com.tanasi.mangajap.utils.jsonApi.JsonApi
import com.tanasi.mangajap.utils.jsonApi.JsonApiResource
import org.json.JSONObject

@JsonApi("themes")
class Theme(
        override var id: String = "",
        var createdAt: String? = null,
        var updatedAt: String? = null,
        titles: JSONObject? = null,
        var description: String? = null,

        var manga: List<Manga> = listOf(),
        var anime: List<Anime> = listOf(),
) : JsonApiResource() {

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
}