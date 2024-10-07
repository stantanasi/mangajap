package com.tanasi.mangajap.fragments.library

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.jsonapi.JsonApiParams
import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.models.AnimeEntry
import com.tanasi.mangajap.models.MangaEntry
import com.tanasi.mangajap.services.MangaJapApiService
import kotlinx.coroutines.launch

class LibraryViewModel : ViewModel() {

    private val mangaJapApiService: MangaJapApiService = MangaJapApiService.build()

    private val _state: MutableLiveData<State> = MutableLiveData(State.Loading)
    val state: LiveData<State> = _state

    sealed class State {
        object Loading: State()
        data class SuccessLoading(val itemList: List<AppAdapter.Item>): State()
        data class FailedLoading(val error: JsonApiResponse.Error): State()

        object Saving: State()
        data class SuccessSaving(val jsonApiResource: JsonApiResource): State()
        data class FailedSaving(val error: JsonApiResponse.Error): State()
    }

    fun getMangaLibrary(userId: String) = viewModelScope.launch {
        _state.value = State.Loading

        val response = mangaJapApiService.getUserMangaLibrary(
                userId,
                JsonApiParams(
                        include = listOf("manga"),
                        sort = listOf("-updatedAt"),
                        limit = 500
                )
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.SuccessLoading(response.body.data!!.map { it.apply { typeLayout = AppAdapter.Type.MANGA_ENTRY_LIBRARY } })
                is JsonApiResponse.Error -> State.FailedLoading(response)
            }
        } catch (e: Exception) {
            State.FailedLoading(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun getAnimeLibrary(userId: String) = viewModelScope.launch {
        _state.value = State.Loading

        val response = mangaJapApiService.getUserAnimeLibrary(
                userId,
                JsonApiParams(
                        include = listOf("anime"),
                        sort = listOf("-updatedAt"),
                        limit = 500
                )
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.SuccessLoading(response.body.data!!.map { it.apply { typeLayout = AppAdapter.Type.ANIME_ENTRY_LIBRARY } })
                is JsonApiResponse.Error -> State.FailedLoading(response)
            }
        } catch (e: Exception) {
            State.FailedLoading(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun getMangaFavorites(userId: String) = viewModelScope.launch {
        _state.value = State.Loading

        val response = mangaJapApiService.getUserMangaFavorites(
                userId,
                JsonApiParams(
                        include = listOf("manga"),
                        sort = listOf("-updatedAt"),
                        limit = 500
                )
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.SuccessLoading(response.body.data!!.map { it.apply { typeLayout = AppAdapter.Type.MANGA_ENTRY_LIBRARY } })
                is JsonApiResponse.Error -> State.FailedLoading(response)
            }
        } catch (e: Exception) {
            State.FailedLoading(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun getAnimeFavorites(userId: String) = viewModelScope.launch {
        _state.value = State.Loading

        val response = mangaJapApiService.getUserAnimeFavorites(
                userId,
                JsonApiParams(
                        include = listOf("anime"),
                        sort = listOf("-updatedAt"),
                        limit = 500
                )
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.SuccessLoading(response.body.data!!.map { it.apply { typeLayout = AppAdapter.Type.ANIME_ENTRY_LIBRARY } })
                is JsonApiResponse.Error -> State.FailedLoading(response)
            }
        } catch (e: Exception) {
            State.FailedLoading(JsonApiResponse.Error.UnknownError(e))
        }
    }


    fun updateMangaEntry(mangaEntry: MangaEntry) = viewModelScope.launch {
        _state.value = State.Saving

        _state.value = try {
            val response = mangaJapApiService.updateMangaEntry(
                mangaEntry.id!!,
                mangaEntry
            )

            when (response) {
                is JsonApiResponse.Success -> State.SuccessSaving(response.body.data!!)
                is JsonApiResponse.Error -> State.FailedSaving(response)
            }
        } catch (e: Exception) {
            State.FailedSaving(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun updateAnimeEntry(animeEntry: AnimeEntry) = viewModelScope.launch {
        _state.value = State.Saving

        _state.value = try {
            val response = mangaJapApiService.updateAnimeEntry(
                animeEntry.id!!,
                animeEntry
            )
            when (response) {
                is JsonApiResponse.Success -> State.SuccessSaving(response.body.data!!)
                is JsonApiResponse.Error -> State.FailedSaving(response)
            }
        } catch (e: Exception) {
            State.FailedSaving(JsonApiResponse.Error.UnknownError(e))
        }
    }
}