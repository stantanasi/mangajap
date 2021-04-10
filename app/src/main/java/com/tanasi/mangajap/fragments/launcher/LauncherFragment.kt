package com.tanasi.mangajap.fragments.launcher

import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import com.tanasi.mangajap.databinding.FragmentLauncherBinding

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

        var versionName: String? = ""
        try {
            val pInfo: PackageInfo = requireContext().packageManager.getPackageInfo(requireContext().packageName, 0)
            versionName = pInfo.versionName
        } catch (e: PackageManager.NameNotFoundException) {
            Log.e("LauncherActivity", "onCreate: ", e)
        }
        binding.appVersionTextView.text = versionName
    }
}