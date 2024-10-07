package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiAttribute
import com.tanasi.jsonapi.JsonApiProperty
import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar
import kotlin.math.max
import kotlin.reflect.KProperty

@JsonApiType("manga-entries")
class MangaEntry(
    var id: String? = null,

    isAdd: Boolean = false,
    isFavorites: Boolean = false,
    status: String = "",
    volumesRead: Int = 0,
    chaptersRead: Int = 0,
    rating: Int? = null,
    @JsonApiAttribute("startedAt")
    private var _startedAt: String? = null,
    @JsonApiAttribute("finishedAt")
    private var _finishedAt: String? = null,
    createdAt: String? = null,
    updatedAt: String? = null,

    user: User? = null,
    manga: Manga? = null,
) : JsonApiResource, AppAdapter.Item {

    var isAdd by JsonApiProperty(isAdd)
    var isFavorites by JsonApiProperty(isFavorites)
    var status by JsonApiProperty(Status.entries.find { it.key == status } ?: Status.READING)
    var volumesRead by JsonApiProperty(volumesRead)
    var chaptersRead by JsonApiProperty(chaptersRead)
    var rating by JsonApiProperty<Int?>(rating)
    var startedAt = _startedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
        set(value) {
            field = value
            _startedAt = value?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
            dirtyProperties.add(MangaEntry::_startedAt)
        }
    var finishedAt = _finishedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
        set(value) {
            field = value
            _finishedAt = value?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
            dirtyProperties.add(MangaEntry::_finishedAt)
        }
    val createdAt = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")

    var user by JsonApiProperty(user)
    var manga by JsonApiProperty(manga)


    fun getProgress(manga: Manga): Int {
        val volumesProgress = ((volumesRead.toDouble() / manga.volumeCount) * 100).toInt()
        val chaptersProgress = ((chaptersRead.toDouble() / manga.chapterCount) * 100).toInt()

        return when {
            volumesProgress - chaptersProgress in 1..5 -> chaptersProgress
            chaptersProgress - volumesProgress in 1..5 -> volumesProgress
            else -> max(volumesProgress, chaptersProgress)
        }
    }

    fun getProgressColor(manga: Manga): Int =
        when (status) {
            Status.READING -> {
                if (getProgress(manga) < 100) R.color.mangaEntryStatusReading_color
                else R.color.mangaEntryStatusReadingFinished_color
            }

            Status.COMPLETED -> R.color.mangaEntryStatusCompleted_color
            Status.PLANNED -> R.color.mangaEntryStatusPlanned_color
            Status.ON_HOLD -> R.color.mangaEntryStatusOnHold_color
            Status.DROPPED -> R.color.mangaEntryStatusDropped_color
        }


    enum class Status(val key: String, val stringId: Int, val colorId: Int) {
        READING("reading", R.string.mangaEntryStatusReading, R.color.mangaEntryStatusReading_color),
        COMPLETED(
            "completed",
            R.string.mangaEntryStatusCompleted,
            R.color.mangaEntryStatusCompleted_color
        ),
        PLANNED("planned", R.string.mangaEntryStatusPlanned, R.color.mangaEntryStatusPlanned_color),
        ON_HOLD("on_hold", R.string.mangaEntryStatusOnHold, R.color.mangaEntryStatusOnHold_color),
        DROPPED("dropped", R.string.mangaEntryStatusDropped, R.color.mangaEntryStatusDropped_color);

        override fun toString(): String = this.key
    }


    override val dirtyProperties: MutableList<KProperty<*>> = mutableListOf()
    override lateinit var itemType: AppAdapter.Type

    fun copy(
        id: String? = this.id,
        isAdd: Boolean = this.isAdd,
        isFavorites: Boolean = this.isFavorites,
        status: String = this.status.key,
        volumesRead: Int = this.volumesRead,
        chaptersRead: Int = this.chaptersRead,
        rating: Int? = this.rating,
        startedAt: String? = this.startedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        finishedAt: String? = this.finishedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        createdAt: String? = this.createdAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        updatedAt: String? = this.updatedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        user: User? = this.user,
        manga: Manga? = this.manga,
    ) = MangaEntry(
        id = id,
        isAdd = isAdd,
        isFavorites = isFavorites,
        status = status,
        volumesRead = volumesRead,
        chaptersRead = chaptersRead,
        rating = rating,
        _startedAt = startedAt,
        _finishedAt = finishedAt,
        createdAt = createdAt,
        updatedAt = updatedAt,
        user = user,
        manga = manga,
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as MangaEntry

        if (id != other.id) return false
        if (_startedAt != other._startedAt) return false
        if (_finishedAt != other._finishedAt) return false
        if (startedAt != other.startedAt) return false
        if (finishedAt != other.finishedAt) return false
        if (createdAt != other.createdAt) return false
        if (updatedAt != other.updatedAt) return false
        if (dirtyProperties != other.dirtyProperties) return false
        if (itemType != other.itemType) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id?.hashCode() ?: 0
        result = 31 * result + (_startedAt?.hashCode() ?: 0)
        result = 31 * result + (_finishedAt?.hashCode() ?: 0)
        result = 31 * result + (startedAt?.hashCode() ?: 0)
        result = 31 * result + (finishedAt?.hashCode() ?: 0)
        result = 31 * result + (createdAt?.hashCode() ?: 0)
        result = 31 * result + (updatedAt?.hashCode() ?: 0)
        result = 31 * result + dirtyProperties.hashCode()
        result = 31 * result + itemType.hashCode()
        return result
    }
}