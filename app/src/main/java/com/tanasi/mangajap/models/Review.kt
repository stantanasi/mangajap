package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.utils.extensions.toCalendar
import java.util.*

@JsonApiType("reviews")
class Review(
        override var id: String = "",
        createdAt: String? = null,
        updatedAt: String? = null,
        var content: String = "",

        var user: User? = null,
        var manga: Manga? = null,
        var anime: Anime? = null,
) : JsonApiResource(), MangaJapAdapter.Item {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd HH:mm:ss")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd HH:mm:ss")


    fun putContent(content: String) = putAttribute("content", content)

    fun putUser(user: User) = putRelationship("user", user)

    fun putManga(manga: Manga) = putRelationship("manga", manga)

    fun putAnime(anime: Anime) = putRelationship("anime", anime)

    override lateinit var typeLayout: MangaJapAdapter.Type
}