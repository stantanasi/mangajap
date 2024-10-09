package com.tanasi.mangajap.fragments.people

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.jsonapi.extensions.jsonApiName
import com.tanasi.jsonapi.extensions.jsonApiType
import com.tanasi.mangajap.models.Anime
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.models.People
import com.tanasi.mangajap.utils.MangaJapApi
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch

class PeopleViewModel(id: String) : ViewModel() {

    private val _state = MutableStateFlow<State>(State.Loading)
    val state: Flow<State> = _state

    sealed class State {
        data object Loading : State()
        data class SuccessLoading(val people: People) : State()
        data class FailedLoading(val error: JsonApiResponse.Error) : State()
    }

    init {
        getPeople(id)
    }


    private fun getPeople(id: String) = viewModelScope.launch {
        _state.emit(State.Loading)

        try {
            val response = MangaJapApi.Peoples.details(
                id,
                include = listOf("manga-staff.manga", "anime-staff.anime"),
                fields = mapOf(
                    Manga::class.jsonApiType to listOf(
                        Manga::title.jsonApiName(Manga::class),
                        Manga::coverImage.jsonApiName(Manga::class),
                        Manga::startDate.jsonApiName(Manga::class),
                    ),
                    Anime::class.jsonApiType to listOf(
                        Anime::title.jsonApiName(Anime::class),
                        Anime::coverImage.jsonApiName(Anime::class),
                        Anime::startDate.jsonApiName(Anime::class),
                    ),
                )
            )

            when (response) {
                is JsonApiResponse.Success -> {
                    _state.emit(State.SuccessLoading(response.body.data!!))
                }

                is JsonApiResponse.Error -> {
                    _state.emit(State.FailedLoading(response))
                }
            }
        } catch (e: Exception) {
            _state.emit(State.FailedLoading(JsonApiResponse.Error.UnknownError(e)))
        }
    }
}