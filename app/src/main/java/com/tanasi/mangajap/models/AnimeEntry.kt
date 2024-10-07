package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiAttribute
import com.tanasi.jsonapi.JsonApiProperty
import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar
import kotlin.reflect.KProperty

@JsonApiType("anime-entries")
class AnimeEntry(
    var id: String? = null,

    isAdd: Boolean = false,
    isFavorites: Boolean = false,
    status: String = "",
    episodesWatch: Int = 0,
    rating: Int? = null,
    @JsonApiAttribute("startedAt")
    private var _startedAt: String? = null,
    @JsonApiAttribute("finishedAt")
    private var _finishedAt: String? = null,
    createdAt: String? = null,
    updatedAt: String? = null,

    user: User? = null,
    anime: Anime? = null,
) : JsonApiResource, AppAdapter.Item {

    var isAdd by JsonApiProperty(isAdd)
    var isFavorites by JsonApiProperty(isFavorites)
    var status by JsonApiProperty(Status.entries.find { it.key == status } ?: Status.WATCHING)
    var episodesWatch by JsonApiProperty(episodesWatch)
    var rating by JsonApiProperty<Int?>(rating)
    var startedAt = _startedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
        set(value) {
            field = value
            _startedAt = value?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
            dirtyProperties.add(AnimeEntry::_startedAt)
        }
    var finishedAt = _finishedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
        set(value) {
            field = value
            _finishedAt = value?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
            dirtyProperties.add(AnimeEntry::_finishedAt)
        }
    val createdAt = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")

    var user by JsonApiProperty(user)
    var anime by JsonApiProperty(anime)


    fun getProgress(anime: Anime): Int =
        ((episodesWatch.toDouble() / anime.episodeCount) * 100).toInt()

    fun getProgressColor(anime: Anime): Int =
        when (status) {
            Status.WATCHING -> {
                if (getProgress(anime) < 100) R.color.animeEntryStatusWatching_color
                else R.color.animeEntryStatusWatchingFinished_color
            }

            Status.COMPLETED -> R.color.animeEntryStatusCompleted_color
            Status.PLANNED -> R.color.animeEntryStatusPlanned_color
            Status.ON_HOLD -> R.color.animeEntryStatusOnHold_color
            Status.DROPPED -> R.color.animeEntryStatusDropped_color
        }


    enum class Status(val key: String, val stringId: Int, val colorId: Int) {
        WATCHING(
            "watching",
            R.string.animeEntryStatusWatching,
            R.color.animeEntryStatusWatching_color
        ),
        COMPLETED(
            "completed",
            R.string.animeEntryStatusCompleted,
            R.color.animeEntryStatusCompleted_color
        ),
        PLANNED("planned", R.string.animeEntryStatusPlanned, R.color.animeEntryStatusPlanned_color),
        ON_HOLD("on_hold", R.string.animeEntryStatusOnHold, R.color.animeEntryStatusOnHold_color),
        DROPPED("dropped", R.string.animeEntryStatusDropped, R.color.animeEntryStatusDropped_color);

        override fun toString(): String = this.key
    }


    override val dirtyProperties: MutableList<KProperty<*>> = mutableListOf()
    override lateinit var itemType: AppAdapter.Type

    fun copy(
        id: String? = this.id,
        isAdd: Boolean = this.isAdd,
        isFavorites: Boolean = this.isFavorites,
        status: String = this.status.key,
        episodesWatch: Int = this.episodesWatch,
        rating: Int? = this.rating,
        startedAt: String? = this.startedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        finishedAt: String? = this.finishedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        createdAt: String? = this.createdAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        updatedAt: String? = this.updatedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        user: User? = this.user,
        anime: Anime? = this.anime,
    ) = AnimeEntry(
        id = id,
        isAdd = isAdd,
        isFavorites = isFavorites,
        status = status,
        episodesWatch = episodesWatch,
        rating = rating,
        _startedAt = startedAt,
        _finishedAt = finishedAt,
        createdAt = createdAt,
        updatedAt = updatedAt,
        user = user,
        anime = anime
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as AnimeEntry

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