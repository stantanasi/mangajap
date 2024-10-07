package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiAttribute
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar

@JsonApiType("follows")
class Follow(
    var id: String? = null,

    @JsonApiAttribute("createdAt", true)
    createdAt: String? = null,
    @JsonApiAttribute("updatedAt", true)
    updatedAt: String? = null,

    var follower: User? = null,
    var followed: User? = null,
) : AppAdapter.Item {

    val createdAt = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")


    override lateinit var itemType: AppAdapter.Type

    fun copy(
        id: String? = this.id,
        createdAt: String? = this.createdAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        updatedAt: String? = this.updatedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        follower: User? = this.follower,
        followed: User? = this.followed,
    ) = Follow(
        id = id,
        createdAt = createdAt,
        updatedAt = updatedAt,
        follower = follower,
        followed = followed,
    )


    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Follow

        if (id != other.id) return false
        if (follower != other.follower) return false
        if (followed != other.followed) return false
        if (createdAt != other.createdAt) return false
        if (updatedAt != other.updatedAt) return false
        if (itemType != other.itemType) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id?.hashCode() ?: 0
        result = 31 * result + (follower?.hashCode() ?: 0)
        result = 31 * result + (followed?.hashCode() ?: 0)
        result = 31 * result + (createdAt?.hashCode() ?: 0)
        result = 31 * result + (updatedAt?.hashCode() ?: 0)
        result = 31 * result + itemType.hashCode()
        return result
    }
}