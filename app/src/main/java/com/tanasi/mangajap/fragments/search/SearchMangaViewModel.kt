package com.tanasi.mangajap.fragments.search

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.jsonapi.JsonApiParams
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.models.MangaEntry
import com.tanasi.mangajap.models.Request
import com.tanasi.mangajap.services.MangaJapApiService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

class SearchMangaViewModel : ViewModel() {

    private val mangaJapApiService: MangaJapApiService = MangaJapApiService.build()

    private val _state = MutableStateFlow<State>(State.Loading)
    private val _savingState = MutableStateFlow<SavingState?>(null)
    val state: Flow<State> = combine(
        _state,
        _savingState,
    ) { state, savingState ->
        when (state) {
            is State.SuccessLoading -> {
                when (savingState) {
                    is SavingState.SuccessSaving -> {
                        State.SuccessLoading(
                            state.mangaList.map { manga ->
                                if (manga.id == savingState.manga.id) {
                                    manga.copy(
                                        mangaEntry = savingState.mangaEntry,
                                    )
                                } else {
                                    manga
                                }
                            },
                            state.nextLink
                        )
                    }
                    else -> state
                }
            }

            else -> state
        }
    }

    private var query = ""

    sealed class State {
        data object Loading : State()
        data object LoadingMore : State()
        data class SuccessLoading(val mangaList: List<Manga>, val nextLink: String) : State()
        data class FailedLoading(val error: JsonApiResponse.Error) : State()
    }

    sealed class SavingState {
        data object Saving : SavingState()
        data class SuccessSaving(val manga: Manga, val mangaEntry: MangaEntry) : SavingState()
        data class FailedSaving(val error: JsonApiResponse.Error) : SavingState()
    }

    init {
        search(query)
    }


    fun search(query: String) = viewModelScope.launch(Dispatchers.IO) {
        _state.emit(State.Loading)

        try {
            val response = mangaJapApiService.getManga(
                JsonApiParams(
                    include = listOf("manga-entry"),
                    sort = listOf("-popularity"),
                    limit = 15,
                    filter = mapOf("query" to listOf(query))
                )
            )

            this@SearchMangaViewModel.query = query

            when (response) {
                is JsonApiResponse.Success -> {
                    _state.emit(
                        State.SuccessLoading(
                            mangaList = response.body.data!!,
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

    fun loadMore(nextLink: String) = viewModelScope.launch(Dispatchers.IO) {
        val currentState = _state.first()
        if (currentState is State.SuccessLoading) {
            _state.emit(State.LoadingMore)

            try {
                val response = mangaJapApiService.loadMoreManga(
                    nextLink
                )

                when (response) {
                    is JsonApiResponse.Success -> {
                        _state.emit(
                            State.SuccessLoading(
                                mangaList = currentState.mangaList + response.body.data!!,
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

    fun saveMangaEntry(manga: Manga, mangaEntry: MangaEntry) =
        viewModelScope.launch(Dispatchers.IO) {
            _savingState.emit(SavingState.Saving)

            try {
                val id = mangaEntry.id

                val response = if (id != null) {
                    mangaJapApiService.updateMangaEntry(
                        mangaEntry.id!!,
                        mangaEntry
                    )
                } else {
                    mangaJapApiService.createMangaEntry(mangaEntry)
                }

                when (response) {
                    is JsonApiResponse.Success -> {
                        _savingState.emit(SavingState.SuccessSaving(manga, response.body.data!!))
                    }

                    is JsonApiResponse.Error -> {
                        _savingState.emit(SavingState.FailedSaving(response))
                    }
                }
            } catch (e: Exception) {
                _savingState.emit(SavingState.FailedSaving(JsonApiResponse.Error.UnknownError(e)))
            }
        }

    fun saveRequest(request: Request) = viewModelScope.launch(Dispatchers.IO) {
        try {
            val response = mangaJapApiService.createRequest(request)

            when (response) {
                is JsonApiResponse.Success -> response.body.data!!
                is JsonApiResponse.Error -> response
            }
        } catch (e: Exception) {
        }
    }
}