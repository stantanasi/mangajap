package com.tanasi.mangajap.fragments.anime

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.jsonapi.JsonApiParams
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.models.Anime
import com.tanasi.mangajap.models.AnimeEntry
import com.tanasi.mangajap.models.Season
import com.tanasi.mangajap.services.MangaJapApiService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.launch

class AnimeViewModel(id: String) : ViewModel() {

    private val mangaJapApiService: MangaJapApiService = MangaJapApiService.build()

    private val _state: MutableStateFlow<State> = MutableStateFlow(State.Loading)
    private val _seasonState: MutableStateFlow<SeasonState?> = MutableStateFlow(null)
    private val _savingState: MutableStateFlow<SavingState?> = MutableStateFlow(null)
    val state: Flow<State> = combine(
        _state,
        _seasonState,
        _savingState,
    ) { state, seasonState, updatingState ->
        when (state) {
            is State.SuccessLoading -> {
                var anime = state.anime
                if (seasonState is SeasonState.SuccessLoadingEpisodes) {
                    anime = anime.copy(
                        seasons = seasonState.seasons,
                    )
                }
                if (updatingState is SavingState.SuccessSaving) {
                    anime = anime.copy(
                        animeEntry = updatingState.animeEntry,
                    )
                }
                anime.seasons.onEach { season ->
                    season.anime = anime
                    season.episodes.onEach { episode ->
                        episode.season = season
                    }
                }
                State.SuccessLoading(anime)
            }

            else -> state
        }
    }

    sealed class State {
        data object Loading : State()
        data class SuccessLoading(val anime: Anime) : State()
        data class FailedLoading(val error: JsonApiResponse.Error) : State()
    }

    sealed class SeasonState {
        data object LoadingEpisodes : SeasonState()
        data class SuccessLoadingEpisodes(val seasons: List<Season>) : SeasonState()
        data class FailedLoadingEpisodes(val error: JsonApiResponse.Error) : SeasonState()
    }

    sealed class SavingState {
        data object Saving : SavingState()
        data class SuccessSaving(val animeEntry: AnimeEntry) : SavingState()
        data class FailedSaving(val error: JsonApiResponse.Error) : SavingState()
    }

    init {
        getAnime(id)
        getSeasons(id)
    }


    private fun getAnime(id: String) = viewModelScope.launch(Dispatchers.IO) {
        _state.emit(State.Loading)

        try {
            val response = mangaJapApiService.getAnime(
                id,
                JsonApiParams(
                    include = listOf(
                        "anime-entry",
                        "genres",
                        "themes",
                        "seasons",
                        "franchises.destination",
                    )
                )
            )

            when (response) {
                is JsonApiResponse.Success -> {
                    _state.emit(
                        State.SuccessLoading(
                            anime = response.body.data!!.also { anime ->
                                anime.seasons.onEach { it.anime = anime }
                            }
                        )
                    )
                }

                is JsonApiResponse.Error -> {
                    _state.emit(State.FailedLoading(response))
                }
            }
        } catch (e: Exception) {
            Log.e("AnimeViewModel", "getAnime: ", e)
            _state.emit(State.FailedLoading(JsonApiResponse.Error.UnknownError(e)))
        }
    }

    private fun getSeasons(id: String) = viewModelScope.launch(Dispatchers.IO) {
        _seasonState.emit(SeasonState.LoadingEpisodes)

        try {
            val response = mangaJapApiService.getAnimeSeasons(
                id,
                JsonApiParams(
                    include = listOf("episodes"),
                    limit = 10000
                )
            )

            when (response) {
                is JsonApiResponse.Success -> {
                    _seasonState.emit(SeasonState.SuccessLoadingEpisodes(response.body.data!!))
                }

                is JsonApiResponse.Error -> {
                    _seasonState.emit(SeasonState.FailedLoadingEpisodes(response))
                }
            }
        } catch (e: Exception) {
            Log.e("AnimeViewModel", "getSeasons: ", e)
            _seasonState.emit(SeasonState.FailedLoadingEpisodes(JsonApiResponse.Error.UnknownError(e)))
        }
    }

    fun saveAnimeEntry(animeEntry: AnimeEntry) = viewModelScope.launch(Dispatchers.IO) {
        _savingState.emit(SavingState.Saving)

        try {
            val id = animeEntry.id

            val response = if (id != null) {
                mangaJapApiService.updateAnimeEntry(
                    animeEntry.id!!,
                    animeEntry
                )
            } else {
                mangaJapApiService.createAnimeEntry(animeEntry)
            }

            when (response) {
                is JsonApiResponse.Success -> {
                    _savingState.emit(SavingState.SuccessSaving(response.body.data!!))
                }

                is JsonApiResponse.Error -> {
                    _savingState.emit(SavingState.FailedSaving(response))
                }
            }
        } catch (e: Exception) {
            Log.e("AnimeViewModel", "saveAnimeEntry: ", e)
            _savingState.emit(SavingState.FailedSaving(JsonApiResponse.Error.UnknownError(e)))
        }
    }
}