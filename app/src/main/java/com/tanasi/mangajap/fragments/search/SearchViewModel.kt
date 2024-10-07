package com.tanasi.mangajap.fragments.search

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.jsonapi.JsonApiParams
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.models.*
import com.tanasi.mangajap.services.MangaJapApiService
import kotlinx.coroutines.launch

class SearchViewModel : ViewModel() {

    private val mangaJapApiService: MangaJapApiService = MangaJapApiService.build()

    private val _state: MutableLiveData<State> = MutableLiveData(State.Loading)
    val state: LiveData<State> = _state

    sealed class State {
        object Loading : State()
        data class SuccessLoadingManga(val mangaList: List<Manga>, val nextLink: String) : State()
        data class SuccessLoadingAnime(val animeList: List<Anime>, val nextLink: String) : State()
        data class SuccessLoadingUsers(val userList: List<User>, val nextLink: String) : State()
        data class FailedLoading(val error: JsonApiResponse.Error) : State()

        object LoadingMore : State()
        data class SuccessLoadingMoreManga(val mangaList: List<Manga>, val nextLink: String) : State()
        data class SuccessLoadingMoreAnime(val animeList: List<Anime>, val nextLink: String) : State()
        data class SuccessLoadingMoreUsers(val userList: List<User>, val nextLink: String) : State()
        data class FailedLoadingMore(val error: JsonApiResponse.Error) : State()

        object Saving : State()
        data class SuccessSaving(val succeed: Boolean) : State()
        data class FailedSaving(val error: JsonApiResponse.Error) : State()

        data class SuccessRequest(val request: Request): State()
        data class FailedRequest(val error: JsonApiResponse.Error): State()
    }


