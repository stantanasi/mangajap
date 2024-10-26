package com.tanasi.mangajap.utils

import android.content.Context
import android.util.TypedValue
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.fragment.app.viewModels
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.NavHostFragment
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.main.MainActivity
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

fun Int.dp(context: Context): Int {
    return TypedValue.applyDimension(
        TypedValue.COMPLEX_UNIT_DIP,
        this.toFloat(),
        context.resources.displayMetrics
    ).toInt()
}

fun Context.toActivity(): FragmentActivity? = this as? FragmentActivity

fun FragmentActivity.getCurrentFragment(): Fragment? = when (this) {
    is MainActivity -> {
        val navHostFragment = this.supportFragmentManager
            .findFragmentById(R.id.nav_main_fragment) as NavHostFragment
        navHostFragment.childFragmentManager.fragments.firstOrNull()
    }

    else -> null
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

fun String.toCalendar(): Calendar? {
    val patterns = listOf(
        SimpleDateFormat("MMM d, yyyy", Locale.ENGLISH),
    )
    patterns.forEach { sdf ->
        try {
            return Calendar.getInstance().also { it.time = sdf.parse(this)!! }
        } catch (_: Exception) {
        }
    }
    return null
}