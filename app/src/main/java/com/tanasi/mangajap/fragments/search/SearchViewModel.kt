package com.tanasi.mangajap.fragments.search

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.utils.MangaReader
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

class SearchViewModel : ViewModel() {

    private val _state = MutableStateFlow<State>(State.Searching)
    val state: Flow<State> = _state

    var query = ""
    private var page = 1

    sealed class State {
        data object Searching : State()
        data object SearchingMore : State()
        data class SuccessSearching(val results: List<Manga>, val hasMore: Boolean) : State()
        data class FailedSearching(val error: Exception) : State()
    }

    init {
        search(query)
    }


    fun search(query: String) = viewModelScope.launch(Dispatchers.IO) {
        _state.emit(State.Searching)

        try {
            val results = MangaReader.search(query)

            this@SearchViewModel.query = query
            page = 1

            _state.emit(State.SuccessSearching(results, true))
        } catch (e: Exception) {
            Log.e("SearchViewModel", "search: ", e)
            _state.emit(State.FailedSearching(e))
        }
    }

    fun loadMore() = viewModelScope.launch(Dispatchers.IO) {
        val currentState = _state.first()
        if (currentState is State.SuccessSearching) {
            _state.emit(State.SearchingMore)

            try {
                val results = MangaReader.search(query, page + 1)

                page += 1

                _state.emit(
                    State.SuccessSearching(
                        results = currentState.results + results,
                        hasMore = results.isNotEmpty(),
                    )
                )
            } catch (e: Exception) {
                Log.e("SearchViewModel", "loadMore: ", e)
                _state.emit(State.FailedSearching(e))
            }
        }
    }
}