package com.tanasi.mangajap.utils.oauth2.adapter

import com.tanasi.mangajap.utils.oauth2.OAuth2Body
import com.tanasi.mangajap.utils.oauth2.OAuth2Response
import com.tanasi.mangajap.utils.oauth2.converter.OAuth2Converter
import okhttp3.Request
import okio.Timeout
import retrofit2.Call
import retrofit2.Callback
import retrofit2.HttpException
import retrofit2.Response
import java.io.IOException

class OAuth2Call(
        private val call: Call<OAuth2Body>
) : Call<OAuth2Response> {

    override fun clone(): Call<OAuth2Response> = OAuth2Call(
            call.clone()
    )

    override fun execute(): Response<OAuth2Response> {
        throw UnsupportedOperationException("Network Response call does not support synchronous execution")
    }

    override fun enqueue(callback: Callback<OAuth2Response>) {
        call.enqueue(object : Callback<OAuth2Body> {
            override fun onResponse(call: Call<OAuth2Body>, response: Response<OAuth2Body>) {
                val oAuth2Response = ResponseHandler.handleResponse(response)
                callback.onResponse(this@OAuth2Call, Response.success(oAuth2Response))
            }

            override fun onFailure(call: Call<OAuth2Body>, t: Throwable) {
                val oAuth2Response = ResponseHandler.handleFailure(t)
                callback.onResponse(this@OAuth2Call, Response.success(oAuth2Response))
            }
        })
    }

    override fun isExecuted(): Boolean = call.isExecuted

    override fun cancel() = call.cancel()

    override fun isCanceled(): Boolean = call.isCanceled

    override fun request(): Request = call.request()

    override fun timeout(): Timeout = call.timeout()


    private object ResponseHandler {

        fun handleResponse(
                response: Response<OAuth2Body>
        ): OAuth2Response {
            val code = response.code()
            val headers = response.headers()

            return if (response.isSuccessful) {
                val body = response.body()

                if (body != null) {
                    OAuth2Response.Success(code, body, headers)
                } else {
                    OAuth2Response.Error.UnknownError(Exception("TODO: Code HTTP bon / body = null"))
                }
            } else {
                try {
                    val body = OAuth2Converter.convertError(response.errorBody())
                    OAuth2Response.Error.ServerError(code, body, headers)
                } catch (e: Exception) {
                    OAuth2Response.Error.UnknownError(e)
                }
            }
        }

        fun handleFailure(
                throwable: Throwable
        ): OAuth2Response {
            return when (throwable) {
                is IOException -> OAuth2Response.Error.NetworkError(throwable)
                is HttpException -> {
                    val code = throwable.response()?.code() ?: 520
                    val body = OAuth2Converter.convertError(throwable.response()?.errorBody())
                    val headers = throwable.response()?.headers()
                    OAuth2Response.Error.ServerError(code, body, headers)
                }
                else -> OAuth2Response.Error.UnknownError(throwable)
            }
        }
    }
}