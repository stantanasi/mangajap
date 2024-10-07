package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiAttribute
import com.tanasi.jsonapi.JsonApiType

@JsonApiType("volume-entries")
class VolumeEntry(
    var id: String? = null,

    createdAt: String? = null,
    updatedAt: String? = null,
    @JsonApiAttribute("readDate") private var _readDate: String? = null,
    readCount: Int = 0,
    rating: Int? = null,

    user: User? = null,
    volume: Volume? = null,
) {
}