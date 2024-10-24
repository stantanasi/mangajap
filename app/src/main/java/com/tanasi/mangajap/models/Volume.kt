package com.tanasi.mangajap.models

import com.tanasi.mangajap.adapters.AppAdapter

data class Volume(
    val id: String,
    val number: Double,
    val title: String = "",
    val poster: String? = null,
) : AppAdapter.Item {

    override lateinit var itemType: AppAdapter.Type
}