    fun getMangas(query: String) = viewModelScope.launch {
        _state.value = State.Loading

        val response = mangaJapApiService.getManga(
                JsonApiParams(
                        include = listOf("manga-entry"),
                        sort = listOf("-popularity"),
                        limit = 15,
                        filter = mapOf("query" to listOf(query))
                )
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.SuccessLoadingManga(
                        response.body.data!!.map { it.apply { itemType = AppAdapter.Type.MANGA_SEARCH_ITEM } },
                        response.body.links?.next ?: ""
                )
                is JsonApiResponse.Error -> State.FailedLoading(response)
            }
        } catch (e: Exception) {
            State.FailedLoading(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun loadMoreManga(nextLink: String) = viewModelScope.launch {
        _state.value = State.LoadingMore

        val response = mangaJapApiService.loadMoreManga(
                nextLink
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.SuccessLoadingMoreManga(
                        response.body.data!!.map { it.apply { itemType = AppAdapter.Type.MANGA_SEARCH_ITEM } },
                        response.body.links?.next ?: ""
                )
                is JsonApiResponse.Error -> State.FailedLoadingMore(response)
            }
        } catch (e: Exception) {
            State.FailedLoadingMore(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun createMangaEntry(manga: Manga, mangaEntry: MangaEntry) = viewModelScope.launch {
        _state.value = State.Saving

        val response = mangaJapApiService.createMangaEntry(
                mangaEntry
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> {
                    manga.mangaEntry = response.body.data!!
                    State.SuccessSaving(true)
                }
                is JsonApiResponse.Error -> State.FailedSaving(response)
            }
        } catch (e: Exception) {
            State.FailedSaving(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun updateMangaEntry(manga: Manga, mangaEntry: MangaEntry) = viewModelScope.launch {
        _state.value = State.Saving

        _state.value = try {
            val response = mangaJapApiService.updateMangaEntry(
                mangaEntry.id!!,
                mangaEntry
            )

            when (response) {
                is JsonApiResponse.Success -> {
                    manga.mangaEntry = response.body.data!!
                    State.SuccessSaving(true)
                }
                is JsonApiResponse.Error -> State.FailedSaving(response)
            }
        } catch (e: Exception) {
            State.FailedSaving(JsonApiResponse.Error.UnknownError(e))
        }
    }


    fun getAnimes(query: String) = viewModelScope.launch {
        _state.value = State.Loading

        val response = mangaJapApiService.getAnime(
                JsonApiParams(
                        include = listOf("anime-entry"),
                        sort = listOf("-popularity"),
                        limit = 15,
                        filter = mapOf("query" to listOf(query))
                )
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.SuccessLoadingAnime(
                        response.body.data!!.map { it.apply { itemType = AppAdapter.Type.ANIME_SEARCH_ITEM } },
                        response.body.links?.next ?: ""
                )
                is JsonApiResponse.Error -> State.FailedLoading(response)
            }
        } catch (e: Exception) {
            State.FailedLoading(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun loadMoreAnime(nextLink: String) = viewModelScope.launch {
        _state.value = State.LoadingMore

        val response = mangaJapApiService.loadMoreAnime(
                nextLink
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.SuccessLoadingMoreAnime(
                        response.body.data!!.map { it.apply { itemType = AppAdapter.Type.ANIME_SEARCH_ITEM } },
                        response.body.links?.next ?: ""
                )
                is JsonApiResponse.Error -> State.FailedLoadingMore(response)
            }
        } catch (e: Exception) {
            State.FailedLoadingMore(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun createAnimeEntry(anime: Anime, animeEntry: AnimeEntry) = viewModelScope.launch {
        _state.value = State.Saving

        val response = mangaJapApiService.createAnimeEntry(
                animeEntry
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> {
                    anime.animeEntry = response.body.data!!
                    State.SuccessSaving(true)
                }
                is JsonApiResponse.Error -> State.FailedSaving(response)
            }
        } catch (e: Exception) {
            State.FailedSaving(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun updateAnimeEntry(anime: Anime, animeEntry: AnimeEntry) = viewModelScope.launch {
        _state.value = State.Saving

        _state.value = try {
            val response = mangaJapApiService.updateAnimeEntry(
                animeEntry.id!!,
                animeEntry
            )

            when (response) {
                is JsonApiResponse.Success -> {
                    anime.animeEntry = response.body.data!!
                    State.SuccessSaving(true)
                }
                is JsonApiResponse.Error -> State.FailedSaving(response)
            }
        } catch (e: Exception) {
            State.FailedSaving(JsonApiResponse.Error.UnknownError(e))
        }
    }


    fun getUsers(query: String) = viewModelScope.launch {
        _state.value = State.Loading

        _state.value = try {
            if (query == "") {
                State.SuccessLoadingUsers(listOf(), "")

            } else {
                val response = mangaJapApiService.getUsers(
                    JsonApiParams(
                        sort = listOf("-followersCount"),
                        limit = 15,
                        filter = mapOf("query" to listOf(query))
                    )
                )

                when (response) {
                    is JsonApiResponse.Success -> State.SuccessLoadingUsers(
                        response.body.data!!.map { it.apply { itemType = AppAdapter.Type.USER_ITEM } },
                        response.body.links?.next ?: ""
                    )
                    is JsonApiResponse.Error -> State.FailedLoading(response)
                }
            }
        } catch (e: Exception) {
            State.FailedLoading(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun loadMoreUser(nextLink: String) = viewModelScope.launch {
        _state.value = State.LoadingMore

        val response = mangaJapApiService.loadMoreUser(
                nextLink
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.SuccessLoadingMoreUsers(
                        response.body.data!!.map { it.apply { itemType = AppAdapter.Type.USER_ITEM } },
                        response.body.links?.next ?: ""
                )
                is JsonApiResponse.Error -> State.FailedLoadingMore(response)
            }
        } catch (e: Exception) {
            State.FailedLoadingMore(JsonApiResponse.Error.UnknownError(e))
        }
    }


    fun createRequest(request: Request) = viewModelScope.launch {
        val response = mangaJapApiService.createRequest(request)
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.SuccessRequest(response.body.data!!)
                is JsonApiResponse.Error -> State.FailedRequest(response)
            }
        } catch (e: Exception) {
            State.FailedRequest(JsonApiResponse.Error.UnknownError(e))
        }
    }
}