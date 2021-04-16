package com.tanasi.mangajap.models

import com.tanasi.mangajap.adapters.MangaJapAdapter

class Header(val title: String) : MangaJapAdapter.Item {


    override lateinit var typeLayout: MangaJapAdapter.Type
}