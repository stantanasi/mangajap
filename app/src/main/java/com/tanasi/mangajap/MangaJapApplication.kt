package com.tanasi.mangajap

import android.app.Application
import android.content.Context

class MangaJapApplication : Application() {

    companion object {
        const val PACKAGE_NAME = "com.tanasi.mangajap"
        private lateinit var mContext: Context
        val context: Context get() = mContext
    }

    override fun onCreate() {
        super.onCreate()
        mContext = applicationContext
    }
}