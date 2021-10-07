package com.tanasi.mangajap.utils.extensions

import android.content.pm.PackageInfo
import android.content.pm.PackageManager

fun PackageManager.requirePackageInfo(packageName: String, flags: Int): PackageInfo? {
    return try {
        this.getPackageInfo(packageName, flags)
    } catch (e: PackageManager.NameNotFoundException) {
        null
    }
}