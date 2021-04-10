package com.tanasi.mangajap.models

import com.tanasi.mangajap.utils.jsonApi.JsonApi
import com.tanasi.mangajap.utils.jsonApi.JsonApiResource

@JsonApi("follows")
class Follow(
        override var id: String ="",
        var createdAt: String? = null,
        var updatedAt: String? = null,

        var follower: User? = null,
        var followed: User? = null,
) : JsonApiResource() {

    fun putFollower(follower: User) = putRelationship("follower", follower)

    fun putFollowed(followed: User) = putRelationship("followed", followed)
}