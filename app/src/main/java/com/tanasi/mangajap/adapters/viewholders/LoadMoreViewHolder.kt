package com.tanasi.mangajap.adapters.viewholders

import android.view.View
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.tanasi.mangajap.databinding.ItemLoadMoreBinding
import com.tanasi.mangajap.models.LoadMore

class LoadMoreViewHolder(
        private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
        _binding.root
) {

    private lateinit var loadMore: LoadMore

    fun setLoadMore(loadMore: LoadMore) {
        this.loadMore = loadMore
        when (_binding) {
            is ItemLoadMoreBinding -> displayProgressBar(_binding)
        }
    }


    private fun displayProgressBar(binding: ItemLoadMoreBinding) {
        binding.pbLoadMoreIsLoading.visibility = if (loadMore.isLoading) View.VISIBLE else View.GONE

        binding.ivLoadMoreIsNotLoading.visibility = if (loadMore.isMoreDataAvailable) View.GONE else View.VISIBLE
    }
}