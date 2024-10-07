package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar

@JsonApiType("franchises")
class Franchise(
    val id: String,

    role: String = "",
    createdAt: String? = null,
    updatedAt: String? = null,

    val source: Media? = null,
    val destination: Media? = null,
) : AppAdapter.Item {

    val role = Role.entries.find { it.key == role } ?: Role.ADAPTATION
    val createdAt = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")


    enum class Role(val key: String, val stringId: Int) {
        ADAPTATION("adaptation", R.string.franchiseRoleAdaptation),
        ALTERNATIVE_SETTING("alternative_setting", R.string.franchiseRoleAlternativeSetting),
        ALTERNATIVE_VERSION("alternative_version", R.string.franchiseRoleAlternativeVersion),
        CHARACTER("character", R.string.franchiseRoleCharacter),
        FULL_STORY("full_story", R.string.franchiseRoleFullStory),
        ORIGINAL_ADAPTATION("original_adaptation", R.string.franchiseRoleOriginalAdaptation),
        OTHER("other", R.string.franchiseRoleOther),
        PARENT_STORY("parent_story", R.string.franchiseRoleParentStory),
        PREQUEL("prequel", R.string.franchiseRolePrequel),
        SEQUEL("sequel", R.string.franchiseRoleSequel),
        SIDE_STORY("side_story", R.string.franchiseRoleSideStory),
        SPINOFF("spinoff", R.string.franchiseRoleSpinoff),
        SUMMARY("summary", R.string.franchiseRoleSummary),
    }


    override var itemType: AppAdapter.Type = AppAdapter.Type.FRANCHISE_ITEM

    fun copy(
        id: String = this.id,
        role: String = this.role.key,
        createdAt: String? = this.createdAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        updatedAt: String? = this.updatedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        source: Media? = this.source,
        destination: Media? = this.destination,
    ) = Franchise(
        id = id,
        role = role,
        createdAt = createdAt,
        updatedAt = updatedAt,
        source = source,
        destination = destination,
    )


    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Franchise

        if (id != other.id) return false
        if (source != other.source) return false
        if (destination != other.destination) return false
        if (role != other.role) return false
        if (createdAt != other.createdAt) return false
        if (updatedAt != other.updatedAt) return false
        if (itemType != other.itemType) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + (source?.hashCode() ?: 0)
        result = 31 * result + (destination?.hashCode() ?: 0)
        result = 31 * result + role.hashCode()
        result = 31 * result + (createdAt?.hashCode() ?: 0)
        result = 31 * result + (updatedAt?.hashCode() ?: 0)
        result = 31 * result + itemType.hashCode()
        return result
    }
}