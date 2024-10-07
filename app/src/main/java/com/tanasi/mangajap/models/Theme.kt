package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.toCalendar
import java.util.*

@JsonApiType("themes")
class Theme(
    val id: String,

    createdAt: String? = null,
    updatedAt: String? = null,
    val title: String = "",
    val description: String? = null,

    val manga: List<Manga> = listOf(),
    val anime: List<Anime> = listOf(),
) : AppAdapter.Item {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")


    override lateinit var typeLayout: AppAdapter.Type
}