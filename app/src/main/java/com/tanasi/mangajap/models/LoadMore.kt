package com.tanasi.mangajap.models

import com.tanasi.mangajap.adapters.AppAdapter

class LoadMore(
    var isLoading: Boolean = false,
    var isMoreDataAvailable: Boolean = true
) : AppAdapter.Item {

    override var itemType: AppAdapter.Type = AppAdapter.Type.LOAD_MORE
}