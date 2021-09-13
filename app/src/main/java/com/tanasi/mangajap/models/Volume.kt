package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.utils.extensions.toCalendar
import org.json.JSONObject
import java.util.*

@JsonApiType("volumes")
class Volume(
    override var id: String = "",
    createdAt: String? = null,
    updatedAt: String? = null,
    titles: JSONObject? = null,
    val number: Int? = null,
    val startChapter: Int? = null,
    val endChapter: Int? = null,
    published: String? = null,
    val coverImage: String? = null,

    val manga: Manga? = null,
) : JsonApiResource(), MangaJapAdapter.Item, Cloneable {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val titles: Titles = Titles.create(titles)
    val published: Calendar? = published?.toCalendar("yyyy-MM-dd")

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

    public override fun clone(): Volume {
        return super.clone() as Volume
    }
}