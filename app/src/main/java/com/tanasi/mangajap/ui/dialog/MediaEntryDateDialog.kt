package com.tanasi.mangajap.ui.dialog

import android.app.AlertDialog
import android.app.DatePickerDialog
import android.content.Context
import android.view.LayoutInflater
import androidx.appcompat.view.ContextThemeWrapper
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.DialogSetMyDateBinding
import com.tanasi.mangajap.utils.extensions.format
import java.util.*

class MediaEntryDateDialog(
        context: Context,
        title: String,
        private var startedAt: Calendar?,
        private var finishedAt: Calendar?,
        private val callable: (startedAt: Calendar?, finishedAt: Calendar?) -> Unit
) : AlertDialog.Builder(ContextThemeWrapper(context, R.style.Widget_AppTheme_Dialog_Alert)) {

    private val binding: DialogSetMyDateBinding = DialogSetMyDateBinding.inflate(LayoutInflater.from(context))

    init {
        setTitle(title)

        setView(binding.root)

        val pattern = "dd MMMM yyyy"

        binding.tvStarted.apply {
            startedAt?.let { text = it.format(pattern) }
            setOnClickListener {
                (startedAt ?: Calendar.getInstance()).let {
                    DatePickerDialog(
                            context,
                            { _, year, month, dayOfMonth ->
                                val date = Calendar.getInstance()
                                date[year, month] = dayOfMonth

                                startedAt = date
                                text = date.format(pattern)
                            },
                            it[Calendar.YEAR],
                            it[Calendar.MONTH],
                            it[Calendar.DAY_OF_MONTH]
                    ).show()
                }
            }
        }

        binding.ivRemoveStarted.setOnClickListener {
            startedAt = null
            binding.tvStarted.text = ""
        }

        binding.tvFinished.apply {
            finishedAt?.let { text = it.format(pattern) }
            setOnClickListener {
                (finishedAt ?: Calendar.getInstance()).let {
                    DatePickerDialog(
                            context,
                            { _, year, month, dayOfMonth ->
                                val date = Calendar.getInstance()
                                date[year, month] = dayOfMonth

                                finishedAt = date
                                text = date.format(pattern)
                            },
                            it[Calendar.YEAR],
                            it[Calendar.MONTH],
                            it[Calendar.DAY_OF_MONTH]
                    ).show()
                }
            }
        }

        binding.ivRemoveFinished.setOnClickListener {
            finishedAt = null
            binding.tvFinished.text = ""
        }

        setPositiveButton(context.getString(R.string.confirm)) { _, _ ->
            callable(startedAt, finishedAt)
        }

        setNegativeButton(context.getString(R.string.cancel), null)
    }
}