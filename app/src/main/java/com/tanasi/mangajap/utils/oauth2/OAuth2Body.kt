package com.tanasi.mangajap.utils.oauth2

class OAuth2Body(
        val raw: String,
        val accessToken: String,
        val tokenType: String,
        val sub: String? = null,
        val expiresIn: String? = null,
        val refreshToken: String? = null,
        val scope: String? = null
)