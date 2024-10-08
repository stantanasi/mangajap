package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiAttribute
import com.tanasi.jsonapi.JsonApiProperty
import com.tanasi.jsonapi.JsonApiRelationship
import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar
import org.json.JSONObject
import kotlin.reflect.KProperty

@JsonApiType("users")
class User(
    var id: String?,

    pseudo: String = "",
    firstName: String = "",
    lastName: String = "",
    about: String = "",
    gender: String? = null,
    @JsonApiAttribute("birthday")
    private var _birthday: String? = null,
    country: String = "",
    avatar: JSONObject? = null,
    val followersCount: Long = 0,
    val followingCount: Long = 0,
    val followedMangaCount: Long = 0,
    @JsonApiAttribute("volumesRead")
    val mangaVolumeRead: Long = 0,
    @JsonApiAttribute("chaptersRead")
    val mangaChapterRead: Long = 0,
    val followedAnimeCount: Long = 0,
    @JsonApiAttribute("episodesWatch")
    val animeEpisodeWatch: Long = 0,
    val timeSpentOnAnime: Long = 0,
    createdAt: String? = null,
    updatedAt: String? = null,

    var followers: List<Follow> = emptyList(),
    var following: List<Follow> = emptyList(),
    @JsonApiRelationship("anime-library")
    var animeLibrary: List<AnimeEntry> = emptyList(),
    @JsonApiRelationship("manga-library")
    var mangaLibrary: List<MangaEntry> = emptyList(),
    @JsonApiRelationship("anime-favorites")
    var animeFavorites: List<AnimeEntry> = emptyList(),
    @JsonApiRelationship("manga-favorites")
    var mangaFavorites: List<MangaEntry> = emptyList(),
    var reviews: List<Review> = emptyList(),
    var requests: List<Request> = emptyList(),
) : JsonApiResource, AppAdapter.Item {

    var pseudo by JsonApiProperty(pseudo)
    var firstName by JsonApiProperty(firstName)
    var lastName by JsonApiProperty(lastName)
    var about by JsonApiProperty(about)
    var gender by JsonApiProperty<Gender?>(Gender.entries.find { it.key == gender })
    var birthday = _birthday?.toCalendar("yyyy-MM-dd")
        set(value) {
            field = value
            _birthday = value?.format("yyyy-MM-dd")
            dirtyProperties.add(User::_birthday)
        }
    var country by JsonApiProperty(country)
    var avatar by JsonApiProperty<Avatar?>(Avatar.create(avatar))
    val createdAt = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")


    enum class Gender(val key: String, val stringId: Int) {
        MEN("men", R.string.genderMen),
        WOMEN("women", R.string.genderWomen),
        OTHER("other", R.string.genderOther);

        override fun toString(): String = this.key
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

        fun toJson(): JSONObject = JSONObject()
            .put("tiny", tiny)
            .put("small", small)
            .put("medium", medium)
            .put("large", large)
            .put("original", original)

        override fun toString(): String = this.original
    }

    data class Stats(
        val user: User
    ) : AppAdapter.Item {
        override lateinit var itemType: AppAdapter.Type
    }


    override val dirtyProperties: MutableList<KProperty<*>> = mutableListOf()
    override lateinit var itemType: AppAdapter.Type

    fun copy(
        id: String? = this.id,
        pseudo: String = this.pseudo,
        firstName: String = this.firstName,
        lastName: String = this.lastName,
        about: String = this.about,
        gender: String? = this.gender?.key,
        birthday: String? = this.birthday?.format("yyyy-MM-dd"),
        country: String = this.country,
        avatar: JSONObject? = this.avatar?.toJson(),
        followersCount: Long = this.followersCount,
        followingCount: Long = this.followingCount,
        followedMangaCount: Long = this.followedMangaCount,
        mangaVolumeRead: Long = this.mangaVolumeRead,
        mangaChapterRead: Long = this.mangaChapterRead,
        followedAnimeCount: Long = this.followedAnimeCount,
        animeEpisodeWatch: Long = this.animeEpisodeWatch,
        timeSpentOnAnime: Long = this.timeSpentOnAnime,
        createdAt: String? = this.createdAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        updatedAt: String? = this.updatedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        followers: List<Follow> = this.followers,
        following: List<Follow> = this.following,
        animeLibrary: List<AnimeEntry> = this.animeLibrary,
        mangaLibrary: List<MangaEntry> = this.mangaLibrary,
        animeFavorites: List<AnimeEntry> = this.animeFavorites,
        mangaFavorites: List<MangaEntry> = this.mangaFavorites,
        reviews: List<Review> = this.reviews,
        requests: List<Request> = this.requests,
    ) = User(
        id = id,
        pseudo = pseudo,
        firstName = firstName,
        lastName = lastName,
        about = about,
        gender = gender,
        _birthday = birthday,
        country = country,
        avatar = avatar,
        followersCount = followersCount,
        followingCount = followingCount,
        followedMangaCount = followedMangaCount,
        mangaVolumeRead = mangaVolumeRead,
        mangaChapterRead = mangaChapterRead,
        followedAnimeCount = followedAnimeCount,
        animeEpisodeWatch = animeEpisodeWatch,
        timeSpentOnAnime = timeSpentOnAnime,
        createdAt = createdAt,
        updatedAt = updatedAt,
        followers = followers,
        following = following,
        animeLibrary = animeLibrary,
        mangaLibrary = mangaLibrary,
        animeFavorites = animeFavorites,
        mangaFavorites = mangaFavorites,
        reviews = reviews,
        requests = requests,
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as User

        if (id != other.id) return false
        if (_birthday != other._birthday) return false
        if (followersCount != other.followersCount) return false
        if (followingCount != other.followingCount) return false
        if (followedMangaCount != other.followedMangaCount) return false
        if (mangaVolumeRead != other.mangaVolumeRead) return false
        if (mangaChapterRead != other.mangaChapterRead) return false
        if (followedAnimeCount != other.followedAnimeCount) return false
        if (animeEpisodeWatch != other.animeEpisodeWatch) return false
        if (timeSpentOnAnime != other.timeSpentOnAnime) return false
        if (followers != other.followers) return false
        if (following != other.following) return false
        if (animeLibrary != other.animeLibrary) return false
        if (mangaLibrary != other.mangaLibrary) return false
        if (animeFavorites != other.animeFavorites) return false
        if (mangaFavorites != other.mangaFavorites) return false
        if (reviews != other.reviews) return false
        if (requests != other.requests) return false
        if (birthday != other.birthday) return false
        if (createdAt != other.createdAt) return false
        if (updatedAt != other.updatedAt) return false
        if (dirtyProperties != other.dirtyProperties) return false
        if (itemType != other.itemType) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id?.hashCode() ?: 0
        result = 31 * result + (_birthday?.hashCode() ?: 0)
        result = 31 * result + followersCount.hashCode()
        result = 31 * result + followingCount.hashCode()
        result = 31 * result + followedMangaCount.hashCode()
        result = 31 * result + mangaVolumeRead.hashCode()
        result = 31 * result + mangaChapterRead.hashCode()
        result = 31 * result + followedAnimeCount.hashCode()
        result = 31 * result + animeEpisodeWatch.hashCode()
        result = 31 * result + timeSpentOnAnime.hashCode()
        result = 31 * result + followers.hashCode()
        result = 31 * result + following.hashCode()
        result = 31 * result + animeLibrary.hashCode()
        result = 31 * result + mangaLibrary.hashCode()
        result = 31 * result + animeFavorites.hashCode()
        result = 31 * result + mangaFavorites.hashCode()
        result = 31 * result + reviews.hashCode()
        result = 31 * result + requests.hashCode()
        result = 31 * result + (birthday?.hashCode() ?: 0)
        result = 31 * result + (createdAt?.hashCode() ?: 0)
        result = 31 * result + (updatedAt?.hashCode() ?: 0)
        result = 31 * result + dirtyProperties.hashCode()
        result = 31 * result + itemType.hashCode()
        return result
    }
}