package com.tanasi.mangajap.utils.preferences

import android.content.Context
import android.content.SharedPreferences
import com.tanasi.mangajap.MangaJapApplication
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.fragments.profile.ProfileFragment

class GeneralPreference(
        context: Context
) {

    companion object {
        private const val PREF_NAME = "${MangaJapApplication.PACKAGE_NAME}.general_preferences"

        private const val START_DESTINATION = "start_destination_id"
        private const val PROFILE_TAB = "profile_tab"
        private const val LAUNCH_COUNT = "launch_count"
        private const val BOOK_LAYOUT_TYPE = "book_layout_type"
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

    var savedProfileTab: ProfileFragment.TabType
        get() {
            val position = prefs.getInt(PROFILE_TAB, ProfileFragment.TabType.Manga.ordinal)
            return ProfileFragment.TabType.values()[position]
        }
        set(value) {
            editor.putInt(PROFILE_TAB, value.ordinal)
            editor.commit()
        }

    var launchCount: Int
        get() = prefs.getInt(LAUNCH_COUNT, 0)
        set(value) {
            editor.putInt(LAUNCH_COUNT, value)
            editor.commit()
        }



    var savedBookLayoutType: MangaJapAdapter.Type
        get() = when (val type = MangaJapAdapter.Type.values()[prefs.getInt(BOOK_LAYOUT_TYPE, MangaJapAdapter.Type.BOOK_DETAILS.ordinal)]) {
                MangaJapAdapter.Type.BOOK,
                MangaJapAdapter.Type.BOOK_DETAILS -> type
                else -> MangaJapAdapter.Type.BOOK_DETAILS
            }
        set(value) {
            editor.putInt(BOOK_LAYOUT_TYPE, value.ordinal)
            editor.commit()
        }
}