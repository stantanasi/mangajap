package com.tanasi.mangajap.fragments.login

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.MainActivity
import com.tanasi.mangajap.databinding.FragmentLoginBinding
import com.tanasi.mangajap.ui.dialog.ChangePasswordDialog
import com.tanasi.mangajap.ui.dialog.ForgotPasswordDialog
import com.tanasi.mangajap.utils.extensions.isPasswordValid
import com.tanasi.mangajap.utils.preferences.UserPreference
import com.tanasi.oauth2.OAuth2ErrorBody
import com.tanasi.oauth2.OAuth2Response

class LoginFragment : Fragment() {
    
    private var _binding: FragmentLoginBinding? = null
    private val binding: FragmentLoginBinding get() = _binding!!
    
    private val viewModel: LoginViewModel by viewModels()

    private lateinit var userPreference: UserPreference
    
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentLoginBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        userPreference = UserPreference(requireContext())
        
        displayLogin()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }



    private fun displayLogin() {
        viewModel.state.observe(viewLifecycleOwner) { state ->
            when (state) {
                LoginViewModel.State.Loading -> binding.isUpdating.cslIsUpdating.visibility = View.VISIBLE

                is LoginViewModel.State.LoginSucceed -> {
                    userPreference.login(state.accessToken, state.userId)
                    binding.isUpdating.cslIsUpdating.visibility = View.GONE
                    startActivity(Intent(requireContext(), MainActivity::class.java))
                    requireActivity().finish()
                }
                is LoginViewModel.State.LoginFailed -> {
                    when (state.error) {
                        is OAuth2Response.Error.ServerError -> {
                            when (state.error.body) {
                                is OAuth2ErrorBody.InvalidGrant -> Toast.makeText(requireContext(), getString(R.string.oauthErrorInvalidGrant), Toast.LENGTH_SHORT).show()
                                else -> Toast.makeText(requireContext(), state.error.body.description, Toast.LENGTH_SHORT).show()
                            }
                        }
                        is OAuth2Response.Error.NetworkError -> Toast.makeText(requireContext(), getString(R.string.serverError), Toast.LENGTH_SHORT).show()
                        is OAuth2Response.Error.UnknownError -> Toast.makeText(requireContext(), getString(R.string.error), Toast.LENGTH_SHORT).show()
                    }
                    binding.isUpdating.cslIsUpdating.visibility = View.GONE
                }

                is LoginViewModel.State.ResetPasswordSucceed -> {
                    ChangePasswordDialog(
                            requireContext()
                    ) { dialog, etPassword, password, etPasswordConfirmation, passwordConfirmation ->
                        if (password.isPasswordValid()) {
                            if (password == passwordConfirmation) {
                                viewModel.changePassword(state.accessToken, password)
                                dialog.dismiss()
                            } else {
                                etPasswordConfirmation.error = getString(R.string.passwordDontMatch)
                            }
                        } else {
                            etPassword.error = getString(R.string.passwordInvalid)
                        }
                    }.show()
                    binding.isUpdating.cslIsUpdating.visibility = View.GONE
                }
                is LoginViewModel.State.ResetPasswordFailed -> {
                    when (state.error) {
                        is OAuth2Response.Error.ServerError -> {
                            when (state.error.body) {
                                is OAuth2ErrorBody.InvalidGrant -> Toast.makeText(requireContext(), getString(R.string.oauthErrorInvalidGrant), Toast.LENGTH_SHORT).show()
                                else -> Toast.makeText(requireContext(), state.error.body.description, Toast.LENGTH_SHORT).show()
                            }
                        }
                        is OAuth2Response.Error.NetworkError -> Toast.makeText(requireContext(), getString(R.string.serverError), Toast.LENGTH_SHORT).show()
                        is OAuth2Response.Error.UnknownError -> Toast.makeText(requireContext(), getString(R.string.error), Toast.LENGTH_SHORT).show()
                    }
                }

                is LoginViewModel.State.ChangePasswordSucceed -> {
                    binding.isUpdating.cslIsUpdating.visibility = View.GONE
                    Toast.makeText(requireContext(), requireContext().resources.getString(R.string.success), Toast.LENGTH_SHORT).show()
                }
                is LoginViewModel.State.ChangePasswordFailed -> {
                    when (state.error) {
                        is JsonApiResponse.Error.ServerError -> {
                            Toast.makeText(requireContext(), getString(R.string.error), Toast.LENGTH_SHORT).show()
                            state.error.body.errors.map { error ->
                                when (error.source?.pointer) {
                                    "/data/attributes/pseudo" -> Toast.makeText(requireContext(), error.title, Toast.LENGTH_SHORT).show()
                                    "/data/attributes/email" -> Toast.makeText(requireContext(), error.title, Toast.LENGTH_SHORT).show()
                                    "/data/attributes/password" -> Toast.makeText(requireContext(), error.title, Toast.LENGTH_SHORT).show()
                                }
                            }
                        }
                        is JsonApiResponse.Error.NetworkError -> Toast.makeText(requireContext(), getString(R.string.serverError), Toast.LENGTH_SHORT).show()
                        is JsonApiResponse.Error.UnknownError -> Toast.makeText(requireContext(), getString(R.string.error), Toast.LENGTH_SHORT).show()
                    }
                    binding.isUpdating.cslIsUpdating.visibility = View.GONE
                }
            }
        }


        binding.btnLogin.setOnClickListener {
            viewModel.login(
                    binding.tilLoginPseudo.editText?.text.toString().trim { it <= ' ' },
                    binding.tilLoginPassword.editText?.text.toString().trim { it <= ' ' }
            )
        }

        binding.tvLoginForgotPassword.setOnClickListener {
            ForgotPasswordDialog(
                    requireContext()
            ) { pseudo, email ->
                viewModel.forgotPassword(pseudo, email)
            }.show()
        }
    }
}