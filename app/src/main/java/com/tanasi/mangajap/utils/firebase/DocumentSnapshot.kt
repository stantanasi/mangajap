package com.tanasi.mangajap.utils.firebase

import com.google.firebase.firestore.DocumentSnapshot
import kotlin.reflect.KClass
import kotlin.reflect.full.primaryConstructor

fun <T : Any> DocumentSnapshot.toClass(c: KClass<T>): T? {
    val id = this.id
    val data = this.data ?: return null

    val params = c.primaryConstructor?.parameters
        ?.filter {
            when {
                it.name == "id" -> true
                data.containsKey(it.name) -> true
                else -> false
            }
        }
        ?.map {
            it to when {
                it.name == "id" -> id
                data.containsKey(it.name) -> {
                    when (it.type.classifier) {
                        Double::class -> {
                            val value = data[it.name]
                            if (value is Long) value.toDouble()
                            else data[it.name]
                        }
                        Long::class -> data[it.name]
                        else -> data[it.name]
                    }
                }
                else -> null
            }
        }
        ?.toMap()
        ?: mapOf()

    return c.primaryConstructor?.callBy(params)!!
}