package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar

@JsonApiType("staff")
class Staff(
    val id: String,

    role: String = "",
    createdAt: String? = null,
    updatedAt: String? = null,

    val people: People? = null,
    val manga: Manga? = null,
    val anime: Anime? = null,
) : AppAdapter.Item {

    val role = Role.entries.find { it.key == role }
    val createdAt = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")


    enum class Role(val key: String, val stringId: Int) {
        AUTHOR("author", R.string.staffRoleAuthor),
        ILLUSTRATOR("illustrator", R.string.staffRoleIllustrator),
        STORY_AND_ART("story_and_art", R.string.staffRoleStoryAndArt),
        LICENSOR("licensor", R.string.staffRoleLicensor),
        PRODUCER("producer", R.string.staffRoleProducer),
        STUDIO("studio", R.string.staffRoleStudio),
        ORIGINAL_CREATOR("original_creator", R.string.staffRoleOriginalCreator),
    }


    override lateinit var itemType: AppAdapter.Type

    fun copy(
        id: String = this.id,
        role: String = this.role?.key ?: "",
        createdAt: String? = this.createdAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        updatedAt: String? = this.updatedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        people: People? = this.people,
        manga: Manga? = this.manga,
        anime: Anime? = this.anime,
    ) = Staff(
        id = id,
        role = role,
        createdAt = createdAt,
        updatedAt = updatedAt,
        people = people,
        manga = manga,
        anime = anime,
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Staff

        if (id != other.id) return false
        if (people != other.people) return false
        if (manga != other.manga) return false
        if (anime != other.anime) return false
        if (role != other.role) return false
        if (createdAt != other.createdAt) return false
        if (updatedAt != other.updatedAt) return false
        if (itemType != other.itemType) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + (people?.hashCode() ?: 0)
        result = 31 * result + (manga?.hashCode() ?: 0)
        result = 31 * result + (anime?.hashCode() ?: 0)
        result = 31 * result + (role?.hashCode() ?: 0)
        result = 31 * result + (createdAt?.hashCode() ?: 0)
        result = 31 * result + (updatedAt?.hashCode() ?: 0)
        result = 31 * result + itemType.hashCode()
        return result
    }
}