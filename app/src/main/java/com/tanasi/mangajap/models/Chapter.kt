package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiRelationship
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar
import org.json.JSONObject

@JsonApiType("chapters")
class Chapter(
    val id: String,

    val titles: JSONObject? = null,
    val number: Int = 0,
    publishedAt: String? = null,
    createdAt: String? = null,
    updatedAt: String? = null,

    val manga: Manga? = null,
    val volume: Volume? = null,
    @JsonApiRelationship("chapter-entry")
    var chapterEntry: ChapterEntry? = null,
) : AppAdapter.Item {

    val publishedAt = publishedAt?.toCalendar("yyyy-MM-dd")
    val createdAt = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")


    override lateinit var itemType: AppAdapter.Type

    fun copy(
        id: String = this.id,
        titles: JSONObject? = this.titles,
        number: Int = this.number,
        publishedAt: String? = this.publishedAt?.format("yyyy-MM-dd"),
        createdAt: String? = this.createdAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        updatedAt: String? = this.updatedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        manga: Manga? = this.manga,
        volume: Volume? = this.volume,
        chapterEntry: ChapterEntry? = this.chapterEntry,
    ) = Chapter(
        id = id,
        titles = titles,
        number = number,
        publishedAt = publishedAt,
        createdAt = createdAt,
        updatedAt = updatedAt,
        manga = manga,
        volume = volume,
        chapterEntry = chapterEntry
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Chapter

        if (id != other.id) return false
        if (titles != other.titles) return false
        if (number != other.number) return false
        if (manga != other.manga) return false
        if (volume != other.volume) return false
        if (chapterEntry != other.chapterEntry) return false
        if (publishedAt != other.publishedAt) return false
        if (createdAt != other.createdAt) return false
        if (updatedAt != other.updatedAt) return false
        if (itemType != other.itemType) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + (titles?.hashCode() ?: 0)
        result = 31 * result + number
        result = 31 * result + (manga?.hashCode() ?: 0)
        result = 31 * result + (volume?.hashCode() ?: 0)
        result = 31 * result + (chapterEntry?.hashCode() ?: 0)
        result = 31 * result + (publishedAt?.hashCode() ?: 0)
        result = 31 * result + (createdAt?.hashCode() ?: 0)
        result = 31 * result + (updatedAt?.hashCode() ?: 0)
        result = 31 * result + itemType.hashCode()
        return result
    }
}