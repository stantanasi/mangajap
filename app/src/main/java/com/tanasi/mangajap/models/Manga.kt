package com.tanasi.mangajap.models

import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.toCalendar

class Manga(
    val id: String,
    val title: String,
    val alternativeTitle: String? = null,
    val overview: String? = null,
    val poster: String? = null,
    val type: String? = null,
    val status: String? = null,
    startDate: String? = null,
    endDate: String? = null,
    val score: Double? = null,
    val languages: List<String> = emptyList(),

    val genres: List<Genre> = emptyList(),
    val volumes: List<Volume> = emptyList(),
    val chapters: List<Chapter> = emptyList(),
    val staff: List<Staff> = emptyList(),
    val magazines: List<Magazine> = emptyList(),
) : AppAdapter.Item {

    val startDate = startDate?.toCalendar()
    val endDate = endDate?.toCalendar()


    override lateinit var itemType: AppAdapter.Type
}