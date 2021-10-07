package com.tanasi.mangajap.activities

import android.app.AlertDialog
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.view.ContextThemeWrapper
import androidx.navigation.findNavController
import androidx.navigation.ui.setupWithNavController
import com.google.firebase.messaging.FirebaseMessaging
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.ActivityMainBinding
import com.tanasi.mangajap.fragments.settingsPreference.SettingsPreferenceFragment
import com.tanasi.mangajap.utils.extensions.getActualTheme
import com.tanasi.mangajap.utils.extensions.setLocale
import com.tanasi.mangajap.utils.preferences.GeneralPreference

class MainActivity : AppCompatActivity() {

    private var _binding: ActivityMainBinding? = null
    private val binding: ActivityMainBinding get() = _binding!!

    override fun onCreate(savedInstanceState: Bundle?) {
        setTheme(getActualTheme())
        super.onCreate(savedInstanceState)
        setLocale()
        _binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val generalPreference = GeneralPreference(this)

        FirebaseMessaging.getInstance().subscribeToTopic("all");

        val navController = findNavController(R.id.nav_main_fragment)

        if (savedInstanceState == null) {
            navController.graph = navController.graph.also {
                it.startDestination = generalPreference.savedStartDestination
            }
        }

        binding.bnvMain.setupWithNavController(navController)

        navController.addOnDestinationChangedListener { _, destination, _ ->
            when (destination.id) {
                R.id.agenda,
                R.id.discover,
                R.id.profile -> {
                    generalPreference.savedStartDestination = destination.id
                    showBottomNavView(true)
                }

                else -> showBottomNavView(false)
            }
        }

        if (++generalPreference.launchCount % 15 == 0) {
            AlertDialog.Builder(ContextThemeWrapper(this, R.style.Widget_AppTheme_Dialog_Alert))
                    .setTitle(getString(R.string.rate))
                    .setMessage(getString(R.string.rateSummary))
                    .setPositiveButton(getString(R.string.now)) { _, _ ->
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(SettingsPreferenceFragment.URL_PLAY_STORE))
                        startActivity(intent)
                    }
                    .setNegativeButton(getString(R.string.later)) { _, _ -> }
                    .show()
        }
    }

    override fun onBackPressed() {
        when (binding.bnvMain.visibility) {
            View.VISIBLE -> finish()
            else -> super.onBackPressed()
        }
    }

    fun showBottomNavView(show: Boolean) {
        _binding?.let {
            binding.bnvMain.visibility = if (show) View.VISIBLE else View.GONE
        } ?: reloadActivity()
    }

    fun reloadActivity() {
        startActivity(Intent(this, MainActivity::class.java))
        finish()
    }
}