package com.tanasi.mangajap.fragments.follow

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.jsonapi.JsonApiParams
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.services.MangaJapApiService
import kotlinx.coroutines.launch

class FollowViewModel : ViewModel() {

    private val mangaJapApiService: MangaJapApiService = MangaJapApiService.build()

    private val _state: MutableLiveData<State> = MutableLiveData(State.Loading)
    val state: LiveData<State> = _state

    sealed class State {
        object Loading: State()
        data class SuccessLoading(val followList: List<AppAdapter.Item>, val nextLink: String): State()
        data class FailedLoading(val error: JsonApiResponse.Error): State()

        object LoadingMore: State()
        data class SuccessLoadingMore(val followList: List<AppAdapter.Item>, val nextLink: String): State()
        data class FailedLoadingMore(val error: JsonApiResponse.Error): State()
    }

    fun getFollowers(userId: String) = viewModelScope.launch {
        _state.value = State.Loading

        val response = mangaJapApiService.getUserFollowers(
            userId,
            JsonApiParams(
                include = listOf("follower"),
                sort = listOf("-createdAt"),
                limit = 15,
            )
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.SuccessLoading(
                    response.body.data!!.map { it.apply { typeLayout = AppAdapter.Type.FOLLOWERS } },
                    response.body.links?.next ?: ""
                )
                is JsonApiResponse.Error -> State.FailedLoading(response)
            }
        } catch (e: Exception) {
            State.FailedLoading(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun getFollowing(userId: String) = viewModelScope.launch {
        _state.value = State.Loading

        val response = mangaJapApiService.getUserFollowing(
            userId,
            JsonApiParams(
                include = listOf("followed"),
                sort = listOf("-createdAt"),
                limit = 15,
            )
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.SuccessLoading(
                    response.body.data!!.map { it.apply { typeLayout = AppAdapter.Type.FOLLOWING } },
                    response.body.links?.next ?: ""
                )
                is JsonApiResponse.Error -> State.FailedLoading(response)
            }
        } catch (e: Exception) {
            State.FailedLoading(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun loadMoreFollowers(nextLink: String) = viewModelScope.launch {
        _state.value = State.LoadingMore

        val response = mangaJapApiService.loadMoreFollows(
            nextLink
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.SuccessLoadingMore(
                    response.body.data!!.map { it.apply { typeLayout = AppAdapter.Type.FOLLOWERS } },
                    response.body.links?.next ?: ""
                )
                is JsonApiResponse.Error -> State.FailedLoadingMore(response)
            }
        } catch (e: Exception) {
            State.FailedLoadingMore(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun loadMoreFollowing(nextLink: String) = viewModelScope.launch {
        _state.value = State.LoadingMore

        val response = mangaJapApiService.loadMoreFollows(
            nextLink
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.SuccessLoadingMore(
                    response.body.data!!.map { it.apply { typeLayout = AppAdapter.Type.FOLLOWING } },
                    response.body.links?.next ?: ""
                )
                is JsonApiResponse.Error -> State.FailedLoadingMore(response)
            }
        } catch (e: Exception) {
            State.FailedLoadingMore(JsonApiResponse.Error.UnknownError(e))
        }
    }
}