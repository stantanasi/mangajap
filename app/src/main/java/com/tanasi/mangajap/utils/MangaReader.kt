package com.tanasi.mangajap.utils

import com.tanasi.mangajap.models.Category
import com.tanasi.mangajap.models.Genre
import com.tanasi.mangajap.models.Manga
import okhttp3.OkHttpClient
import org.jsoup.nodes.Document
import retrofit2.Retrofit
import retrofit2.http.GET
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
    }
}