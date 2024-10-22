package com.tanasi.mangajap.fragments.login

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.flowWithLifecycle
import androidx.lifecycle.lifecycleScope
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.main.MainActivity
import com.tanasi.mangajap.databinding.FragmentLoginBinding
import com.tanasi.mangajap.ui.dialog.ResetPasswordDialog
import kotlinx.coroutines.launch

class LoginFragment : Fragment() {

    private var _binding: FragmentLoginBinding? = null
    private val binding get() = _binding!!

    private val viewModel by viewModels<LoginViewModel>()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentLoginBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        initializeLogin()

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.state.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED).collect { state ->
                when (state) {
                    null -> {}

                    LoginViewModel.State.Loading -> binding.isUpdating.apply {
                        root.visibility = View.VISIBLE
                    }

                    is LoginViewModel.State.LoginSucceed -> {
                        binding.isUpdating.root.visibility = View.GONE
                        startActivity(Intent(requireContext(), MainActivity::class.java))
                        requireActivity().finish()
                    }

                    is LoginViewModel.State.LoginFailed -> {
                        Toast.makeText(requireContext(), state.error.message, Toast.LENGTH_SHORT)
                            .show()
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
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }


    private fun initializeLogin() {
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