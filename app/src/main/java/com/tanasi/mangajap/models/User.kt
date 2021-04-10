package com.tanasi.mangajap.models

import com.tanasi.mangajap.R
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar
import com.tanasi.mangajap.utils.jsonApi.JsonApi
import com.tanasi.mangajap.utils.jsonApi.JsonApiAttribute
import com.tanasi.mangajap.utils.jsonApi.JsonApiRelationships
import com.tanasi.mangajap.utils.jsonApi.JsonApiResource
import org.json.JSONObject
import java.util.*

@JsonApi("users")
class User(
        override var id: String = "",
        var createdAt: String? = null,
        var updatedAt: String? = null,
        var pseudo: String = "",
        var slug: String = "",
        var about: String = "",
        var isAdmin: Boolean = false,
        var isPremium: Boolean = false,
        var followersCount: Long = 0,
        var followingCount: Long = 0,
        var followedMangaCount: Long = 0,
        @JsonApiAttribute("volumesRead") var mangaVolumeRead: Long = 0,
        @JsonApiAttribute("chaptersRead") var mangaChapterRead: Long = 0,
        var followedAnimeCount: Long = 0,
        @JsonApiAttribute("episodesWatch") var animeEpisodeWatch: Long = 0,
        var timeSpentOnAnime: Long = 0,
        var firstName: String? = null,
        var lastName: String? = null,
        birthday: String? = null,
        gender: String? = "",
        var country: String? = null,
        avatar: JSONObject? = null,
        var email: String? = null,

        var followers: List<Follow> = listOf(),
        var following: List<Follow> = listOf(),
        @JsonApiRelationships("manga-library") var mangaLibrary: List<MangaEntry> = listOf(),
        @JsonApiRelationships("anime-library") var animeLibrary: List<AnimeEntry> = listOf(),
        @JsonApiRelationships("manga-favorites") var mangaFavorites: List<MangaEntry> = listOf(),
        @JsonApiRelationships("anime-favorites") var animeFavorites: List<AnimeEntry> = listOf(),
        var reviews: List<Review> = listOf(),
        var requests: List<Request> = listOf(),
) : JsonApiResource() {

    val birthday: Calendar? = birthday?.toCalendar("yyyy-MM-dd")
    var gender: Gender? = Gender.getByName(gender)
    var avatar: Avatar? = Avatar.create(avatar)

    enum class Gender(val stringId: Int) {
        men(R.string.genderMen),
        women(R.string.genderWomen),
        other(R.string.genderOther);

        companion object {
            fun getByName(name: String?): Gender? = try {
                valueOf(name!!)
            } catch (e: Exception) {
                null
            }
        }
    }

    data class Avatar(
            val tiny: String,
            val small: String,
            val medium: String,
            val large: String,
            val original: String
    ) {
        companion object {
            fun create(avatar: JSONObject?): Avatar? = avatar?.let {
                Avatar(
                        avatar.optString("tiny"),
                        avatar.optString("small"),
                        avatar.optString("medium"),
                        avatar.optString("large"),
                        avatar.optString("original")
                )
            }
        }
    }


    fun putPseudo(pseudo: String) = putAttribute("pseudo", pseudo)

    fun putAbout(about: String?) = putAttribute("about", about)

    fun putFirstName(firstName: String?) = putAttribute("firstName", firstName)

    fun putLastName(lastName: String?) = putAttribute("lastName", lastName)

    fun putBirthday(birthday: Calendar?) = putAttribute("birthday", birthday?.format("yyyy-MM-dd"))

    fun putGender(gender: Gender?) = putAttribute("gender", gender?.name)

    fun putCountry(country: String?) = putAttribute("country", country)

    fun putAvatar(avatar: String?) = putAttribute("avatar", avatar)

    fun putEmail(email: String?) = putAttribute("email", email)

    fun putPassword(password: String?) = putAttribute("password", password)
}