package com.tanasi.mangajap.utils.extensions

fun <E> MutableList<E>.addOrLast(index: Int, element: E) {
    this.add(if (size < index) size else index, element)
}