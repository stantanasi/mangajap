package com.tanasi.mangajap.ui.dialog

import android.app.AlertDialog
import android.content.Context
import android.view.LayoutInflater
import androidx.appcompat.view.ContextThemeWrapper
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.DialogNumberPickerBinding

class NumberPickerDialog(
        context: Context,
        title: String,
        private val minValue: Int,
        private val maxValue: Int,
        private val value: Int?,
        private val callable: (value: Int?) -> Unit
) : AlertDialog.Builder(ContextThemeWrapper(context, R.style.Widget_AppTheme_Dialog_Alert)) {

    private val binding: DialogNumberPickerBinding = DialogNumberPickerBinding.inflate(LayoutInflater.from(context))

    init {
        setTitle(title)

        setView(binding.root)

        binding.numberPicker.also { numberPicker ->
            numberPicker.minValue = minValue
            numberPicker.maxValue = maxValue
            numberPicker.value = when {
                value == null -> (minValue + maxValue) / 2
                value < minValue -> minValue
                value > maxValue -> maxValue
                else -> value
            }
        }

        setPositiveButton(context.getString(R.string.confirm)) { _, _ ->
            callable(binding.numberPicker.value)
        }

        setNegativeButton(context.getString(R.string.cancel)) { _, _ -> }
    }
}