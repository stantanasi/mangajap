package com.tanasi.mangajap.adapters.viewHolders

import android.view.View
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.tanasi.mangajap.databinding.ItemLoadMoreBinding
import com.tanasi.mangajap.models.LoadMore

class VhLoadMore(
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
        binding.isLoadingProgressBar.visibility = if (loadMore.isMoreDataAvailable) View.VISIBLE else View.GONE

        binding.isNoMoreDataAvailable.visibility = if (loadMore.isMoreDataAvailable) View.GONE else View.VISIBLE
    }
}