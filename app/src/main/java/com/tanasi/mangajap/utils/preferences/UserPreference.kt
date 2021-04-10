package com.tanasi.mangajap.utils.preferences

import android.content.Context
import android.content.SharedPreferences
import com.tanasi.mangajap.MangaJapApplication

class UserPreference(context: Context) {

    companion object {
        private const val PREF_NAME = "${MangaJapApplication.PACKAGE_NAME}.user_preferences"

        private const val ACCESS_TOKEN = "access_token"
        private const val USER_ID = "user_id"
    }

    private val prefs: SharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    private val editor: SharedPreferences.Editor = prefs.edit().also { it.apply() }


    fun login(accessToken: String, userId: String) {
        editor.putString(ACCESS_TOKEN, accessToken)
        editor.putString(USER_ID, userId)
        editor.commit()
    }

    fun logout() {
        editor.remove(ACCESS_TOKEN)
        editor.remove(USER_ID)
        editor.commit()
    }

    val accessToken: String? = prefs.getString(ACCESS_TOKEN, context.getSharedPreferences("user_prefs", Context.MODE_PRIVATE).getString("accessToken", null))

    val selfId: String = prefs.getString(USER_ID, context.getSharedPreferences("user_prefs", Context.MODE_PRIVATE).getString("id", "0")) ?: "0"
}