package com.tanasi.mangajap.utils.jsonApi

import org.json.JSONArray
import org.json.JSONObject

class JsonApiBody<out T : Any>(
        val raw: String,
        val data: T?,
        val included: JSONArray? = null,
        val meta: JSONObject? = null,
        links: JSONObject? = null,
        jsonApi: JSONObject? = null,
) {

    val jsonApi: JsonApi? = JsonApi.fromJson(jsonApi)
    val links: Links? = Links.fromJson(links)

    data class JsonApi(
            val version: String?
    ) {
        companion object {
            fun fromJson(json: JSONObject?): JsonApi? {
                return json?.let { JsonApi(
                        json.optString("version")
                ) }
            }
        }
    }

    data class Links(
            val first: String?,
            val prev: String?,
            val next: String?,
            val last: String?,
    ) {
        companion object {
            fun fromJson(json: JSONObject?): Links? {
                return json?.let { Links(
                        json.optString("first"),
                        json.optString("prev"),
                        json.optString("next"),
                        json.optString("last"),
                ) }
            }
        }
    }
}