package com.tanasi.mangajap.utils.extensions

import android.content.Intent
import android.view.View
import android.widget.TextView
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.widget.Toolbar
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.main.MainActivity

fun Fragment.onBackPressed(callable: () -> Unit) {
    this.requireActivity()
            .onBackPressedDispatcher
            .addCallback(this.viewLifecycleOwner, object : OnBackPressedCallback(true) {
                override fun handleOnBackPressed() {
                    if (isEnabled) {
                        isEnabled = false
                        callable()
                    }
                }
            })
}

fun Fragment.runOnUiThread(action: () -> Unit) {
    if (!isAdded) return
    this.activity?.runOnUiThread(action)
}

fun Fragment.shareText(text: String) {
    val intent = Intent(Intent.ACTION_SEND)
    intent.type = "text/plain"
    intent.putExtra(Intent.EXTRA_TEXT, text)
    this.startActivity(Intent.createChooser(intent, this.resources.getString(R.string.share)))
}

inline fun <reified T : ViewModel> Fragment.viewModelsFactory(crossinline viewModelInitialization: () -> T): Lazy<T> {
    return viewModels {
        object : ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                return viewModelInitialization.invoke() as T
            }
        }
    }
}