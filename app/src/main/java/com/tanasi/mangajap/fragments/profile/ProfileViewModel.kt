package com.tanasi.mangajap.fragments.profile

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.mangajap.MangaJapApplication
import com.tanasi.mangajap.models.Follow
import com.tanasi.mangajap.models.User
import com.tanasi.mangajap.services.MangaJapApiService
import com.tanasi.mangajap.utils.jsonApi.JsonApiBody
import com.tanasi.mangajap.utils.jsonApi.JsonApiParams
import com.tanasi.mangajap.utils.jsonApi.JsonApiResponse
import com.tanasi.mangajap.utils.preferences.UserPreference
import kotlinx.coroutines.async
import kotlinx.coroutines.launch

class ProfileViewModel : ViewModel() {

    private val mangaJapApiService: MangaJapApiService = MangaJapApiService.build()

    private val _state: MutableLiveData<State> = MutableLiveData(State.Loading)
    val state: LiveData<State> = _state

    sealed class State {
        object Loading: State()
        data class SuccessLoading(val user: User, val followed: Follow?, val follower: Follow?): State()
        data class FailedLoading(val error: JsonApiResponse.Error): State()

        object UpdatingFollowed: State()
        data class SuccessUpdatingFollowed(val followed: Follow?): State()
        data class FailedUpdatingFollowed(val error: JsonApiResponse.Error): State()
    }

    fun getProfile(userId: String?) = viewModelScope.launch {
        _state.value = State.Loading

        _state.value = try {
            if (userId == null) {
                val response = mangaJapApiService.getUsers(
                        JsonApiParams(
                                include = listOf("manga-library.manga", "anime-library.anime", "manga-favorites.manga", "anime-favorites.anime"),
                                fields = mapOf(
                                        "manga" to listOf( "canonicalTitle", "coverImage", "volumeCount", "chapterCount"),
                                        "anime" to listOf("canonicalTitle", "coverImage", "episodeCount")
                                ),
                                filter = mapOf("self" to listOf("true"))
                        )
                )
                when (response) {
                    is JsonApiResponse.Success -> State.SuccessLoading(response.body.data!!.first(), null, null)
                    is JsonApiResponse.Error -> State.FailedLoading(response)
                }
            } else {
                val selfId = UserPreference(MangaJapApplication.context).selfId

                val userResponseDeferred = async { mangaJapApiService.getUser(
                        userId,
                        JsonApiParams(
                                include = listOf("manga-library.manga", "anime-library.anime", "manga-favorites.manga", "anime-favorites.anime"),
                                fields = mapOf(
                                        "manga" to listOf( "canonicalTitle", "coverImage", "volumeCount", "chapterCount"),
                                        "anime" to listOf("canonicalTitle", "coverImage", "episodeCount")
                                )
                        )
                ) }
                val followedResponseDeferred = async {
                    if (userId != selfId) {
                        mangaJapApiService.getFollows(
                                JsonApiParams(
                                        filter = mapOf(
                                                "followerId" to listOf(selfId),
                                                "followedId" to listOf(userId)
                                        )
                                )
                        )
                    } else {
                        JsonApiResponse.Success(200, JsonApiBody("", listOf()))
                    }
                }
                val followerResponseDeferred = async {
                    if (userId != selfId) {
                        mangaJapApiService.getFollows(
                                JsonApiParams(
                                        filter = mapOf(
                                                "followerId" to listOf(userId),
                                                "followedId" to listOf(selfId)
                                        )
                                )
                        )
                    } else {
                        JsonApiResponse.Success(200, JsonApiBody("", listOf()))
                    }
                }

                val userResponse = userResponseDeferred.await()
                val followedResponse = followedResponseDeferred.await()
                val followerResponse = followerResponseDeferred.await()

                when {
                    userResponse is JsonApiResponse.Success &&
                            followedResponse is JsonApiResponse.Success &&
                            followerResponse is JsonApiResponse.Success -> State.SuccessLoading(
                            userResponse.body.data!!,
                            followedResponse.body.data?.firstOrNull(),
                            followerResponse.body.data?.firstOrNull()
                    )

                    userResponse is JsonApiResponse.Success -> State.FailedLoading(JsonApiResponse.Error.UnknownError(Exception("Unable to load user data")))
                    userResponse is JsonApiResponse.Error -> State.FailedLoading(userResponse)

                    followedResponse is JsonApiResponse.Success -> State.FailedLoading(JsonApiResponse.Error.UnknownError(Exception("Unable to load followed data")))
                    followedResponse is JsonApiResponse.Error -> State.FailedLoading(followedResponse)

                    followerResponse is JsonApiResponse.Success -> State.FailedLoading(JsonApiResponse.Error.UnknownError(Exception("Unable to load follower data")))
                    followerResponse is JsonApiResponse.Error -> State.FailedLoading(followerResponse)

                    else -> State.FailedLoading(JsonApiResponse.Error.UnknownError(Exception("Unable to load data")))
                }
            }
        } catch (e: Exception) {
            State.FailedLoading(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun follow(follow: Follow) = viewModelScope.launch {
        _state.value = State.UpdatingFollowed

        val response = mangaJapApiService.createFollow(
                follow
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.SuccessUpdatingFollowed(response.body.data!!)
                is JsonApiResponse.Error -> State.FailedUpdatingFollowed(response)
            }
        } catch (e: Exception) {
            State.FailedUpdatingFollowed(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun deleteFollow(follow: Follow) = viewModelScope.launch {
        _state.value = State.UpdatingFollowed

        val response = mangaJapApiService.deleteFollow(
                follow.id
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.SuccessUpdatingFollowed(null)
                is JsonApiResponse.Error -> State.FailedUpdatingFollowed(response)
            }
        } catch (e: Exception) {
            State.FailedUpdatingFollowed(JsonApiResponse.Error.UnknownError(e))
        }
    }
}