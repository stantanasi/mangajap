package com.tanasi.mangajap.utils

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Rect
import com.google.gson.annotations.SerializedName
import com.tanasi.mangajap.models.Category
import com.tanasi.mangajap.models.Chapter
import com.tanasi.mangajap.models.Genre
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.models.Page
import com.tanasi.mangajap.models.Volume
import okhttp3.OkHttpClient
import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query
import java.util.concurrent.TimeUnit
import javax.crypto.Cipher
import javax.crypto.spec.SecretKeySpec
import kotlin.math.min

object MangaReader {

    private const val URL = "https://mangareader.to/"

    private val service = Service.build()

    suspend fun getHome(): List<Category> {
        val document = service.getHome()

        val categories = mutableListOf<Category>()

        categories.add(
            Category(
                name = "Trending",
                list = document.select("div#trending-home div.item").map {
                    Manga(
                        id = it.selectFirst("a.link-mask")
                            ?.attr("href")?.substringAfterLast("-")
                            ?: "",
                        title = it.selectFirst("div.anime-name")
                            ?.text()
                            ?: "",
                        poster = it.selectFirst("img.manga-poster-img")
                            ?.attr("src"),
                    )
                }
            )
        )

        categories.add(
            Category(
                name = "Recommended",
                list = document.select("div#featured-03 div.mg-item-basic").map {
                    Manga(
                        id = it.selectFirst("a.link-mask")
                            ?.attr("href")?.substringAfterLast("-")
                            ?: "",
                        title = it.selectFirst("h3.manga-name")
                            ?.text()
                            ?: "",
                        poster = it.selectFirst("img.manga-poster-img")
                            ?.attr("src"),

                        genres = it.select("div.fd-infor a").map { element ->
                            Genre(
                                id = element
                                    .attr("href").substringAfterLast("/"),
                                title = element.text(),
                            )
                        }
                    )
                }
            )
        )

        categories.add(
            Category(
                name = "Completed",
                list = document.select("div#featured-04 div.mg-item-basic").map {
                    Manga(
                        id = it.selectFirst("a.link-mask")
                            ?.attr("href")?.substringAfterLast("-")
                            ?: "",
                        title = it.selectFirst("h3.manga-name")
                            ?.text()
                            ?: "",
                        poster = it.selectFirst("img.manga-poster-img")
                            ?.attr("src"),

                        genres = it.select("div.fd-infor a").map { element ->
                            Genre(
                                id = element
                                    .attr("href").substringAfterLast("/"),
                                title = element.text(),
                            )
                        }
                    )
                }
            )
        )

        return categories
    }

    suspend fun search(query: String, page: Int = 1): List<Manga> {
        if (query.isEmpty()) {
            return emptyList()
        }

        val document = service.search(query.replace(" ", "+"), page)

        val results = document.select("div.manga_list-sbs div.item").map {
            Manga(
                id = it.selectFirst("a")
                    ?.attr("href")?.substringAfterLast("-")
                    ?: "",
                title = it.selectFirst("h3.manga-name")
                    ?.text()
                    ?: "",
                poster = it.selectFirst("img.manga-poster-img")
                    ?.attr("src"),

                genres = it.select("div.fd-infor a").map { element ->
                    Genre(
                        id = element
                            .attr("href").substringAfterLast("/"),
                        title = element.text(),
                    )
                },
            )
        }

        return results
    }

    suspend fun getManga(id: String): Manga {
        val document = service.getManga(id)

        val manga = Manga(
            id = id,
            title = document.selectFirst("h2.manga-name")
                ?.text()
                ?: "",
            overview = document.selectFirst("div.description")
                ?.text(),
            poster = document.selectFirst("img.manga-poster-img")
                ?.attr("src"),

            genres = document.select("div.genres a").map { element ->
                Genre(
                    id = element
                        .attr("href").substringAfterLast("/"),
                    title = element.text(),
                )
            },
        )

        return manga
    }

    suspend fun getChapters(mangaId: String): List<Chapter> {
        val response = service.getChapters(mangaId)

        val chapters = response.html.select("li.chapter-item").map {
            Chapter(
                id = it.attr("data-id"),
                number = it.attr("data-number").toDoubleOrNull()
                    ?: 0.0,
                title = it.selectFirst("span.name")
                    ?.text(),
                language = it.selectFirst("a")
                    ?.attr("href")?.split("/")?.getOrNull(3),
            )
        }

        return chapters
    }

    suspend fun getVolumes(mangaId: String): List<Volume> {
        val response = service.getVolumes(mangaId)

        val volumes = response.html.select("li.volume-item").map {
            Volume(
                id = it.attr("data-id"),
                number = it.attr("data-number").toDoubleOrNull()
                    ?: 0.0,
                title = it.selectFirst("span.name")
                    ?.text(),
                language = it.selectFirst("a")
                    ?.attr("href")?.split("/")?.getOrNull(3),
            )
        }

        return volumes
    }

    suspend fun getChapterPages(id: String): List<Page> {
        val response = service.getChapterPages(id)

        val pages = response.html.select("div.iv-card").map {
            Page(
                image = it.attr("data-url"),
                isShuffled = it.hasClass("shuffled"),
            )
        }

        return pages
    }

