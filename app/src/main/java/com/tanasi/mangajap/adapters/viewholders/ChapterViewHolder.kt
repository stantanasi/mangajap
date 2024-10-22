package com.tanasi.mangajap.adapters.viewholders

import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.tanasi.mangajap.databinding.ItemChapterBinding
import com.tanasi.mangajap.models.Chapter
import java.util.Locale

class ChapterViewHolder(
    private val _binding: ViewBinding,
) : RecyclerView.ViewHolder(_binding.root) {

    private val context = itemView.context
    private lateinit var chapter: Chapter

    fun bind(chapter: Chapter) {
        this.chapter = chapter
        when (_binding) {
            is ItemChapterBinding -> displayItem(_binding)
        }
    }


    private fun displayItem(binding: ItemChapterBinding) {
        binding.tvChapterTitle.text = String.format(Locale.ROOT, "%d", chapter.number)
    }
}