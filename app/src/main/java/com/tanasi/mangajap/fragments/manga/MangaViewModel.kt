package com.tanasi.mangajap.fragments.manga

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.utils.MangaReader
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch

class MangaViewModel(id: String) : ViewModel() {

    private val _state: MutableStateFlow<State> = MutableStateFlow(State.Loading)
    val state: Flow<State> = _state

    sealed class State {
        data object Loading : State()
        data class SuccessLoading(val manga: Manga) : State()
        data class FailedLoading(val error: Exception) : State()
    }

    init {
        getManga(id)
    }

    fun getManga(id: String) = viewModelScope.launch(Dispatchers.IO) {
        _state.emit(State.Loading)

        try {
            val manga = MangaReader.getManga(id)

            _state.emit(State.SuccessLoading(manga))
        } catch (e: Exception) {
            Log.e("MangaViewModel", "getManga: ", e)
            _state.emit(State.FailedLoading(e))
        }
    }
}