package com.tanasi.mangajap.utils

import com.tanasi.mangajap.models.Category
import com.tanasi.mangajap.models.Chapter
import com.tanasi.mangajap.models.Genre
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.models.Volume
import okhttp3.OkHttpClient
import org.jsoup.nodes.Document
import retrofit2.Retrofit
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
                            ?.attr("href")?.substringAfter("/")
                            ?: "",
                        title = it.selectFirst("div.anime-name")
                            ?.text()
                            ?: "",
                        coverImage = it.selectFirst("img.manga-poster-img")
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
                            ?.attr("href")?.substringAfter("/")
                            ?: "",
                        title = it.selectFirst("h3.manga-name")
                            ?.text()
                            ?: "",
                        coverImage = it.selectFirst("img.manga-poster-img")
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
                            ?.attr("href")?.substringAfter("/")
                            ?: "",
                        title = it.selectFirst("h3.manga-name")
                            ?.text()
                            ?: "",
                        coverImage = it.selectFirst("img.manga-poster-img")
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
        val document = service.search(query.replace(" ", "+"), page)

        val results = document.select("div.manga_list-sbs div.item").map {
            Manga(
                id = it.selectFirst("a")
                    ?.attr("href")?.substringAfter("/")
                    ?: "",
                title = it.selectFirst("h3.manga-name")
                    ?.text()
                    ?: "",
                coverImage = it.selectFirst("img.manga-poster-img")
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
            synopsis = document.selectFirst("div.description")
                ?.text(),
            coverImage = document.selectFirst("img.manga-poster-img")
                ?.attr("src"),

            genres = document.select("div.genres a").map { element ->
                Genre(
                    id = element
                        .attr("href").substringAfterLast("/"),
                    title = element.text(),
                )
            },
            volumes = document.select("div#list-vol div.item").map {
                Volume(
                    id = it.selectFirst("a.link-mask")
                        ?.attr("href")?.substringAfterLast("/")
                        ?: "",
//                    title = it.selectFirst("span.tick-vol")
//                        ?.text(),
                    number = it.selectFirst("span.tick-vol")
                        ?.text()?.substringAfter("VOL ")?.toIntOrNull()
                        ?: 0,
                    coverImage = it.selectFirst("img.manga-poster-img")
                        ?.attr("src"),
                )
            },
            chapters = document.select("div#list-chapter li.item").map {
                Chapter(
                    id = it.selectFirst("a.item-link")
                        ?.attr("href")?.substringAfterLast("/")
                        ?: "",
//                    title = it.selectFirst("span.name")
//                        ?.text(),
                    number = it.attr("data-number").toIntOrNull()
                        ?: 0,
                )
            },
        )

        return manga
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

        @GET("{id}")
        suspend fun getManga(
            @Path("id") id: String,
        ): Document
    }
}