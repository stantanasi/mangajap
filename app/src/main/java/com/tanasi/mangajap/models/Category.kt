package com.tanasi.mangajap.models

import com.tanasi.mangajap.adapters.AppAdapter

data class Category(
    val name: String,
    val list: List<Manga>,
) : AppAdapter.Item {

    override lateinit var itemType: AppAdapter.Type
}