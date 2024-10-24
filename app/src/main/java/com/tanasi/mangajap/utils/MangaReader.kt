package com.tanasi.mangajap.utils

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
                    ?.text()
                    ?: "",
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
                    ?.text()
                    ?: "",
            )
        }

        return volumes
    }

    suspend fun getChapterPages(id: String): List<Page> {
        val response = service.getChapterPages(id)

        val pages = response.html.select("div.iv-card").map {
            Page(
                image = it.attr("data-url"),
                isShuffle = it.hasClass("shuffled"),
            )
        }

        return pages
    }

    suspend fun getVolumePages(id: String): List<Page> {
        val response = service.getVolumePages(id)

        val pages = response.html.select("div.iv-card").map {
            Page(
                image = it.attr("data-url"),
                isShuffle = it.hasClass("shuffled"),
            )
        }

        return pages
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