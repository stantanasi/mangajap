package com.tanasi.mangajap.fragments.recyclerView

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.recyclerview.widget.RecyclerView
import com.tanasi.mangajap.adapters.MangaJapAdapter

class RecyclerViewViewModel : ViewModel() {

    private val _state: MutableLiveData<State> = MutableLiveData(State.Loading)
    val state: LiveData<State> = _state

    sealed class State {
        object Loading: State()
        data class SuccessLoading(val list: List<MangaJapAdapter.Item>, val layoutManager: RecyclerView.LayoutManager, val padding: Int): State()
        data class FailedLoading(val throwable: Throwable): State()
    }

    fun createList(list: List<MangaJapAdapter.Item>, layoutManager: RecyclerView.LayoutManager, padding: Int = 0) {
        _state.value = State.Loading

        _state.value = try {
            State.SuccessLoading(list, layoutManager, padding)
        } catch (e: Exception) {
            State.FailedLoading(e)
        }
    }
}