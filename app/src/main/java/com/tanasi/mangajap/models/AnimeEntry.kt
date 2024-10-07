package com.tanasi.mangajap.models

import com.tanasi.jsonapi.*
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar
import java.util.*
import kotlin.reflect.KProperty

@JsonApiType("anime-entries")
class AnimeEntry(
    var id: String? = null,

    createdAt: String? = null,
    updatedAt: String? = null,
    isAdd: Boolean = false,
    isFavorites: Boolean = false,
    status: String = "",
    episodesWatch: Int = 0,
    @JsonApiAttribute("startedAt") private var _startedAt: String? = null,
    @JsonApiAttribute("finishedAt") private var _finishedAt: String? = null,
    rating: Int? = null,

    user: User? = null,
    anime: Anime? = null,
) : JsonApiResource, AppAdapter.Item {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    var isAdd: Boolean by JsonApiProperty(isAdd)
    var isFavorites: Boolean by JsonApiProperty(isFavorites)
    var status: Status by JsonApiProperty(Status.getByName(status))
    var episodesWatch: Int by JsonApiProperty(episodesWatch)
    var startedAt: Calendar? = _startedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
        set(value) {
            field = value
            _startedAt = value?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
            dirtyProperties.add(AnimeEntry::_startedAt)
        }
    var finishedAt: Calendar? = _finishedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
        set(value) {
            field = value
            _finishedAt = value?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
            dirtyProperties.add(AnimeEntry::_finishedAt)
        }
    var rating: Int? by JsonApiProperty(rating)

    var user: User? by JsonApiProperty(user)
    var anime: Anime? by JsonApiProperty(anime)


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

        override fun toString(): String = this.name
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


    override val dirtyProperties: MutableList<KProperty<*>> = mutableListOf()
    override lateinit var typeLayout: AppAdapter.Type
}