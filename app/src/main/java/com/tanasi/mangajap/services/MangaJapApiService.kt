package com.tanasi.mangajap.services

import com.google.android.gms.tasks.Tasks
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.tanasi.jsonapi.JsonApiParams
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.jsonapi.callAdapter.JsonApiCallAdapterFactory
import com.tanasi.jsonapi.converter.JsonApiConverterFactory
import com.tanasi.mangajap.models.Anime
import com.tanasi.mangajap.models.AnimeEntry
import com.tanasi.mangajap.models.Episode
import com.tanasi.mangajap.models.Follow
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.models.MangaEntry
import com.tanasi.mangajap.models.People
import com.tanasi.mangajap.models.Request
import com.tanasi.mangajap.models.Review
import com.tanasi.mangajap.models.Season
import com.tanasi.mangajap.models.User
import com.tanasi.oauth2.adapter.OAuth2CallAdapterFactory
import com.tanasi.oauth2.converter.OAuth2ConverterFactory
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.QueryMap
import retrofit2.http.Url
import java.util.concurrent.TimeUnit

interface MangaJapApiService {

    companion object {
        fun build(): MangaJapApiService {
            val client = OkHttpClient.Builder()
                .readTimeout(60, TimeUnit.SECONDS)
                .addInterceptor { chain ->
                    val requestBuilder = chain.request().newBuilder()
                        .addHeader("Accept", "application/vnd.api+json")
                        .addHeader("Content-Type", "application/vnd.api+json")

                    Firebase.auth.currentUser?.getIdToken(false)
                        ?.let {
                            val tokenResult = Tasks.await(it, 10, TimeUnit.SECONDS)
                            tokenResult.token
                        }
                        ?.let { idToken ->
                            requestBuilder.addHeader("Authorization", idToken)
                        }


                    chain.proceed(requestBuilder.build())
                }
                .build()

            val retrofit = Retrofit.Builder()
                .baseUrl("https://api-za7rwcomoa-uc.a.run.app/")
                .client(client)
                .addCallAdapterFactory(OAuth2CallAdapterFactory.create())
                .addConverterFactory(OAuth2ConverterFactory.create())
                .addCallAdapterFactory(JsonApiCallAdapterFactory.create())
                .addConverterFactory(JsonApiConverterFactory.create())
                .build()

            return retrofit.create(MangaJapApiService::class.java)
        }
    }


    /**
     * Anime
     */

    @GET("anime")
    suspend fun getAnime(@QueryMap params: JsonApiParams = JsonApiParams()): JsonApiResponse<List<Anime>>

    @GET
    suspend fun loadMoreAnime(@Url next: String): JsonApiResponse<List<Anime>>

    @GET("anime/{id}")
    suspend fun getAnime(
        @Path("id") id: String,
        @QueryMap params: JsonApiParams = JsonApiParams()
    ): JsonApiResponse<Anime>

    @GET("anime/{id}/seasons")
    suspend fun getAnimeSeasons(
        @Path("id") animeId: String,
        @QueryMap params: JsonApiParams = JsonApiParams()
    ): JsonApiResponse<List<Season>>

    @GET("anime/{id}/reviews")
    suspend fun getAnimeReviews(
        @Path("id") animeId: String,
        @QueryMap params: JsonApiParams = JsonApiParams()
    ): JsonApiResponse<List<Review>>


    /**
     * AnimeEntry
     */

    @POST("anime-entries")
    suspend fun createAnimeEntry(
        @Body animeEntry: AnimeEntry
    ): JsonApiResponse<AnimeEntry>

    @PATCH("anime-entries/{id}")
    suspend fun updateAnimeEntry(
        @Path("id") id: String,
        @Body animeEntry: AnimeEntry,
    ): JsonApiResponse<AnimeEntry>


    /**
     * Follow
     */

    @GET("follows")
    suspend fun getFollows(@QueryMap params: JsonApiParams = JsonApiParams()): JsonApiResponse<List<Follow>>

    @GET
    suspend fun loadMoreFollows(@Url next: String): JsonApiResponse<List<Follow>>


    /**
     * Manga
     */

    @GET("manga")
    suspend fun getManga(@QueryMap params: JsonApiParams = JsonApiParams()): JsonApiResponse<List<Manga>>

    @GET
    suspend fun loadMoreManga(@Url next: String): JsonApiResponse<List<Manga>>

    @GET("manga/{id}")
    suspend fun getManga(
        @Path("id") id: String,
        @QueryMap params: JsonApiParams = JsonApiParams()
    ): JsonApiResponse<Manga>

