package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiRelationship
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.utils.extensions.toCalendar
import org.json.JSONObject
import java.util.Calendar

@JsonApiType("chapters")
class Chapter(
    val id: String,

    createdAt: String? = null,
    updatedAt: String? = null,
    titles: JSONObject? = null,
    val number: Int = 0,
    publishedAt: String? = null,

    val manga: Manga? = null,
    val volume: Volume? = null,
    @JsonApiRelationship("chapter-entry") val chapterEntry: ChapterEntry? = null,
) : MangaJapAdapter.Item {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val titles: Titles = Titles.create(titles)
    val published: Calendar? = publishedAt?.toCalendar("yyyy-MM-dd")

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
                    json?.optString("ja_jp") ?: ""
                )
            }
        }
    }


    override lateinit var typeLayout: MangaJapAdapter.Type
}