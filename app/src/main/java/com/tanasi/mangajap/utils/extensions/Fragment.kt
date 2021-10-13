package com.tanasi.mangajap.utils.extensions

import android.content.Intent
import android.view.View
import android.widget.TextView
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.widget.Toolbar
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.MainActivity

fun Fragment.setToolbar(title: String, subtitle: String): Toolbar {
    val toolbar = requireView().findViewById<Toolbar>(R.id.toolbar)
    (requireActivity() as MainActivity).setSupportActionBar(toolbar)

    toolbar.findViewById<TextView>(R.id.tv_toolbar_title).apply {
        text = title
        maxLines = if (subtitle == "") 2 else 1
    }

    toolbar.findViewById<TextView>(R.id.tv_toolbar_subtitle).apply {
        text = subtitle
        visibility = if (subtitle == "") View.GONE else View.VISIBLE
    }

    toolbar.setNavigationOnClickListener { findNavController().navigateUp() }

    return toolbar
}

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