package com.tanasi.mangajap.utils.preferences

import android.content.Context
import android.content.SharedPreferences
import com.tanasi.mangajap.MangaJapApplication

class BookPreference(
        context: Context,
        private val bookTitle: String
) {

    companion object {
        private const val PREF_NAME = "${MangaJapApplication.PACKAGE_NAME}.books_preferences"
    }

    private val prefs: SharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    private var editor: SharedPreferences.Editor = prefs.edit().also { it.apply() }


    var savedBookmark: Int
        get() = prefs.getInt(bookTitle + "_bookmark", 0)
        set(bookmark) {
            editor.putInt(bookTitle + "_bookmark", bookmark)
            editor.commit()
        }
}