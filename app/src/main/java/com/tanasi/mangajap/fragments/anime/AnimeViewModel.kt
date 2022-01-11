package com.tanasi.mangajap.fragments.anime

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.jsonapi.JsonApiParams
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.models.Anime
import com.tanasi.mangajap.models.AnimeEntry
import com.tanasi.mangajap.models.Season
import com.tanasi.mangajap.services.MangaJapApiService
import kotlinx.coroutines.launch

class AnimeViewModel : ViewModel() {

    private val mangaJapApiService: MangaJapApiService = MangaJapApiService.build()

    private val _state: MutableLiveData<State> = MutableLiveData(State.Loading)
    val state: LiveData<State> = _state

    sealed class State {
        object Loading : State()
        data class SuccessLoading(val anime: Anime) : State()
        data class FailedLoading(val error: JsonApiResponse.Error) : State()

        data class LoadingEpisodes(val season: Season) : State()
        data class SuccessLoadingEpisodes(val season: Season) : State()
        data class FailedLoadingEpisodes(val error: JsonApiResponse.Error) : State()

        object AddingEntry : State()
        data class SuccessAddingEntry(val animeEntry: AnimeEntry) : State()
        data class FailedAddingEntry(val error: JsonApiResponse.Error) : State()

        object Updating : State()
        data class SuccessUpdating(val animeEntry: AnimeEntry) : State()
        data class FailedUpdating(val error: JsonApiResponse.Error) : State()
    }


    fun getAnime(id: String) = viewModelScope.launch {
        _state.value = State.Loading

        _state.value = try {
            val response = mangaJapApiService.getAnime(
                id,
                JsonApiParams(
                    include = listOf("anime-entry", "seasons")
                )
            )

            when (response) {
                is JsonApiResponse.Success -> {
                    val anime = response.body.data!!

                    anime.seasons.map { season ->
                        season.anime = anime
                    }

                    State.SuccessLoading(anime)
                }
                is JsonApiResponse.Error -> State.FailedLoading(response)
            }
        } catch (e: Exception) {
            State.FailedLoading(JsonApiResponse.Error.UnknownError(e))
        }
    }


    fun getSeasonEpisodes(season: Season) = viewModelScope.launch {
        _state.value = State.LoadingEpisodes(season)

        _state.value = try {
            if (season.episodes.isEmpty()) {
                val response = mangaJapApiService.getSeasonEpisodes(
                    season.id,
                    JsonApiParams(
                        limit = 10000
                    )
                )

                when (response) {
                    is JsonApiResponse.Success -> {
                        season.episodes.run {
                            clear()
                            addAll(response.body.data!!)
                            map { episode ->
                                episode.season = season
                            }
                        }

                        State.SuccessLoadingEpisodes(season)
                    }
                    is JsonApiResponse.Error -> State.FailedLoadingEpisodes(response)
                }
            } else {
                State.SuccessLoadingEpisodes(season)
            }
        } catch (e: Exception) {
            State.FailedLoadingEpisodes(JsonApiResponse.Error.UnknownError(e))
        }
    }


    fun addAnimeEntry(animeEntry: AnimeEntry) = viewModelScope.launch {
        _state.value = State.AddingEntry

        _state.value = try {
            val response = animeEntry.id?.let {
                mangaJapApiService.updateAnimeEntry(it, animeEntry)
            } ?: mangaJapApiService.createAnimeEntry(animeEntry)

            when (response) {
                is JsonApiResponse.Success -> State.SuccessAddingEntry(response.body.data!!)
                is JsonApiResponse.Error -> State.FailedAddingEntry(response)
            }
        } catch (e: Exception) {
            State.FailedAddingEntry(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun updateAnimeEntry(animeEntry: AnimeEntry) = viewModelScope.launch {
        _state.value = State.Updating

        _state.value = try {
            val response = mangaJapApiService.updateAnimeEntry(
                animeEntry.id!!,
                animeEntry
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