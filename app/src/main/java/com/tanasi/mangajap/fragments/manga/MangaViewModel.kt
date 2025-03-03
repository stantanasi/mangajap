package com.tanasi.mangajap.fragments.manga

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.mangajap.models.Chapter
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.models.Volume
import com.tanasi.mangajap.utils.MangaReader
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch

class MangaViewModel(val id: String) : ViewModel() {

    private val _state: MutableStateFlow<State> = MutableStateFlow(State.Loading)
    val state: Flow<State> = _state

    private val _chapters: MutableStateFlow<ChaptersState> = MutableStateFlow(ChaptersState.Loading)
    val chapters: Flow<ChaptersState> = _chapters

    private val _volumes: MutableStateFlow<VolumesState> = MutableStateFlow(VolumesState.Loading)
    val volumes: Flow<VolumesState> = _volumes

    var selectedTabPosition = 0

    sealed class State {
        data object Loading : State()
        data class SuccessLoading(val manga: Manga) : State()
        data class FailedLoading(val error: Exception) : State()
    }

    sealed class ChaptersState {
        data object Loading : ChaptersState()
        data class SuccessLoading(val chapters: List<Chapter>) : ChaptersState()
        data class FailedLoading(val error: Exception) : ChaptersState()
    }

    sealed class VolumesState {
        data object Loading : VolumesState()
        data class SuccessLoading(val volumes: List<Volume>) : VolumesState()
        data class FailedLoading(val error: Exception) : VolumesState()
    }

    init {
        getManga(id)
        getMangaChapters(id)
        getMangaVolumes(id)
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

    fun getMangaChapters(mangaId: String) = viewModelScope.launch(Dispatchers.IO) {
        _chapters.emit(ChaptersState.Loading)

        try {
            val chapters = MangaReader.getChapters(mangaId)

            _chapters.emit(ChaptersState.SuccessLoading(chapters))
        } catch (e: Exception) {
            Log.e("MangaViewModel", "getMangaChapters: ", e)
            _chapters.emit(ChaptersState.FailedLoading(e))
        }
    }

    fun getMangaVolumes(mangaId: String) = viewModelScope.launch(Dispatchers.IO) {
        _volumes.emit(VolumesState.Loading)

        try {
            val volumes = MangaReader.getVolumes(mangaId)

            _volumes.emit(VolumesState.SuccessLoading(volumes))
        } catch (e: Exception) {
            Log.e("MangaViewModel", "getMangaVolumes: ", e)
            _volumes.emit(VolumesState.FailedLoading(e))
        }
    }
}