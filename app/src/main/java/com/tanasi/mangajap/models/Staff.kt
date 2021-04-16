package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.MangaJapAdapter

@JsonApiType("staff")
class Staff(
        override var id: String = "",
        var createdAt: String? = null,
        var updatedAt: String? = null,
        role: String = "",

        var people: People? = null,
        var manga: Manga? = null,
        var anime: Anime? = null,
) : JsonApiResource(), MangaJapAdapter.Item {

    var role: Role? = Role.getByName(role)
    
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