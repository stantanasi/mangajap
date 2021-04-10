package com.tanasi.mangajap.models

import com.tanasi.mangajap.utils.extensions.toCalendar
import com.tanasi.mangajap.utils.jsonApi.JsonApi
import com.tanasi.mangajap.utils.jsonApi.JsonApiResource
import java.util.*

@JsonApi("reviews")
class Review(
        override var id: String = "",
        createdAt: String? = null,
        updatedAt: String? = null,
        var content: String = "",

        var user: User? = null,
        var manga: Manga? = null,
        var anime: Anime? = null,
) : JsonApiResource() {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd HH:mm:ss")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd HH:mm:ss")


    fun putContent(content: String) = putAttribute("content", content)

    fun putUser(user: User) = putRelationship("user", user)

    fun putManga(manga: Manga) = putRelationship("manga", manga)

    fun putAnime(anime: Anime) = putRelationship("anime", anime)
}