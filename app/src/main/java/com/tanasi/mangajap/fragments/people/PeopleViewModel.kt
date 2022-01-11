package com.tanasi.mangajap.fragments.people

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.jsonapi.JsonApiParams
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.jsonapi.extensions.jsonApiName
import com.tanasi.jsonapi.extensions.jsonApiType
import com.tanasi.mangajap.models.Anime
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.models.People
import com.tanasi.mangajap.services.MangaJapApiService
import kotlinx.coroutines.launch

class PeopleViewModel : ViewModel() {

    private val mangaJapApiService: MangaJapApiService = MangaJapApiService.build()

    private val _state: MutableLiveData<State> = MutableLiveData(State.Loading)
    val state: LiveData<State> = _state

    sealed class State {
        object Loading : State()
        data class SuccessLoading(val people: People) : State()
        data class FailedLoading(val error: JsonApiResponse.Error) : State()
    }

    fun getPeople(id: String) = viewModelScope.launch {
        _state.value = State.Loading

        val response = mangaJapApiService.getPeople(
            id,
            JsonApiParams(
                include = listOf("manga-staff.manga", "anime-staff.anime"),
                fields = mapOf(
                    Manga::class.jsonApiType to listOf(
                        Manga::coverImage.jsonApiName(Manga::class),
                        Manga::title.jsonApiName(Manga::class),
                        Manga::startDate.jsonApiName(Manga::class),
                    ),
                    Anime::class.jsonApiType to listOf(
                        Anime::coverImage.jsonApiName(Anime::class),
                        Anime::title.jsonApiName(Anime::class),
                        Anime::startDate.jsonApiName(Anime::class),
                    ),
                )
            )
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.SuccessLoading(response.body.data!!)
                is JsonApiResponse.Error -> State.FailedLoading(response)
            }
        } catch (e: Exception) {
            State.FailedLoading(JsonApiResponse.Error.UnknownError(e))
        }
    }
}