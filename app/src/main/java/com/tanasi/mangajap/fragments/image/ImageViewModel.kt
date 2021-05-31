package com.tanasi.mangajap.fragments.image

import android.graphics.Bitmap
import android.graphics.drawable.Drawable
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.squareup.picasso.Picasso
import kotlinx.coroutines.launch

class ImageViewModel : ViewModel() {

    private val _state: MutableLiveData<State> = MutableLiveData(State.Loading)
    val state: LiveData<State> = _state

    sealed class State {
        object Loading: State()
        data class SuccessLoading(val image: Bitmap): State()
        data class FailedLoading(val error: Throwable): State()
    }

    fun getImage(url: String) = viewModelScope.launch {
        _state.value = State.Loading

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