package com.tanasi.mangajap.fragments.reviewSave

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.models.Review
import com.tanasi.mangajap.services.MangaJapApiService
import kotlinx.coroutines.launch

class ReviewSaveViewModel : ViewModel() {

    private val mangaJapApiService: MangaJapApiService = MangaJapApiService.build()

    private val _state: MutableLiveData<State> = MutableLiveData(State.Loading)
    val state: LiveData<State> = _state

    sealed class State {
        object Loading: State()
        data class SuccessLoading(val review: Review): State()
        data class FailedLoading(val error: JsonApiResponse.Error): State()

        object Saving: State()
        data class SuccessSaving(val review: Review): State()
        data class FailedSaving(val error: JsonApiResponse.Error): State()
    }

    fun getReview(id: String?) = viewModelScope.launch {
        _state.value = State.Loading

        _state.value = try {
            if (id == null) {
                State.SuccessLoading(Review())
            } else {
                val response = mangaJapApiService.getReview(
                        id
                )
                when (response) {
                    is JsonApiResponse.Success -> State.SuccessLoading(response.body.data!!)
                    is JsonApiResponse.Error -> State.FailedLoading(response)
                }
            }
        } catch (e: Exception) {
            State.FailedLoading(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun createReview(review: Review) = viewModelScope.launch {
        _state.value = State.Saving

        val response = mangaJapApiService.createReview(
                review
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.SuccessSaving(response.body.data!!)
                is JsonApiResponse.Error -> State.FailedSaving(response)
            }
        } catch (e: Exception) {
            State.FailedSaving(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun updateReview(review: Review) = viewModelScope.launch {
        _state.value = State.Saving

        val response = mangaJapApiService.updateReview(
                review.id,
                review.updateJson()
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.SuccessSaving(response.body.data!!)
                is JsonApiResponse.Error -> State.FailedSaving(response)
            }
        } catch (e: Exception) {
            State.FailedSaving(JsonApiResponse.Error.UnknownError(e))
        }
    }
}