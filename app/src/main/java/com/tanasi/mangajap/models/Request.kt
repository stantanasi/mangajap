package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiAttribute
import com.tanasi.jsonapi.JsonApiProperty
import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.utils.extensions.toCalendar
import java.util.*
import kotlin.reflect.KProperty

@JsonApiType("requests")
class Request(
    var id: String? = null,

    createdAt: String? = null,
    updatedAt: String? = null,
    requestType: String = "",
    data: String = "",
    isDone: Boolean = false,
    userHasRead: Boolean = false,

    user: User? = null,
) : JsonApiResource, MangaJapAdapter.Item {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    var requestType: RequestType by JsonApiProperty(RequestType.getByName(requestType))
    var data: String by JsonApiProperty(data)
    var isDone: Boolean by JsonApiProperty(isDone)
    var userHasRead: Boolean by JsonApiProperty(userHasRead)

    var user: User? by JsonApiProperty(user)


    enum class RequestType(val stringId: Int) {
        manga(R.string.manga),
        anime(R.string.anime);

        companion object {
            fun getByName(name: String): RequestType = try {
                valueOf(name)
            } catch (e: Exception) {
                manga
            }
        }

        override fun toString(): String = this.name
    }


    override val dirtyProperties: MutableList<KProperty<*>> = mutableListOf()
    override lateinit var typeLayout: MangaJapAdapter.Type
}