package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiRelationship
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar
import org.json.JSONObject
import java.util.Locale

@JsonApiType("manga")
class Manga(
    val id: String,

    val title: String = "",
    val titles: JSONObject? = null,
    val slug: String = "",
    val synopsis: String? = null,
    startDate: String? = null,
    endDate: String? = null,
    origin: String? = null,
    mangaType: String = "",
    status: String = "",
    val coverImage: String? = null,
    val bannerImage: String? = null,
    val links: JSONObject? = null,
    val volumeCount: Int = 0,
    val chapterCount: Int = 0,
    val averageRating: Double? = null,
    val ratingRank: Int? = null,
    val popularity: Int? = null,
    val userCount: Int = 0,
    val favoritesCount: Int = 0,
    val reviewCount: Int = 0,
    createdAt: String? = null,
    updatedAt: String? = null,

    val genres: List<Genre> = emptyList(),
    val themes: List<Theme> = emptyList(),
    val volumes: List<Volume> = emptyList(),
    val chapters: List<Chapter> = emptyList(),
    val staff: List<Staff> = emptyList(),
    val reviews: List<Review> = emptyList(),
    val franchises: List<Franchise> = emptyList(),
    @JsonApiRelationship("manga-entry")
    var mangaEntry: MangaEntry? = null,
) : Media, AppAdapter.Item {

    val startDate = startDate?.toCalendar("yyyy-MM-dd")
    val endDate = endDate?.toCalendar("yyyy-MM-dd")
    val origin = origin?.let { Locale("", it) }
    val mangaType = MangaType.entries.find { it.key == mangaType } ?: MangaType.SHONEN
    val status = Status.entries.find { it.key == status } ?: Status.PUBLISHING
    val createdAt = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")

    enum class MangaType(val key: String, val stringId: Int) {
        BD("bd", R.string.mangaTypeBd),
        COMICS("comics", R.string.mangaTypeComics),
        JOSEI("josei", R.string.mangaTypeJosei),
        KODOMO("kodomo", R.string.mangaTypeKodomo),
        SEIJIN("seijin", R.string.mangaTypeSeijin),
        SEINEN("seinen", R.string.mangaTypeSeinen),
        SHOJO("shojo", R.string.mangaTypeShojo),
        SHONEN("shonen", R.string.mangaTypeShonen),
        DOUJIN("doujin", R.string.mangaTypeDoujin),
        NOVEL("novel", R.string.mangaTypeNovel),
        ONESHOT("oneshot", R.string.mangaTypeOneshot),
        WEBTOON("webtoon", R.string.webtoon),
    }

    enum class Status(val key: String, val stringId: Int) {
        PUBLISHING("publishing", R.string.mangaStatusPublishing),
        FINISHED("finished", R.string.mangaStatusFinished),
        UNRELEASED("unreleased", R.string.mangaStatusUnreleased),
        UPCOMING("upcoming", R.string.mangaStatusUpcoming),
    }


    override lateinit var itemType: AppAdapter.Type

    fun copy(
        id: String = this.id,
        title: String = this.title,
        titles: JSONObject? = this.titles,
        slug: String = this.slug,
        synopsis: String? = this.synopsis,
        startDate: String? = this.startDate?.format("yyyy-MM-dd"),
        endDate: String? = this.endDate?.format("yyyy-MM-dd"),
        origin: String? = this.origin?.country,
        mangaType: String = this.mangaType.key,
        status: String = this.status.key,
        coverImage: String? = this.coverImage,
        bannerImage: String? = this.bannerImage,
        links: JSONObject? = this.links,
        volumeCount: Int = this.volumeCount,
        chapterCount: Int = this.chapterCount,
        averageRating: Double? = this.averageRating,
        ratingRank: Int? = this.ratingRank,
        popularity: Int? = this.popularity,
        userCount: Int = this.userCount,
        favoritesCount: Int = this.favoritesCount,
        reviewCount: Int = this.reviewCount,
        createdAt: String? = this.createdAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        updatedAt: String? = this.updatedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        genres: List<Genre> = this.genres,
        themes: List<Theme> = this.themes,
        volumes: List<Volume> = this.volumes,
        chapters: List<Chapter> = this.chapters,
        staff: List<Staff> = this.staff,
        reviews: List<Review> = this.reviews,
        franchises: List<Franchise> = this.franchises,
        mangaEntry: MangaEntry? = this.mangaEntry,
    ) = Manga(
        id = id,
        title = title,
        titles = titles,
        slug = slug,
        synopsis = synopsis,
        startDate = startDate,
        endDate = endDate,
        origin = origin,
        mangaType = mangaType,
        status = status,
        coverImage = coverImage,
        bannerImage = bannerImage,
        links = links,
        volumeCount = volumeCount,
        chapterCount = chapterCount,
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
        volumes = volumes,
        chapters = chapters,
        staff = staff,
        reviews = reviews,
        franchises = franchises,
        mangaEntry = mangaEntry,
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Manga

        if (id != other.id) return false
        if (title != other.title) return false
        if (titles != other.titles) return false
        if (slug != other.slug) return false
        if (synopsis != other.synopsis) return false
        if (coverImage != other.coverImage) return false
        if (bannerImage != other.bannerImage) return false
        if (links != other.links) return false
        if (volumeCount != other.volumeCount) return false
        if (chapterCount != other.chapterCount) return false
        if (averageRating != other.averageRating) return false
        if (ratingRank != other.ratingRank) return false
        if (popularity != other.popularity) return false
        if (userCount != other.userCount) return false
        if (favoritesCount != other.favoritesCount) return false
        if (reviewCount != other.reviewCount) return false
        if (genres != other.genres) return false
        if (themes != other.themes) return false
        if (volumes != other.volumes) return false
        if (chapters != other.chapters) return false
        if (staff != other.staff) return false
        if (reviews != other.reviews) return false
        if (franchises != other.franchises) return false
        if (mangaEntry != other.mangaEntry) return false
        if (startDate != other.startDate) return false
        if (endDate != other.endDate) return false
        if (origin != other.origin) return false
        if (mangaType != other.mangaType) return false
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
        result = 31 * result + (synopsis?.hashCode() ?: 0)
        result = 31 * result + (coverImage?.hashCode() ?: 0)
        result = 31 * result + (bannerImage?.hashCode() ?: 0)
        result = 31 * result + (links?.hashCode() ?: 0)
        result = 31 * result + volumeCount
        result = 31 * result + chapterCount
        result = 31 * result + (averageRating?.hashCode() ?: 0)
        result = 31 * result + (ratingRank ?: 0)
        result = 31 * result + (popularity ?: 0)
        result = 31 * result + userCount
        result = 31 * result + favoritesCount
        result = 31 * result + reviewCount
        result = 31 * result + genres.hashCode()
        result = 31 * result + themes.hashCode()
        result = 31 * result + volumes.hashCode()
        result = 31 * result + chapters.hashCode()
        result = 31 * result + staff.hashCode()
        result = 31 * result + reviews.hashCode()
        result = 31 * result + franchises.hashCode()
        result = 31 * result + (mangaEntry?.hashCode() ?: 0)
        result = 31 * result + (startDate?.hashCode() ?: 0)
        result = 31 * result + (endDate?.hashCode() ?: 0)
        result = 31 * result + (origin?.hashCode() ?: 0)
        result = 31 * result + mangaType.hashCode()
        result = 31 * result + status.hashCode()
        result = 31 * result + (createdAt?.hashCode() ?: 0)
        result = 31 * result + (updatedAt?.hashCode() ?: 0)
        result = 31 * result + itemType.hashCode()
        return result
    }
}