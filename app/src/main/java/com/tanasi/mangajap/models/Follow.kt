package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.adapters.MangaJapAdapter

@JsonApiType("follows")
class Follow(
        override var id: String ="",
        var createdAt: String? = null,
        var updatedAt: String? = null,

        var follower: User? = null,
        var followed: User? = null,
) : JsonApiResource(), MangaJapAdapter.Item {

    fun putFollower(follower: User) = putRelationship("follower", follower)

    fun putFollowed(followed: User) = putRelationship("followed", followed)

    override lateinit var typeLayout: MangaJapAdapter.Type
}