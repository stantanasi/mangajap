package com.tanasi.mangajap.models

import com.tanasi.mangajap.MangaJapApplication
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.utils.extensions.getExtension
import com.tanasi.mangajap.utils.extensions.toCache
import com.tanasi.mangajap.utils.preferences.BookPreference
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.util.zip.ZipFile

class Book(
        val file: File
) : MangaJapAdapter.Item() {

    val name: String = file.name
    val title: String = file.nameWithoutExtension
    val absolutePath: String = file.absolutePath
    val size: Long = file.length() / 1000000
    val extension: Extension? = Extension.getByName(file.getExtension())
    var cover: File = File(MangaJapApplication.context.cacheDir, name)
    val bookmark: Int = BookPreference(MangaJapApplication.context, name).savedBookmark
    val status: Status
        get() {
            return when (bookmark+1) {
                1 -> Status.NotStarted
                in 2 until pageCount ->  Status.Ongoing
                pageCount -> Status.Completed
                else -> Status.NotStarted
            }
        }

    var pages: List<BookPage> = listOf()
    var pageCount: Int = 0

    var mangaId: String? = null
    var manga: Manga? = null

    suspend fun loadCover(): Book = withContext(Dispatchers.IO) {
        when (extension) {
            Extension.cbz,
            Extension.cbr -> {
                val zipFile = ZipFile(absolutePath)
                val entries = zipFile.entries().toList()
                this@Book.pageCount = entries.size
                this@Book.cover = this@Book.cover.also {
                    if (!it.exists()) BookPage(zipFile, entries.first()).getImage().toCache(it)
                }
            }
            null -> {}
        }
        return@withContext this@Book
    }

    suspend fun loadPages(): Book = withContext(Dispatchers.IO) {
        when (extension) {
            Extension.cbz,
            Extension.cbr -> {
                val zipFile = ZipFile(absolutePath)
                val entries = zipFile.entries().toList()
                this@Book.pageCount = entries.size
                this@Book.pages = entries.map { BookPage(zipFile, it) }
            }
            null -> {}
        }
        return@withContext this@Book
    }

    enum class Extension {
        cbz,
        cbr;

        companion object {
            fun getByName(name: String): Extension? = try {
                valueOf(name)
            } catch (e: Exception) {
                null
            }
        }
    }

    enum class Status {
        NotStarted,
        Ongoing,
        Completed;

        companion object {
            fun getByName(name: String): Status = try {
                valueOf(name)
            } catch (e: Exception) {
                NotStarted
            }
        }
    }
}