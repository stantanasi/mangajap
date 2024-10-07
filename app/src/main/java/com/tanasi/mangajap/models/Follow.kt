package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiAttribute
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.toCalendar
import java.util.*

@JsonApiType("follows")
class Follow(
    var id: String? = null,

    @JsonApiAttribute("createdAt", true) createdAt: String? = null,
    @JsonApiAttribute("updatedAt", true) updatedAt: String? = null,

    var follower: User? = null,
    var followed: User? = null,
) : AppAdapter.Item {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")


    override lateinit var itemType: AppAdapter.Type
}