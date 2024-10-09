package com.tanasi.mangajap.fragments.reviewsave

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.models.Review
import com.tanasi.mangajap.utils.MangaJapApi
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch

class ReviewSaveViewModel(id: String?) : ViewModel() {

    private val _state = MutableStateFlow<State>(State.Loading)
    val state: Flow<State> = _state

    sealed class State {
        data object Loading : State()
        data class SuccessLoading(val review: Review) : State()
        data class FailedLoading(val error: JsonApiResponse.Error) : State()

        data object Saving : State()
        data class SuccessSaving(val review: Review) : State()
        data class FailedSaving(val error: JsonApiResponse.Error) : State()
    }

    init {
        getReview(id)
    }


    private fun getReview(id: String?) = viewModelScope.launch(Dispatchers.IO) {
        _state.emit(State.Loading)

        try {
            if (id == null) {
                _state.emit(State.SuccessLoading(Review()))
                return@launch
            }

            val response = MangaJapApi.Reviews.details(id)

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

    fun saveReview(review: Review) = viewModelScope.launch(Dispatchers.IO) {
        _state.emit(State.Saving)

        try {
            val id = review.id

            val response = if (id == null) {
                MangaJapApi.Reviews.create(review)
            } else {
                MangaJapApi.Reviews.update(id, review)
            }

            when (response) {
                is JsonApiResponse.Success -> {
                    _state.emit(State.SuccessSaving(response.body.data!!))
                }
                is JsonApiResponse.Error -> {
                    _state.emit(State.FailedSaving(response))
                }
            }
        } catch (e: Exception) {
            _state.emit(State.FailedSaving(JsonApiResponse.Error.UnknownError(e)))
        }
    }
}