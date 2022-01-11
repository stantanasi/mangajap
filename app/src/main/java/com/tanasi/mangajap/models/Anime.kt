package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiRelationship
import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.utils.extensions.toCalendar
import org.json.JSONObject
import java.util.*

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
) : MangaJapAdapter.Item, Cloneable {

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