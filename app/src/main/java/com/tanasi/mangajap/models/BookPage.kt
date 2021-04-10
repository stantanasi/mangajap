package com.tanasi.mangajap.models

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import com.tanasi.mangajap.adapters.MangaJapAdapter
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.util.zip.ZipEntry
import java.util.zip.ZipFile

class BookPage(
        val zipFile: ZipFile,
        val entry: ZipEntry
) : MangaJapAdapter.Item() {

    var name: String = entry.name
    var image: Bitmap? = null

    suspend fun getImage(): Bitmap = withContext(Dispatchers.IO) {
        return@withContext zipFile.getInputStream(entry).use { BitmapFactory.decodeStream(it) }
    }

    suspend fun loadImage(): BookPage = withContext(Dispatchers.IO) {
        this@BookPage.image = zipFile.getInputStream(entry).use { BitmapFactory.decodeStream(it) }
        return@withContext this@BookPage
    }

    override var typeLayout: MangaJapAdapter.Type = MangaJapAdapter.Type.BOOK_PAGE
}