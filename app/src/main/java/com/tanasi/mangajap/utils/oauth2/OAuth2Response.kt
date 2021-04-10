package com.tanasi.mangajap.utils.oauth2

import okhttp3.Headers
import java.io.IOException

sealed class OAuth2Response {

    data class Success(
            val code: Int,
            val body: OAuth2Body,
            val headers: Headers? = null,
    ) : OAuth2Response()

    sealed class Error : OAuth2Response() {

        data class ServerError(
                val code: Int,
                val body: OAuth2ErrorBody,
                val headers: Headers? = null,
        ) : Error()

        data class NetworkError(val error: IOException) : Error()

        data class UnknownError(val error: Throwable) : Error()
    }
}