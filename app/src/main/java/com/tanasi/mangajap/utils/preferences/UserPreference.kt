package com.tanasi.mangajap.utils.preferences

import android.content.Context
import android.content.SharedPreferences
import com.tanasi.mangajap.MangaJapApplication

class UserPreference(val context: Context) {

    companion object {
        private const val PREF_NAME = "${MangaJapApplication.PACKAGE_NAME}.user_preferences"

        private const val USER_ID = "user_id"
    }

    private val prefs: SharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    private val editor: SharedPreferences.Editor = prefs.edit().also { it.apply() }

    // TODO: essayer d'enlever / supprimer cette classe
    var selfId: String
        get() {
            if (context.getSharedPreferences("user_prefs", Context.MODE_PRIVATE).getString("id", "") != "") {
                selfId = context.getSharedPreferences("user_prefs", Context.MODE_PRIVATE).getString("id", "") ?: ""
                context.getSharedPreferences("user_prefs", Context.MODE_PRIVATE).edit().remove("id").commit()
            }

            return prefs.getString(USER_ID, "") ?: ""
        }
        set(value) {
            editor.putString(USER_ID, value)
            editor.commit()
        }
}