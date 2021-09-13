package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar
import java.util.*
import kotlin.math.max

@JsonApiType("mangaEntries")
class MangaEntry(
    override var id: String = "",
    createdAt: String? = null,
    updatedAt: String? = null,
    var isAdd: Boolean = false,
    var isFavorites: Boolean = false,
    var isPrivate: Boolean = false,
    status: String = "",
    var volumesRead: Int = 0,
    var chaptersRead: Int = 0,
    startedAt: String? = null,
    finishedAt: String? = null,
    var rating: Int? = null,
    var rereadCount: Int = 0,

    var user: User? = null,
    var manga: Manga? = null,
) : JsonApiResource(), MangaJapAdapter.Item {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val status: Status = Status.getByName(status)
    val startedAt: Calendar? = startedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val finishedAt: Calendar? = finishedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")

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
    }


    fun getProgress(manga: Manga): Int {
        val volumesProgress = ((volumesRead.toDouble() / (manga.volumeCount ?: 1)) * 100).toInt()
        val chaptersProgress = ((chaptersRead.toDouble() / (manga.chapterCount ?: 1)) * 100).toInt()

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

    fun putAdd(isAdd: Boolean) = putAttribute("isAdd", isAdd)

    fun putFavorites(isFavorites: Boolean) = putAttribute("isFavorites", isFavorites)

    fun putPrivate(isPrivate: Boolean) = putAttribute("isPrivate", isPrivate)

    fun putStartedAt(startedAt: Calendar?) =
        putAttribute("startedAt", startedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"))

    fun putFinishedAt(finishedAt: Calendar?) =
        putAttribute("finishedAt", finishedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"))

    fun putStatus(status: Status) = putAttribute("status", status.name)

    fun putVolumesRead(volumesRead: Int) = putAttribute("volumesRead", volumesRead)

    fun putChaptersRead(chaptersRead: Int) = putAttribute("chaptersRead", chaptersRead)

    fun putRating(rating: Int?) = putAttribute("rating", rating)

    fun putRereadCount(rereadCount: Int) = putAttribute("rereadCount", rereadCount)

    fun putUser(user: User) = putRelationship("user", user)

    fun putManga(manga: Manga) = putRelationship("manga", manga)


    override lateinit var typeLayout: MangaJapAdapter.Type
}