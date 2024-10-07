package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiProperty
import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar
import kotlin.reflect.KProperty

@JsonApiType("requests")
class Request(
    var id: String? = null,

    requestType: String = "",
    data: String = "",
    isDone: Boolean = false,
    userHasRead: Boolean = false,
    createdAt: String? = null,
    updatedAt: String? = null,

    user: User? = null,
) : JsonApiResource, AppAdapter.Item {

    var requestType by JsonApiProperty(RequestType.entries.find { it.key == requestType }
        ?: RequestType.MANGA)
    var data by JsonApiProperty(data)
    var isDone by JsonApiProperty(isDone)
    var userHasRead by JsonApiProperty(userHasRead)
    val createdAt = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")

    var user: User? by JsonApiProperty(user)


    enum class RequestType(val key: String, val stringId: Int) {
        MANGA("manga", R.string.manga),
        ANIME("anime", R.string.anime);

        override fun toString(): String = this.key
    }


    override val dirtyProperties: MutableList<KProperty<*>> = mutableListOf()
    override lateinit var itemType: AppAdapter.Type

    fun copy(
        id: String? = this.id,
        requestType: String = this.requestType.key,
        data: String = this.data,
        isDone: Boolean = this.isDone,
        userHasRead: Boolean = this.userHasRead,
        createdAt: String? = this.createdAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        updatedAt: String? = this.updatedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        user: User? = this.user,
    ) = Request(
        id = id,
        requestType = requestType,
        data = data,
        isDone = isDone,
        userHasRead = userHasRead,
        createdAt = createdAt,
        updatedAt = updatedAt,
        user = user,
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Request

        if (id != other.id) return false
        if (createdAt != other.createdAt) return false
        if (updatedAt != other.updatedAt) return false
        if (dirtyProperties != other.dirtyProperties) return false
        if (itemType != other.itemType) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id?.hashCode() ?: 0
        result = 31 * result + (createdAt?.hashCode() ?: 0)
        result = 31 * result + (updatedAt?.hashCode() ?: 0)
        result = 31 * result + dirtyProperties.hashCode()
        result = 31 * result + itemType.hashCode()
        return result
    }
}