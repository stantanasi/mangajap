package com.tanasi.mangajap.utils

import com.google.android.gms.tasks.Tasks
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.tanasi.jsonapi.JsonApiParams
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.jsonapi.callAdapter.JsonApiCallAdapterFactory
import com.tanasi.jsonapi.converter.JsonApiConverterFactory
import com.tanasi.mangajap.models.AnimeEntry
import com.tanasi.mangajap.models.Episode
import com.tanasi.mangajap.models.Follow
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
import java.util.concurrent.TimeUnit

object MangaJapApi {

    private val service = Service.build()

    object Anime {

        suspend fun list(
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<List<com.tanasi.mangajap.models.Anime>> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.getAnime(params)
        }

        suspend fun details(
            id: String,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<com.tanasi.mangajap.models.Anime> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.getAnime(id, params)
        }

        suspend fun seasons(
            id: String,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<List<Season>> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.getAnimeSeasons(id, params)
        }

        suspend fun reviews(
            id: String,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<List<Review>> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.getAnimeReviews(id, params)
        }
    }

    object AnimeEntries {

        suspend fun create(
            animeEntry: AnimeEntry,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<AnimeEntry> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.createAnimeEntry(animeEntry, params)
        }

        suspend fun update(
            id: String,
            animeEntry: AnimeEntry,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<AnimeEntry> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.updateAnimeEntry(id, animeEntry, params)
        }
    }

    object Follows {

        suspend fun list(
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<List<Follow>> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.getFollows(params)
        }

        suspend fun create(
            follow: Follow,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<Follow> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.createFollow(follow, params)
        }

        suspend fun delete(
            id: String,
        ): JsonApiResponse<Unit> {
            return service.deleteFollow(id)
        }
    }

    object Manga {

        suspend fun list(
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<List<com.tanasi.mangajap.models.Manga>> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.getManga(params)
        }

        suspend fun details(
            id: String,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<com.tanasi.mangajap.models.Manga> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.getManga(id, params)
        }

        suspend fun reviews(
            id: String,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<List<Review>> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.getMangaReviews(id, params)
        }
    }

    object MangaEntries {

        suspend fun create(
            animeEntry: MangaEntry,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<MangaEntry> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.createMangaEntry(animeEntry, params)
        }

        suspend fun update(
            id: String,
            animeEntry: MangaEntry,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<MangaEntry> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.updateMangaEntry(id, animeEntry, params)
        }
    }

    object Peoples {

        suspend fun list(
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<List<People>> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.getPeoples(params)
        }

        suspend fun details(
            id: String,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<People> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.getPeople(id, params)
        }
    }

    object Requests {

        suspend fun create(
            request: Request,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<Request> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.createRequest(request, params)
        }
    }

    object Reviews {

        suspend fun details(
            id: String,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<Review> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.getReview(id, params)
        }

        suspend fun create(
            review: Review,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<Review> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.createReview(review, params)
        }

        suspend fun update(
            id: String,
            review: Review,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<Review> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.updateReview(id, review, params)
        }
    }

    object Seasons {

        suspend fun episodes(
            id: String,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<List<Episode>> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.getSeasonEpisodes(id, params)
        }
    }

    object Users {

        suspend fun list(
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<List<User>> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.getUsers(params)
        }

        suspend fun details(
            id: String,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<User> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.getUser(id, params)
        }

        suspend fun create(
            user: User,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<User> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.createUser(user, params)
        }

        suspend fun update(
            id: String,
            user: User,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<User> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.updateUser(id, user, params)
        }

        suspend fun followers(
            id: String,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<List<Follow>> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.getUserFollowers(id, params)
        }

        suspend fun following(
            id: String,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<List<Follow>> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.getUserFollowing(id, params)
        }

        suspend fun animeLibrary(
            id: String,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<List<AnimeEntry>> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.getUserAnimeLibrary(id, params)
        }

        suspend fun mangaLibrary(
            id: String,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<List<MangaEntry>> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.getUserMangaLibrary(id, params)
        }

        suspend fun animeFavorites(
            id: String,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<List<AnimeEntry>> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.getUserAnimeFavorites(id, params)
        }

        suspend fun mangaFavorites(
            id: String,
            include: List<String>? = null,
            fields: Map<String, List<String>>? = null,
            sort: List<String>? = null,
            limit: Int? = null,
            offset: Int? = null,
            filter: Map<String, List<String>>? = null,
        ): JsonApiResponse<List<MangaEntry>> {
            val params = JsonApiParams(include, fields, sort, limit, offset, filter)
            return service.getUserMangaFavorites(id, params)
        }
    }


    private interface Service {

