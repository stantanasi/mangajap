package com.tanasi.mangajap.models

import com.tanasi.mangajap.adapters.AppAdapter

data class Manga(
    val id: String,
    val title: String,
    val overview: String? = null,
    val poster: String? = null,

    val genres: List<Genre> = emptyList(),
    val volumes: List<Volume> = emptyList(),
    val chapters: List<Chapter> = emptyList(),
) : AppAdapter.Item {

    override lateinit var itemType: AppAdapter.Type
}