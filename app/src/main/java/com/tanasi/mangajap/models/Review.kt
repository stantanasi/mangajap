package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiProperty
import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar
import java.util.*
import kotlin.reflect.KProperty

@JsonApiType("reviews")
class Review(
    var id: String? = null,

    content: String = "",
    createdAt: String? = null,
    updatedAt: String? = null,

    user: User? = null,
    manga: Manga? = null,
    anime: Anime? = null,
) : JsonApiResource, AppAdapter.Item {

    var content by JsonApiProperty(content)
    val createdAt = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")

    var user by JsonApiProperty<User?>(user)
    var manga by JsonApiProperty<Manga?>(manga)
    var anime by JsonApiProperty<Anime?>(anime)


    override val dirtyProperties: MutableList<KProperty<*>> = mutableListOf()
    override lateinit var itemType: AppAdapter.Type

    fun copy(
        id: String? = this.id,
        content: String = this.content,
        createdAt: String? = this.createdAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        updatedAt: String? = this.updatedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        user: User? = this.user,
        manga: Manga? = this.manga,
        anime: Anime? = this.anime,
    ) = Review(
        id = id,
        content = content,
        createdAt = createdAt,
        updatedAt = updatedAt,
        user = user,
        manga = manga,
        anime = anime,
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Review

        if (id != other.id) return false
        if (createdAt != other.createdAt) return false
        if (updatedAt != other.updatedAt) return false
        if (dirtyProperties != other.dirtyProperties) return false
        if (itemType != other.itemType) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id?.hashCode() ?: 0
        result = 31 * result + (createdAt?.hashCode() ?: 0)
        result = 31 * result + (updatedAt?.hashCode() ?: 0)
        result = 31 * result + dirtyProperties.hashCode()
        result = 31 * result + itemType.hashCode()
        return result
    }
}