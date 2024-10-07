package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiRelationship
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.toCalendar
import java.util.*

@JsonApiType("peoples")
class People(
    val id: String,

    createdAt: String? = null,
    updatedAt: String? = null,
    val firstName: String = "",
    val lastName: String = "",
    val pseudo: String = "",
    val image: String? = null,

    val staff: List<Staff> = listOf(),
    @JsonApiRelationship("manga-staff") val mangaStaff: List<Staff> = listOf(),
    @JsonApiRelationship("anime-staff") val animeStaff: List<Staff> = listOf(),
) : AppAdapter.Item {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")


    override lateinit var typeLayout: AppAdapter.Type
}