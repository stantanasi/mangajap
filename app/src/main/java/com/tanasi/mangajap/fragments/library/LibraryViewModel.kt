package com.tanasi.mangajap.fragments.library

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.fragments.library.LibraryFragment.LibraryType
import com.tanasi.mangajap.models.AnimeEntry
import com.tanasi.mangajap.models.MangaEntry
import com.tanasi.mangajap.utils.MangaJapApi
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.launch

class LibraryViewModel(userId: String, libraryType: LibraryType) : ViewModel() {

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
                            itemList = state.itemList.map { item ->
                                when (savingState.entry) {
                                    is AnimeEntry -> state.itemList
                                        .filterIsInstance<AnimeEntry>()
                                        .find { it.id == savingState.entry.id }
                                        ?.copy()
                                        ?: item

                                    is MangaEntry -> state.itemList
                                        .filterIsInstance<MangaEntry>()
                                        .find { it.id == savingState.entry.id }
                                        ?.copy()
                                        ?: item

                                    else -> item
                                }
                            }
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
        data class SuccessLoading(val itemList: List<AppAdapter.Item>) : State()
        data class FailedLoading(val error: JsonApiResponse.Error) : State()
    }

    sealed class SavingState {
        data object Saving : SavingState()
        data class SuccessSaving(val entry: JsonApiResource) : SavingState()
        data class FailedSaving(val error: JsonApiResponse.Error) : SavingState()
    }

    init {
        when (libraryType) {
            LibraryType.MangaList -> getMangaLibrary(userId)
            LibraryType.AnimeList -> getAnimeLibrary(userId)
            LibraryType.MangaFavoritesList -> getMangaFavorites(userId)
            LibraryType.AnimeFavoritesList -> getAnimeFavorites(userId)
        }
    }


    private fun getMangaLibrary(userId: String) = viewModelScope.launch(Dispatchers.IO) {
        _state.emit(State.Loading)

        try {
            val response = MangaJapApi.Users.mangaLibrary(
                userId,
                include = listOf("manga"),
                sort = listOf("-updatedAt"),
                limit = 500
            )

            when (response) {
                is JsonApiResponse.Success -> {
                    _state.emit(State.SuccessLoading(response.body.data!!))
                }

                is JsonApiResponse.Error -> {
                    _state.emit(State.FailedLoading(response))
                }
            }
        } catch (e: Exception) {
            _state.emit(State.FailedLoading(JsonApiResponse.Error.UnknownError(e)))
        }
    }

    private fun getAnimeLibrary(userId: String) = viewModelScope.launch(Dispatchers.IO) {
        _state.emit(State.Loading)

        try {
            val response = MangaJapApi.Users.animeLibrary(
                userId,
                include = listOf("anime"),
                sort = listOf("-updatedAt"),
                limit = 500
            )

            when (response) {
                is JsonApiResponse.Success -> {
                    _state.emit(State.SuccessLoading(response.body.data!!))
                }

                is JsonApiResponse.Error -> {
                    _state.emit(State.FailedLoading(response))
                }
            }
        } catch (e: Exception) {
            _state.emit(State.FailedLoading(JsonApiResponse.Error.UnknownError(e)))
        }
    }

    private fun getMangaFavorites(userId: String) = viewModelScope.launch(Dispatchers.IO) {
        _state.emit(State.Loading)

        try {
            val response = MangaJapApi.Users.mangaFavorites(
                userId,
                include = listOf("manga"),
                sort = listOf("-updatedAt"),
                limit = 500
            )

            when (response) {
                is JsonApiResponse.Success -> {
                    _state.emit(State.SuccessLoading(response.body.data!!))
                }

                is JsonApiResponse.Error -> {
                    _state.emit(State.FailedLoading(response))
                }
            }
        } catch (e: Exception) {
            _state.emit(State.FailedLoading(JsonApiResponse.Error.UnknownError(e)))
        }
    }

    private fun getAnimeFavorites(userId: String) = viewModelScope.launch(Dispatchers.IO) {
        _state.emit(State.Loading)

        try {
            val response = MangaJapApi.Users.animeFavorites(
                userId,
                include = listOf("anime"),
                sort = listOf("-updatedAt"),
                limit = 500
            )

            when (response) {
                is JsonApiResponse.Success -> {
                    _state.emit(State.SuccessLoading(response.body.data!!))
                }

                is JsonApiResponse.Error -> {
                    _state.emit(State.FailedLoading(response))
                }
            }
        } catch (e: Exception) {
            _state.emit(State.FailedLoading(JsonApiResponse.Error.UnknownError(e)))
        }
    }


    fun updateMangaEntry(mangaEntry: MangaEntry) = viewModelScope.launch(Dispatchers.IO) {
        _savingState.emit(SavingState.Saving)

        try {
            val response = MangaJapApi.MangaEntries.update(
                mangaEntry.id!!,
                mangaEntry
            )

            when (response) {
                is JsonApiResponse.Success -> {
                    _savingState.emit(SavingState.SuccessSaving(response.body.data!!))
                }

                is JsonApiResponse.Error -> {
                    _savingState.emit(SavingState.FailedSaving(response))
                }
            }
        } catch (e: Exception) {
            _savingState.emit(SavingState.FailedSaving(JsonApiResponse.Error.UnknownError(e)))
        }
    }

    fun updateAnimeEntry(animeEntry: AnimeEntry) = viewModelScope.launch(Dispatchers.IO) {
        _savingState.emit(SavingState.Saving)

        try {
            val response = MangaJapApi.AnimeEntries.update(
                animeEntry.id!!,
                animeEntry
            )

            when (response) {
                is JsonApiResponse.Success -> {
                    _savingState.emit(SavingState.SuccessSaving(response.body.data!!))
                }

                is JsonApiResponse.Error -> {
                    _savingState.emit(SavingState.FailedSaving(response))
                }
            }
        } catch (e: Exception) {
            _savingState.emit(SavingState.FailedSaving(JsonApiResponse.Error.UnknownError(e)))
        }
    }
}