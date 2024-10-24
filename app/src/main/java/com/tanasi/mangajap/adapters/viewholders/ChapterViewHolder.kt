package com.tanasi.mangajap.adapters.viewholders

import androidx.navigation.findNavController
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.tanasi.mangajap.databinding.ItemChapterBinding
import com.tanasi.mangajap.fragments.manga.MangaFragmentDirections
import com.tanasi.mangajap.fragments.reader.ReaderFragment
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
        binding.root.apply {
            setOnClickListener {
                findNavController().navigate(
                    MangaFragmentDirections.actionMangaToReader(
                        id = chapter.id,
                        readerType = ReaderFragment.ReaderType.CHAPTER,
                    )
                )
            }
        }

        binding.tvChapterTitle.text = when {
            chapter.number % 1.0 == 0.0 -> String.format(Locale.ROOT, "%.0f", chapter.number)
            else -> String.format(Locale.ROOT, "%.1f", chapter.number)
        }
    }
}