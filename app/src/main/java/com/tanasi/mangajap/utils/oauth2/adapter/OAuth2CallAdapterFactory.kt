package com.tanasi.mangajap.utils.oauth2.adapter

import com.tanasi.mangajap.utils.oauth2.OAuth2Response
import retrofit2.CallAdapter
import retrofit2.Retrofit
import java.lang.reflect.ParameterizedType
import java.lang.reflect.Type

class OAuth2CallAdapterFactory : CallAdapter.Factory() {

    companion object {
        fun create(): OAuth2CallAdapterFactory {
            return OAuth2CallAdapterFactory()
        }
    }

    override fun get(returnType: Type, annotations: Array<Annotation>, retrofit: Retrofit): CallAdapter<*, *>? {
        check(returnType is ParameterizedType) { "$returnType must be parameterized. Raw types are not supported" }

        val containerType = getParameterUpperBound(0, returnType)
        if (getRawType(containerType) != OAuth2Response::class.java) {
            return null
        }

        return OAuth2CallAdapter()
    }
}