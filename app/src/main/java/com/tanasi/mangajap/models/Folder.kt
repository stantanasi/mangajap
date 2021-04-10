package com.tanasi.mangajap.models

import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.utils.extensions.isBook
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File

class Folder(
        val file: File
) : MangaJapAdapter.Item() {

    var name: String = file.name
    var absolutePath: String = file.absolutePath
    var books: List<Book> = listOf()

    suspend fun loadBooks(): Folder = withContext(Dispatchers.IO) {
        this@Folder.books = file.listFiles()
                ?.filter { it.isBook() }
                ?.map { Book(it) }
                ?: listOf()
        return@withContext this@Folder
    }
}