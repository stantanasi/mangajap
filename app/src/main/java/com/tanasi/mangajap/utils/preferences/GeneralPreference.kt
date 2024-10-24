package com.tanasi.mangajap.utils.preferences

import android.content.Context
import android.content.SharedPreferences
import com.tanasi.mangajap.MangaJapApplication
import com.tanasi.mangajap.R

class GeneralPreference(
        context: Context
) {

    object GeneralPreference {}

    companion object {
        private const val PREF_NAME = "${MangaJapApplication.PACKAGE_NAME}.general_preferences"

        private const val START_DESTINATION = "start_destination_id"
        private const val LAUNCH_COUNT = "launch_count"
        private const val DISPLAY_FIRST = "display_first"
    }

    private val prefs: SharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    private var editor: SharedPreferences.Editor = prefs.edit().also { it.apply() }


}