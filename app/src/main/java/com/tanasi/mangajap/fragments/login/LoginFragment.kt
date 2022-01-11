package com.tanasi.mangajap.fragments.login

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.MainActivity
import com.tanasi.mangajap.databinding.FragmentLoginBinding
import com.tanasi.mangajap.ui.dialog.ResetPasswordDialog

class LoginFragment : Fragment() {
    
    private var _binding: FragmentLoginBinding? = null
    private val binding: FragmentLoginBinding get() = _binding!!
    
    private val viewModel: LoginViewModel by viewModels()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentLoginBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewModel.state.observe(viewLifecycleOwner) { state ->
            when (state) {
                LoginViewModel.State.Loading -> binding.isUpdating.root.visibility = View.VISIBLE

                is LoginViewModel.State.LoginSucceed -> {
                    binding.isUpdating.root.visibility = View.GONE
                    startActivity(Intent(requireContext(), MainActivity::class.java))
                    requireActivity().finish()
                }
                is LoginViewModel.State.LoginFailed -> {
                    Toast.makeText(requireContext(), state.error.message, Toast.LENGTH_SHORT).show()
                    binding.isUpdating.root.visibility = View.GONE
                }

                is LoginViewModel.State.PasswordResetEmailSuccess -> Toast.makeText(
                    requireContext(),
                    getString(R.string.password_reset_email_sent),
                    Toast.LENGTH_SHORT
                ).show()
                is LoginViewModel.State.PasswordResetEmailFailed -> Toast.makeText(
                    requireContext(),
                    state.error.message,
                    Toast.LENGTH_SHORT
                ).show()
            }
        }

        displayLogin()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }



    private fun displayLogin() {
        binding.btnLogin.setOnClickListener {
            viewModel.login(
                    binding.tilLoginEmail.editText?.text.toString().trim { it <= ' ' },
                    binding.tilLoginPassword.editText?.text.toString().trim { it <= ' ' }
            )
        }

        binding.tvLoginForgotPassword.setOnClickListener {
            ResetPasswordDialog(
                    requireContext()
            ) { email ->
                viewModel.resetPassword(email)
            }.show()
        }
    }
}