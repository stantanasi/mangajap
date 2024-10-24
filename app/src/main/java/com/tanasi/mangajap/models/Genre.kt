package com.tanasi.mangajap.models

import com.tanasi.mangajap.adapters.AppAdapter

class Genre(
    val id: String,
    val title: String = "",
) : AppAdapter.Item {

    override lateinit var itemType: AppAdapter.Type

    fun copy(
        id:String = this.id,
        title: String = this.title,
    ) = Genre(
        id = id,
        title = title,
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Genre

        if (id != other.id) return false
        if (title != other.title) return false
        if (!::itemType.isInitialized || !other::itemType.isInitialized) return false
        return itemType == other.itemType
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + title.hashCode()
        result = 31 * result + (if (::itemType.isInitialized) itemType.hashCode() else 0)
        return result
    }
}