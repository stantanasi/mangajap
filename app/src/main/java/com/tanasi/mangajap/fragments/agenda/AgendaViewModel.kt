package com.tanasi.mangajap.fragments.agenda

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.jsonapi.JsonApiParams
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.models.AnimeEntry
import com.tanasi.mangajap.models.MangaEntry
import com.tanasi.mangajap.services.MangaJapApiService
import kotlinx.coroutines.async
import kotlinx.coroutines.launch

class AgendaViewModel : ViewModel() {

    private val mangaJapApiService: MangaJapApiService = MangaJapApiService.build()

    private val _state: MutableLiveData<State> = MutableLiveData(State.Loading)
    val state: LiveData<State> = _state

    sealed class State {
        object Loading: State()
        data class SuccessLoading(val readingManga: List<MangaEntry>, val watchingAnime: List<AnimeEntry>): State()
        data class FailedLoading(val error: JsonApiResponse.Error): State()
    }

    fun getAgenda(userId: String) = viewModelScope.launch {
        _state.value = State.Loading

        val mangaResponseDeferred = async { mangaJapApiService.getUserMangaLibrary(
                userId,
                JsonApiParams(
                        include = listOf("manga"),
                        sort = listOf("-updatedAt"),
                        limit = 500,
                        filter = mapOf(
                                "status" to listOf("reading")
                        )
                )
        ) }
        val animeResponseDeferred = async { mangaJapApiService.getUserAnimeLibrary(
                userId,
                JsonApiParams(
                        include = listOf("anime"),
                        sort = listOf("-updatedAt"),
                        limit = 500,
                        filter = mapOf(
                                "status" to listOf("watching")
                        )
                )
        ) }

        val mangaResponse = mangaResponseDeferred.await()
        val animeResponse = animeResponseDeferred.await()

        _state.value = try {
            when {
                mangaResponse is JsonApiResponse.Success &&
                        animeResponse is JsonApiResponse.Success -> State.SuccessLoading(
                        mangaResponse.body.data!!.map { it.apply { typeLayout = MangaJapAdapter.Type.MANGA_ENTRY_TO_READ } },
                        animeResponse.body.data!!.map { it.apply { typeLayout = MangaJapAdapter.Type.ANIME_ENTRY_TO_WATCH } }
                )

                mangaResponse is JsonApiResponse.Error -> State.FailedLoading(mangaResponse)
                animeResponse is JsonApiResponse.Error -> State.FailedLoading(animeResponse)

                else -> State.FailedLoading(JsonApiResponse.Error.UnknownError(Throwable("Impossible to load data")))
            }
        } catch (e: Exception) {
            State.FailedLoading(JsonApiResponse.Error.UnknownError(e))
        }
    }
}