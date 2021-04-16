package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiRelationship
import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.utils.extensions.toCalendar
import org.json.JSONObject
import java.util.*

@JsonApiType("manga")
class Manga(
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
        mangaType: String = "",
        var volumeCount: Int? = 0,
        var chapterCount: Int? = 0,
        var averageRating: Double? = null,
        var ratingRank: Int? = null,
        var popularity: Int? = null,
        var userCount: Int = 0,
        var favoritesCount: Int? = null,
        var reviewCount: Int? = null,
        var coverImage: String? = null,
        var bannerImage: String? = null,

        var volumes: List<Volume> = listOf(),
        var genres: List<Genre> = listOf(),
        var themes: List<Theme> = listOf(),
        var staff: List<Staff> = listOf(),
        var reviews: List<Review> = listOf(),
        @JsonApiRelationship("franchise") var franchise: List<Franchise> = listOf(),
        @JsonApiRelationship("manga-entry") var mangaEntry: MangaEntry? = null,
) : JsonApiResource(), MangaJapAdapter.Item, Cloneable {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd HH:mm:ss")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd HH:mm:ss")
    val titles: Titles? = Titles.create(titles)
    val startDate: Calendar? = startDate?.toCalendar("yyyy-MM-dd")
    val endDate: Calendar? = endDate?.toCalendar("yyyy-MM-dd")
    val origin: Locale? = origin?.let { Locale("", it) }
    var status: Status = Status.getByName(status)
    var mangaType: MangaType? = MangaType.getByName(mangaType)

    var books: List<Book> = listOf()


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
            fun getByName(name: String): MangaType? = try {
                valueOf(name)
            } catch (e: Exception) {
                null
            }
        }
    }

    override lateinit var typeLayout: MangaJapAdapter.Type

    public override fun clone(): Manga {
        return super.clone() as Manga
    }
}