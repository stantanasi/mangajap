package com.tanasi.mangajap.utils.oauth2

sealed class OAuth2ErrorBody(
        open val raw: String,
        open val description: String? = null,
        open val uri: String? = null
) {

    data class InvalidRequest(
            override val raw: String,
            override val description: String? = null,
            override val uri: String? = null
    ) : OAuth2ErrorBody(raw, description, uri)

    data class InvalidClient(
            override val raw: String,
            override val description: String? = null,
            override val uri: String? = null
    ) : OAuth2ErrorBody(raw, description, uri)

    data class InvalidGrant(
            override val raw: String,
            override val description: String? = null,
            override val uri: String? = null
    ) : OAuth2ErrorBody(raw, description, uri)

    data class InvalidScope(
            override val raw: String,
            override val description: String? = null,
            override val uri: String? = null
    ) : OAuth2ErrorBody(raw, description, uri)

    data class UnauthorizedClient(
            override val raw: String,
            override val description: String? = null,
            override val uri: String? = null
    ) : OAuth2ErrorBody(raw, description, uri)

    data class UnsupportedGrantType(
            override val raw: String,
            override val description: String? = null,
            override val uri: String? = null
    ) : OAuth2ErrorBody(raw, description, uri)
}