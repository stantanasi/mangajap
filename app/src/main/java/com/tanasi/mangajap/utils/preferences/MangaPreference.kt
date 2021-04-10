package com.tanasi.mangajap.utils.preferences

import android.content.Context
import android.content.SharedPreferences
import com.tanasi.mangajap.MangaJapApplication
import com.tanasi.mangajap.models.Manga

class MangaPreference(
        context: Context,
        private val manga: Manga
) {

    companion object {
        private const val PREF_NAME = "${MangaJapApplication.PACKAGE_NAME}.manga_preferences"
    }

    private val prefs: SharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    private var editor: SharedPreferences.Editor = prefs.edit().also { it.apply() }

    var books: List<String>
        get() {
            return prefs.getString("manga_${manga.id}_books", "")
                    ?.split(";")
                    ?.filterNot { it == "" }
                    ?: listOf()
        }
        set(value) {
            editor.putString("manga_${manga.id}_books", value
                    .distinctBy { it }
                    .joinToString(";") { it })
            editor.commit()
        }
}