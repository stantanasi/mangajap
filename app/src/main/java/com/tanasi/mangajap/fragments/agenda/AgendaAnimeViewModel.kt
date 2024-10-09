package com.tanasi.mangajap.fragments.agenda

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.models.AnimeEntry
import com.tanasi.mangajap.utils.MangaJapApi
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch

class AgendaAnimeViewModel : ViewModel() {

    private val _state: MutableStateFlow<State> = MutableStateFlow(State.Loading)
    val state: Flow<State> = _state

    sealed class State {
        data object Loading : State()
        data class SuccessLoading(val watchingAnime: List<AnimeEntry>) : State()
        data class FailedLoading(val error: JsonApiResponse.Error) : State()
    }

    init {
        getAgendaAnime(Firebase.auth.uid!!)
    }


    private fun getAgendaAnime(userId: String) = viewModelScope.launch(Dispatchers.IO) {
        _state.emit(State.Loading)

        try {
            val response = MangaJapApi.Users.animeLibrary(
                userId,
                include = listOf("anime"),
                sort = listOf("-updatedAt"),
                limit = 500,
                filter = mapOf(
                    "status" to listOf("watching")
                )
            )

            when (response) {
                is JsonApiResponse.Success -> {
                    _state.emit(State.SuccessLoading(response.body.data!!))
                }

                is JsonApiResponse.Error -> {
                    _state.emit(State.FailedLoading(response))
                }

                else -> {
                    _state.emit(State.FailedLoading(JsonApiResponse.Error.UnknownError(Throwable("Impossible to load data"))))
                }
            }
        } catch (e: Exception) {
            Log.e("AgendaAnimeViewModel", "getAgendaAnime: ", e)
            _state.emit(State.FailedLoading(JsonApiResponse.Error.UnknownError(e)))
        }
    }
}