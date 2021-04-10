package com.tanasi.mangajap.fragments.reading

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.mangajap.models.Book
import kotlinx.coroutines.launch
import java.io.File

class ReadingViewModel : ViewModel() {

    private val _state: MutableLiveData<State> = MutableLiveData(State.Loading)
    val state: LiveData<State> = _state

    sealed class State {
        object Loading: State()
        data class SuccessLoading(val book: Book): State()
        data class FailedLoading(val throwable: Throwable): State()
    }

    fun getBook(path: String) = viewModelScope.launch {
        _state.value = State.Loading

        _state.value = try {
            State.SuccessLoading(Book(File(path)).loadPages())
        } catch (e: Exception) {
            State.FailedLoading(e)
        }
    }
}