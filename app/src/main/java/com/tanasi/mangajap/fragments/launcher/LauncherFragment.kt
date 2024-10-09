package com.tanasi.mangajap.fragments.launcher

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.tanasi.mangajap.databinding.FragmentLauncherBinding
import com.tanasi.mangajap.utils.extensions.requirePackageInfo

class LauncherFragment : Fragment() {

    private var _binding: FragmentLauncherBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
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
        binding.tvLauncherLogin.setOnClickListener {
            findNavController().navigate(
                LauncherFragmentDirections.actionLauncherFragmentToLoginFragment()
            )
        }

        binding.tvLauncherRegister.setOnClickListener {
            findNavController().navigate(
                LauncherFragmentDirections.actionLauncherFragmentToRegisterFragment()
            )
        }

        binding.tvLauncherAppVersion.text = requireContext().packageManager.requirePackageInfo(
            requireContext().packageName,
            0
        )?.versionName ?: ""
    }
}