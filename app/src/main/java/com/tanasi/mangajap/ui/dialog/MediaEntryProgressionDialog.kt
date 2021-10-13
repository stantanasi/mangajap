package com.tanasi.mangajap.ui.dialog

import android.content.Context
import android.view.LayoutInflater
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.view.ContextThemeWrapper
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.DialogProgressionBinding

class MediaEntryProgressionDialog(
        context: Context,
        title: String,
        value: Int,
        private val callable: (value: Int) -> Unit
) : AlertDialog.Builder(ContextThemeWrapper(context, R.style.Widget_AppTheme_Dialog_Alert)) {

    private val binding: DialogProgressionBinding = DialogProgressionBinding.inflate(LayoutInflater.from(context))

    init {
        setTitle(title)

        setView(binding.root)

        binding.etNumberPicker.setText(value.toString())

        binding.ivDecrement.setOnClickListener {
            binding.etNumberPicker.setText(
                    (binding.etNumberPicker.text.toString().trim { it <= ' ' }.toIntOrNull() ?: 0)
                            .dec()
                            .coerceAtLeast(0)
                            .toString()
            )
        }

        binding.ivIncrement.setOnClickListener {
            binding.etNumberPicker.setText(
                    (binding.etNumberPicker.text.toString().trim { it <= ' ' }.toIntOrNull() ?: 0)
                            .inc()
                            .toString()
            )
        }

        setPositiveButton(context.getString(R.string.confirm)) { _, _ ->
            callable(binding.etNumberPicker.text.toString().trim { it <= ' ' }.toIntOrNull() ?: 0)
        }

        setNegativeButton(context.getString(R.string.cancel), null)
    }
}