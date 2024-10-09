package com.tanasi.mangajap.fragments.settings

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import androidx.navigation.fragment.findNavController
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.FragmentSettingsBinding
import com.tanasi.mangajap.fragments.settingspreference.SettingsPreferenceFragment
import com.tanasi.mangajap.utils.extensions.setToolbar

class SettingsFragment : Fragment() {

    private var _binding: FragmentSettingsBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentSettingsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setToolbar(
            resources.getString(R.string.settings),
            ""
        ).setNavigationOnClickListener { findNavController().navigateUp() }

        if (savedInstanceState == null)
            showFragment(SettingsPreferenceFragment.Settings.main)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }


    fun showFragment(settings: SettingsPreferenceFragment.Settings) {
        val ft: FragmentTransaction = childFragmentManager.beginTransaction()
        ft.replace(binding.flSettings.id, SettingsPreferenceFragment().also {
            it.settingsFragment = this
            it.arguments = Bundle().also { bundle ->
                bundle.putString("settings", settings.name)
            }
        })
        when (settings) {
            SettingsPreferenceFragment.Settings.main -> {}
            else -> ft.addToBackStack(null)
        }
        ft.commit()
    }
}