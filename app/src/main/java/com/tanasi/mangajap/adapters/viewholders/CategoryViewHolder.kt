package com.tanasi.mangajap.adapters.viewholders

import android.os.Handler
import android.os.Looper
import android.view.View
import android.widget.LinearLayout
import androidx.core.os.postDelayed
import androidx.core.view.children
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import androidx.viewpager2.widget.ViewPager2
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.databinding.ContentCategorySwiperBinding
import com.tanasi.mangajap.databinding.ItemCategoryBinding
import com.tanasi.mangajap.models.Category
import com.tanasi.mangajap.ui.SpacingItemDecoration

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
            is ContentCategorySwiperBinding -> displaySwiper(_binding)
            is ItemCategoryBinding -> displayCategoryItem(_binding)
        }
    }


    private fun displaySwiper(binding: ContentCategorySwiperBinding) {
        val handler = Handler(Looper.getMainLooper())
        handler.postDelayed(8_000) {
            binding.vpCategorySwiper.currentItem += 1
        }

        val items = listOf(
            listOfNotNull(category.list.lastOrNull()),
            category.list,
            listOfNotNull(category.list.firstOrNull()),
        ).flatten()
        binding.vpCategorySwiper.apply {
            adapter = AppAdapter().apply {
                submitList(category.list)
                post { (adapter as AppAdapter).submitList(items) }
            }
        }

        binding.llDotsIndicator.apply {
            removeAllViews()
            repeat(category.list.size) {
                val view = View(context).apply {
                    layoutParams = LinearLayout.LayoutParams(15, 15).apply {
                        setMargins(10, 0, 10, 0)
                    }
                    setBackgroundResource(R.drawable.bg_dot_indicator)
                }
                addView(view)
            }
        }

        binding.vpCategorySwiper.registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {
            override fun onPageSelected(position: Int) {
                val indicatorPosition = when (position) {
                    0 -> category.list.lastIndex
                    items.lastIndex -> 0
                    else -> position - 1
                }
                binding.llDotsIndicator.children.forEachIndexed { index, view ->
                    view.isSelected = (indicatorPosition == index)
                }
                handler.removeCallbacksAndMessages(null)
                handler.postDelayed(8_000) {
                    binding.vpCategorySwiper.currentItem += 1
                }
            }

            override fun onPageScrollStateChanged(state: Int) {
                if (state == ViewPager2.SCROLL_STATE_IDLE) {
                    when (binding.vpCategorySwiper.currentItem) {
                        0 -> binding.vpCategorySwiper.setCurrentItem(
                            items.lastIndex - 1,
                            false
                        )
                        items.lastIndex -> binding.vpCategorySwiper.setCurrentItem(
                            1,
                            false
                        )
                    }
                }
            }
        })
    }

    private fun displayCategoryItem(binding: ItemCategoryBinding) {
        binding.tvCategoryTitle.text = category.name

        binding.rvCategory.apply {
            adapter = AppAdapter().apply {
                submitList(category.list)
            }
            if (itemDecorationCount == 0) {
                addItemDecoration(SpacingItemDecoration(category.itemSpacing))
            }
        }
    }
}