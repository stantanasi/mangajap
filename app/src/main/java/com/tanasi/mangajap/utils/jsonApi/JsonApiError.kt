package com.tanasi.mangajap.utils.jsonApi

import org.json.JSONObject

class JsonApiError(
        val id: String? = null,
        links: JSONObject? = null,
        val status: String? = null,
        val code: String? = null,
        val title: String? = null,
        val detail: String? = null,
        source: JSONObject? = null,
        val meta: JSONObject? = null,
) {

    val links: Links? = Links.create(links)
    val source: Source? = Source.create(source)

    class Links(
            val about: String
    ) {
        companion object {
            fun create(links: JSONObject?): Links? {
                return links?.let {
                    Links(
                            links.optString("about")
                    )
                }
            }
        }
    }

    class Source(
            val pointer: String? = null,
            val parameter: String? = null
    ) {
        companion object {
            fun create(source: JSONObject?): Source? {
                return source?.let {
                    Source(
                            source.optString("pointer"),
                            source.optString("parameter")
                    )
                }
            }
        }
    }
}