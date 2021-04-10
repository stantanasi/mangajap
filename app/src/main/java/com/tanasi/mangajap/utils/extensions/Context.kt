package com.tanasi.mangajap.utils.extensions

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.content.res.Configuration
import android.os.Build
import android.os.Environment
import android.util.TypedValue
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.tanasi.mangajap.utils.preferences.SettingsPreference
import java.io.File
import java.util.*

fun AppCompatActivity.getActualTheme(): Int = SettingsPreference(this).theme.styleId

fun Context.locale(): Locale = Locale(SettingsPreference(this).language.name)

fun Context.setLocale(lang: String? = null) {
    val locale = if (lang == null) this.locale() else Locale(lang)
    Locale.setDefault(locale)
    this.resources.updateConfiguration(Configuration().also {
        it.setLocale(locale)
    }, this.resources.displayMetrics)
}


fun Context.isStoragePermissionGranted(): Boolean {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED
    } else { //permission is automatically granted on sdk<23 upon installation
        true
    }
}

// TODO: ne fonctionne pas sur mon samsung (carte sd et stockage interne)
fun Context.getInternalStorageDirectory(): File {
    return Environment.getExternalStorageDirectory()
}

fun Context.getExternalStorageDirectory(): File {
    val fileList = File("/storage/").listFiles() ?: return File("/storage/")
    for (file in fileList) {
        if (!file.absolutePath.equals(this.getInternalStorageDirectory().absolutePath, true)
                && !file.name.equals("self", true)
                && file.isDirectory
                && file.canRead()) {
            return file
        }
    }
    return File("/storage/")
}

fun Context.getAttrColor(resId: Int): Int {
    val typedValue = TypedValue()
    this.theme.resolveAttribute(resId, typedValue, true)
    return typedValue.data
}

fun Context.getCountries(): Map<String, String> {
    val countries: MutableMap<String, String> = mutableMapOf()
    val locales = Locale.getAvailableLocales()
    for (locale in locales) {
        val countryName = locale.getDisplayCountry(this.locale())
        val countryCode = locale.country
        if (countryName.isNotEmpty() && !countries.containsValue(countryName)) {
            countries[countryCode] = countryName
        }
    }
    return countries
}

fun Context.pxToDp(px: Int): Int {
    val density = this.resources.displayMetrics.density
    return (px / density).toInt()
}

fun Context.dpToPx(dp: Int): Int {
    val density = this.resources.displayMetrics.density
    return (dp * density).toInt()
}

fun Context.getAppVersionName(): String {
    return try {
        this.packageManager.getPackageInfo(this.packageName, 0).versionName
    } catch (e: PackageManager.NameNotFoundException) {
        ""
    }
}

fun Context.getAppVersionCode(): Int {
    return try {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            this.packageManager.getPackageInfo(this.packageName, 0).longVersionCode.toInt()
        } else {
            this.packageManager.getPackageInfo(this.packageName, 0).versionCode
        }
    } catch (e: PackageManager.NameNotFoundException) {
        0
    }
}