package com.tanasi.mangajap.models

import com.tanasi.mangajap.adapters.AppAdapter

data class Genre(
    val id: String,
    val title: String = "",
) : AppAdapter.Item {

    override lateinit var itemType: AppAdapter.Type
}