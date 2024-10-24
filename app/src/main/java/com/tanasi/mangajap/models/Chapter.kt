package com.tanasi.mangajap.models

import com.tanasi.mangajap.adapters.AppAdapter

data class Chapter(
    val id: String,
    val number: Double,
    val title: String = "",
) : AppAdapter.Item {

    override lateinit var itemType: AppAdapter.Type
}