    suspend fun getVolumePages(id: String): List<Page> {
        val response = service.getVolumePages(id)

        val pages = response.html.select("div.iv-card").map {
            Page(
                image = it.attr("data-url"),
                isShuffled = it.hasClass("shuffled"),
            )
        }

        return pages
    }


    // https://github.com/Howard20181/tachiyomi-extensions
    object ImageUnshuffler {

        private const val PIECE_SIZE = 200

        private val memo = hashMapOf<Int, IntArray>()

        fun unshuffle(bitmap: Bitmap): Bitmap {
            val width = bitmap.width
            val height = bitmap.height

            val result = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
            val canvas = Canvas(result)

            val pieces = ArrayList<Piece>()
            for (y in 0 until height step PIECE_SIZE) {
                for (x in 0 until width step PIECE_SIZE) {
                    val w = min(PIECE_SIZE, width - x)
                    val h = min(PIECE_SIZE, height - y)
                    pieces.add(Piece(x, y, w, h))
                }
            }

            val groups = pieces.groupBy { it.w shl 16 or it.h }

            for (group in groups.values) {
                val size = group.size

                val permutation = memo.getOrPut(size) {
                    // The key is actually "stay", but it's padded here in case the code is run in
                    // Oracle's JDK, where RC4 key is required to be at least 5 bytes
                    val random = SeedRandom("staystay")

                    // https://github.com/webcaetano/shuffle-seed
                    val indices = (0 until size).toMutableList()
                    IntArray(size) { indices.removeAt((random.nextDouble() * indices.size).toInt()) }
                }

                for ((i, original) in permutation.withIndex()) {
                    val src = group[i]
                    val dst = group[original]

                    val srcRect = Rect(src.x, src.y, src.x + src.w, src.y + src.h)
                    val dstRect = Rect(dst.x, dst.y, dst.x + dst.w, dst.y + dst.h)

                    canvas.drawBitmap(bitmap, srcRect, dstRect, null)
                }
            }

            return result
        }

        private class Piece(val x: Int, val y: Int, val w: Int, val h: Int)

        // https://github.com/davidbau/seedrandom
        private class SeedRandom(key: String) {

            private val input = ByteArray(RC4_WIDTH)
            private val buffer = ByteArray(RC4_WIDTH)
            private var pos = RC4_WIDTH

            private val rc4 = Cipher.getInstance("RC4").apply {
                init(Cipher.ENCRYPT_MODE, SecretKeySpec(key.toByteArray(), "RC4"))
                update(input, 0, RC4_WIDTH, buffer) // RC4-drop[256]
            }

            fun nextDouble(): Double {
                var num = nextByte()
                var exp = 8
                while (num < 1L shl 52) {
                    num = num shl 8 or nextByte()
                    exp += 8
                }
                while (num >= 1L shl 53) {
                    num = num ushr 1
                    exp--
                }
                return Math.scalb(num.toDouble(), -exp)
            }

            private fun nextByte(): Long {
                if (pos == RC4_WIDTH) {
                    rc4.update(input, 0, RC4_WIDTH, buffer)
                    pos = 0
                }
                return buffer[pos++].toLong() and 0xFF
            }

            companion object {
                private const val RC4_WIDTH = 256
            }
        }
    }


    private interface Service {

        companion object {
            fun build(): Service {
                val client = OkHttpClient.Builder()
                    .readTimeout(10, TimeUnit.SECONDS)
                    .connectTimeout(10, TimeUnit.SECONDS)
                    .build()

                val retrofit = Retrofit.Builder()
                    .baseUrl(URL)
                    .addConverterFactory(JsoupConverterFactory.create())
                    .addConverterFactory(GsonConverterFactory.create())
                    .client(client)
                    .build()

                return retrofit.create(Service::class.java)
            }
        }


        @GET("home")
        suspend fun getHome(): Document

        @GET("search")
        suspend fun search(
            @Query("keyword") keyword: String,
            @Query("page") page: Int,
        ): Document

        @GET("slug-{id}")
        suspend fun getManga(
            @Path("id") id: String,
        ): Document

        @GET("ajax/manga/reading-list/{mangaId}?readingBy=chap")
        suspend fun getChapters(
            @Path("mangaId") mangaId: String,
        ): AjaxResponse

        @GET("ajax/manga/reading-list/{mangaId}?readingBy=vol")
        suspend fun getVolumes(
            @Path("mangaId") mangaId: String,
        ): AjaxResponse

        @GET("ajax/image/list/chap/{chapterId}")
        suspend fun getChapterPages(
            @Path("chapterId", encoded = true) chapterId: String,
        ): AjaxResponse

        @GET("ajax/image/list/vol/{volumeId}")
        suspend fun getVolumePages(
            @Path("volumeId", encoded = true) volumeId: String,
        ): AjaxResponse


        data class AjaxResponse(
            val status: Boolean,
            @SerializedName("html") private val _html: String,
        ) {
            val html: Document
                get() = Jsoup.parse(_html)
        }
    }
}