package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.utils.extensions.toCalendar
import java.util.*

@JsonApiType("themes")
class Theme(
    override var id: String = "",
    createdAt: String? = null,
    updatedAt: String? = null,
    val title: String = "",
    val description: String? = null,

    var manga: List<Manga> = listOf(),
    var anime: List<Anime> = listOf(),
) : JsonApiResource(), MangaJapAdapter.Item {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")


    override lateinit var typeLayout: MangaJapAdapter.Type
}