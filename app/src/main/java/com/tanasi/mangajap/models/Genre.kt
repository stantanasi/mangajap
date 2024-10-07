package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar

@JsonApiType("genres")
class Genre(
    val id: String,

    val title: String = "",
    val description: String = "",
    createdAt: String? = null,
    updatedAt: String? = null,

    val mangas: List<Manga> = emptyList(),
    val animes: List<Anime> = emptyList(),
) : AppAdapter.Item {

    val createdAt = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")


    override lateinit var itemType: AppAdapter.Type

    fun copy(
        id:String = this.id,
        title: String = this.title,
        description: String = this.description,
        createdAt: String? = this.createdAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        updatedAt: String? = this.updatedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        mangas: List<Manga> = this.mangas,
        animes: List<Anime> = this.animes,
    ) = Genre(
        id = id,
        title = title,
        description = description,
        createdAt = createdAt,
        updatedAt = updatedAt,
        mangas = mangas,
        animes = animes,
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Genre

        if (id != other.id) return false
        if (title != other.title) return false
        if (description != other.description) return false
        if (mangas != other.mangas) return false
        if (animes != other.animes) return false
        if (createdAt != other.createdAt) return false
        if (updatedAt != other.updatedAt) return false
        if (itemType != other.itemType) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + title.hashCode()
        result = 31 * result + description.hashCode()
        result = 31 * result + mangas.hashCode()
        result = 31 * result + animes.hashCode()
        result = 31 * result + (createdAt?.hashCode() ?: 0)
        result = 31 * result + (updatedAt?.hashCode() ?: 0)
        result = 31 * result + itemType.hashCode()
        return result
    }
}