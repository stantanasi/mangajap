package com.tanasi.mangajap.fragments.discover

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.models.*
import com.tanasi.mangajap.services.MangaJapApiService
import com.tanasi.mangajap.utils.jsonApi.JsonApiParams
import com.tanasi.mangajap.utils.jsonApi.JsonApiResponse
import kotlinx.coroutines.async
import kotlinx.coroutines.launch

class DiscoverViewModel : ViewModel() {

    private val mangaJapApiService: MangaJapApiService = MangaJapApiService.build()

    private val _state: MutableLiveData<State> = MutableLiveData(State.Loading)
    val state: LiveData<State> = _state

    sealed class State {
        object Loading: State()
        data class SuccessLoading(val peopleList: List<People>, val mangaList: List<Manga>, val animeList: List<Anime>): State()
        data class FailedLoading(val error: JsonApiResponse.Error): State()

        object Updating: State()
        data class SuccessUpdating(val succeed: Boolean): State()
        data class FailedUpdating(val error: JsonApiResponse.Error): State()
    }

    fun getDiscover() = viewModelScope.launch {
        _state.value = State.Loading

        val peopleResponseDeferred = async { mangaJapApiService.getPeoples(
                JsonApiParams(
                        include = listOf("staff.manga", "staff.anime"),
                        fields = mapOf(
                                "manga" to listOf("coverImage", "canonicalTitle"),
                                "anime" to listOf("coverImage", "canonicalTitle")),
                        sort = listOf("random"),
                        limit = 10
                )
        ) }
        val mangaResponseDeferred = async { mangaJapApiService.getTrendingManga(
                JsonApiParams(
                        include = listOf("manga-entry"),
                        limit = 10
                )
        ) }
        val animeResponseDeferred = async { mangaJapApiService.getTrendingAnime(
                JsonApiParams(
                        include = listOf("anime-entry"),
                        limit = 10
                )
        ) }

        val peopleResponse = peopleResponseDeferred.await()
        val mangaResponse = mangaResponseDeferred.await()
        val animeResponse = animeResponseDeferred.await()

        _state.value = try {
            when {
                peopleResponse is JsonApiResponse.Success &&
                        mangaResponse is JsonApiResponse.Success &&
                        animeResponse is JsonApiResponse.Success ->
                    State.SuccessLoading(
                            peopleResponse.body.data!!.map { it.apply { typeLayout = MangaJapAdapter.Type.PEOPLE_DISCOVER } },
                            mangaResponse.body.data!!.map { it.apply { typeLayout = MangaJapAdapter.Type.MANGA_TRENDING } },
                            animeResponse.body.data!!.map { it.apply { typeLayout = MangaJapAdapter.Type.ANIME_TRENDING } }
                    )

                peopleResponse is JsonApiResponse.Error -> State.FailedLoading(peopleResponse)
                mangaResponse is JsonApiResponse.Error -> State.FailedLoading(mangaResponse)
                animeResponse is JsonApiResponse.Error -> State.FailedLoading(animeResponse)

                else -> State.FailedLoading(JsonApiResponse.Error.UnknownError(Throwable("Impossible to load data")))
            }
        } catch (e: Exception) {
            State.FailedLoading(JsonApiResponse.Error.UnknownError(e))
        }
    }


    fun createMangaEntry(manga: Manga, mangaEntry: MangaEntry) = viewModelScope.launch {
        _state.value = State.Updating

        val response = mangaJapApiService.createMangaEntry(
                mangaEntry
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> {
                    manga.mangaEntry = response.body.data!!
                    State.SuccessUpdating(true)
                }
                is JsonApiResponse.Error -> State.FailedUpdating(response)
            }
        } catch (e: Exception) {
            State.FailedUpdating(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun updateMangaEntry(manga: Manga, mangaEntry: MangaEntry) = viewModelScope.launch {
        _state.value = State.Updating

        val response = mangaJapApiService.updateMangaEntry(
                mangaEntry.id,
                mangaEntry.updateJson()
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> {
                    manga.mangaEntry = response.body.data!!
                    State.SuccessUpdating(true)
                }
                is JsonApiResponse.Error -> State.FailedUpdating(response)
            }
        } catch (e: Exception) {
            State.FailedUpdating(JsonApiResponse.Error.UnknownError(e))
        }
    }


    fun createAnimeEntry(anime: Anime, animeEntry: AnimeEntry) = viewModelScope.launch {
        _state.value = State.Updating

        val response = mangaJapApiService.createAnimeEntry(
                animeEntry
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> {
                    anime.animeEntry = response.body.data!!
                    State.SuccessUpdating(true)
                }
                is JsonApiResponse.Error -> State.FailedUpdating(response)
            }
        } catch (e: Exception) {
            State.FailedUpdating(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun updateAnimeEntry(anime: Anime, animeEntry: AnimeEntry) = viewModelScope.launch {
        _state.value = State.Updating

        val response = mangaJapApiService.updateAnimeEntry(
                animeEntry.id,
                animeEntry.updateJson()
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> {
                    anime.animeEntry = response.body.data!!
                    State.SuccessUpdating(true)
                }
                is JsonApiResponse.Error -> State.FailedUpdating(response)
            }
        } catch (e: Exception) {
            State.FailedUpdating(JsonApiResponse.Error.UnknownError(e))
        }
    }
}