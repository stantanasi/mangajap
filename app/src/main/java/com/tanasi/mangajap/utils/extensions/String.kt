package com.tanasi.mangajap.utils.extensions

import com.tanasi.mangajap.MangaJapApplication
import java.text.SimpleDateFormat
import java.util.*

fun String.toCalendar(pattern: String): Calendar? {
    return try {
        Calendar.getInstance().also {
            it.time = SimpleDateFormat(pattern, MangaJapApplication.context.locale()).parse(this)!!
        }
    } catch (e: Exception) {
        try {
            Calendar.getInstance().also {
                it.time = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", MangaJapApplication.context.locale()).parse(this)!!
            }
        } catch (e1: Exception) {
            null
        }
    }
}

fun String.isEmailValid(): Boolean = this.matches("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}$".toRegex())

fun String.isPseudoValid(): Boolean = this.matches("[A-Za-z0-9_]{3,60}".toRegex())

fun String.isPasswordValid(): Boolean = this.matches("[a-zA-Z0-9_@\$!%*#?&]{8,72}".toRegex())