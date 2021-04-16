package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiRelationship
import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.adapters.MangaJapAdapter

@JsonApiType("people")
class People(
        override var id: String = "",
        var firstName: String? = null,
        var lastName: String? = null,
        var pseudo: String = "",
        var image: String? = null,

        var staff: List<Staff> = listOf(),
        @JsonApiRelationship("manga-staff") var mangaStaff: List<Staff> = listOf(),
        @JsonApiRelationship("anime-staff") var animeStaff: List<Staff> = listOf(),
) : JsonApiResource(), MangaJapAdapter.Item {


    override lateinit var typeLayout: MangaJapAdapter.Type
}