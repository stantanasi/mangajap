package com.tanasi.mangajap.utils.preferences

import android.content.Context
import android.content.SharedPreferences
import com.tanasi.mangajap.MangaJapApplication
import com.tanasi.mangajap.R
import com.tanasi.mangajap.utils.extensions.setLocale
import java.util.*

class SettingsPreference(
        private val context: Context
) {

    companion object {
        const val PREF_NAME = "${MangaJapApplication.PACKAGE_NAME}.settings_preferences"

        private const val THEME = "theme"
        private const val LANGUAGE = "language"
    }

    private val prefs: SharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    private val editor: SharedPreferences.Editor = prefs.edit().also { it.apply() }


    enum class Language(val stringId: Int) {
        en(R.string.languageEn),
        fr(R.string.languageFr);

        companion object {
            fun getByName(name: String?): Language = try {
                valueOf(name!!)
            } catch (e: Exception) {
                en
            }
        }
    }
    var language: Language
        get() = Language.getByName(prefs.getString(LANGUAGE, Locale.getDefault().language))
        set(value) {
            editor.putString(LANGUAGE, value.name)
            editor.commit()
            context.setLocale(value.name)
        }


    enum class Theme(val styleId: Int, val stringId: Int) {
        light(R.style.AppTheme_Light, R.string.themeClassic),
        dark(R.style.AppTheme_Dark, R.string.themeDark);

        companion object {
            fun getByName(name: String?): Theme = try {
                valueOf(name!!)
            } catch (e: Exception) {
                light
            }
        }
    }
    var theme: Theme
        get() = Theme.getByName(prefs.getString(THEME, null))
        set(value) {
            editor.putString(THEME, value.name)
            editor.commit()
        }
}