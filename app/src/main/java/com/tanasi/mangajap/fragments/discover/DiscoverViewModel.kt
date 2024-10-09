package com.tanasi.mangajap.fragments.discover

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.models.Anime
import com.tanasi.mangajap.models.AnimeEntry
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.models.MangaEntry
import com.tanasi.mangajap.models.People
import com.tanasi.mangajap.utils.MangaJapApi
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.launch

class DiscoverViewModel : ViewModel() {

    private val _state: MutableStateFlow<State> = MutableStateFlow(State.Loading)
    private val _updating: MutableStateFlow<UpdatingState?> = MutableStateFlow(null)
    val state: Flow<State> = combine(
        _state,
        _updating,
    ) { state, updating ->
        when (state) {
            is State.SuccessLoading -> {
                when (updating) {
                    is UpdatingState.SuccessUpdatingAnimeEntry -> {
                        State.SuccessLoading(
                            peoples = state.peoples,
                            anime = state.anime.map { anime ->
                                if (anime.id == updating.anime.id) {
                                    anime.copy(
                                        animeEntry = updating.animeEntry,
                                    )
                                } else {
                                    anime
                                }
                            },
                            manga = state.manga,
                        )
                    }

                    is UpdatingState.SuccessUpdatingMangaEntry -> {
                        State.SuccessLoading(
                            peoples = state.peoples,
                            anime = state.anime,
                            manga = state.manga.map { manga ->
                                if (manga.id == updating.manga.id) {
                                    manga.copy(
                                        mangaEntry = updating.mangaEntry,
                                    )
                                } else {
                                    manga
                                }
                            },
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
        data class SuccessLoading(
            val peoples: List<People>,
            val anime: List<Anime>,
            val manga: List<Manga>,
        ) : State()

        data class FailedLoading(val error: JsonApiResponse.Error) : State()
    }

    sealed class UpdatingState {
        data object Updating : UpdatingState()
        data class SuccessUpdatingAnimeEntry(
            val animeEntry: AnimeEntry,
            val anime: Anime
        ) : UpdatingState()

        data class SuccessUpdatingMangaEntry(
            val mangaEntry: MangaEntry,
            val manga: Manga
        ) : UpdatingState()

        data class FailedUpdating(val error: JsonApiResponse.Error) : UpdatingState()
    }

    init {
        getDiscover()
    }


    private fun getDiscover() = viewModelScope.launch(Dispatchers.IO) {
        _state.emit(State.Loading)

        try {
            val peopleResponseDeferred = async {
                MangaJapApi.Peoples.list(
                    include = listOf("staff.manga", "staff.anime"),
                    fields = mapOf(
                        "manga" to listOf("title", "coverImage"),
                        "anime" to listOf("title", "coverImage"),
                    ),
                    sort = listOf("random"),
                    limit = 10
                )
            }
            val mangaRecentResponseDeferred = async {
                MangaJapApi.Manga.list(
                    include = listOf("manga-entry"),
                    sort = listOf("-createdAt"),
                    limit = 15
                )
            }
            val animeRecentResponseDeferred = async {
                MangaJapApi.Anime.list(
                    include = listOf("anime-entry"),
                    sort = listOf("-createdAt"),
                    limit = 15
                )
            }

            val peopleResponse = peopleResponseDeferred.await()
            val mangaRecentResponse = mangaRecentResponseDeferred.await()
            val animeRecentResponse = animeRecentResponseDeferred.await()

            when {
                peopleResponse is JsonApiResponse.Success &&
                        mangaRecentResponse is JsonApiResponse.Success &&
                        animeRecentResponse is JsonApiResponse.Success -> {
                    _state.emit(
                        State.SuccessLoading(
                            peopleResponse.body.data!!,
                            animeRecentResponse.body.data!!,
                            mangaRecentResponse.body.data!!,
                        )
                    )
                }

                peopleResponse is JsonApiResponse.Error -> {
                    _state.emit(
                        State.FailedLoading(peopleResponse)
                    )
                }

                mangaRecentResponse is JsonApiResponse.Error -> {
                    _state.emit(
                        State.FailedLoading(mangaRecentResponse)
                    )
                }

                animeRecentResponse is JsonApiResponse.Error -> {
                    _state.emit(
                        State.FailedLoading(animeRecentResponse)
                    )
                }

                else -> {
                    _state.emit(
                        State.FailedLoading(JsonApiResponse.Error.UnknownError(Exception("Impossible to load data")))
                    )
                }
            }
        } catch (e: Exception) {
            Log.e("DiscoverViewModel", "getDiscover: ", e)
            _state.emit(State.FailedLoading(JsonApiResponse.Error.UnknownError(e)))
        }
    }

    fun saveAnimeEntry(
        anime: Anime,
        animeEntry: AnimeEntry,
    ) = viewModelScope.launch(Dispatchers.IO) {
            _updating.emit(UpdatingState.Updating)

            try {
                val id = animeEntry.id
                val response = if (id == null) {
                    MangaJapApi.AnimeEntries.create(animeEntry)
                } else {
                    MangaJapApi.AnimeEntries.update(id, animeEntry)
                }

                when (response) {
                    is JsonApiResponse.Success -> {
                        _updating.emit(
                            UpdatingState.SuccessUpdatingAnimeEntry(
                                response.body.data!!,
                                anime
                            )
                        )
                    }

                    is JsonApiResponse.Error -> {
                        _updating.emit(UpdatingState.FailedUpdating(response))
                    }
                }
            } catch (e: Exception) {
                _updating.emit(UpdatingState.FailedUpdating(JsonApiResponse.Error.UnknownError(e)))
            }
        }

    fun saveMangaEntry(
        manga: Manga,
        mangaEntry: MangaEntry,
    ) = viewModelScope.launch(Dispatchers.IO) {
            _updating.emit(UpdatingState.Updating)

            try {
                val id = mangaEntry.id
                val response = if (id == null) {
                    MangaJapApi.MangaEntries.create(mangaEntry)
                } else {
                    MangaJapApi.MangaEntries.update(id, mangaEntry)
                }

                when (response) {
                    is JsonApiResponse.Success -> {
                        _updating.emit(
                            UpdatingState.SuccessUpdatingMangaEntry(
                                response.body.data!!,
                                manga
                            )
                        )
                    }

                    is JsonApiResponse.Error -> {
                        _updating.emit(UpdatingState.FailedUpdating(response))
                    }
                }
            } catch (e: Exception) {
                Log.e("DiscoverViewModel", "saveMangaEntry: ", e)
                _updating.emit(UpdatingState.FailedUpdating(JsonApiResponse.Error.UnknownError(e)))
            }
        }
}