package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.MangaJapAdapter

@JsonApiType("franchises")
class Franchise(
        override var id: String = "",
        var createdAt: String? = null,
        var updatedAt: String? = null,
        role: String = "",

        var source: MangaJapAdapter.Item? = null,
        var destination: MangaJapAdapter.Item? = null,
) : JsonApiResource(), MangaJapAdapter.Item {

    var role: Role? = Role.getByName(role)


    override lateinit var typeLayout: MangaJapAdapter.Type

    
    enum class Role(val stringId: Int) {
        adaptation(R.string.franchiseRoleAdaptation),
        alternative_setting(R.string.franchiseRoleAlternativeSetting),
        alternative_version(R.string.franchiseRoleAlternativeVersion),
        character(R.string.franchiseRoleCharacter),
        full_story(R.string.franchiseRoleFullStory),
        original_adaptation(R.string.franchiseRoleOriginalAdaptation),
        other(R.string.franchiseRoleOther),
        parent_story(R.string.franchiseRoleParentStory),
        prequel(R.string.franchiseRolePrequel),
        sequel(R.string.franchiseRoleSequel),
        side_story(R.string.franchiseRoleSideStory),
        spinoff(R.string.franchiseRoleSpinoff),
        summary(R.string.franchiseRoleSummary);

        companion object {
            fun getByName(name: String): Role? = try {
                valueOf(name)
            } catch (e: Exception) {
                null
            }
        }
    }
}