package com.tanasi.mangajap.utils.extensions

import com.tanasi.mangajap.MangaJapApplication
import java.text.SimpleDateFormat
import java.util.*

fun Calendar.format(pattern: String): String? {
    return try {
        SimpleDateFormat(pattern, MangaJapApplication.context.locale()).format(this.time)
    } catch (e: Exception) {
        null
    }
}