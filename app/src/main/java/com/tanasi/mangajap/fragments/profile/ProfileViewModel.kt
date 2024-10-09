package com.tanasi.mangajap.fragments.profile

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.jsonapi.bodies.JsonApiBody
import com.tanasi.mangajap.models.Follow
import com.tanasi.mangajap.models.User
import com.tanasi.mangajap.utils.MangaJapApi
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.launch

class ProfileViewModel(userId: String) : ViewModel() {

    private val _state: MutableStateFlow<State> = MutableStateFlow(State.Loading)
    private val _follow: MutableStateFlow<FollowState?> = MutableStateFlow(null)
    val state: Flow<State> = combine(
        _state,
        _follow,
    ) { state, follow ->
        when (state) {
            is State.SuccessLoading -> {
                when (follow) {
                    is FollowState.SuccessUpdatingFollowed -> {
                        State.SuccessLoading(
                            state.user,
                            follow.followed,
                            state.follower,
                        )
                    }

                    else -> state
                }
            }

            else -> state
        }
    }

    sealed class State {
        data object Loading : State()

        data class SuccessLoading(
            val user: User,
            val followed: Follow?,
            val follower: Follow?
        ) : State()

        data class FailedLoading(val error: JsonApiResponse.Error) : State()
    }

    sealed class FollowState {
        data object UpdatingFollowed : FollowState()
        data class SuccessUpdatingFollowed(val followed: Follow?) : FollowState()
        data class FailedUpdatingFollowed(val error: JsonApiResponse.Error) : FollowState()
    }

    init {
        getProfile(userId)
    }


    private fun getProfile(userId: String) = viewModelScope.launch(Dispatchers.IO) {
        _state.emit(State.Loading)

        try {
            val selfId = Firebase.auth.uid!!

            val userResponseDeferred = async {
                MangaJapApi.Users.details(
                    userId,
                    include = listOf(
                        "manga-library.manga",
                        "anime-library.anime",
                        "manga-favorites.manga",
                        "anime-favorites.anime"
                    ),
                    fields = mapOf(
                        "manga" to listOf("title", "coverImage", "volumeCount", "chapterCount"),
                        "anime" to listOf("title", "coverImage", "episodeCount")
                    ),
                )
            }
            val followedResponseDeferred = async {
                if (userId != selfId) {
                    MangaJapApi.Follows.list(
                        filter = mapOf(
                            "follower" to listOf(selfId),
                            "followed" to listOf(userId)
                        )
                    )
                } else {
                    JsonApiResponse.Success(200, JsonApiBody("", listOf()))
                }
            }
            val followerResponseDeferred = async {
                if (userId != selfId) {
                    MangaJapApi.Follows.list(
                        filter = mapOf(
                            "follower" to listOf(userId),
                            "followed" to listOf(selfId)
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
                        followerResponse is JsonApiResponse.Success -> {
                    _state.emit(
                        State.SuccessLoading(
                            userResponse.body.data!!,
                            followedResponse.body.data?.firstOrNull(),
                            followerResponse.body.data?.firstOrNull()
                        )
                    )
                }

                userResponse is JsonApiResponse.Success -> {
                    _state.emit(State.FailedLoading(JsonApiResponse.Error.UnknownError(Exception("Unable to load user data"))))
                }

                userResponse is JsonApiResponse.Error -> {
                    _state.emit(State.FailedLoading(userResponse))
                }

                followedResponse is JsonApiResponse.Success -> {
                    _state.emit(State.FailedLoading(JsonApiResponse.Error.UnknownError(Exception("Unable to load followed data"))))
                }

                followedResponse is JsonApiResponse.Error -> {
                    _state.emit(State.FailedLoading(followedResponse))
                }

                followerResponse is JsonApiResponse.Success -> {
                    _state.emit(State.FailedLoading(JsonApiResponse.Error.UnknownError(Exception("Unable to load follower data"))))
                }

                followerResponse is JsonApiResponse.Error -> {
                    _state.emit(State.FailedLoading(followerResponse))
                }

                else -> {
                    _state.emit(State.FailedLoading(JsonApiResponse.Error.UnknownError(Exception("Unable to load data"))))
                }
            }
        } catch (e: Exception) {
            Log.e("ProfileViewModel", "getProfile: ", e)
            _state.emit(State.FailedLoading(JsonApiResponse.Error.UnknownError(e)))
        }
    }

    fun follow(follow: Follow) = viewModelScope.launch(Dispatchers.IO) {
        _follow.emit(FollowState.UpdatingFollowed)

        try {
            val response = MangaJapApi.Follows.create(follow)

            when (response) {
                is JsonApiResponse.Success -> {
                    _follow.emit(FollowState.SuccessUpdatingFollowed(response.body.data!!))
                }

                is JsonApiResponse.Error -> {
                    _follow.emit(FollowState.FailedUpdatingFollowed(response))
                }
            }
        } catch (e: Exception) {
            Log.e("ProfileViewModel", "follow: ", e)
            _follow.emit(FollowState.FailedUpdatingFollowed(JsonApiResponse.Error.UnknownError(e)))
        }
    }

    fun unfollow(follow: Follow) = viewModelScope.launch(Dispatchers.IO) {
        _follow.emit(FollowState.UpdatingFollowed)

        try {
            val response = MangaJapApi.Follows.delete(follow.id!!)

            when (response) {
                is JsonApiResponse.Success -> {
                    _follow.emit(FollowState.SuccessUpdatingFollowed(null))
                }

                is JsonApiResponse.Error -> {
                    _follow.emit(FollowState.FailedUpdatingFollowed(response))
                }
            }
        } catch (e: Exception) {
            Log.e("ProfileViewModel", "unfollow: ", e)
            _follow.emit(FollowState.FailedUpdatingFollowed(JsonApiResponse.Error.UnknownError(e)))
        }
    }
}