package com.tanasi.mangajap.utils.jsonApi.adapter

import com.tanasi.mangajap.utils.jsonApi.JsonApiResponse
import retrofit2.CallAdapter
import retrofit2.Retrofit
import java.lang.reflect.ParameterizedType
import java.lang.reflect.Type

class JsonApiCallAdapterFactory : CallAdapter.Factory() {

    companion object {
        fun create(): JsonApiCallAdapterFactory {
            return JsonApiCallAdapterFactory()
        }
    }

    override fun get(returnType: Type, annotations: Array<Annotation>, retrofit: Retrofit): CallAdapter<*, *>? {
        check(returnType is ParameterizedType) { "$returnType must be parameterized. Raw types are not supported" }

        val containerType = getParameterUpperBound(0, returnType)
        if (getRawType(containerType) != JsonApiResponse::class.java) {
            return null
        }

        check(containerType is ParameterizedType) { "$containerType must be parameterized. Raw types are not supported" }

        return JsonApiCallAdapter<Any>(getParameterUpperBound(0, containerType))
    }
}