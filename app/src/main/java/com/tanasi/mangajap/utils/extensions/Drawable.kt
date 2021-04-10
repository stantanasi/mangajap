package com.tanasi.mangajap.utils.extensions

import android.graphics.BlendMode
import android.graphics.BlendModeColorFilter
import android.graphics.PorterDuff
import android.graphics.drawable.Drawable
import android.os.Build


fun Drawable.setColorFilter(resId: Int) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        this.colorFilter = BlendModeColorFilter(resId, BlendMode.SRC_ATOP)
    } else {
        this.setColorFilter(resId, PorterDuff.Mode.SRC_ATOP)
    }
}