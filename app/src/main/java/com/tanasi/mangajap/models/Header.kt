package com.tanasi.mangajap.models

import com.tanasi.mangajap.adapters.AppAdapter

class Header(
    val title: String
) : AppAdapter.Item {

    override lateinit var typeLayout: AppAdapter.Type
}