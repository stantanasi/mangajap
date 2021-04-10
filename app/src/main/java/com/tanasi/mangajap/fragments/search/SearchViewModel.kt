package com.tanasi.mangajap.fragments.search

import android.widget.Toast
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.mangajap.MangaJapApplication
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.models.*
import com.tanasi.mangajap.services.MangaJapApiService
import com.tanasi.mangajap.utils.jsonApi.JsonApiParams
import com.tanasi.mangajap.utils.jsonApi.JsonApiResponse
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

        object Updating : State()
        data class SuccessUpdating(val succeed: Boolean) : State()
        data class FailedUpdating(val error: JsonApiResponse.Error) : State()
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
                        response.body.data!!.map { it.apply { typeLayout = MangaJapAdapter.Type.MANGA_SEARCH } },
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
                        response.body.data!!.map { it.apply { typeLayout = MangaJapAdapter.Type.MANGA_SEARCH } },
                        response.body.links?.next ?: ""
                )
                is JsonApiResponse.Error -> State.FailedLoadingMore(response)
            }
        } catch (e: Exception) {
            State.FailedLoadingMore(JsonApiResponse.Error.UnknownError(e))
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
                        response.body.data!!.map { it.apply { typeLayout = MangaJapAdapter.Type.ANIME_SEARCH } },
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
                        response.body.data!!.map { it.apply { typeLayout = MangaJapAdapter.Type.ANIME_SEARCH } },
                        response.body.links?.next ?: ""
                )
                is JsonApiResponse.Error -> State.FailedLoadingMore(response)
            }
        } catch (e: Exception) {
            State.FailedLoadingMore(JsonApiResponse.Error.UnknownError(e))
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


    fun getUsers(query: String) = viewModelScope.launch {
        _state.value = State.Loading

        val response = mangaJapApiService.getUsers(
                JsonApiParams(
                        sort = listOf("-followersCount"),
                        limit = 15,
                        filter = mapOf("query" to listOf(query))
                )
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.SuccessLoadingUsers(
                        response.body.data!!.map { it.apply { typeLayout = MangaJapAdapter.Type.USER } },
                        response.body.links?.next ?: ""
                )
                is JsonApiResponse.Error -> State.FailedLoading(response)
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
                        response.body.data!!.map { it.apply { typeLayout = MangaJapAdapter.Type.USER } },
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
        try {
            when (response) {
                is JsonApiResponse.Success -> Toast.makeText(
                        MangaJapApplication.context,
                        MangaJapApplication.context.getString(R.string.media_will_be_added, response.body.data?.data ?: ""),
                        Toast.LENGTH_SHORT).show()
                is JsonApiResponse.Error -> Toast.makeText(
                        MangaJapApplication.context,
                        MangaJapApplication.context.getString(R.string.error),
                        Toast.LENGTH_SHORT).show()
            }
        } catch (e: Exception) {
        }
    }
}