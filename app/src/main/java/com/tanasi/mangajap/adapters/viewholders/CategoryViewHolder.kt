package com.tanasi.mangajap.adapters.viewholders

import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.databinding.ItemCategoryBinding
import com.tanasi.mangajap.models.Category

class CategoryViewHolder(
    private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
    _binding.root
) {

    private val context = itemView.context
    private lateinit var category: Category

    fun bind(category: Category) {
        this.category = category
        when (_binding) {
            is ItemCategoryBinding -> displayCategoryItem(_binding)
        }
    }


    private fun displayCategoryItem(binding: ItemCategoryBinding) {
        binding.tvCategoryTitle.text = category.name

        binding.rvCategory.apply {
            adapter = AppAdapter().apply {
                submitList(category.list)
            }
        }
    }
}