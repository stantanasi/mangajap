package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiRelationship
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.models.Anime.Status.AIRING
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar
import org.json.JSONObject
import java.util.Locale

@JsonApiType("anime")
class Anime(
    val id: String,

    val title: String = "",
    val titles: JSONObject? = null,
    val slug: String = "",
    val synopsis: String = "",
    startDate: String? = null,
    endDate: String? = null,
    origin: String? = null,
    animeType: String? = null,
    status: String? = null,
    val inProduction: Boolean = false,
    val youtubeVideoId: String = "",
    val coverImage: String? = null,
    val bannerImage: String? = null,
    val links: JSONObject? = null,
    val seasonCount: Int = 0,
    val episodeCount: Int = 0,
    val episodeLength: Int = 0,
    val averageRating: Double? = null,
    val ratingRank: Int? = null,
    val popularity: Int = 0,
    val userCount: Int = 0,
    val favoritesCount: Int = 0,
    val reviewCount: Int = 0,
    createdAt: String? = null,
    updatedAt: String? = null,

    val genres: List<Genre> = emptyList(),
    val themes: List<Theme> = emptyList(),
    val seasons: List<Season> = emptyList(),
    val episodes: List<Episode> = emptyList(),
    val staff: List<Staff> = emptyList(),
    val reviews: List<Review> = emptyList(),
    val franchises: List<Franchise> = emptyList(),
    @JsonApiRelationship("anime-entry")
    var animeEntry: AnimeEntry? = null,
) : Media, AppAdapter.Item {

    val startDate = startDate?.toCalendar("yyyy-MM-dd")
    val endDate = endDate?.toCalendar("yyyy-MM-dd")
    val origin = origin?.let { Locale("", it) }
    val animeType = AnimeType.entries.find { it.key == animeType }
    val status = Status.entries.find { it.key == status } ?: AIRING
    val createdAt = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")


    enum class Status(val key: String, val stringId: Int) {
        AIRING("airing", R.string.animeStatusAiring),
        FINISHED("finished", R.string.animeStatusFinished),
        UNRELEASED("unreleased", R.string.animeStatusUnreleased),
        UPCOMING("upcoming", R.string.animeStatusUpcoming),
    }

    enum class AnimeType(val key: String, val stringId: Int) {
        TV("tv", R.string.animeTypeTv),
        OVA("ova", R.string.animeTypeOva),
        ONA("ona", R.string.animeTypeOna),
        MOVIE("movie", R.string.animeTypeMovie),
        MUSIC("music", R.string.animeTypeMusic),
        SPECIAL("special", R.string.animeTypeSpecial),
    }


    override lateinit var itemType: AppAdapter.Type

    fun copy(
        id: String = this.id,
        title: String = this.title,
        titles: JSONObject? = this.titles,
        slug: String = this.slug,
        synopsis: String = this.synopsis,
        startDate: String? = this.startDate?.format("yyyy-MM-dd"),
        endDate: String? = this.endDate?.format("yyyy-MM-dd"),
        origin: String? = this.origin?.country,
        animeType: String? = this.animeType?.key,
        status: String? = this.status.key,
        inProduction: Boolean = this.inProduction,
        youtubeVideoId: String = this.youtubeVideoId,
        coverImage: String? = this.coverImage,
        bannerImage: String? = this.bannerImage,
        links: JSONObject? = this.links,
        seasonCount: Int = this.seasonCount,
        episodeCount: Int = this.episodeCount,
        episodeLength: Int = this.episodeLength,
        averageRating: Double? = this.averageRating,
        ratingRank: Int? = this.ratingRank,
        popularity: Int = this.popularity,
        userCount: Int = this.userCount,
        favoritesCount: Int = this.favoritesCount,
        reviewCount: Int = this.reviewCount,
        createdAt: String? = this.createdAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        updatedAt: String? = this.updatedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        genres: List<Genre> = this.genres,
        themes: List<Theme> = this.themes,
        seasons: List<Season> = this.seasons,
        episodes: List<Episode> = this.episodes,
        staff: List<Staff> = this.staff,
        reviews: List<Review> = this.reviews,
        franchises: List<Franchise> = this.franchises,
        animeEntry: AnimeEntry? = this.animeEntry,
    ) = Anime(
        id = id,
        title = title,
        titles = titles,
        slug = slug,
        synopsis = synopsis,
        startDate = startDate,
        endDate = endDate,
        origin = origin,
        animeType = animeType,
        status = status,
        inProduction = inProduction,
        youtubeVideoId = youtubeVideoId,
        coverImage = coverImage,
        bannerImage = bannerImage,
        links = links,
        seasonCount = seasonCount,
        episodeCount = episodeCount,
        episodeLength = episodeLength,
        averageRating = averageRating,
        ratingRank = ratingRank,
        popularity = popularity,
        userCount = userCount,
        favoritesCount = favoritesCount,
        reviewCount = reviewCount,
        createdAt = createdAt,
        updatedAt = updatedAt,
        genres = genres,
        themes = themes,
        seasons = seasons,
        episodes = episodes,
        staff = staff,
        reviews = reviews,
        franchises = franchises,
        animeEntry = animeEntry,
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Anime

        if (id != other.id) return false
        if (title != other.title) return false
        if (titles != other.titles) return false
        if (slug != other.slug) return false
        if (synopsis != other.synopsis) return false
        if (inProduction != other.inProduction) return false
        if (youtubeVideoId != other.youtubeVideoId) return false
        if (coverImage != other.coverImage) return false
        if (bannerImage != other.bannerImage) return false
        if (links != other.links) return false
        if (seasonCount != other.seasonCount) return false
        if (episodeCount != other.episodeCount) return false
        if (episodeLength != other.episodeLength) return false
        if (averageRating != other.averageRating) return false
        if (ratingRank != other.ratingRank) return false
        if (popularity != other.popularity) return false
        if (userCount != other.userCount) return false
        if (favoritesCount != other.favoritesCount) return false
        if (reviewCount != other.reviewCount) return false
        if (genres != other.genres) return false
        if (themes != other.themes) return false
        if (seasons != other.seasons) return false
        if (episodes != other.episodes) return false
        if (staff != other.staff) return false
        if (reviews != other.reviews) return false
        if (franchises != other.franchises) return false
        if (animeEntry != other.animeEntry) return false
        if (startDate != other.startDate) return false
        if (endDate != other.endDate) return false
        if (origin != other.origin) return false
        if (animeType != other.animeType) return false
        if (status != other.status) return false
        if (createdAt != other.createdAt) return false
        if (updatedAt != other.updatedAt) return false
        if (itemType != other.itemType) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + title.hashCode()
        result = 31 * result + (titles?.hashCode() ?: 0)
        result = 31 * result + slug.hashCode()
        result = 31 * result + synopsis.hashCode()
        result = 31 * result + inProduction.hashCode()
        result = 31 * result + youtubeVideoId.hashCode()
        result = 31 * result + (coverImage?.hashCode() ?: 0)
        result = 31 * result + (bannerImage?.hashCode() ?: 0)
        result = 31 * result + (links?.hashCode() ?: 0)
        result = 31 * result + seasonCount
        result = 31 * result + episodeCount
        result = 31 * result + episodeLength
        result = 31 * result + (averageRating?.hashCode() ?: 0)
        result = 31 * result + (ratingRank ?: 0)
        result = 31 * result + popularity
        result = 31 * result + userCount
        result = 31 * result + favoritesCount
        result = 31 * result + reviewCount
        result = 31 * result + genres.hashCode()
        result = 31 * result + themes.hashCode()
        result = 31 * result + seasons.hashCode()
        result = 31 * result + episodes.hashCode()
        result = 31 * result + staff.hashCode()
        result = 31 * result + reviews.hashCode()
        result = 31 * result + franchises.hashCode()
        result = 31 * result + (animeEntry?.hashCode() ?: 0)
        result = 31 * result + (startDate?.hashCode() ?: 0)
        result = 31 * result + (endDate?.hashCode() ?: 0)
        result = 31 * result + (origin?.hashCode() ?: 0)
        result = 31 * result + (animeType?.hashCode() ?: 0)
        result = 31 * result + status.hashCode()
        result = 31 * result + (createdAt?.hashCode() ?: 0)
        result = 31 * result + (updatedAt?.hashCode() ?: 0)
        result = 31 * result + itemType.hashCode()
        return result
    }
}