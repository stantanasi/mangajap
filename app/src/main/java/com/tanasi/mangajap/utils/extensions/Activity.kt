package com.tanasi.mangajap.utils.extensions

import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.NavHostFragment
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.MainActivity
import com.tanasi.mangajap.fragments.recyclerView.RecyclerViewFragment
import com.tanasi.mangajap.fragments.settingsPreference.SettingsPreferenceFragment

fun AppCompatActivity.getCurrentFragment(): Fragment? = // TODO: if (context is MainActivity) {
    when (this) {
        is MainActivity ->  {
            val navHostFragment = this.supportFragmentManager.findFragmentById(R.id.nav_main_fragment) as NavHostFragment
            navHostFragment.childFragmentManager.fragments.firstOrNull { it !is RecyclerViewFragment && it !is SettingsPreferenceFragment }
        }
        else -> null
    }

fun <F : Fragment> AppCompatActivity.getFragment(fragmentClass: Class<F>): F? {
    val navHostFragment = this.supportFragmentManager.fragments.first() as NavHostFragment

    navHostFragment.childFragmentManager.fragments.forEach {
        if (fragmentClass.isAssignableFrom(it.javaClass)) {
            @Suppress("UNCHECKED_CAST")
            return it as F
        }
    }

    return null
}

