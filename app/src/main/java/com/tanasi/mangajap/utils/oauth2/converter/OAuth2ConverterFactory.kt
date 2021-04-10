package com.tanasi.mangajap.utils.oauth2.converter

import com.tanasi.mangajap.utils.oauth2.OAuth2Body
import okhttp3.ResponseBody
import retrofit2.Converter
import retrofit2.Retrofit
import java.lang.reflect.Type

class OAuth2ConverterFactory : Converter.Factory() {

    companion object {
        fun create(): OAuth2ConverterFactory {
            return OAuth2ConverterFactory()
        }
    }

    override fun responseBodyConverter(type: Type, annotations: Array<Annotation>, retrofit: Retrofit): Converter<ResponseBody, *>? {
        if (type !== OAuth2Body::class.java) {
            return null
        }
        return OAuth2Converter()
    }

}