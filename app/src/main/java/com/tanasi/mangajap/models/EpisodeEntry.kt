package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiAttribute
import com.tanasi.jsonapi.JsonApiType

@JsonApiType("episode-entries")
class EpisodeEntry(
    var id: String? = null,

    createdAt: String? = null,
    updatedAt: String? = null,
    @JsonApiAttribute("watchedDate") private var _watchedDate: String? = null,
    watchedCount: Int = 0,
    rating: Int? = null,

    user: User? = null,
    episode: Episode? = null,
) {
}