package com.tanasi.mangajap.fragments.register

import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.MainActivity
import com.tanasi.mangajap.databinding.FragmentRegisterBinding
import com.tanasi.mangajap.models.User
import com.tanasi.mangajap.utils.extensions.isEmailValid
import com.tanasi.mangajap.utils.extensions.isPasswordValid
import com.tanasi.mangajap.utils.extensions.isPseudoValid
import com.tanasi.mangajap.utils.preferences.UserPreference
import com.tanasi.oauth2.OAuth2ErrorBody
import com.tanasi.oauth2.OAuth2Response

class RegisterFragment : Fragment() {

    private var _binding: FragmentRegisterBinding? = null
    private val binding: FragmentRegisterBinding get() = _binding!!

    private val viewModel: RegisterViewModel by viewModels()

    private lateinit var userPreference: UserPreference

    val user: User = User()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentRegisterBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        userPreference = UserPreference(requireContext())

        viewModel.state.observe(viewLifecycleOwner) { state ->
            when (state) {
                RegisterViewModel.State.Loading -> binding.isUpdating.cslIsUpdating.visibility = View.VISIBLE

                is RegisterViewModel.State.RegisterSucceed -> {
                    viewModel.login(
                            binding.tilRegisterPseudo.editText?.text.toString().trim { it <= ' ' },
                            binding.tilRegisterPassword.editText?.text.toString().trim { it <= ' ' }
                    )
                }
                is RegisterViewModel.State.RegisterFailed -> {
                    when (state.error) {
                        is JsonApiResponse.Error.ServerError -> {
                            Toast.makeText(requireContext(), getString(R.string.error), Toast.LENGTH_SHORT).show()
                            state.error.body.errors.map { error ->
                                when (error.source?.pointer) {
                                    "/data/attributes/pseudo" -> binding.tilRegisterPseudo.editText?.error = error.title
                                    "/data/attributes/email" -> binding.tilRegisterEmail.editText?.error = error.title
                                    "/data/attributes/password" -> binding.tilRegisterPassword.editText?.error = error.title
                                }
                            }
                        }
                        is JsonApiResponse.Error.NetworkError -> Toast.makeText(requireContext(), getString(R.string.serverError), Toast.LENGTH_SHORT).show()
                        is JsonApiResponse.Error.UnknownError -> Toast.makeText(requireContext(), getString(R.string.error), Toast.LENGTH_SHORT).show()
                    }
                    binding.isUpdating.cslIsUpdating.visibility = View.GONE
                }

                is RegisterViewModel.State.LoginSucceed -> {
                    userPreference.login(state.accessToken, state.userId)
                    binding.isUpdating.cslIsUpdating.visibility = View.GONE
                    startActivity(Intent(requireContext(), MainActivity::class.java))
                    requireActivity().finish()
                }
                is RegisterViewModel.State.LoginFailed -> {
                    when (state.error) {
                        is OAuth2Response.Error.ServerError -> {
                            when (state.error.body) {
                                is OAuth2ErrorBody.InvalidGrant -> Toast.makeText(requireContext(), getString(R.string.account_created_but_login_error), Toast.LENGTH_SHORT).show()
                                else -> Toast.makeText(requireContext(), state.error.body.description, Toast.LENGTH_SHORT).show()
                            }
                        }
                        is OAuth2Response.Error.NetworkError -> Toast.makeText(requireContext(), getString(R.string.serverError), Toast.LENGTH_SHORT).show()
                        is OAuth2Response.Error.UnknownError -> Toast.makeText(requireContext(), getString(R.string.error), Toast.LENGTH_SHORT).show()
                    }
                    binding.isUpdating.cslIsUpdating.visibility = View.GONE
                }
            }
        }

        displayRegister()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }



    private fun displayRegister() {
        binding.register.setOnClickListener {
            var isValid = true
            binding.tilRegisterPseudo.apply {
                if (editText?.text.toString().trim { char -> char <= ' ' }.isPseudoValid())
                    isErrorEnabled = false
                else {
                    error = getString(R.string.pseudoInvalid)
                    isValid = false
                }
            }
            binding.tilRegisterEmail.apply {
                if (editText?.text.toString().trim { char -> char <= ' ' }.isEmailValid())
                    isErrorEnabled = false
                else {
                    error = getString(R.string.emailInvalid)
                    isValid = false
                }
            }
            binding.tilRegisterPassword.apply {
                if (editText?.text.toString().trim { char -> char <= ' ' }.isPasswordValid())
                    isErrorEnabled = false
                else {
                    error = getString(R.string.passwordInvalid)
                    isValid = false
                }
            }

            if (isValid) viewModel.register(user)
        }

        binding.tilRegisterPseudo.apply {
            editText?.addTextChangedListener(object : TextWatcher {
                override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
                override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {}
                override fun afterTextChanged(s: Editable) {
                    user.putPseudo(s.toString().trim { it <= ' ' })
                }
            })
        }

        binding.tilRegisterEmail.apply {
            editText?.addTextChangedListener(object : TextWatcher {
                override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
                override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {}
                override fun afterTextChanged(s: Editable) {
                    user.putEmail(s.toString().trim { it <= ' ' })
                }
            })
        }

        binding.tilRegisterPassword.apply {
            editText?.addTextChangedListener(object : TextWatcher {
                override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
                override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {}
                override fun afterTextChanged(s: Editable) {
                    user.putPassword(s.toString().trim { it <= ' ' })
                }
            })
        }
    }
}