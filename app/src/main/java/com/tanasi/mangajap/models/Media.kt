package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiRelationship
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.utils.extensions.toCalendar
import org.json.JSONObject
import java.util.*

sealed class Media


@JsonApiType("anime")
class Anime(
    val id: String,

    createdAt: String? = null,
    updatedAt: String? = null,
    val title: String = "",
    titles: JSONObject? = null,
    val synopsis: String = "",
    startDate: String = "",
    endDate: String? = null,
    origin: String = "",
    status: String = "",
    animeType: String = "",
    val seasonCount: Int = 0,
    val episodeCount: Int = 0,
    val episodeLength: Int = 0,
    val averageRating: Double? = null,
    val ratingRank: Int? = null,
    val popularity: Int = 0,
    val userCount: Int = 0,
    val favoritesCount: Int = 0,
    val reviewCount: Int = 0,
    val youtubeVideoId: String = "",
    val coverImage: String? = null,
    val bannerImage: String? = null,

    val seasons: List<Season> = listOf(),
    val genres: List<Genre> = listOf(),
    val themes: List<Theme> = listOf(),
    val staff: List<Staff> = listOf(),
    val reviews: List<Review> = listOf(),
    val franchises: List<Franchise> = listOf(),
    @JsonApiRelationship("anime-entry") var animeEntry: AnimeEntry? = null,
) : Media(), MangaJapAdapter.Item, Cloneable {

    val titles: Titles = Titles.create(titles)
    val startDate: Calendar? = startDate?.toCalendar("yyyy-MM-dd")
    val endDate: Calendar? = endDate?.toCalendar("yyyy-MM-dd")
    val origin: Locale? = origin?.let { Locale("", it) }
    val status: Status = Status.getByName(status)
    val animeType: AnimeType? = AnimeType.getByName(animeType)
    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")


    data class Titles(
        val fr: String,
        val en: String,
        val en_jp: String,
        val ja_jp: String,
    ) {
        companion object {
            fun create(json: JSONObject?): Titles {
                return Titles(
                    json?.optString("fr") ?: "",
                    json?.optString("en") ?: "",
                    json?.optString("en_jp") ?: "",
                    json?.optString("ja_jp") ?: ""
                )
            }
        }
    }

    enum class Status(val stringId: Int) {
        airing(R.string.animeStatusAiring),
        finished(R.string.animeStatusFinished),
        unreleased(R.string.animeStatusUnreleased),
        upcoming(R.string.animeStatusUpcoming);

        companion object {
            fun getByName(name: String): Status = try {
                valueOf(name)
            } catch (e: Exception) {
                airing
            }
        }
    }

    enum class AnimeType(val stringId: Int) {
        tv(R.string.animeTypeTv),
        ova(R.string.animeTypeOva),
        ona(R.string.animeTypeOna),
        movie(R.string.animeTypeMovie),
        music(R.string.animeTypeMusic),
        special(R.string.animeTypeSpecial);

        companion object {
            fun getByName(name: String): AnimeType? = try {
                valueOf(name)
            } catch (e: Exception) {
                null
            }
        }
    }


    override lateinit var typeLayout: MangaJapAdapter.Type

    public override fun clone(): Anime = super.clone() as Anime
}


@JsonApiType("manga")
class Manga(
    val id: String,

    createdAt: String? = null,
    updatedAt: String? = null,
    val title: String = "",
    titles: JSONObject? = null,
    val synopsis: String? = null,
    startDate: String? = null,
    endDate: String? = null,
    origin: String? = null,
    status: String = "",
    mangaType: String = "",
    val volumeCount: Int = 0,
    val chapterCount: Int = 0,
    val averageRating: Double? = null,
    val ratingRank: Int? = null,
    val popularity: Int? = null,
    val userCount: Int = 0,
    val favoritesCount: Int = 0,
    val reviewCount: Int = 0,
    val coverImage: String? = null,
    val bannerImage: String? = null,

    val volumes: List<Volume> = listOf(),
    val genres: List<Genre> = listOf(),
    val themes: List<Theme> = listOf(),
    val staff: List<Staff> = listOf(),
    val reviews: List<Review> = listOf(),
    val franchises: List<Franchise> = listOf(),
    @JsonApiRelationship("manga-entry") var mangaEntry: MangaEntry? = null,
) : Media(), MangaJapAdapter.Item, Cloneable {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val titles: Titles? = Titles.create(titles)
    val startDate: Calendar? = startDate?.toCalendar("yyyy-MM-dd")
    val endDate: Calendar? = endDate?.toCalendar("yyyy-MM-dd")
    val origin: Locale? = origin?.let { Locale("", it) }
    val status: Status = Status.getByName(status)
    val mangaType: MangaType = MangaType.getByName(mangaType)


    data class Titles(
        val fr: String,
        val en: String,
        val en_jp: String,
        val ja_jp: String,
    ) {
        companion object {
            fun create(json: JSONObject?): Titles? {
                return if (json == null) null else Titles(
                    json.optString("fr") ?: "",
                    json.optString("en") ?: "",
                    json.optString("en_jp") ?: "",
                    json.optString("ja_jp") ?: ""
                )
            }
        }
    }

    enum class Status(val stringId: Int) {
        publishing(R.string.mangaStatusPublishing),
        finished(R.string.mangaStatusFinished),
        unreleased(R.string.mangaStatusUnreleased),
        upcoming(R.string.mangaStatusUpcoming);

        companion object {
            fun getByName(name: String): Status = try {
                valueOf(name)
            } catch (e: Exception) {
                publishing
            }
        }
    }

    enum class MangaType(val stringId: Int) {
        bd(R.string.mangaTypeBd),
        comics(R.string.mangaTypeComics),
        josei(R.string.mangaTypeJosei),
        kodomo(R.string.mangaTypeKodomo),
        seijin(R.string.mangaTypeSeijin),
        seinen(R.string.mangaTypeSeinen),
        shojo(R.string.mangaTypeShojo),
        shonen(R.string.mangaTypeShonen),
        doujin(R.string.mangaTypeDoujin),
        novel(R.string.mangaTypeNovel),
        oneshot(R.string.mangaTypeOneshot),
        webtoon(R.string.webtoon);

        companion object {
            fun getByName(name: String): MangaType = try {
                valueOf(name)
            } catch (e: Exception) {
                shonen
            }
        }
    }

    override lateinit var typeLayout: MangaJapAdapter.Type

    public override fun clone(): Manga {
        return super.clone() as Manga
    }
}
