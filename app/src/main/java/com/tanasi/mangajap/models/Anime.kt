package com.tanasi.mangajap.models

import com.tanasi.mangajap.R
import com.tanasi.mangajap.utils.extensions.toCalendar
import com.tanasi.mangajap.utils.jsonApi.JsonApi
import com.tanasi.mangajap.utils.jsonApi.JsonApiRelationships
import com.tanasi.mangajap.utils.jsonApi.JsonApiResource
import org.json.JSONObject
import java.util.*

@JsonApi("anime")
class Anime(
        override var id: String = "",
        createdAt: String? = null,
        updatedAt: String? = null,
        var canonicalTitle: String = "",
        titles: JSONObject? = null,
        var synopsis: String? = null,
        startDate: String? = null,
        endDate: String? = null,
        origin: String? = null,
        status: String = "",
        animeType: String = "",
        var seasonCount: Int? = null,
        var episodeCount: Int? = null,
        var episodeLength: Int? = null,
        var totalLength: Int? = null,
        var averageRating: Double? = null,
        var ratingRank: Int? = null,
        var popularity: Int? = null,
        var userCount: Int? = null,
        var favoritesCount: Int? = null,
        var reviewCount: Int? = null,
        var coverImage: String? = null,
        var bannerImage: String? = null,
        var youtubeVideoId: String? = null,

        var episodes: List<Episode> = listOf(),
        var genres: List<Genre> = listOf(),
        var themes: List<Theme> = listOf(),
        var staff: List<Staff> = listOf(),
        var reviews: List<Review> = listOf(),
        var franchises: List<Franchise> = listOf(),
        @JsonApiRelationships("anime-entry") var animeEntry: AnimeEntry? = null,
) : JsonApiResource(), Cloneable {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd HH:mm:ss")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd HH:mm:ss")
    val titles: Titles? = Titles.create(titles)
    val startDate: Calendar? = startDate?.toCalendar("yyyy-MM-dd")
    val endDate: Calendar? = endDate?.toCalendar("yyyy-MM-dd")
    val origin: Locale? = origin?.let { Locale("", it) }
    var status: Status = Status.getByName(status)
    var animeType: AnimeType? = AnimeType.getByName(animeType)
    
    val seasons: List<Season>
        get() {
            return episodes
                    .groupBy {
                        it.seasonNumber
                    }
                    .map { (_, episodes) ->
                        Season(
                                episodes.map {
                                    it.anime = this
                                    it
                                }
                        )
                    }
        }


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

    public override fun clone(): Anime {
        return super.clone() as Anime
    }
}