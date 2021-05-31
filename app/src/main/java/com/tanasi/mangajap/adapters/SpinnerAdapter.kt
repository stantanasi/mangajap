package com.tanasi.mangajap.adapters

import android.content.Context
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import com.tanasi.mangajap.R

class SpinnerAdapter<T : Any>(
    context: Context,
    list: List<T>,
    resource: Int = R.layout.item_spinner_dropdown,
) : ArrayAdapter<T>(context, resource, list) {

    var onView: ((position: Int, context: Context, parent: ViewGroup) -> View)? = null
    var onBind: ((position: Int, context: Context, parent: ViewGroup) -> View)? = null

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        return onView?.let { it(position, context, parent) } ?: super.getView(
            position,
            convertView,
            parent
        )
    }

    override fun getDropDownView(position: Int, convertView: View?, parent: ViewGroup): View {
        return onBind?.let { it(position, context, parent) } ?: super.getDropDownView(
            position,
            convertView,
            parent
        )
    }
}