package com.tanasi.mangajap.models

import com.tanasi.mangajap.adapters.AppAdapter

class Manga(
    val id: String,
    val title: String = "",
    val synopsis: String? = null,
    val coverImage: String? = null,

    val genres: List<Genre> = emptyList(),
    val volumes: List<Volume> = emptyList(),
    val chapters: List<Chapter> = emptyList(),
) : AppAdapter.Item {

    override lateinit var itemType: AppAdapter.Type

    fun copy(
        id: String = this.id,
        title: String = this.title,
        synopsis: String? = this.synopsis,
        coverImage: String? = this.coverImage,
        genres: List<Genre> = this.genres,
        volumes: List<Volume> = this.volumes,
        chapters: List<Chapter> = this.chapters,
    ) = Manga(
        id = id,
        title = title,
        synopsis = synopsis,
        coverImage = coverImage,
        genres = genres,
        volumes = volumes,
        chapters = chapters,
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Manga

        if (id != other.id) return false
        if (title != other.title) return false
        if (synopsis != other.synopsis) return false
        if (coverImage != other.coverImage) return false
        if (genres != other.genres) return false
        if (volumes != other.volumes) return false
        if (chapters != other.chapters) return false
        if (!::itemType.isInitialized || !other::itemType.isInitialized) return false
        return itemType == other.itemType
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + title.hashCode()
        result = 31 * result + (synopsis?.hashCode() ?: 0)
        result = 31 * result + (coverImage?.hashCode() ?: 0)
        result = 31 * result + genres.hashCode()
        result = 31 * result + volumes.hashCode()
        result = 31 * result + chapters.hashCode()
        result = 31 * result + (if (::itemType.isInitialized) itemType.hashCode() else 0)
        return result
    }
}