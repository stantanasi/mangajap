package com.tanasi.mangajap.ui.dialog

import android.app.AlertDialog
import android.app.Dialog
import android.content.Context
import android.view.LayoutInflater
import androidx.appcompat.view.ContextThemeWrapper
import com.google.android.material.textfield.TextInputLayout
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.DialogEdittextBinding

class EditTextDialog(
        context: Context,
        title: String?,
        hint: String?,
        text: String?,
        private val callable: (dialog: Dialog, textInputLayout: TextInputLayout, text: String) -> Unit
) : AlertDialog.Builder(ContextThemeWrapper(context, R.style.Widget_AppTheme_Dialog_Alert)) {

    private val binding: DialogEdittextBinding = DialogEdittextBinding.inflate(LayoutInflater.from(context))

    init {
        setTitle(title)

        setView(binding.root)

        binding.editTextTextInputLayout.also {
            it.hint = hint
            it.editText?.append(text)
        }

        setPositiveButton(context.getString(R.string.confirm), null)

        setNegativeButton(context.getString(R.string.cancel), null)
    }

    override fun show(): AlertDialog {
        val alertDialog = super.show()
        alertDialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener {
            callable(
                    alertDialog,
                    binding.editTextTextInputLayout,
                    binding.editTextTextInputLayout.editText?.text.toString().trim { it <= ' ' }
            )
        }
        return alertDialog
    }
}