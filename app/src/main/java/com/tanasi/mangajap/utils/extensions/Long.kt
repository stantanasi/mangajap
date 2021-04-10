package com.tanasi.mangajap.utils.extensions

fun Long.withSuffix(): String {
    return when (this) {
        in 0L until 1000L -> this.toString()
        in 1000L until 1000000L -> (this / (1000L / 10) / 10.0).toString()+" K"
        in 1000000L until 1000000000L -> (this / (1000000L / 10) / 10.0).toString()+" M"
        in 1000000000L until 1000000000000L -> (this / (1000000000L / 10) / 10.0).toString()+" G"
        in 1000000000000L until 1000000000000000L -> (this / (1000000000000L / 10) / 10.0).toString()+" T"
        in 1000000000000000L until 1000000000000000000L -> (this / (1000000000000000L / 10) / 10.0).toString()+" P"
        else -> (this / (1000000000000000000L / 10) / 10.0).toString()+" E"
    }
}