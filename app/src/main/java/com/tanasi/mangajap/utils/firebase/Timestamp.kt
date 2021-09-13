package com.tanasi.mangajap.utils.firebase

import com.google.firebase.Timestamp
import com.tanasi.mangajap.utils.extensions.toCalendar
import java.util.*

fun Date.toCalendar(): Calendar = Calendar.getInstance().also { it.time = this }

fun Calendar.toTimestamp(): Timestamp = Timestamp(this.time)

fun Timestamp.toCalendar(): Calendar = this.toDate().toCalendar()