package com.tanasi.mangajap.fragments.home

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.mangajap.models.Category
import com.tanasi.mangajap.utils.MangaReader
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch

class HomeViewModel : ViewModel() {

    private val _state = MutableStateFlow<State>(State.Loading)
    val state: Flow<State> = _state

    sealed class State {
        data object Loading : State()
        data class SuccessLoading(val categories: List<Category>) : State()
        data class FailedLoading(val error: Exception) : State()
    }

    init {
        getHome()
    }


    private fun getHome() = viewModelScope.launch(Dispatchers.IO) {
        _state.emit(State.Loading)

        try {
            val categories = MangaReader.getHome()

            _state.emit(State.SuccessLoading(categories))
        } catch (e: Exception) {
            Log.e("HomeViewModel", "getHome: ", e)
            _state.emit(State.FailedLoading(e))
        }
    }
}