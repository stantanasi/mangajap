package com.tanasi.mangajap.fragments.manga

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.jsonapi.JsonApiParams
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.models.MangaEntry
import com.tanasi.mangajap.services.MangaJapApiService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.launch

class MangaViewModel(id: String) : ViewModel() {

    private val mangaJapApiService: MangaJapApiService = MangaJapApiService.build()

    private val _state: MutableStateFlow<State> = MutableStateFlow(State.Loading)
    private val _updating: MutableStateFlow<SavingState?> = MutableStateFlow(null)
    val state: Flow<State> = combine(
        _state,
        _updating,
    ) { state, updating ->
        when (state) {
            is State.SuccessLoading -> {
                when (updating) {
                    is SavingState.SuccessSaving -> {
                        State.SuccessLoading(
                            manga = state.manga.copy(
                                mangaEntry = updating.mangaEntry,
                            )
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
        data class SuccessLoading(val manga: Manga) : State()
        data class FailedLoading(val error: JsonApiResponse.Error) : State()
    }

    sealed class SavingState {
        data object Saving : SavingState()
        data class SuccessSaving(val mangaEntry: MangaEntry) : SavingState()
        data class FailedSaving(val error: JsonApiResponse.Error) : SavingState()
    }

    init {
        getManga(id)
    }

    private fun getManga(id: String) = viewModelScope.launch(Dispatchers.IO) {
        _state.emit(State.Loading)

        try {
            val response = mangaJapApiService.getManga(
                id,
                JsonApiParams(
                    include = listOf(
                        "manga-entry",
                        "genres",
                        "themes",
                        "volumes",
                        "staff.people",
                        "franchises.destination"
                    )
                )
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
            Log.e("MangaViewModel", "getManga: ", e)
            _state.emit(State.FailedLoading(JsonApiResponse.Error.UnknownError(e)))
        }
    }

    fun saveMangaEntry(mangaEntry: MangaEntry) = viewModelScope.launch(Dispatchers.IO) {
        _updating.emit(SavingState.Saving)

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
                    _updating.emit(SavingState.SuccessSaving(response.body.data!!))
                }
                is JsonApiResponse.Error -> {
                    _updating.emit(SavingState.FailedSaving(response))
                }
            }
        } catch (e: Exception) {
            Log.e("MangaViewModel", "updateMangaEntry: ", e)
            _updating.emit(SavingState.FailedSaving(JsonApiResponse.Error.UnknownError(e)))
        }
    }
}