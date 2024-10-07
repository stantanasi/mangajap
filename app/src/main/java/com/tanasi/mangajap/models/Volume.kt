package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiRelationship
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar
import org.json.JSONObject
import java.util.Calendar

@JsonApiType("volumes")
class Volume(
    val id: String,

    val titles: JSONObject? = null,
    val number: Int = 0,
    published: String? = null,
    val coverImage: String? = null,
    val chapterCount: Int = 0,
    val startChapter: Int? = null,
    val endChapter: Int? = null,
    createdAt: String? = null,
    updatedAt: String? = null,

    val manga: Manga? = null,
    val chapters: List<Chapter> = emptyList(),
    @JsonApiRelationship("volume-entry")
    var volumeEntry: VolumeEntry? = null,
) : AppAdapter.Item {

    val title: String
        get() = titles?.optString("fr")
            ?: titles?.optString("en")
            ?: titles?.optString("en_jp")
            ?: titles?.optString("ja_jp")
            ?: ""
    val published = published?.toCalendar("yyyy-MM-dd")
    val createdAt = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")


    override lateinit var itemType: AppAdapter.Type

    fun copy(
        id: String = this.id,
        titles: JSONObject? = this.titles,
        number: Int = this.number,
        published: String? = this.published?.format("yyyy-MM-dd"),
        coverImage: String? = this.coverImage,
        chapterCount: Int = this.chapterCount,
        startChapter: Int? = this.startChapter,
        endChapter: Int? = this.endChapter,
        createdAt: String? = this.createdAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        updatedAt: String? = this.updatedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        manga: Manga? = this.manga,
        chapters: List<Chapter> = this.chapters,
        volumeEntry: VolumeEntry? = this.volumeEntry,
    ) = Volume(
        id = id,
        titles = titles,
        number = number,
        published = published,
        coverImage = coverImage,
        chapterCount = chapterCount,
        startChapter = startChapter,
        endChapter = endChapter,
        createdAt = createdAt,
        updatedAt = updatedAt,
        manga = manga,
        chapters = chapters,
        volumeEntry = volumeEntry,
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Volume

        if (id != other.id) return false
        if (titles != other.titles) return false
        if (number != other.number) return false
        if (coverImage != other.coverImage) return false
        if (chapterCount != other.chapterCount) return false
        if (startChapter != other.startChapter) return false
        if (endChapter != other.endChapter) return false
        if (manga != other.manga) return false
        if (chapters != other.chapters) return false
        if (volumeEntry != other.volumeEntry) return false
        if (published != other.published) return false
        if (createdAt != other.createdAt) return false
        if (updatedAt != other.updatedAt) return false
        if (itemType != other.itemType) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + (titles?.hashCode() ?: 0)
        result = 31 * result + number
        result = 31 * result + (coverImage?.hashCode() ?: 0)
        result = 31 * result + chapterCount
        result = 31 * result + (startChapter ?: 0)
        result = 31 * result + (endChapter ?: 0)
        result = 31 * result + (manga?.hashCode() ?: 0)
        result = 31 * result + chapters.hashCode()
        result = 31 * result + (volumeEntry?.hashCode() ?: 0)
        result = 31 * result + (published?.hashCode() ?: 0)
        result = 31 * result + (createdAt?.hashCode() ?: 0)
        result = 31 * result + (updatedAt?.hashCode() ?: 0)
        result = 31 * result + itemType.hashCode()
        return result
    }
}