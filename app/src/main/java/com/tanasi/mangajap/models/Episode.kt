package com.tanasi.mangajap.models

import com.tanasi.mangajap.utils.jsonApi.JsonApi
import com.tanasi.mangajap.utils.jsonApi.JsonApiResource
import org.json.JSONObject

@JsonApi("episodes")
class Episode(
        override var id: String = "",
        var createdAt: String? = null,
        var updatedAt: String? = null,
        var canonicalTitle: String? = null,
        titles: JSONObject? = null,
        var seasonNumber: Int = 0,
        var relativeNumber: Int = 0,
        var number: Int = 0,
        var airDate: String? = null,
        episodeType: String = "",

        var anime: Anime? = null,
) : JsonApiResource(), Cloneable {

    val titles: Titles? = Titles.create(titles)
    var episodeType: EpisodeType? = EpisodeType.getByName(episodeType)

    var seasonEpisodeCount: Int = 0

    data class Titles(
            val fr: String,
    ) {
        companion object {
            fun create(json: JSONObject?): Titles? {
                return if (json == null) null else Titles(
                        json.optString("fr") ?: ""
                )
            }
        }
    }

    enum class EpisodeType(val stringId: Int) {
        ova(0);

        companion object {
            fun getByName(name: String): EpisodeType? = try {
                valueOf(name)
            } catch (e: Exception) {
                null
            }
        }
    }

    public override fun clone(): Episode {
        return super.clone() as Episode
    }
}