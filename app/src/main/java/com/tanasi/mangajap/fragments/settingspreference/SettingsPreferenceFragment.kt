package com.tanasi.mangajap.fragments.settingspreference

import android.app.AlertDialog
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.view.ContextThemeWrapper
import androidx.fragment.app.viewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.flowWithLifecycle
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import androidx.preference.Preference
import androidx.preference.PreferenceFragmentCompat
import com.google.firebase.auth.EmailAuthProvider
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.MainActivity
import com.tanasi.mangajap.fragments.settings.SettingsFragment
import com.tanasi.mangajap.models.User
import com.tanasi.mangajap.ui.dialog.ChangePasswordDialog
import com.tanasi.mangajap.ui.dialog.EditTextDialog
import com.tanasi.mangajap.ui.dialog.RadioGroupDialog
import com.tanasi.mangajap.ui.dialog.VerifyPasswordDialog
import com.tanasi.mangajap.utils.extensions.getAppVersionCode
import com.tanasi.mangajap.utils.extensions.getAppVersionName
import com.tanasi.mangajap.utils.extensions.getFragment
import com.tanasi.mangajap.utils.extensions.isEmailValid
import com.tanasi.mangajap.utils.extensions.isPasswordValid
import com.tanasi.mangajap.utils.extensions.isPseudoValid
import com.tanasi.mangajap.utils.extensions.onBackPressed
import com.tanasi.mangajap.utils.extensions.setNightMode
import com.tanasi.mangajap.utils.extensions.setToolbar
import com.tanasi.mangajap.utils.preferences.SettingsPreference
import kotlinx.coroutines.launch
import java.util.Calendar

// TODO: faire comme dans Steams, bouton "ANNOUNCEMENTS = annonces" dans les paramètres qui affiche toutes les nouveautés, notes...
// TODO: faire une préférence pour les titres (pas compliqué fait vraiment !!!!!)
// TODO: systeme de dons pour que je gagne de l'argent
class SettingsPreferenceFragment : PreferenceFragmentCompat() {

    private lateinit var settingsPreference: SettingsPreference
    private var settings: Settings? = null

    lateinit var settingsFragment: SettingsFragment

    private val viewModel: SettingsPreferenceViewModel by viewModels()

    enum class Settings {
        main,
        general,
        account,
        about;

