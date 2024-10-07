package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiAttribute
import com.tanasi.jsonapi.JsonApiProperty
import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar
import java.util.*
import kotlin.math.max
import kotlin.reflect.KProperty

@JsonApiType("manga-entries")
class MangaEntry(
    var id: String? = null,

    createdAt: String? = null,
    updatedAt: String? = null,
    isAdd: Boolean = false,
    isFavorites: Boolean = false,
    status: String = "",
    volumesRead: Int = 0,
    chaptersRead: Int = 0,
    rating: Int? = null,
    @JsonApiAttribute("startedAt") private var _startedAt: String? = null,
    @JsonApiAttribute("finishedAt") private var _finishedAt: String? = null,

    user: User? = null,
    manga: Manga? = null,
) : JsonApiResource, AppAdapter.Item {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    var isAdd: Boolean by JsonApiProperty(isAdd)
    var isFavorites: Boolean by JsonApiProperty(isFavorites)
    var status: Status by JsonApiProperty(Status.getByName(status))
    var volumesRead: Int by JsonApiProperty(volumesRead)
    var chaptersRead: Int by JsonApiProperty(chaptersRead)
    var startedAt: Calendar? = _startedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
        set(value) {
            field = value
            _startedAt = value?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
            dirtyProperties.add(MangaEntry::_startedAt)
        }
    var finishedAt: Calendar? = _finishedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
        set(value) {
            field = value
            _finishedAt = value?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
            dirtyProperties.add(MangaEntry::_finishedAt)
        }
    var rating: Int? by JsonApiProperty(rating)

    var user: User? by JsonApiProperty(user)
    var manga: Manga? by JsonApiProperty(manga)


    enum class Status(val stringId: Int, val colorId: Int) {
        reading(R.string.mangaEntryStatusReading, R.color.mangaEntryStatusReading_color),
        completed(R.string.mangaEntryStatusCompleted, R.color.mangaEntryStatusCompleted_color),
        planned(R.string.mangaEntryStatusPlanned, R.color.mangaEntryStatusPlanned_color),
        on_hold(R.string.mangaEntryStatusOnHold, R.color.mangaEntryStatusOnHold_color),
        dropped(R.string.mangaEntryStatusDropped, R.color.mangaEntryStatusDropped_color);

        companion object {
            fun getByName(name: String): Status = try {
                valueOf(name)
            } catch (e: Exception) {
                reading
            }
        }

        override fun toString(): String = this.name
    }


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
            Status.reading -> {
                if (getProgress(manga) < 100) R.color.mangaEntryStatusReading_color
                else R.color.mangaEntryStatusReadingFinished_color
            }
            Status.completed -> R.color.mangaEntryStatusCompleted_color
            Status.planned -> R.color.mangaEntryStatusPlanned_color
            Status.on_hold -> R.color.mangaEntryStatusOnHold_color
            Status.dropped -> R.color.mangaEntryStatusDropped_color
        }


    override val dirtyProperties: MutableList<KProperty<*>> = mutableListOf()
    override lateinit var typeLayout: AppAdapter.Type
}