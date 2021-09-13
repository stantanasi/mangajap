package com.tanasi.mangajap.activities

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.ads.MobileAds
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.tanasi.mangajap.databinding.ActivityLauncherBinding
import com.tanasi.mangajap.utils.extensions.getActualTheme
import com.tanasi.mangajap.utils.extensions.setLocale
import com.tanasi.mangajap.utils.preferences.UserPreference

class LauncherActivity : AppCompatActivity() {

    private var _binding: ActivityLauncherBinding? = null
    private val binding: ActivityLauncherBinding get() = _binding!!

    override fun onCreate(savedInstanceState: Bundle?) {
        setTheme(getActualTheme())
        super.onCreate(savedInstanceState)
        setLocale()
        _binding = ActivityLauncherBinding.inflate(layoutInflater)
        setContentView(binding.root)

        MobileAds.initialize(this) {}

        Firebase.auth.currentUser?.let {
            startActivity(Intent(this, MainActivity::class.java))
            finish()
        }
    }
}