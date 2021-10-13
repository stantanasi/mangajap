package com.tanasi.mangajap.adapters.viewHolders

import android.content.Context
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.tanasi.mangajap.databinding.ItemAgendaHeaderBinding
import com.tanasi.mangajap.databinding.ItemLibraryStatusBinding
import com.tanasi.mangajap.models.Header

class VhHeader(
    private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
    _binding.root
) {

    private val context: Context = itemView.context

    private lateinit var header: Header

    fun setVhStatusHeader(header: Header) {
        this.header = header
        when (_binding) {
            is ItemAgendaHeaderBinding -> displayAgendaHeader(_binding)
            is ItemLibraryStatusBinding -> displayStatus(_binding)
        }
    }


    private fun displayAgendaHeader(binding: ItemAgendaHeaderBinding) {

    }

    private fun displayStatus(binding: ItemLibraryStatusBinding) {
        binding.tvLibraryStatus.text = header.title
    }

}