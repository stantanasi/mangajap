package com.tanasi.mangajap.utils.preferences

import android.content.Context
import android.content.SharedPreferences
import com.tanasi.mangajap.MangaJapApplication
import com.tanasi.mangajap.R

class GeneralPreference(
        context: Context
) {

    companion object {
        private const val PREF_NAME = "${MangaJapApplication.PACKAGE_NAME}.general_preferences"

        private const val START_DESTINATION = "start_destination_id"
        private const val PROFILE_TAB = "profile_tab"
        private const val LAUNCH_COUNT = "launch_count"
        private const val DISPLAY_FIRST = "display_first"
    }

    private val prefs: SharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    private var editor: SharedPreferences.Editor = prefs.edit().also { it.apply() }


    var savedStartDestination: Int
        get() = when (val id = prefs.getInt(START_DESTINATION, R.id.discover)) {
            R.id.agenda,
            R.id.discover,
            R.id.profile -> id
            else -> R.id.discover
        }
        set(id) {
            editor.putInt(START_DESTINATION, id)
            editor.commit()
        }

    enum class DisplayFirst(val stringId: Int) {
        Manga(R.string.manga),
        Anime(R.string.anime);

        companion object {
            fun getByName(name: String?): DisplayFirst = try {
                valueOf(name!!)
            } catch (e: Exception) {
                Manga
            }
        }
    }
    var displayFirst: DisplayFirst
        get() = DisplayFirst.getByName(prefs.getString(DISPLAY_FIRST, null))
        set(value) {
            editor.putString(DISPLAY_FIRST, value.name)
            editor.commit()
        }

    var launchCount: Int
        get() = prefs.getInt(LAUNCH_COUNT, 0)
        set(value) {
            editor.putInt(LAUNCH_COUNT, value)
            editor.commit()
        }
}