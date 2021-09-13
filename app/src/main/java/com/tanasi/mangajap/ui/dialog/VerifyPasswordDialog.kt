package com.tanasi.mangajap.ui.dialog

import android.app.AlertDialog
import android.app.Dialog
import android.content.Context
import android.view.LayoutInflater
import androidx.appcompat.view.ContextThemeWrapper
import com.google.android.material.textfield.TextInputEditText
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.DialogVerifyPasswordBinding

class VerifyPasswordDialog(
    context: Context,
    val callable: (dialog: Dialog, etPassword: TextInputEditText, password: String) -> Unit
) : AlertDialog.Builder(ContextThemeWrapper(context, R.style.Widget_AppTheme_Dialog_Alert)) {

    private val binding: DialogVerifyPasswordBinding = DialogVerifyPasswordBinding.inflate(LayoutInflater.from(context))

    init {
        setTitle(R.string.verifyPassword)
        setMessage(R.string.verifyPasswordMessage)

        setView(binding.root)

        setPositiveButton(R.string.confirm, null)

        setNegativeButton(R.string.cancel, null)
    }

    override fun show(): AlertDialog {
        val alertDialog = super.show()
        alertDialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener {
            callable(
                alertDialog,
                binding.etPassword,
                binding.etPassword.text.toString().trim { it <= ' ' }
            )
        }
        return alertDialog
    }
}