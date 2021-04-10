package com.tanasi.mangajap.utils.preferences

import android.content.Context
import android.content.SharedPreferences
import com.tanasi.mangajap.MangaJapApplication
import com.tanasi.mangajap.fragments.library.LibraryFragment

class LibraryPreference(
        context: Context
) {

    companion object {
        private const val PREF_NAME = "${MangaJapApplication.PACKAGE_NAME}.library_preferences"

        private const val SORT_BY = "sort_by"
        private const val ORDER_REVERSE = "sort_in_reverse"
        private const val SHOW_STATUS_HEADER = "show_status_header"
    }

    private val prefs: SharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    private var editor: SharedPreferences.Editor = prefs.edit().also { it.apply() }


    var sortBy: LibraryFragment.SortBy
        get() = LibraryFragment.SortBy.getByName(prefs.getString(SORT_BY, null))
        set(value) {
            editor.putString(SORT_BY, value.name)
            editor.commit()
        }

    var sortInReverse: Boolean
        get() = prefs.getBoolean(ORDER_REVERSE, false)
        set(value) {
            editor.putBoolean(ORDER_REVERSE, value)
            editor.commit()
        }

    var showStatusHeader: Boolean
        get() = prefs.getBoolean(SHOW_STATUS_HEADER, true)
        set(value) {
            editor.putBoolean(SHOW_STATUS_HEADER, value)
            editor.commit()
        }
}