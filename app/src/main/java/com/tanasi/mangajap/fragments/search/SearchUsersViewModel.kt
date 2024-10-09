package com.tanasi.mangajap.fragments.search

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.models.User
import com.tanasi.mangajap.utils.MangaJapApi
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

class SearchUsersViewModel : ViewModel() {

    private val _state = MutableStateFlow<State>(State.Loading)
    val state: Flow<State> = _state

    private var query = ""
    private var page = 0

    sealed class State {
        data object Loading : State()
        data object LoadingMore : State()
        data class SuccessLoading(val userList: List<User>, val hasMore: Boolean) : State()
        data class FailedLoading(val error: JsonApiResponse.Error) : State()
    }

    init {
        search(query)
    }


    fun search(query: String) = viewModelScope.launch(Dispatchers.IO) {
        _state.emit(State.Loading)

        try {
            if (query.isEmpty()) {
                page = 0
                _state.emit(State.SuccessLoading(userList = listOf(), hasMore = false))
                return@launch
            }

            val response = MangaJapApi.Users.list(
                sort = listOf("-followersCount"),
                limit = 15,
                filter = mapOf("query" to listOf(query))
            )

            this@SearchUsersViewModel.query = query
            page = 0

            when (response) {
                is JsonApiResponse.Success -> {
                    _state.emit(
                        State.SuccessLoading(
                            userList = response.body.data!!,
                            hasMore = response.body.links?.next != null
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

    fun loadMore() = viewModelScope.launch(Dispatchers.IO) {
        val currentState = _state.first()
        if (currentState is State.SuccessLoading) {
            _state.emit(State.LoadingMore)

            try {
                val response = MangaJapApi.Users.list(
                    sort = listOf("-followersCount"),
                    limit = 15,
                    offset = 15 * (page + 1),
                    filter = mapOf("query" to listOf(query))
                )

                page += 1

                when (response) {
                    is JsonApiResponse.Success -> {
                        _state.emit(
                            State.SuccessLoading(
                                userList = currentState.userList + response.body.data!!,
                                hasMore = response.body.links?.next != null
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