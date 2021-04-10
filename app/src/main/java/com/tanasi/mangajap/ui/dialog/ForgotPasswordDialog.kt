package com.tanasi.mangajap.ui.dialog

import android.app.AlertDialog
import android.content.Context
import android.view.LayoutInflater
import androidx.appcompat.view.ContextThemeWrapper
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.DialogForgotPasswordBinding

class ForgotPasswordDialog(
        context: Context,
        callable: (pseudo: String, email: String) -> Unit
) : AlertDialog.Builder(ContextThemeWrapper(context, R.style.Widget_AppTheme_Dialog_Alert)) {

    private val binding: DialogForgotPasswordBinding = DialogForgotPasswordBinding.inflate(LayoutInflater.from(context))

    init {
        setTitle(context.getString(R.string.forgotPassword))

        setView(binding.root)

        setPositiveButton(context.getString(R.string.confirm)) { _, _ ->
            callable(
                    binding.pseudoTextInputEditText.text.toString().trim { it <= ' ' },
                    binding.emailTextInputEditText.text.toString().trim { it <= ' ' }
            )
        }

        setNegativeButton(context.getString(R.string.cancel), null)
    }
}