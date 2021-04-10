package com.tanasi.mangajap.fragments.books

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.mangajap.models.Book
import com.tanasi.mangajap.models.Folder
import kotlinx.coroutines.launch
import java.io.File

class BooksViewModel : ViewModel() {

    private val _state: MutableLiveData<State> = MutableLiveData(State.Loading)
    val state: LiveData<State> = _state

    sealed class State {
        object Loading: State()
        data class SuccessLoading(val books: List<Book>): State()
        data class FailedLoading(val throwable: Throwable): State()
    }

    fun getBooks(folders: List<String>) = viewModelScope.launch {
        _state.value = State.Loading

        _state.value = try {
            State.SuccessLoading(folders
                    .map { Folder(File(it)).loadBooks().books }
                    .flatten()
                    .map { it.loadCover() }
                    .sortedBy { it.title.toLowerCase() })
        } catch (e: Exception) {
            State.FailedLoading(e)
        }
    }
}