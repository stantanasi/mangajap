package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.utils.extensions.toCalendar
import java.util.*

@JsonApiType("staff")
class Staff(
    val id: String,

    createdAt: String? = null,
    updatedAt: String? = null,
    role: String = "",

    val people: People? = null,
    val manga: Manga? = null,
    val anime: Anime? = null,
) : MangaJapAdapter.Item {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val role: Role? = Role.getByName(role)


    enum class Role(val stringId: Int) {
        author(R.string.staffRoleAuthor),
        illustrator(R.string.staffRoleIllustrator),
        story_and_art(R.string.staffRoleStoryAndArt),
        licensor(R.string.staffRoleLicensor),
        producer(R.string.staffRoleProducer),
        studio(R.string.staffRoleStudio),
        original_creator(R.string.staffRoleOriginalCreator);

        companion object {
            fun getByName(name: String): Role? = try {
                valueOf(name)
            } catch (e: Exception) {
                null
            }
        }
    }


    override lateinit var typeLayout: MangaJapAdapter.Type
}