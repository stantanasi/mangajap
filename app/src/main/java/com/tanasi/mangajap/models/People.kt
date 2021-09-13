package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiRelationship
import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.utils.extensions.toCalendar
import java.util.*

@JsonApiType("people")
class People(
    override var id: String = "",
    createdAt: String? = null,
    updatedAt: String? = null,
    val firstName: String = "",
    val lastName: String = "",
    val pseudo: String = "",
    val image: String? = null,

    var staff: List<Staff> = listOf(),
    @JsonApiRelationship("manga-staff") var mangaStaff: List<Staff> = listOf(),
    @JsonApiRelationship("anime-staff") var animeStaff: List<Staff> = listOf(),
) : JsonApiResource(), MangaJapAdapter.Item {

    val createdAt: Calendar? = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt: Calendar? = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")


    override lateinit var typeLayout: MangaJapAdapter.Type
}