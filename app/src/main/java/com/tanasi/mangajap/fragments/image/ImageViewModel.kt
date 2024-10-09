package com.tanasi.mangajap.fragments.image

import android.graphics.Bitmap
import android.graphics.drawable.Drawable
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.squareup.picasso.Picasso
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch

class ImageViewModel(url: String) : ViewModel() {

    private val _state = MutableStateFlow<State>(State.Loading)
    val state: Flow<State> = _state

    sealed class State {
        data object Loading : State()
        data class SuccessLoading(val image: Bitmap) : State()
        data class FailedLoading(val error: Throwable) : State()
    }

    init {
        getImage(url)
    }


    private fun getImage(url: String) = viewModelScope.launch {
        _state.emit(State.Loading)

        Picasso.get().load(url).into(object : com.squareup.picasso.Target {
            override fun onBitmapLoaded(bitmap: Bitmap?, from: Picasso.LoadedFrom?) {
                bitmap?.let {
                    _state.value = State.SuccessLoading(it)
                } ?: let {
                    _state.value = State.FailedLoading(Exception("Bitmap is null"))
                }
            }

            override fun onPrepareLoad(placeHolderDrawable: Drawable?) {}

            override fun onBitmapFailed(e: Exception?, errorDrawable: Drawable?) {
                _state.value = State.FailedLoading(e ?: Exception("Bitmap failed to load"))
            }
        })
    }
}