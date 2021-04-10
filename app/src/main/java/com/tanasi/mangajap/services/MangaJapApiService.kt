package com.tanasi.mangajap.services

import com.tanasi.mangajap.MangaJapApplication
import com.tanasi.mangajap.models.*
import com.tanasi.mangajap.utils.jsonApi.JsonApiParams
import com.tanasi.mangajap.utils.jsonApi.JsonApiResponse
import com.tanasi.mangajap.utils.jsonApi.adapter.JsonApiCallAdapterFactory
import com.tanasi.mangajap.utils.jsonApi.converter.JsonApiConverterFactory
import com.tanasi.mangajap.utils.oauth2.OAuth2Response
import com.tanasi.mangajap.utils.oauth2.adapter.OAuth2CallAdapterFactory
import com.tanasi.mangajap.utils.oauth2.converter.OAuth2ConverterFactory
import com.tanasi.mangajap.utils.preferences.UserPreference
import okhttp3.OkHttpClient
import okhttp3.Request
import retrofit2.Retrofit
import retrofit2.http.*

interface MangaJapApiService {

    companion object {
        fun build(): MangaJapApiService {
            val client = OkHttpClient.Builder().addInterceptor { chain ->
                val newRequest: Request = chain.request().newBuilder()
                        .addHeader("Authorization", "Bearer ${UserPreference(MangaJapApplication.context).accessToken}")
                        .addHeader("Accept", "application/json")
                        .build()
                chain.proceed(newRequest)
            }.build()

            val retrofit = Retrofit.Builder()
                    .baseUrl("http://mangajap.000webhostapp.com/api/")
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
     * Authentication
     */

    @FormUrlEncoded
    @POST("oauth/token")
    suspend fun login(
            @Field("username") username: String,
            @Field("password") password: String,
            @Field("grant_type") grantType: String = "password",
            @Field("REQUEST_METHOD") method: String = "POST"
    ): OAuth2Response

    @FormUrlEncoded
    @POST("forgot-password")
    suspend fun forgotPassword(
            @Field("email") email: String,
            @Field("pseudo") pseudo: String,
            @Field("REQUEST_METHOD") method: String = "POST"
    ): OAuth2Response

    @FormUrlEncoded
    @POST("reset-password")
    suspend fun resetPassword(
            @Query("token") token: String,
            @Field("password") password: String,
            @Field("REQUEST_METHOD") method: String = "PATCH"
    ): JsonApiResponse<User>




    /**
     * Anime
     */

    @GET("anime")
    suspend fun getAnime(@QueryMap params: JsonApiParams = JsonApiParams()): JsonApiResponse<List<Anime>>

    @GET
    suspend fun loadMoreAnime(@Url next: String): JsonApiResponse<List<Anime>>

    @GET("anime/{id}")
    suspend fun getAnime(@Path("id") id: String, @QueryMap params: JsonApiParams = JsonApiParams()): JsonApiResponse<Anime>

    @GET("trending/anime")
    suspend fun getTrendingAnime(@QueryMap params: JsonApiParams = JsonApiParams()): JsonApiResponse<List<Anime>>

    @GET("anime/{id}/reviews")
    suspend fun getAnimeReviews(@Path("id") animeId: String, @QueryMap params: JsonApiParams = JsonApiParams()): JsonApiResponse<List<Review>>


    /**
     * AnimeEntry
     */

    @POST("anime-entries")
    suspend fun createAnimeEntry(
            @Body animeEntry: AnimeEntry
    ): JsonApiResponse<AnimeEntry>

    @FormUrlEncoded
    @POST("anime-entries/{id}")
    suspend fun updateAnimeEntry(
            @Path("id") id: String,
            @Field("data") animeEntry: String,
            @Field("REQUEST_METHOD") method: String = "PATCH"
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
    suspend fun getManga(@Path("id") id: String, @QueryMap params: JsonApiParams = JsonApiParams()): JsonApiResponse<Manga>

    @GET("trending/manga")
    suspend fun getTrendingManga(@QueryMap params: JsonApiParams = JsonApiParams()): JsonApiResponse<List<Manga>>

    @GET("manga/{id}/reviews")
    suspend fun getMangaReviews(@Path("id") mangaId: String, @QueryMap params: JsonApiParams = JsonApiParams()): JsonApiResponse<List<Review>>


    /**
     * AnimeEntry
     */

    @POST("manga-entries")
    suspend fun createMangaEntry(
            @Body mangaEntry: MangaEntry
    ): JsonApiResponse<MangaEntry>

    @FormUrlEncoded
    @POST("manga-entries/{id}")
    suspend fun updateMangaEntry(
            @Path("id") id: String,
            @Field("data") mangaEntry: String,
            @Field("REQUEST_METHOD") method: String = "PATCH"
    ): JsonApiResponse<MangaEntry>


    /**
     * Follow
     */

    @POST("follows")
    suspend fun createFollow(
            @Body follow: Follow
    ): JsonApiResponse<Follow>

    @FormUrlEncoded
    @POST("follows/{id}")
    suspend fun deleteFollow(
            @Path("id") id: String,
            @Field("REQUEST_METHOD") method: String = "DELETE"
    ): JsonApiResponse<Unit>


    /**
     * People
     */

    @GET("people")
    suspend fun getPeoples(@QueryMap params: JsonApiParams = JsonApiParams()): JsonApiResponse<List<People>>

    @GET("people/{id}")
    suspend fun getPeople(@Path("id") id: String, @QueryMap params: JsonApiParams = JsonApiParams()): JsonApiResponse<People>

    /**
     * Request
     */
    @POST("requests")
    suspend fun createRequest(
            @Body request: com.tanasi.mangajap.models.Request
    ): JsonApiResponse<com.tanasi.mangajap.models.Request>

    @FormUrlEncoded
    @POST("requests/{id}")
    suspend fun updateRequest(
            @Path("id") id: String,
            @Field("data") request: String,
            @Field("REQUEST_METHOD") method: String = "PATCH"
    ): JsonApiResponse<com.tanasi.mangajap.models.Request>


    /**
     * Review
     */

    @GET("reviews/{id}")
    suspend fun getReview(@Path("id") id: String, @QueryMap params: JsonApiParams = JsonApiParams()): JsonApiResponse<Review>

    @POST("reviews")
    suspend fun createReview(
            @Body review: Review
    ): JsonApiResponse<Review>

    @FormUrlEncoded
    @POST("reviews/{id}")
    suspend fun updateReview(
            @Path("id") id: String,
            @Field("data") review: String,
            @Field("REQUEST_METHOD") method: String = "PATCH"
    ): JsonApiResponse<Review>


    /**
     * User
     */

    @GET("users")
    suspend fun getUsers(@QueryMap params: JsonApiParams = JsonApiParams()): JsonApiResponse<List<User>>

    @GET
    suspend fun loadMoreUser(@Url next: String): JsonApiResponse<List<User>>

    @GET("users/{id}")
    suspend fun getUser(@Path("id") id: String, @QueryMap params: JsonApiParams = JsonApiParams()): JsonApiResponse<User>

    @POST("users")
    suspend fun createUser(
            @Body user: User
    ): JsonApiResponse<User>

    @FormUrlEncoded
    @POST("users/{id}")
    suspend fun updateUser(
            @Path("id") id: String,
            @Field("data") user: String,
            @Field("REQUEST_METHOD") method: String = "PATCH"
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

    @GET("users/{id}/requests")
    suspend fun getUserRequests(
            @Path("id") userId: String,
            @QueryMap params: JsonApiParams = JsonApiParams()
    ): JsonApiResponse<List<com.tanasi.mangajap.models.Request>>

}