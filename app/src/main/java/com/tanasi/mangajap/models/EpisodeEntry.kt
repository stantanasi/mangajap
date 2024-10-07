package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiAttribute
import com.tanasi.jsonapi.JsonApiProperty
import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar
import kotlin.reflect.KProperty

@JsonApiType("episode-entries")
class EpisodeEntry(
    var id: String? = null,

    @JsonApiAttribute("watchedDate")
    private var _watchedDate: String? = null,
    watchedCount: Int = 0,
    rating: Int? = null,
    createdAt: String? = null,
    updatedAt: String? = null,

    user: User? = null,
    episode: Episode? = null,
) : JsonApiResource, AppAdapter.Item {

    var watchedDate = _watchedDate?.toCalendar("yyyy-MM-dd")
        set(value) {
            field = value
            _watchedDate = value?.format("yyyy-MM-dd")
            dirtyProperties.add(EpisodeEntry::_watchedDate)
        }
    var watchedCount by JsonApiProperty(watchedCount)
    var rating by JsonApiProperty(rating)
    val createdAt = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")

    var user by JsonApiProperty(user)
    var episode by JsonApiProperty(episode)

    override val dirtyProperties: MutableList<KProperty<*>> = mutableListOf()
    override lateinit var itemType: AppAdapter.Type

    fun copy(
        id: String? = this.id,
        watchedDate: String? = this.watchedDate?.format("yyyy-MM-dd"),
        watchedCount: Int = this.watchedCount,
        rating: Int? = this.rating,
        createdAt: String? = this.createdAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        updatedAt: String? = this.updatedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        user: User? = this.user,
        episode: Episode? = this.episode,
    ) = EpisodeEntry(
        id = id,
        _watchedDate = watchedDate,
        watchedCount = watchedCount,
        rating = rating,
        createdAt = createdAt,
        updatedAt = updatedAt,
        user = user,
        episode = episode,
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as EpisodeEntry

        if (id != other.id) return false
        if (_watchedDate != other._watchedDate) return false
        if (watchedDate != other.watchedDate) return false
        if (createdAt != other.createdAt) return false
        if (updatedAt != other.updatedAt) return false
        if (dirtyProperties != other.dirtyProperties) return false
        if (itemType != other.itemType) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id?.hashCode() ?: 0
        result = 31 * result + (_watchedDate?.hashCode() ?: 0)
        result = 31 * result + (watchedDate?.hashCode() ?: 0)
        result = 31 * result + (createdAt?.hashCode() ?: 0)
        result = 31 * result + (updatedAt?.hashCode() ?: 0)
        result = 31 * result + dirtyProperties.hashCode()
        result = 31 * result + itemType.hashCode()
        return result
    }
}