    @GET("manga/{id}/reviews")
    suspend fun getMangaReviews(
        @Path("id") mangaId: String,
        @QueryMap params: JsonApiParams = JsonApiParams()
    ): JsonApiResponse<List<Review>>


    /**
     * AnimeEntry
     */

    @POST("manga-entries")
    suspend fun createMangaEntry(
        @Body mangaEntry: MangaEntry
    ): JsonApiResponse<MangaEntry>

    @PATCH("manga-entries/{id}")
    suspend fun updateMangaEntry(
        @Path("id") id: String,
        @Body mangaEntry: MangaEntry,
    ): JsonApiResponse<MangaEntry>


    /**
     * Follow
     */

    @POST("follows")
    suspend fun createFollow(
        @Body follow: Follow
    ): JsonApiResponse<Follow>

    @DELETE("follows/{id}")
    suspend fun deleteFollow(
        @Path("id") id: String,
    ): JsonApiResponse<Unit>


    /**
     * People
     */

    @GET("peoples")
    suspend fun getPeoples(@QueryMap params: JsonApiParams = JsonApiParams()): JsonApiResponse<List<People>>

    @GET("peoples/{id}")
    suspend fun getPeople(
        @Path("id") id: String,
        @QueryMap params: JsonApiParams = JsonApiParams()
    ): JsonApiResponse<People>

    /**
     * Request
     */
    @POST("requests")
    suspend fun createRequest(
        @Body request: Request
    ): JsonApiResponse<Request>


    /**
     * Review
     */

    @GET("reviews/{id}")
    suspend fun getReview(
        @Path("id") id: String,
        @QueryMap params: JsonApiParams = JsonApiParams()
    ): JsonApiResponse<Review>

    @POST("reviews")
    suspend fun createReview(
        @Body review: Review
    ): JsonApiResponse<Review>

    @PATCH("reviews/{id}")
    suspend fun updateReview(
        @Path("id") id: String,
        @Body review: Review,
    ): JsonApiResponse<Review>

    /**
     * Season
     * */

    @GET("seasons/{id}/episodes")
    suspend fun getSeasonEpisodes(
        @Path("id") seasonId: String,
        @QueryMap params: JsonApiParams = JsonApiParams()
    ): JsonApiResponse<List<Episode>>


    /**
     * User
     */

    @GET("users")
    suspend fun getUsers(@QueryMap params: JsonApiParams = JsonApiParams()): JsonApiResponse<List<User>>

    @GET
    suspend fun loadMoreUser(@Url next: String): JsonApiResponse<List<User>>

    @GET("users/{id}")
    suspend fun getUser(
        @Path("id") id: String,
        @QueryMap params: JsonApiParams = JsonApiParams()
    ): JsonApiResponse<User>

    @POST("users")
    suspend fun createUser(
        @Body user: User
    ): JsonApiResponse<User>

    @PATCH("users/{id}")
    suspend fun updateUser(
        @Path("id") id: String,
        @Body user: User,
    ): JsonApiResponse<User>


    @GET("users/{id}/followers")
    suspend fun getUserFollowers(
        @Path("id") userId: String,
        @QueryMap params: JsonApiParams = JsonApiParams()
    ): JsonApiResponse<List<Follow>>

    @GET("users/{id}/following")
    suspend fun getUserFollowing(
        @Path("id") userId: String,
        @QueryMap params: JsonApiParams = JsonApiParams()
    ): JsonApiResponse<List<Follow>>

    @GET("users/{id}/manga-library")
    suspend fun getUserMangaLibrary(
        @Path("id") userId: String,
        @QueryMap params: JsonApiParams = JsonApiParams()
    ): JsonApiResponse<List<MangaEntry>>

    @GET("users/{id}/anime-library")
    suspend fun getUserAnimeLibrary(
        @Path("id") userId: String,
        @QueryMap params: JsonApiParams = JsonApiParams()
    ): JsonApiResponse<List<AnimeEntry>>

    @GET("users/{id}/manga-favorites")
    suspend fun getUserMangaFavorites(
        @Path("id") userId: String,
        @QueryMap params: JsonApiParams = JsonApiParams()
    ): JsonApiResponse<List<MangaEntry>>

    @GET("users/{id}/anime-favorites")
    suspend fun getUserAnimeFavorites(
        @Path("id") userId: String,
        @QueryMap params: JsonApiParams = JsonApiParams()
    ): JsonApiResponse<List<AnimeEntry>>
}