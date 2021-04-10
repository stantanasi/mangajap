package com.tanasi.mangajap.utils.jsonApi

import okhttp3.Headers
import java.io.IOException

sealed class JsonApiResponse<out T : Any> {

    data class Success<T : Any>(
            val code: Int,
            val body: JsonApiBody<T>,
            val headers: Headers? = null,
    ) : JsonApiResponse<T>()

    sealed class Error: JsonApiResponse<Nothing>() {

        data class ServerError(
                val code: Int,
                val body: JsonApiErrorBody,
                val headers: Headers? = null,
        ) : Error()

        data class NetworkError(val error: IOException) : Error()

        data class UnknownError(val error: Throwable) : Error()
    }
}