        companion object {
            fun getByName(name: String): Settings? = try {
                valueOf(name)
            } catch (e: Exception) {
                null
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        preferenceManager.sharedPreferencesName = SettingsPreference.PREF_NAME
    }

    override fun onCreatePreferences(savedInstanceState: Bundle?, rootKey: String?) {
        settings = Settings.getByName(arguments?.getString("settings", "") ?: "")
        when (settings) {
            Settings.main -> addPreferencesFromResource(R.xml.preference_settings_main)
            Settings.general -> addPreferencesFromResource(R.xml.preference_settings_general)
            Settings.account -> addPreferencesFromResource(R.xml.preference_settings_account)
            Settings.about -> addPreferencesFromResource(R.xml.preference_settings_about)
            null -> Toast.makeText(
                requireContext(),
                requireContext().resources.getString(R.string.error),
                Toast.LENGTH_SHORT
            ).show()
        }
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        settingsPreference = SettingsPreference(requireContext())

        if (!this::settingsFragment.isInitialized)
            settingsFragment =
                (requireActivity() as MainActivity).getFragment(SettingsFragment::class.java)!!

        onBackPressed {
            when (settings) {
                Settings.main -> findNavController().navigateUp()

                Settings.general,
                Settings.account,
                Settings.about -> parentFragmentManager.popBackStack()

                else -> {}
            }
        }

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.state.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED).collect { state ->
                when (state) {
                    SettingsPreferenceViewModel.State.Loading -> {}

                    is SettingsPreferenceViewModel.State.SuccessLoading -> {
                        displayAccount(state.user)
                    }

                    is SettingsPreferenceViewModel.State.FailedLoading -> {
                        when (state.error) {
                            is JsonApiResponse.Error.ServerError -> state.error.body.errors.map {
                                Toast.makeText(requireContext(), it.title, Toast.LENGTH_SHORT)
                                    .show()
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
                    }

                    SettingsPreferenceViewModel.State.Updating -> {}

                    is SettingsPreferenceViewModel.State.SuccessUpdating -> {
                        displayAccount(state.user)
                    }

                    is SettingsPreferenceViewModel.State.FailedUpdating -> {
                        when (state.error) {
                            is JsonApiResponse.Error.ServerError -> state.error.body.errors.map {
                                Toast.makeText(requireContext(), it.title, Toast.LENGTH_SHORT)
                                    .show()
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
                    }
                }
            }
        }

        when (settings) {
            Settings.main -> displayMain()
            Settings.general -> displayGeneral()
            Settings.account -> {
                viewModel.getUser(Firebase.auth.uid!!)
                displayAccount()
            }

            Settings.about -> displayAbout()
            else -> {}
        }
    }


    private fun displayMain() {
        settingsFragment.setToolbar(getString(R.string.settings), "")
            .setNavigationOnClickListener { findNavController().navigateUp() }

        findPreference<Preference>("general")?.setOnPreferenceClickListener {
            settingsFragment.showFragment(Settings.general)
            false
        }

        findPreference<Preference>("account")?.setOnPreferenceClickListener {
            settingsFragment.showFragment(Settings.account)
            false
        }

        findPreference<Preference>("about")?.setOnPreferenceClickListener {
            settingsFragment.showFragment(Settings.about)
            false
        }
    }

    private fun displayGeneral() {
        settingsFragment.setToolbar(getString(R.string.general), "")
            .setNavigationOnClickListener { parentFragmentManager.popBackStack() }

        findPreference<Preference>("language")?.apply {
            summary = getString(settingsPreference.language.stringId)

            setOnPreferenceClickListener {
                RadioGroupDialog(
                    requireContext(),
                    getString(R.string.defineALanguage),
                    getString(settingsPreference.language.stringId),
                    SettingsPreference.Language.entries.map { getString(it.stringId) }
                        .sortedBy { it }
                ) { position ->
                    settingsPreference.language = SettingsPreference.Language.entries[position]

                    startActivity(Intent(requireContext(), MainActivity::class.java))
                    requireActivity().finish()
                    requireActivity().overridePendingTransition(
                        R.anim.fade_in_activity,
                        R.anim.fade_out_activity
                    )
                }.show()
                false
            }
        }

        findPreference<Preference>("theme")?.apply {
            summary = getString(settingsPreference.theme.stringId)

            setOnPreferenceClickListener {
                RadioGroupDialog(
                    requireContext(),
                    getString(R.string.defineATheme),
                    getString(settingsPreference.theme.stringId),
                    SettingsPreference.Theme.entries.map { getString(it.stringId) }
                ) { position ->
                    settingsPreference.theme = SettingsPreference.Theme.entries[position]

                    summary = getString(settingsPreference.theme.stringId)

                    requireContext().setNightMode()
                }.show()
                false
            }
        }

        findPreference<Preference>("clearCache")?.apply {
            setOnPreferenceClickListener {
                requireContext().cacheDir.deleteRecursively()
                false
            }
        }
    }

    private fun displayAccount(user: User? = null) {
        settingsFragment.setToolbar(getString(R.string.account), "")
            .setNavigationOnClickListener { parentFragmentManager.popBackStack() }

        val firebaseUser = Firebase.auth.currentUser!!
        if (user == null) return

        findPreference<Preference>("pseudo")?.apply {
            summary = user.pseudo
            setOnPreferenceClickListener {
                EditTextDialog(
                    requireContext(),
                    getString(R.string.changePseudo),
                    getString(R.string.pseudo),
                    user.pseudo
                ) { dialog, textInputLayout, text ->
                    if (text.isPseudoValid()) {
                        user.pseudo = text
                        viewModel.updateUser(user.also {
                            it.dirtyProperties.addAll(
                                listOf(
                                    User::pseudo,
                                )
                            )
                        })
                        dialog.dismiss()
                    } else {
                        textInputLayout.error = getString(R.string.pseudoInvalid)
                    }
                }.show()
                false
            }
        }

        findPreference<Preference>("email")?.apply {
            summary = firebaseUser.email
            setOnPreferenceClickListener {
                VerifyPasswordDialog(
                    requireContext()
                ) { dialog, etPassword, password ->
                    try {
                        val credential = EmailAuthProvider
                            .getCredential(firebaseUser.email!!, password)
                        firebaseUser
                            .reauthenticate(credential)
                            .addOnCompleteListener {
                                if (it.isSuccessful) {

                                    EditTextDialog(
                                        requireContext(),
                                        getString(R.string.changeEmail),
                                        getString(R.string.email),
                                        firebaseUser.email
                                    ) { dialog, textInputLayout, email ->

                                        if (email.isEmailValid()) {
                                            firebaseUser.updateEmail(email)
                                                .addOnCompleteListener { task ->
                                                    if (task.isSuccessful) {
                                                        dialog.dismiss()
                                                    }
                                                }
                                        } else {
                                            textInputLayout.error =
                                                requireContext().resources.getString(R.string.emailInvalid)
                                        }

                                    }.show()

                                    dialog.dismiss()
                                } else {
                                    etPassword.error = getString(R.string.passwordIncorrect)
                                }
                            }
                    } catch (e: Exception) {
                        Toast.makeText(requireContext(), e.message, Toast.LENGTH_SHORT).show()
                    }
                }.show()

                false
            }
        }


        findPreference<Preference>("userId")?.summary = user.id

        findPreference<Preference>("changePassword")?.apply {
            setOnPreferenceClickListener {
                ChangePasswordDialog(
                    requireContext()
                ) { dialog, etCurrentPassword, etNewPassword, currentPassword, newPassword, confirmPassword ->
                    try {
                        if (newPassword.isPasswordValid()) {
                            if (newPassword == confirmPassword) {
                                val credential = EmailAuthProvider
                                    .getCredential(firebaseUser.email!!, currentPassword)
                                firebaseUser
                                    .reauthenticate(credential)
                                    .addOnCompleteListener {

                                        if (it.isSuccessful) {
                                            firebaseUser.updatePassword(newPassword)
                                                .addOnCompleteListener { task ->
                                                    if (task.isSuccessful) {
                                                        dialog.dismiss()
                                                    }
                                                }
                                        } else {
                                            etCurrentPassword.error =
                                                getString(R.string.passwordIncorrect)
                                        }
                                    }

                            } else {
                                etNewPassword.error = getString(R.string.passwordDontMatch)
                            }
                        } else {
                            etNewPassword.error = getString(R.string.passwordInvalid)
                        }

                    } catch (e: Exception) {
                        Toast.makeText(requireContext(), e.message, Toast.LENGTH_SHORT).show()
                    }
                }.show()
                false
            }
        }

        findPreference<Preference>("logout")?.apply {
            setOnPreferenceClickListener {
                AlertDialog.Builder(
                    ContextThemeWrapper(
                        context,
                        R.style.Widget_AppTheme_Dialog_Alert
                    )
                )
                    .setTitle(getString(R.string.logout))
                    .setMessage(getString(R.string.logoutConfirmation))
                    .setPositiveButton(getString(R.string.confirm)) { _, _ ->
                        Firebase.auth.signOut()
                    }
                    .setNegativeButton(getString(R.string.cancel)) { _, _ -> }
                    .show()
                false
            }
        }
    }

    private fun displayAbout() {
        settingsFragment.setToolbar(getString(R.string.about), "")
            .setNavigationOnClickListener { parentFragmentManager.popBackStack() }

        findPreference<Preference>("version")?.apply {
            summary =
                requireContext().getAppVersionName() + " - " + requireContext().getAppVersionCode()
        }

        findPreference<Preference>("privacyPolicy")?.setOnPreferenceClickListener {
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(URL_PRIVACY_POLICY))
            startActivity(intent)
            false
        }

        findPreference<Preference>("contactUs")?.setOnPreferenceClickListener {
            Intent(Intent.ACTION_SENDTO).apply {
                data = Uri.parse("mailto:")
                putExtra(Intent.EXTRA_EMAIL, arrayOf("stantanasi@gmail.com"))
                putExtra(Intent.EXTRA_SUBJECT, "Help and comments")
                putExtra(
                    Intent.EXTRA_TEXT,
                    requireContext().resources.getString(R.string.app_name) + ", " + requireContext().getAppVersionName() + " - " + requireContext().getAppVersionCode()
                )
                startActivity(this)
            }
            false
        }

        findPreference<Preference>("rate")?.setOnPreferenceClickListener {
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(URL_PLAY_STORE))
            startActivity(intent)
            false
        }

        findPreference<Preference>("copyright")?.apply {
            summary = getString(
                R.string.copyright,
                Calendar.getInstance().get(Calendar.YEAR),
                getString(R.string.app_name)
            )
        }
    }


    companion object {
        const val URL_PRIVACY_POLICY =
            "https://www.privacypolicies.com/privacy/view/c1e4635a371ace65d48de05aae989c11"
        const val URL_PLAY_STORE =
            "https://play.google.com/store/apps/details?id=com.tanasi.mangajap"
    }
}