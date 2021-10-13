package com.tanasi.mangajap.fragments.settings

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.FragmentSettingsBinding
import com.tanasi.mangajap.fragments.settingsPreference.SettingsPreferenceFragment
import com.tanasi.mangajap.utils.extensions.setToolbar

class SettingsFragment : Fragment() {

    private var _binding: FragmentSettingsBinding? = null
    private val binding: FragmentSettingsBinding get() = _binding!!

    private val viewModel: SettingsViewModel by viewModels()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentSettingsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setToolbar(resources.getString(R.string.settings), "").setNavigationOnClickListener { findNavController().navigateUp() }

        showFragment(SettingsPreferenceFragment.Settings.main, false)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }



    fun showFragment(settings: SettingsPreferenceFragment.Settings, back_stack: Boolean) {
        val ft: FragmentTransaction = childFragmentManager.beginTransaction()
        val settingsPreferenceFragment = SettingsPreferenceFragment()
        settingsPreferenceFragment.settingsFragment = this
        val args = Bundle()
        args.putString("settings", settings.name)
        settingsPreferenceFragment.arguments = args
        // TODO: check ?
        ft.replace(binding.flSettings.id, settingsPreferenceFragment)
        if (back_stack) ft.addToBackStack(null)
        ft.commit()
    }
}