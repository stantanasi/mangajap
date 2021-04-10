package com.tanasi.mangajap.utils.extensions

import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.NavHostFragment
import com.tanasi.mangajap.R
import com.tanasi.mangajap.fragments.recyclerView.RecyclerViewFragment
import com.tanasi.mangajap.fragments.settingsPreference.SettingsPreferenceFragment

fun AppCompatActivity.getCurrentFragment(): Fragment? {
    val navHostFragment: NavHostFragment = this.supportFragmentManager.findFragmentById(R.id.nav_main_fragment) as NavHostFragment
    return navHostFragment.childFragmentManager.fragments.firstOrNull { it !is RecyclerViewFragment && it !is SettingsPreferenceFragment }
}

fun <F : Fragment> AppCompatActivity.getFragment(fragmentClass: Class<F>): F? {
    val navHostFragment = this.supportFragmentManager.fragments.first() as NavHostFragment

    navHostFragment.childFragmentManager.fragments.forEach {
        if (fragmentClass.isAssignableFrom(it.javaClass)) {
            return it as F
        }
    }

    return null
}

