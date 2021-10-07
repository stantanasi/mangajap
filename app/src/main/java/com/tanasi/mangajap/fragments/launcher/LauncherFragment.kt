package com.tanasi.mangajap.fragments.launcher

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import com.tanasi.mangajap.databinding.FragmentLauncherBinding
import com.tanasi.mangajap.utils.extensions.requirePackageInfo

class LauncherFragment : Fragment() {

    private var _binding: FragmentLauncherBinding? = null
    private val binding: FragmentLauncherBinding get() = _binding!!

    private val viewModel: LauncherViewModel by viewModels()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentLauncherBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        displayLauncher()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }



    private fun displayLauncher() {
        binding.login.setOnClickListener {
            findNavController().navigate(
                    LauncherFragmentDirections.actionLauncherFragmentToLoginFragment()
            )
        }

        binding.register.setOnClickListener {
            findNavController().navigate(
                    LauncherFragmentDirections.actionLauncherFragmentToRegisterFragment()
            )
        }

        binding.appVersionTextView.text = requireContext().packageManager.requirePackageInfo(requireContext().packageName, 0)?.versionName ?: ""
    }
}