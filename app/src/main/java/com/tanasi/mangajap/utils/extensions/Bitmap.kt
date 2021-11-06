package com.tanasi.mangajap.utils.extensions

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Color
import android.os.Environment
import android.util.Base64
import android.util.Log
import androidx.palette.graphics.Palette
import com.tanasi.mangajap.ui.SingleMediaScanner
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream
import java.io.IOException

fun Bitmap.toBase64(): String {
    val baos = ByteArrayOutputStream()
    this.compress(Bitmap.CompressFormat.JPEG, 100, baos)
    val data = baos.toByteArray()
    return Base64.encodeToString(data, Base64.DEFAULT)
}

fun Bitmap.getAverageColor(): Int {
    val p = Palette.from(this).generate()
    val vibrantSwatch = p.mutedSwatch
    return vibrantSwatch?.rgb ?: Color.GRAY
}

suspend fun Bitmap.toCache(file: File): Boolean = withContext(Dispatchers.IO) {
    return@withContext try {
        val out = FileOutputStream(file)
        this@toCache.compress(Bitmap.CompressFormat.JPEG, 100, out)
        out.flush()
        out.close()
        true
    } catch (e: IOException) {
        Log.e("Function", "bitmapToCache: ", e)
        false
    }
}

fun Bitmap.save(context: Context, name: String, extension: String): Boolean {
    return try {
        val path = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).absolutePath
        var file = File(path, "$name.$extension")
        var i = 1
        while (file.exists()) {
            file = File(path, "$name (${i++}).$extension")
        }

        val out = FileOutputStream(file)
        this.compress(Bitmap.CompressFormat.JPEG, 90, out)
        out.flush()
        out.close()
        SingleMediaScanner(context, file)
        true
    } catch (e: Exception) {
        Log.e("ImageActivity", "saveImage: ", e)
        false
    }
}