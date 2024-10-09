package com.tanasi.mangajap.fragments.follow

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.fragments.follow.FollowFragment.FollowType
import com.tanasi.mangajap.models.Follow
import com.tanasi.mangajap.utils.MangaJapApi
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

class FollowViewModel(private val userId: String, followType: FollowType) : ViewModel() {

    private val _state = MutableStateFlow<State>(State.Loading)
    val state: Flow<State> = _state

    private var page = 0

    sealed class State {
        data object Loading : State()
        data object LoadingMore : State()
        data class SuccessLoading(
            val followList: List<Follow>,
            val hasMore: Boolean
        ) : State()

        data class FailedLoading(val error: JsonApiResponse.Error) : State()
    }

    init {
        when (followType) {
            FollowType.Followers -> getFollowers(userId)
            FollowType.Following -> getFollowing(userId)
        }
    }


    private fun getFollowers(userId: String) = viewModelScope.launch(Dispatchers.IO) {
        _state.emit(State.Loading)

        try {
            val response = MangaJapApi.Users.followers(
                userId,
                include = listOf("follower"),
                sort = listOf("-createdAt"),
                limit = 15,
            )

            when (response) {
                is JsonApiResponse.Success -> {
                    _state.emit(
                        State.SuccessLoading(
                            followList = response.body.data!!,
                            hasMore = response.body.links?.next?.takeIf { it.isNotEmpty() } != null
                        )
                    )
                }

                is JsonApiResponse.Error -> {
                    _state.emit(State.FailedLoading(response))
                }
            }
        } catch (e: Exception) {
            _state.emit(State.FailedLoading(JsonApiResponse.Error.UnknownError(e)))
        }
    }

    private fun getFollowing(userId: String) = viewModelScope.launch(Dispatchers.IO) {
        _state.emit(State.Loading)

        try {
            val response = MangaJapApi.Users.following(
                userId,
                include = listOf("followed"),
                sort = listOf("-createdAt"),
                limit = 15,
            )

            when (response) {
                is JsonApiResponse.Success -> {
                    _state.emit(
                        State.SuccessLoading(
                            followList = response.body.data!!,
                            hasMore = response.body.links?.next?.takeIf { it.isNotEmpty() } != null
                        )
                    )
                }

                is JsonApiResponse.Error -> {
                    _state.emit(State.FailedLoading(response))
                }
            }
        } catch (e: Exception) {
            _state.emit(State.FailedLoading(JsonApiResponse.Error.UnknownError(e)))
        }
    }

    fun loadMoreFollowers() = viewModelScope.launch(Dispatchers.IO) {
        val currentState = _state.first()
        if (currentState is State.SuccessLoading) {
            _state.emit(State.LoadingMore)

            try {
                val response = MangaJapApi.Users.followers(
                    userId,
                    include = listOf("follower"),
                    sort = listOf("-createdAt"),
                    limit = 15,
                    offset = 15 * (page + 1)
                )

                page += 1

                when (response) {
                    is JsonApiResponse.Success -> {
                        _state.emit(
                            State.SuccessLoading(
                                followList = currentState.followList + response.body.data!!,
                                hasMore = response.body.links?.next?.takeIf { it.isNotEmpty() } != null
                            )
                        )
                    }

                    is JsonApiResponse.Error -> {
                        _state.emit(State.FailedLoading(response))
                    }
                }
            } catch (e: Exception) {
                _state.emit(State.FailedLoading(JsonApiResponse.Error.UnknownError(e)))
            }
        }
    }

    fun loadMoreFollowing() = viewModelScope.launch(Dispatchers.IO) {
        val currentState = _state.first()
        if (currentState is State.SuccessLoading) {
            _state.emit(State.LoadingMore)

            try {
                val response = MangaJapApi.Users.following(
                    userId,
                    include = listOf("followed"),
                    sort = listOf("-createdAt"),
                    limit = 15,
                    offset = 15 * (page + 1)
                )

                page += 1

                when (response) {
                    is JsonApiResponse.Success -> {
                        _state.emit(
                            State.SuccessLoading(
                                followList = currentState.followList + response.body.data!!,
                                hasMore = response.body.links?.next?.takeIf { it.isNotEmpty() } != null
                            )
                        )
                    }

                    is JsonApiResponse.Error -> {
                        _state.emit(State.FailedLoading(response))
                    }
                }
            } catch (e: Exception) {
                _state.emit(State.FailedLoading(JsonApiResponse.Error.UnknownError(e)))
            }
        }
    }
}