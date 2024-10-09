package com.tanasi.mangajap.fragments.follow

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.jsonapi.JsonApiParams
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.fragments.follow.FollowFragment.FollowType
import com.tanasi.mangajap.models.Follow
import com.tanasi.mangajap.services.MangaJapApiService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

class FollowViewModel(userId: String, followType: FollowType) : ViewModel() {

    private val mangaJapApiService: MangaJapApiService = MangaJapApiService.build()

    private val _state = MutableStateFlow<State>(State.Loading)
    val state: Flow<State> = _state

    sealed class State {
        data object Loading : State()
        data object LoadingMore : State()
        data class SuccessLoading(
            val followList: List<Follow>,
            val nextLink: String
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
            val response = mangaJapApiService.getUserFollowers(
                userId,
                JsonApiParams(
                    include = listOf("follower"),
                    sort = listOf("-createdAt"),
                    limit = 15,
                )
            )

            when (response) {
                is JsonApiResponse.Success -> {
                    _state.emit(
                        State.SuccessLoading(
                            followList = response.body.data!!,
                            nextLink = response.body.links?.next ?: ""
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
            val response = mangaJapApiService.getUserFollowing(
                userId,
                JsonApiParams(
                    include = listOf("followed"),
                    sort = listOf("-createdAt"),
                    limit = 15,
                )
            )

            when (response) {
                is JsonApiResponse.Success -> {
                    _state.emit(
                        State.SuccessLoading(
                            followList = response.body.data!!,
                            nextLink = response.body.links?.next ?: ""
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

    fun loadMoreFollowers(nextLink: String) = viewModelScope.launch(Dispatchers.IO) {
        val currentState = _state.first()
        if (currentState is State.SuccessLoading) {
            _state.emit(State.LoadingMore)

            try {
                val response = mangaJapApiService.loadMoreFollows(
                    nextLink
                )

                when (response) {
                    is JsonApiResponse.Success -> {
                        _state.emit(
                            State.SuccessLoading(
                                followList = currentState.followList + response.body.data!!,
                                nextLink = response.body.links?.next ?: ""
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

    fun loadMoreFollowing(nextLink: String) = viewModelScope.launch(Dispatchers.IO) {
        val currentState = _state.first()
        if (currentState is State.SuccessLoading) {
            _state.emit(State.LoadingMore)

            try {
                val response = mangaJapApiService.loadMoreFollows(
                    nextLink
                )

                when (response) {
                    is JsonApiResponse.Success -> {
                        _state.emit(
                            State.SuccessLoading(
                                followList = currentState.followList + response.body.data!!,
                                nextLink = response.body.links?.next ?: ""
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