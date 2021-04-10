package com.tanasi.mangajap.ui.dialog

import android.app.AlertDialog
import android.app.Dialog
import android.content.Context
import android.view.LayoutInflater
import android.widget.EditText
import androidx.appcompat.view.ContextThemeWrapper
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.DialogChangePasswordBinding

class ChangePasswordDialog(
        context: Context,
        private val callable: (dialog: Dialog, etPassword: EditText, password: String, etPasswordConfirmation: EditText, passwordConfirmation: String) -> Unit
) : AlertDialog.Builder(ContextThemeWrapper(context, R.style.Widget_AppTheme_Dialog_Alert)) {

    private val binding: DialogChangePasswordBinding = DialogChangePasswordBinding.inflate(LayoutInflater.from(context))

    init {
        setTitle(context.getString(R.string.changePassword))

        setView(binding.root)

        setPositiveButton(context.getString(R.string.confirm), null)

        setNegativeButton(context.getString(R.string.cancel), null)
    }

    override fun show(): AlertDialog {
        val alertDialog = super.show()
        alertDialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener {
            callable(
                    alertDialog,
                    binding.newPasswordEditText,
                    binding.newPasswordEditText.text.toString().trim { it <= ' ' },
                    binding.newPasswordConfirmEditText,
                    binding.newPasswordConfirmEditText.text.toString().trim { it <= ' ' }
            )
        }
        return alertDialog
    }
}