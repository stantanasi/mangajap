package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.utils.extensions.toCalendar
import java.util.*

@JsonApiType("franchises")
class Franchise(
    val id: String,

    createdAt: String? = null,
    updatedAt: String? = null,
    role: String = "",

    val source: Media? = null,
    val destination: Media? = null,
) : MangaJapAdapter.Item {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val role: Role = Role.getByName(role)


    override var typeLayout: MangaJapAdapter.Type = MangaJapAdapter.Type.FRANCHISE


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
            fun getByName(name: String): Role = try {
                valueOf(name)
            } catch (e: Exception) {
                adaptation
            }
        }
    }
}