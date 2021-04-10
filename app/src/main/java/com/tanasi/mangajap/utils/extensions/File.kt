package com.tanasi.mangajap.utils.extensions

import com.tanasi.mangajap.models.Book
import java.io.File

fun File.getExtension(): String {
    val fileName = this.name
    val dotIndex = fileName.lastIndexOf('.')
    return if (dotIndex == -1) "" else fileName.substring(dotIndex + 1)
}

fun File.isBook(): Boolean = this.isFile && Book.Extension.values().map { it.name }.contains(this.getExtension())