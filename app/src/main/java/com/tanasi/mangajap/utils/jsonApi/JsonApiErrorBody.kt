package com.tanasi.mangajap.utils.jsonApi

import org.json.JSONObject

class JsonApiErrorBody(
        val raw: String,
        val errors: List<JsonApiError>,
        val meta: JSONObject? = null,
        val links: JsonApiBody.Links? = null,
        val jsonApi: JsonApiBody.JsonApi? = null,
)