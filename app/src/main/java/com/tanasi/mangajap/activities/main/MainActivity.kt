package com.tanasi.mangajap.activities.main

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.activity.OnBackPressedCallback
import androidx.activity.viewModels
import androidx.fragment.app.FragmentActivity
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.ActivityMainBinding

class MainActivity : FragmentActivity() {

    private var _binding: ActivityMainBinding? = null
    private val binding get() = _binding!!

    private val viewModel by viewModels<MainViewModel>()

    override fun onCreate(savedInstanceState: Bundle?) {
        setTheme(R.style.AppTheme_MangaJap)
        super.onCreate(savedInstanceState)
        _binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val navHostFragment = this.supportFragmentManager
            .findFragmentById(binding.navMainFragment.id) as NavHostFragment
        val navController = navHostFragment.navController

        binding.bnvMain.setupWithNavController(navController)

        navController.addOnDestinationChangedListener { _, destination, _ ->
            when (destination.id) {
                R.id.home -> binding.bnvMain.visibility = View.VISIBLE
                else -> binding.bnvMain.visibility = View.GONE
            }
        }

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                when (navController.currentDestination?.id) {
                    R.id.home -> finish()
                    else -> navController.navigateUp().takeIf { !it }
                        ?: finish()
                }
            }
        })
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