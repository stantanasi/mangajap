package com.tanasi.mangajap.utils.firebase

import android.util.Log
import com.tanasi.mangajap.models.Manga
import java.util.*
import kotlin.reflect.KClass
import kotlin.reflect.full.isSubclassOf
import kotlin.reflect.full.memberProperties

class FirestoreModel {
    var id: String? = null
    val titles: Manga.Titles? = null
    val startDate: Calendar? = null
    val origin: Locale = Locale("", "fr")
    val status: Manga.Status? = null
    val mangaType: Manga.MangaType? = null
    val createdAt: Calendar? = null

    fun toFirestoreHashmap() {
        for (prop in this.javaClass.kotlin.memberProperties) {
            val name = prop.name
            val value = prop.get(this)

            when {
                (prop.returnType.classifier as KClass<*>).isSubclassOf(Enum::class) -> Log.e(
                    "TAG",
                    "${prop.name} is enum     =>    ${(prop.get(this) as Enum<*>?)?.name}"
                )
                prop.get(this) is Calendar -> Log.e("TAG", "${prop.name} is calendar")
                prop.get(this) is Locale -> Log.e("TAG", "${prop.name} is Locale")
            }

            Log.e(
                "TAG",
                "${prop.name} = ${prop.get(this)}  =>  ${prop.returnType} = ${prop.returnType.classifier}  =>  ${prop.returnType.classifier as KClass<*>}"
            )
        }
    }
}