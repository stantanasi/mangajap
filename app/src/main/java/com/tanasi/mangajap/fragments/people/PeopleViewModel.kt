package com.tanasi.mangajap.fragments.people

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.jsonapi.JsonApiParams
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.jsonapi.utils.jsonApiAttribute
import com.tanasi.jsonapi.utils.jsonApiType
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
                // TODO: use Manga::staff.name
                fields = mapOf(
                    Manga::class.run {
                        jsonApiType() to listOf(
                            jsonApiAttribute(Manga::coverImage),
                            jsonApiAttribute(Manga::title),
                            jsonApiAttribute(Manga::startDate),
                        )
                    },
                    Manga::class.jsonApiType() to listOf(
                        Manga::class.jsonApiAttribute(Manga::coverImage),
                        Manga::class.jsonApiAttribute(Manga::title),
                        Manga::class.jsonApiAttribute(Manga::startDate),
                    ),
                    "manga" to listOf("coverImage", "title", "startDate"),
                    "anime" to listOf("coverImage", "title", "startDate")
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