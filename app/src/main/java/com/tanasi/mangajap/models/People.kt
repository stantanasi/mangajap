package com.tanasi.mangajap.models

import com.tanasi.jsonapi.JsonApiRelationship
import com.tanasi.jsonapi.JsonApiType
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.toCalendar

@JsonApiType("peoples")
class People(
    val id: String,

    val firstName: String = "",
    val lastName: String = "",
    val pseudo: String = "",
    val image: String? = null,
    createdAt: String? = null,
    updatedAt: String? = null,

    val staff: List<Staff> = emptyList(),
    @JsonApiRelationship("manga-staff")
    val mangaStaff: List<Staff> = emptyList(),
    @JsonApiRelationship("anime-staff")
    val animeStaff: List<Staff> = emptyList(),
) : AppAdapter.Item {

    val createdAt = createdAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    val updatedAt = updatedAt?.toCalendar("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")


    override lateinit var itemType: AppAdapter.Type

    fun copy(
        id: String = this.id,
        firstName: String = this.firstName,
        lastName: String = this.lastName,
        pseudo: String = this.pseudo,
        image: String? = this.image,
        createdAt: String? = this.createdAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        updatedAt: String? = this.updatedAt?.format("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        staff: List<Staff> = this.staff,
        mangaStaff: List<Staff> = this.mangaStaff,
        animeStaff: List<Staff> = this.animeStaff,
    ) = People(
        id = id,
        firstName = firstName,
        lastName = lastName,
        pseudo = pseudo,
        image = image,
        createdAt = createdAt,
        updatedAt = updatedAt,
        staff = staff,
        mangaStaff = mangaStaff,
        animeStaff = animeStaff,
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as People

        if (id != other.id) return false
        if (firstName != other.firstName) return false
        if (lastName != other.lastName) return false
        if (pseudo != other.pseudo) return false
        if (image != other.image) return false
        if (staff != other.staff) return false
        if (mangaStaff != other.mangaStaff) return false
        if (animeStaff != other.animeStaff) return false
        if (createdAt != other.createdAt) return false
        if (updatedAt != other.updatedAt) return false
        if (itemType != other.itemType) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + firstName.hashCode()
        result = 31 * result + lastName.hashCode()
        result = 31 * result + pseudo.hashCode()
        result = 31 * result + (image?.hashCode() ?: 0)
        result = 31 * result + staff.hashCode()
        result = 31 * result + mangaStaff.hashCode()
        result = 31 * result + animeStaff.hashCode()
        result = 31 * result + (createdAt?.hashCode() ?: 0)
        result = 31 * result + (updatedAt?.hashCode() ?: 0)
        result = 31 * result + itemType.hashCode()
        return result
    }
}