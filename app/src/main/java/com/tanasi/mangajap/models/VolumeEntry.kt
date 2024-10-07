package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiAttribute
import com.tanasi.jsonapi.JsonApiProperty
import com.tanasi.jsonapi.JsonApiResource
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar
import kotlin.reflect.KProperty

@JsonApiType("volume-entries")
class VolumeEntry(
    var id: String? = null,

    @JsonApiAttribute("readDate")
    private var _readDate: String? = null,
    readCount: Int = 0,
    rating: Int? = null,
    createdAt: String? = null,
    updatedAt: String? = null,

    user: User? = null,
    volume: Volume? = null,
) : JsonApiResource, AppAdapter.Item {

    var readDate = _readDate?.toCalendar("yyyy-MM-dd")
        set(value) {
            field = value
            _readDate = value?.format("yyyy-MM-dd")
            dirtyProperties.add(VolumeEntry::_readDate)
        }
    var readCount by JsonApiProperty(readCount)
    var rating by JsonApiProperty<Int?>(rating)
    val createdAt = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")

    var user by JsonApiProperty<User?>(user)
    var volume by JsonApiProperty<Volume?>(volume)


    override val dirtyProperties: MutableList<KProperty<*>> = mutableListOf()
    override lateinit var itemType: AppAdapter.Type

    fun copy(
        id: String? = this.id,
        readDate: String? = this.readDate?.format("yyyy-MM-dd"),
        readCount: Int = this.readCount,
        rating: Int? = this.rating,
        createdAt: String? = this.createdAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        updatedAt: String? = this.updatedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        user: User? = this.user,
        volume: Volume? = this.volume,
    ) = VolumeEntry(
        id = id,
        _readDate = readDate,
        readCount = readCount,
        rating = rating,
        createdAt = createdAt,
        updatedAt = updatedAt,
        user = user,
        volume = volume,
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as VolumeEntry

        if (id != other.id) return false
        if (_readDate != other._readDate) return false
        if (readDate != other.readDate) return false
        if (createdAt != other.createdAt) return false
        if (updatedAt != other.updatedAt) return false
        if (dirtyProperties != other.dirtyProperties) return false
        if (itemType != other.itemType) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id?.hashCode() ?: 0
        result = 31 * result + (_readDate?.hashCode() ?: 0)
        result = 31 * result + (readDate?.hashCode() ?: 0)
        result = 31 * result + (createdAt?.hashCode() ?: 0)
        result = 31 * result + (updatedAt?.hashCode() ?: 0)
        result = 31 * result + dirtyProperties.hashCode()
        result = 31 * result + itemType.hashCode()
        return result
    }
}