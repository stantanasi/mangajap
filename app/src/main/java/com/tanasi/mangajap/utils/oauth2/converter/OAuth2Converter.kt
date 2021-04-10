package com.tanasi.mangajap.utils.oauth2.converter

import com.tanasi.mangajap.utils.oauth2.OAuth2Body
import com.tanasi.mangajap.utils.oauth2.OAuth2ErrorBody
import okhttp3.ResponseBody
import org.json.JSONObject
import retrofit2.Converter

class OAuth2Converter : Converter<ResponseBody, Any?> {

    override fun convert(value: ResponseBody): Any {
        return convertResponse(value)
    }

    private fun convertResponse(value: ResponseBody): OAuth2Body {
        val json = value.string()
        val jsonObject = JSONObject(json)

        val accessToken = jsonObject.optString("access_token")
        val tokenType = jsonObject.optString("token_type")
        val expiresIn = jsonObject.optString("expires_in")
        val refreshToken = jsonObject.optString("refresh_token")
        val scope = jsonObject.optString("scope")
        val sub = jsonObject.optString("sub")

        return OAuth2Body(
                raw = json,
                accessToken = accessToken,
                tokenType = tokenType,
                sub = sub,
                expiresIn = expiresIn,
                refreshToken = refreshToken,
                scope = scope
        )
    }

    companion object {
        fun convertError(value: ResponseBody?): OAuth2ErrorBody {
            val json = value?.string() ?: ""
            val jsonObject = JSONObject(json)

            val error = jsonObject.optString("error")
            val errorDescription = jsonObject.optString("error_description")
            val errorURI = jsonObject.optString("error_uri")

            return when (error) {
                "invalid_request" -> OAuth2ErrorBody.InvalidRequest(json, errorDescription, errorURI)
                "invalid_client" -> OAuth2ErrorBody.InvalidClient(json, errorDescription, errorURI)
                "invalid_grant" -> OAuth2ErrorBody.InvalidGrant(json, errorDescription, errorURI)
                "invalid_scope" -> OAuth2ErrorBody.InvalidScope(json, errorDescription, errorURI)
                "unauthorized_client" -> OAuth2ErrorBody.UnauthorizedClient(json, errorDescription, errorURI)
                "unsupported_grant_type" -> OAuth2ErrorBody.UnsupportedGrantType(json, errorDescription, errorURI)
                else -> throw Exception("Error response is not valid : $error\n$json")
            }
        }
    }
}