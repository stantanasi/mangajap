package com.tanasi.mangajap.ui.dialog

import android.app.AlertDialog
import android.content.Context
import android.view.LayoutInflater
import androidx.appcompat.view.ContextThemeWrapper
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.DialogResetPasswordBinding

class ResetPasswordDialog(
        context: Context,
        callable: (email: String) -> Unit
) : AlertDialog.Builder(ContextThemeWrapper(context, R.style.Widget_AppTheme_Dialog_Alert)) {

    private val binding: DialogResetPasswordBinding = DialogResetPasswordBinding.inflate(LayoutInflater.from(context))

    init {
        setTitle(R.string.forgotPassword)
        setMessage(R.string.passwordResetInstructions)

        setView(binding.root)

        setPositiveButton(R.string.confirm) { _, _ ->
            callable(
                    binding.tilDialogEmail.editText?.text?.toString()?.trim { it <= ' ' } ?: ""
            )
        }

        setNegativeButton(R.string.cancel, null)
    }
}