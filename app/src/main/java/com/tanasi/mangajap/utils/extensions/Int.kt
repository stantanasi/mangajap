package com.tanasi.mangajap.utils.extensions

import android.content.Context

fun Int.pxToDp(context: Context): Int {
    val density = context.resources.displayMetrics.density
    return (this / density).toInt()
}

fun Int.dpToPx(context: Context): Int {
    val density = context.resources.displayMetrics.density
    return (this * density).toInt()
}