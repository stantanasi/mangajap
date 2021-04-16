package com.tanasi.mangajap.models

import com.tanasi.mangajap.adapters.MangaJapAdapter

class UserStats(
        val user: User
) : MangaJapAdapter.Item {


    override lateinit var typeLayout: MangaJapAdapter.Type
}