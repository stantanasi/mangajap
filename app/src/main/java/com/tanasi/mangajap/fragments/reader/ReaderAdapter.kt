package com.tanasi.mangajap.fragments.reader

import android.graphics.Bitmap
import android.graphics.drawable.Drawable
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.request.target.CustomTarget
import com.bumptech.glide.request.transition.Transition
import com.tanasi.mangajap.databinding.ItemPageBinding
import com.tanasi.mangajap.models.Page
import com.tanasi.mangajap.utils.MangaReader

class ReaderAdapter(
    private val pages: MutableList<Page> = mutableListOf()
) : RecyclerView.Adapter<ReaderAdapter.ReaderViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int) =
        ReaderViewHolder(
            ItemPageBinding.inflate(
                LayoutInflater.from(parent.context),
                parent,
                false
            )
        )

    override fun onBindViewHolder(holder: ReaderViewHolder, position: Int) {
        holder.bind(pages[position])
    }

    override fun getItemCount() = pages.size

    fun submitList(list: List<Page>) {
        val result = DiffUtil.calculateDiff(object : DiffUtil.Callback() {
            override fun getOldListSize() = pages.size

            override fun getNewListSize() = list.size

            override fun areItemsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
                val oldItem = pages[oldItemPosition]
                val newItem = list[newItemPosition]
                return oldItem.image == newItem.image
            }

            override fun areContentsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
                val oldItem = pages[oldItemPosition]
                val newItem = list[newItemPosition]
                return oldItem == newItem
            }
        })

        pages.clear()
        pages.addAll(list)
        result.dispatchUpdatesTo(this)
    }


    class ReaderViewHolder(
        private val binding: ItemPageBinding,
    ) : RecyclerView.ViewHolder(binding.root) {

        private val context = itemView.context
        private lateinit var page: Page

        fun bind(page: Page) {
            this.page = page
            displayItem()
        }


        private fun displayItem() {
            Glide.with(context)
                .asBitmap()
                .load(page.image)
                .fitCenter()
                .into(object : CustomTarget<Bitmap>() {
                    override fun onResourceReady(
                        resource: Bitmap,
                        transition: Transition<in Bitmap>?
                    ) {
                        val image = when {
                            page.isShuffled -> MangaReader.ImageUnshuffler.unshuffle(resource)
                            else -> resource
                        }

                        binding.ivPage.setImageBitmap(image)
                    }

                    override fun onLoadCleared(placeholder: Drawable?) {}
                })
        }
    }
}