package com.tanasi.mangajap.fragments.register

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
import com.tanasi.mangajap.databinding.FragmentRegisterBinding
import com.tanasi.mangajap.utils.extensions.isEmailValid
import com.tanasi.mangajap.utils.extensions.isPasswordValid
import com.tanasi.mangajap.utils.extensions.isPseudoValid

class RegisterFragment : Fragment() {

    private var _binding: FragmentRegisterBinding? = null
    private val binding: FragmentRegisterBinding get() = _binding!!

    private val viewModel: RegisterViewModel by viewModels()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentRegisterBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewModel.state.observe(viewLifecycleOwner) { state ->
            when (state) {
                RegisterViewModel.State.Loading -> binding.isUpdating.root.visibility = View.VISIBLE

                is RegisterViewModel.State.RegisterSucceed -> {
                    binding.isUpdating.root.visibility = View.GONE
                    startActivity(Intent(requireContext(), MainActivity::class.java))
                    requireActivity().finish()
                }
                is RegisterViewModel.State.RegisterFailed -> {
                    when (state.error) {
                        is JsonApiResponse.Error.ServerError -> state.error.body.errors.map {
                            Toast.makeText(requireContext(), it.title, Toast.LENGTH_SHORT).show()
                        }
                        is JsonApiResponse.Error.NetworkError -> Toast.makeText(
                            requireContext(),
                            state.error.error.message ?: "",
                            Toast.LENGTH_SHORT
                        ).show()
                        is JsonApiResponse.Error.UnknownError -> Toast.makeText(
                            requireContext(),
                            state.error.error.message ?: "",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                    binding.isUpdating.root.visibility = View.GONE
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
        binding.btnRegister.setOnClickListener {
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

            if (isValid) viewModel.register(
                binding.tilRegisterPseudo.editText?.text.toString(),
                binding.tilRegisterEmail.editText?.text.toString(),
                binding.tilRegisterPassword.editText?.text.toString()
            )
        }
    }
}