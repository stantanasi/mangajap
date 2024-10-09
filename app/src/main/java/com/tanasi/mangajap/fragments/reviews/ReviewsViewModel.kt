package com.tanasi.mangajap.fragments.reviews

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.fragments.reviews.ReviewsFragment.ReviewsType
import com.tanasi.mangajap.models.Review
import com.tanasi.mangajap.utils.MangaJapApi
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch

class ReviewsViewModel(mediaType: ReviewsType, mediaId: String) : ViewModel() {

    private val _state = MutableStateFlow<State>(State.Loading)
    val state: Flow<State> = _state

    sealed class State {
        data object Loading : State()
        data class SuccessLoading(val reviews: List<Review>) : State()
        data class FailedLoading(val error: JsonApiResponse.Error) : State()
    }

    init {
        when (mediaType) {
            ReviewsType.Manga -> getMangaReviews(mediaId)
            ReviewsType.Anime -> getAnimeReviews(mediaId)
        }
    }


    private fun getMangaReviews(mangaId: String) = viewModelScope.launch {
        _state.emit(State.Loading)

        try {
            val response = MangaJapApi.Manga.reviews(
                mangaId,
                include = listOf("user")
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

    private fun getAnimeReviews(animeId: String) = viewModelScope.launch {
        _state.emit(State.Loading)

        try {
            val response = MangaJapApi.Anime.reviews(
                animeId,
                include = listOf("user")
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