        companion object {
            fun build(): Service {
                val client = OkHttpClient.Builder().addInterceptor { chain ->
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
                }.build()

                val retrofit = Retrofit.Builder()
                    .baseUrl("https://api-za7rwcomoa-uc.a.run.app/")
                    .client(client)
                    .addCallAdapterFactory(OAuth2CallAdapterFactory.create())
                    .addConverterFactory(OAuth2ConverterFactory.create())
                    .addCallAdapterFactory(JsonApiCallAdapterFactory.create())
                    .addConverterFactory(JsonApiConverterFactory.create())
                    .build()

                return retrofit.create(Service::class.java)
            }
        }


        @GET("anime")
        suspend fun getAnime(
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<List<com.tanasi.mangajap.models.Anime>>

        @GET("anime/{id}")
        suspend fun getAnime(
            @Path("id") id: String,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<com.tanasi.mangajap.models.Anime>

        @GET("anime/{id}/seasons")
        suspend fun getAnimeSeasons(
            @Path("id") animeId: String,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<List<Season>>

        @GET("anime/{id}/reviews")
        suspend fun getAnimeReviews(
            @Path("id") animeId: String,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<List<Review>>


        @POST("anime-entries")
        suspend fun createAnimeEntry(
            @Body animeEntry: AnimeEntry,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<AnimeEntry>

        @PATCH("anime-entries/{id}")
        suspend fun updateAnimeEntry(
            @Path("id") id: String,
            @Body animeEntry: AnimeEntry,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<AnimeEntry>


        @GET("follows")
        suspend fun getFollows(
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<List<Follow>>

        @POST("follows")
        suspend fun createFollow(
            @Body follow: Follow,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<Follow>

        @DELETE("follows/{id}")
        suspend fun deleteFollow(
            @Path("id") id: String,
        ): JsonApiResponse<Unit>


        @GET("manga")
        suspend fun getManga(
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<List<com.tanasi.mangajap.models.Manga>>

        @GET("manga/{id}")
        suspend fun getManga(
            @Path("id") id: String,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<com.tanasi.mangajap.models.Manga>

        @GET("manga/{id}/reviews")
        suspend fun getMangaReviews(
            @Path("id") mangaId: String,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<List<Review>>


        @POST("manga-entries")
        suspend fun createMangaEntry(
            @Body mangaEntry: MangaEntry,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<MangaEntry>

        @PATCH("manga-entries/{id}")
        suspend fun updateMangaEntry(
            @Path("id") id: String,
            @Body mangaEntry: MangaEntry,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<MangaEntry>


        @GET("peoples")
        suspend fun getPeoples(
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<List<People>>

        @GET("peoples/{id}")
        suspend fun getPeople(
            @Path("id") id: String,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<People>


        @POST("requests")
        suspend fun createRequest(
            @Body request: Request,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<Request>


        @GET("reviews/{id}")
        suspend fun getReview(
            @Path("id") id: String,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<Review>

        @POST("reviews")
        suspend fun createReview(
            @Body review: Review,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<Review>

        @PATCH("reviews/{id}")
        suspend fun updateReview(
            @Path("id") id: String,
            @Body review: Review,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<Review>


        @GET("seasons/{id}/episodes")
        suspend fun getSeasonEpisodes(
            @Path("id") seasonId: String,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<List<Episode>>


        @GET("users")
        suspend fun getUsers(
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<List<User>>

        @GET("users/{id}")
        suspend fun getUser(
            @Path("id") id: String,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<User>

        @POST("users")
        suspend fun createUser(
            @Body user: User,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<User>

        @PATCH("users/{id}")
        suspend fun updateUser(
            @Path("id") id: String,
            @Body user: User,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<User>


        @GET("users/{id}/followers")
        suspend fun getUserFollowers(
            @Path("id") userId: String,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<List<Follow>>

        @GET("users/{id}/following")
        suspend fun getUserFollowing(
            @Path("id") userId: String,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<List<Follow>>

        @GET("users/{id}/anime-library")
        suspend fun getUserAnimeLibrary(
            @Path("id") userId: String,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<List<AnimeEntry>>

        @GET("users/{id}/manga-library")
        suspend fun getUserMangaLibrary(
            @Path("id") userId: String,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<List<MangaEntry>>

        @GET("users/{id}/anime-favorites")
        suspend fun getUserAnimeFavorites(
            @Path("id") userId: String,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<List<AnimeEntry>>

        @GET("users/{id}/manga-favorites")
        suspend fun getUserMangaFavorites(
            @Path("id") userId: String,
            @QueryMap params: JsonApiParams = JsonApiParams(),
        ): JsonApiResponse<List<MangaEntry>>
    }
}