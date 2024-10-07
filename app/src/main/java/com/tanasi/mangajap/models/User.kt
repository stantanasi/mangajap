package com.tanasi.mangajap.models

import com.tanasi.jsonapi.*
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar
import org.json.JSONObject
import java.util.*
import kotlin.reflect.KProperty

@JsonApiType("users")
class User(
    var id: String?,

    createdAt: String? = null,
    updatedAt: String? = null,
    pseudo: String = "",
    about: String = "",
    val isAdmin: Boolean = false,
    val isPremium: Boolean = false,
    val followersCount: Long = 0,
    val followingCount: Long = 0,
    val followedMangaCount: Long = 0,
    @JsonApiAttribute("volumesRead") val mangaVolumeRead: Long = 0,
    @JsonApiAttribute("chaptersRead") val mangaChapterRead: Long = 0,
    val followedAnimeCount: Long = 0,
    @JsonApiAttribute("episodesWatch") val animeEpisodeWatch: Long = 0,
    val timeSpentOnAnime: Long = 0,
    firstName: String = "",
    lastName: String = "",
    @JsonApiAttribute("birthday") private var _birthday: String? = null,
    gender: String? = "",
    country: String = "",
    avatar: JSONObject? = null,

    var followers: List<Follow> = listOf(),
    var following: List<Follow> = listOf(),
    @JsonApiRelationship("manga-library") var mangaLibrary: List<MangaEntry> = listOf(),
    @JsonApiRelationship("anime-library") var animeLibrary: List<AnimeEntry> = listOf(),
    @JsonApiRelationship("manga-favorites") var mangaFavorites: List<MangaEntry> = listOf(),
    @JsonApiRelationship("anime-favorites") var animeFavorites: List<AnimeEntry> = listOf(),
    var reviews: List<Review> = listOf(),
    var requests: List<Request> = listOf(),
) : JsonApiResource, AppAdapter.Item {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")

    var pseudo: String by JsonApiProperty(pseudo)
    var about: String by JsonApiProperty(about)
    var firstName: String by JsonApiProperty(firstName)
    var lastName: String by JsonApiProperty(lastName)
    var birthday: Calendar? = _birthday?.toCalendar("yyyy-MM-dd")
        set(value) {
            field = value
            _birthday = value?.format("yyyy-MM-dd")
            dirtyProperties.add(User::_birthday)
        }
    var gender: Gender? by JsonApiProperty(Gender.getByName(gender))
    var country: String? by JsonApiProperty(country)
    var avatar: Avatar? by JsonApiProperty(Avatar.create(avatar))


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

        override fun toString(): String = this.name
    }

    data class Avatar(
        val tiny: String,
        val small: String,
        val medium: String,
        val large: String,
        var original: String
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

        override fun toString(): String = this.original
    }


    class Stats(
        val user: User
    ) : AppAdapter.Item {
        override lateinit var typeLayout: AppAdapter.Type
    }


    override val dirtyProperties: MutableList<KProperty<*>> = mutableListOf()
    override lateinit var typeLayout: AppAdapter.Type
}