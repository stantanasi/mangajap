package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar
import java.util.*

@JsonApiType("animeEntries")
class AnimeEntry(
    override var id: String = "",
    createdAt: String? = null,
    updatedAt: String? = null,
    var isAdd: Boolean = false,
    var isFavorites: Boolean = false,
    status: String = "",
    var episodesWatch: Int = 0,
    startedAt: String? = null,
    finishedAt: String? = null,
    var rating: Int? = null,
    var rewatchCount: Int = 0,

    var user: User? = null,
    var anime: Anime? = null,
) : JsonApiResource(), MangaJapAdapter.Item {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    var status: Status = Status.getByName(status)
    val startedAt: Calendar? = startedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val finishedAt: Calendar? = finishedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")

    enum class Status(val stringId: Int, val colorId: Int) {
        watching(R.string.animeEntryStatusWatching, R.color.animeEntryStatusWatching_color),
        completed(R.string.animeEntryStatusCompleted, R.color.animeEntryStatusCompleted_color),
        planned(R.string.animeEntryStatusPlanned, R.color.animeEntryStatusPlanned_color),
        on_hold(R.string.animeEntryStatusOnHold, R.color.animeEntryStatusOnHold_color),
        dropped(R.string.animeEntryStatusDropped, R.color.animeEntryStatusDropped_color);

        companion object {
            fun getByName(name: String): Status = try {
                valueOf(name)
            } catch (e: Exception) {
                watching
            }
        }
    }

    fun getProgress(anime: Anime): Int =
        ((episodesWatch.toDouble() / (anime.episodeCount ?: 1)) * 100).toInt()

    fun getProgressColor(anime: Anime): Int =
        when (status) {
            Status.watching -> {
                if (getProgress(anime) < 100) R.color.animeEntryStatusWatching_color
                else R.color.animeEntryStatusWatchingFinished_color
            }
            Status.completed -> R.color.animeEntryStatusCompleted_color
            Status.planned -> R.color.animeEntryStatusPlanned_color
            Status.on_hold -> R.color.animeEntryStatusOnHold_color
            Status.dropped -> R.color.animeEntryStatusDropped_color
        }


    fun putAdd(isAdd: Boolean) = putAttribute("isAdd", isAdd)

    fun putFavorites(isFavorites: Boolean) = putAttribute("isFavorites", isFavorites)

    fun putStatus(status: Status) = putAttribute("status", status.name)

    fun putEpisodesWatch(episodesWatch: Int) = putAttribute("episodesWatch", episodesWatch)

    fun putStartedAt(startedAt: Calendar?) =
        putAttribute("startedAt", startedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"))

    fun putFinishedAt(finishedAt: Calendar?) =
        putAttribute("finishedAt", finishedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"))

    fun putRating(rating: Int?) = putAttribute("rating", rating)

    fun putRewatchCount(rewatchCount: Int) = putAttribute("rewatchCount", rewatchCount)

    fun putUser(user: User) = putRelationship("user", user)

    fun putAnime(anime: Anime) = putRelationship("anime", anime)


    override lateinit var typeLayout: MangaJapAdapter.Type
}