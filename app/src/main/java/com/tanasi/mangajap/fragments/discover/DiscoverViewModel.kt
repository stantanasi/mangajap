package com.tanasi.mangajap.fragments.discover

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.jsonapi.JsonApiParams
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.models.*
import com.tanasi.mangajap.services.MangaJapApiService
import kotlinx.coroutines.async
import kotlinx.coroutines.launch

class DiscoverViewModel : ViewModel() {

    private val mangaJapApiService: MangaJapApiService = MangaJapApiService.build()

    private val _state: MutableLiveData<State> = MutableLiveData(State.Loading)
    val state: LiveData<State> = _state

    sealed class State {
        object Loading : State()
        data class SuccessLoading(
            val peopleList: List<People>,
            val mangaRecentList: List<Manga>,
            val animeRecentList: List<Anime>
        ) : State()

        data class FailedLoading(val error: JsonApiResponse.Error) : State()

        object Updating : State()
        data class SuccessUpdating(val succeed: Boolean) : State()
        data class FailedUpdating(val error: JsonApiResponse.Error) : State()
    }

    fun getDiscover() = viewModelScope.launch {
        _state.value = State.Loading

        val peopleResponseDeferred = async {
            mangaJapApiService.getPeoples(
                JsonApiParams(
                    include = listOf("staff.manga", "staff.anime"),
                    fields = mapOf(
                        "manga" to listOf("title", "coverImage"),
                        "anime" to listOf("title", "coverImage"),
                    ),
                    sort = listOf("random"),
                    limit = 10
                )
            )
        }
        val mangaRecentResponseDeferred = async {
            mangaJapApiService.getManga(
                JsonApiParams(
                    include = listOf("manga-entry"),
                    sort = listOf("-createdAt"),
                    limit = 15
                )
            )
        }
        val animeRecentResponseDeferred = async {
            mangaJapApiService.getAnime(
                JsonApiParams(
                    include = listOf("anime-entry"),
                    sort = listOf("-createdAt"),
                    limit = 15
                )
            )
        }

        val peopleResponse = peopleResponseDeferred.await()
        val mangaRecentResponse = mangaRecentResponseDeferred.await()
        val animeRecentResponse = animeRecentResponseDeferred.await()

        _state.value = try {
            when {
                peopleResponse is JsonApiResponse.Success &&
                        mangaRecentResponse is JsonApiResponse.Success &&
                        animeRecentResponse is JsonApiResponse.Success ->
                    State.SuccessLoading(
                        peopleResponse.body.data!!.map {
                            it.apply {
                                itemType = AppAdapter.Type.PEOPLE_DISCOVER_ITEM
                            }
                        },
                        mangaRecentResponse.body.data!!.map {
                            it.apply {
                                itemType = AppAdapter.Type.MANGA_DISCOVER_ITEM
                            }
                        },
                        animeRecentResponse.body.data!!.map {
                            it.apply {
                                itemType = AppAdapter.Type.ANIME_DISCOVER_ITEM
                            }
                        }
                    )

                peopleResponse is JsonApiResponse.Error -> State.FailedLoading(peopleResponse)
                mangaRecentResponse is JsonApiResponse.Error -> State.FailedLoading(
                    mangaRecentResponse
                )
                animeRecentResponse is JsonApiResponse.Error -> State.FailedLoading(
                    animeRecentResponse
                )

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

        _state.value = try {
            val response = mangaJapApiService.updateMangaEntry(
                mangaEntry.id!!,
                mangaEntry
            )

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

        _state.value = try {
            val response = mangaJapApiService.updateAnimeEntry(
                animeEntry.id!!,
                animeEntry
            )
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