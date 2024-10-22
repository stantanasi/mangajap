package com.tanasi.mangajap.fragments.reader

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.mangajap.fragments.reader.ReaderFragment.ReaderType
import com.tanasi.mangajap.models.Page
import com.tanasi.mangajap.utils.MangaReader
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch

class ReaderViewModel(id: String, readerType: ReaderType) : ViewModel() {

    private var _state = MutableStateFlow<State>(State.Loading)
    val state: Flow<State> = _state

    sealed class State {
        data object Loading : State()
        data class SuccessLoading(val pages: List<Page>) : State()
        data class FailedLoading(val error: Exception) : State()
    }

    init {
        getPages(id, readerType)
    }


    fun getPages(id: String, readerType: ReaderType) = viewModelScope.launch(Dispatchers.IO) {
        _state.emit(State.Loading)

        try {
            val pages = when (readerType) {
                ReaderType.CHAPTER -> MangaReader.getChapterPages(id)
                ReaderType.VOLUME -> MangaReader.getVolumePages(id)
            }

            _state.emit(State.SuccessLoading(pages))
        } catch (e: Exception) {
            Log.e("ReaderViewModel", "getPages: ", e)
            _state.emit(State.FailedLoading(e))
        }
    }
}