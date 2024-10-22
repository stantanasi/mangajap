package com.tanasi.mangajap.utils

import okhttp3.OkHttpClient
import retrofit2.Retrofit
import java.util.concurrent.TimeUnit

object MangaReader {

    private const val URL = "https://mangareader.to/"

    private val service = Service.build()


    private interface Service {

        companion object {
            fun build(): Service {
                val client = OkHttpClient.Builder()
                    .readTimeout(10, TimeUnit.SECONDS)
                    .connectTimeout(10, TimeUnit.SECONDS)
                    .build()

                val retrofit = Retrofit.Builder()
                    .baseUrl(URL)
                    .addConverterFactory(JsoupConverterFactory.create())
                    .client(client)
                    .build()

                return retrofit.create(Service::class.java)
            }
        }
    }
}