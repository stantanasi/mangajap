package com.tanasi.mangajap.utils.extensions

import com.google.android.material.tabs.TabLayout

fun TabLayout.contains(tabTitle: String): Boolean {
    for (i in 0 until this.tabCount) {
        if (this.getTabAt(i)?.text.toString() == tabTitle) return true
    }
    return false
}

fun TabLayout.add(tabTitle: String) = this.addTab(this.newTab().setText(tabTitle))