package com.tanasi.mangajap.utils.oauth2.adapter

import com.tanasi.mangajap.utils.oauth2.OAuth2Body
import com.tanasi.mangajap.utils.oauth2.OAuth2Response
import retrofit2.Call
import retrofit2.CallAdapter
import java.lang.reflect.Type

class OAuth2CallAdapter : CallAdapter<OAuth2Body, Call<OAuth2Response>> {

    override fun responseType(): Type = OAuth2Body::class.java

    override fun adapt(call: Call<OAuth2Body>): Call<OAuth2Response> = OAuth2Call(call)
}