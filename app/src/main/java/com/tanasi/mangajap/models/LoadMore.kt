package com.tanasi.mangajap.models

import com.tanasi.mangajap.adapters.MangaJapAdapter

class LoadMore(
        var isLoading: Boolean = false,
        var isMoreDataAvailable: Boolean = true
) : MangaJapAdapter.Item() {

    override var typeLayout: MangaJapAdapter.Type = MangaJapAdapter.Type.LOAD_MORE
}