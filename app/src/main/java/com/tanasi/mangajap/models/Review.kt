package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiProperty
import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.utils.extensions.toCalendar
import java.util.*
import kotlin.reflect.KProperty

@JsonApiType("reviews")
class Review(
    var id: String? = null,

    createdAt: String? = null,
    updatedAt: String? = null,
    content: String = "",

    user: User? = null,
    manga: Manga? = null,
    anime: Anime? = null,
) : JsonApiResource, MangaJapAdapter.Item {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    var content: String by JsonApiProperty(content)

    var user: User? by JsonApiProperty(user)
    var manga: Manga? by JsonApiProperty(manga)
    var anime: Anime? by JsonApiProperty(anime)


    override val dirtyProperties: MutableList<KProperty<*>> = mutableListOf()
    override lateinit var typeLayout: MangaJapAdapter.Type
}