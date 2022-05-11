package com.tanasi.mangajap.fragments.manga

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.jsonapi.JsonApiParams
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.models.MangaEntry
import com.tanasi.mangajap.services.MangaJapApiService
import kotlinx.coroutines.launch

class MangaViewModel : ViewModel() {

    private val mangaJapApiService: MangaJapApiService = MangaJapApiService.build()

    private val _state: MutableLiveData<State> = MutableLiveData(State.Loading)
    val state: LiveData<State> = _state

    sealed class State {
        object Loading: State()
        data class SuccessLoading(val manga: Manga): State()
        data class FailedLoading(val error: JsonApiResponse.Error): State()

        object AddingEntry : State()
        data class SuccessAddingEntry(val mangaEntry: MangaEntry) : State()
        data class FailedAddingEntry(val error: JsonApiResponse.Error) : State()

        object Updating: State()
        data class SuccessUpdating(val mangaEntry: MangaEntry): State()
        data class FailedUpdating(val error: JsonApiResponse.Error): State()
    }

    fun getManga(id: String) = viewModelScope.launch {
        _state.value = State.Loading

        val response = mangaJapApiService.getManga(
                id,
                JsonApiParams(
                        include = listOf("manga-entry", "genres", "themes", "volumes", "staff.people", "franchises.destination")
                )
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> {
                    val manga = response.body.data!!
                    State.SuccessLoading(manga)
                }
                is JsonApiResponse.Error -> State.FailedLoading(response)
            }
        } catch (e: Exception) {
            State.FailedLoading(JsonApiResponse.Error.UnknownError(e))
        }
    }


    fun addMangaEntry(mangaEntry: MangaEntry) = viewModelScope.launch {
        _state.value = State.AddingEntry

        _state.value = try {
            val response = mangaEntry.id?.let {
                mangaJapApiService.updateMangaEntry(it, mangaEntry)
            } ?: mangaJapApiService.createMangaEntry(mangaEntry)

            when (response) {
                is JsonApiResponse.Success -> State.SuccessAddingEntry(response.body.data!!)
                is JsonApiResponse.Error -> State.FailedAddingEntry(response)
            }
        } catch (e: Exception) {
            State.FailedAddingEntry(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun updateMangaEntry(mangaEntry: MangaEntry) = viewModelScope.launch {
        _state.value = State.Updating

        _state.value = try {
            val response = mangaJapApiService.updateMangaEntry(
                mangaEntry.id!!,
                mangaEntry
            )
            when (response) {
                is JsonApiResponse.Success -> State.SuccessUpdating(response.body.data!!)
                is JsonApiResponse.Error -> State.FailedUpdating(response)
            }
        } catch (e: Exception) {
            State.FailedUpdating(JsonApiResponse.Error.UnknownError(e))
        }
    }
}