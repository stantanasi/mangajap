package com.tanasi.mangajap.models

import com.tanasi.mangajap.utils.jsonApi.JsonApi
import com.tanasi.mangajap.utils.jsonApi.JsonApiRelationships
import com.tanasi.mangajap.utils.jsonApi.JsonApiResource

@JsonApi("people")
class People(
        override var id: String = "",
        var firstName: String? = null,
        var lastName: String? = null,
        var pseudo: String = "",
        var image: String? = null,

        var staff: List<Staff> = listOf(),
        @JsonApiRelationships("manga-staff") var mangaStaff: List<Staff> = listOf(),
        @JsonApiRelationships("anime-staff") var animeStaff: List<Staff> = listOf(),
) : JsonApiResource()