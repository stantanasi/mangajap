package com.tanasi.mangajap.models

import com.tanasi.mangajap.adapters.AppAdapter

class Chapter(
    val id: String,
    val number: Int = 0,
) : AppAdapter.Item {

    override lateinit var itemType: AppAdapter.Type

    fun copy(
        id: String = this.id,
        number: Int = this.number,
    ) = Chapter(
        id = id,
        number = number,
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Chapter

        if (id != other.id) return false
        if (number != other.number) return false
        if (!::itemType.isInitialized || !other::itemType.isInitialized) return false
        return itemType == other.itemType
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + number
        result = 31 * result + (if (::itemType.isInitialized) itemType.hashCode() else 0)
        return result
    }
}