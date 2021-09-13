package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.utils.extensions.toCalendar
import java.util.*

@JsonApiType("follows")
class Follow(
    override var id: String = "",
    createdAt: String? = null,
    updatedAt: String? = null,

    var follower: User? = null,
    var followed: User? = null,
) : JsonApiResource(), MangaJapAdapter.Item {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")

    fun putFollower(follower: User) = putRelationship("follower", follower)

    fun putFollowed(followed: User) = putRelationship("followed", followed)

    override lateinit var typeLayout: MangaJapAdapter.Type
}