package com.tanasi.mangajap.ui.dialog

import android.app.AlertDialog
import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.widget.RadioButton
import android.widget.RadioGroup
import androidx.appcompat.view.ContextThemeWrapper
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.DialogRadioGroupBinding
import com.tanasi.mangajap.utils.extensions.getAttrColor

class RadioGroupDialog(
        context: Context,
        title: String,
        value: String,
        private val array: List<String>,
        private val callable: (position: Int) -> Unit
) : AlertDialog.Builder(ContextThemeWrapper(context, R.style.Widget_AppTheme_Dialog_Alert)) {

    private val binding: DialogRadioGroupBinding = DialogRadioGroupBinding.inflate(LayoutInflater.from(context))

    init {
        setTitle(title)

        setView(binding.root)

        array.map { string ->
            binding.rgDialogRadioGroup.addView(RadioButton(context).apply {
                id = View.generateViewId()
                text = string
                setTextColor(context.getAttrColor(R.attr.textSecondaryColor))
                layoutParams = RadioGroup.LayoutParams(RadioGroup.LayoutParams.MATCH_PARENT, RadioGroup.LayoutParams.WRAP_CONTENT)
                isChecked = string == value
            })
        }

        setNegativeButton(context.getString(R.string.cancel), null)
    }

    override fun show(): AlertDialog {
        val alertDialog = super.show()
        binding.rgDialogRadioGroup.setOnCheckedChangeListener { radioGroup, id ->
            val radioBtn: RadioButton = radioGroup.findViewById(id)
            callable(array.indexOf(radioBtn.text.toString()))
            alertDialog.dismiss()
        }
        return alertDialog
    }
}