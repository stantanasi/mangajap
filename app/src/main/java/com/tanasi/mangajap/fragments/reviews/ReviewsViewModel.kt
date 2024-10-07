package com.tanasi.mangajap.fragments.reviews

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.jsonapi.JsonApiParams
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.models.Review
import com.tanasi.mangajap.services.MangaJapApiService
import kotlinx.coroutines.launch

class ReviewsViewModel : ViewModel() {

    private val mangaJapApiService: MangaJapApiService = MangaJapApiService.build()

    private val _state: MutableLiveData<State> = MutableLiveData(State.Loading)
    val state: LiveData<State> = _state

    sealed class State {
        object Loading: State()
        data class SuccessLoading(val reviews: List<Review>): State()
        data class FailedLoading(val error: JsonApiResponse.Error): State()
    }

    fun getMangaReviews(mangaId: String) = viewModelScope.launch {
        _state.value = State.Loading

        val response = mangaJapApiService.getMangaReviews(
                mangaId,
                JsonApiParams(
                        include = listOf("user")
                )
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.SuccessLoading(response.body.data!!.map { it.apply { typeLayout = AppAdapter.Type.REVIEW } })
                is JsonApiResponse.Error -> State.FailedLoading(response)
            }
        } catch (e: Exception) {
            State.FailedLoading(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun getAnimeReviews(animeId: String) = viewModelScope.launch {
        _state.value = State.Loading

        val response = mangaJapApiService.getAnimeReviews(
                animeId,
                JsonApiParams(
                        include = listOf("user")
                )
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.SuccessLoading(response.body.data!!.map { it.apply { typeLayout = AppAdapter.Type.REVIEW } })
                is JsonApiResponse.Error -> State.FailedLoading(response)
            }
        } catch (e: Exception) {
            State.FailedLoading(JsonApiResponse.Error.UnknownError(e))
        }
    }
}