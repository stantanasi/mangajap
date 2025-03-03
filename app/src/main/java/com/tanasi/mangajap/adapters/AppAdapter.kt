package com.tanasi.mangajap.adapters

import android.os.Parcelable
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.RecyclerView
import com.tanasi.mangajap.adapters.viewholders.CategoryViewHolder
import com.tanasi.mangajap.adapters.viewholders.ChapterViewHolder
import com.tanasi.mangajap.adapters.viewholders.MangaViewHolder
import com.tanasi.mangajap.adapters.viewholders.VolumeViewHolder
import com.tanasi.mangajap.databinding.ContentCategorySwiperBinding
import com.tanasi.mangajap.databinding.ItemCategoryBinding
import com.tanasi.mangajap.databinding.ItemCategorySwiperBinding
import com.tanasi.mangajap.databinding.ItemChapterBinding
import com.tanasi.mangajap.databinding.ItemLoadMoreBinding
import com.tanasi.mangajap.databinding.ItemMangaBinding
import com.tanasi.mangajap.databinding.ItemMangaGridBinding
import com.tanasi.mangajap.databinding.ItemVolumeBinding
import com.tanasi.mangajap.models.Category
import com.tanasi.mangajap.models.Chapter
import com.tanasi.mangajap.models.Genre
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.models.Volume

class AppAdapter(
    private val items: MutableList<Item> = mutableListOf(),
) : RecyclerView.Adapter<RecyclerView.ViewHolder>() {

    interface Item {
        var itemType: Type
    }

    enum class Type {
        CATEGORY_SWIPER,
        CATEGORY_ITEM,

        CHAPTER_ITEM,

        LOADING_ITEM,

        MANGA_ITEM,
        MANGA_GRID_ITEM,
        MANGA_SWIPER_ITEM,

        VOLUME_ITEM,
    }

    private val states = mutableMapOf<Int, Parcelable?>()

    var isLoading = false
    private var onLoadMoreListener: (() -> Unit)? = null

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder =
        when (Type.entries[viewType]) {
            Type.CATEGORY_SWIPER -> CategoryViewHolder(
                ContentCategorySwiperBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.CATEGORY_ITEM -> CategoryViewHolder(
                ItemCategoryBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.CHAPTER_ITEM -> ChapterViewHolder(
                ItemChapterBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.LOADING_ITEM -> LoadingViewHolder(
                ItemLoadMoreBinding.inflate(
                    LayoutInflater.from(
                        parent.context
                    ), parent, false
                )
            )

            Type.MANGA_ITEM -> MangaViewHolder(
                ItemMangaBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.MANGA_GRID_ITEM -> MangaViewHolder(
                ItemMangaGridBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.MANGA_SWIPER_ITEM -> MangaViewHolder(
                ItemCategorySwiperBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.VOLUME_ITEM -> VolumeViewHolder(
                ItemVolumeBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )
        }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        if (position >= itemCount - 5 && !isLoading) {
            onLoadMoreListener?.invoke()
            isLoading = true
        }

        when (holder) {
            is CategoryViewHolder -> holder.bind(items[position] as Category)
            is ChapterViewHolder -> holder.bind(items[position] as Chapter)
            is MangaViewHolder -> holder.bind(items[position] as Manga)
            is VolumeViewHolder -> holder.bind(items[position] as Volume)
        }

        val state = states[holder.layoutPosition]
        if (state != null) {
            when (holder) {
                is CategoryViewHolder -> holder.childRecyclerView?.layoutManager?.onRestoreInstanceState(state)
            }
        }
    }

    override fun getItemCount(): Int = items.size + when {
        onLoadMoreListener != null -> 1
        else -> 0
    }

    override fun getItemViewType(position: Int): Int = items.getOrNull(position)?.itemType?.ordinal
        ?: Type.LOADING_ITEM.ordinal

    override fun onViewRecycled(holder: RecyclerView.ViewHolder) {
        super.onViewRecycled(holder)

        states[holder.layoutPosition] = when (holder) {
            is CategoryViewHolder -> holder.childRecyclerView?.layoutManager?.onSaveInstanceState()
            else -> null
        }
    }

    fun onSaveInstanceState(recyclerView: RecyclerView) {
        for (position in items.indices) {
            val holder = recyclerView.findViewHolderForAdapterPosition(position) ?: continue

            states[position] = when (holder) {
                is CategoryViewHolder -> holder.childRecyclerView?.layoutManager?.onSaveInstanceState()
                else -> null
            }
        }
    }


    fun submitList(list: List<Item>) {
        val result = DiffUtil.calculateDiff(object : DiffUtil.Callback() {
            override fun getOldListSize() = items.size

            override fun getNewListSize() = list.size

            override fun areItemsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
                val oldItem = items[oldItemPosition]
                val newItem = list[newItemPosition]
                return when {
                    oldItem is Category && newItem is Category -> oldItem.name == newItem.name
                    oldItem is Chapter && newItem is Chapter -> oldItem.id == newItem.id
                    oldItem is Genre && newItem is Genre -> oldItem.id == newItem.id
                    oldItem is Manga && newItem is Manga -> oldItem.id == newItem.id
                    oldItem is Volume && newItem is Volume -> oldItem.id == newItem.id
                    else -> false
                } && oldItem.itemType.ordinal == newItem.itemType.ordinal
            }

            override fun areContentsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
                val oldItem = items[oldItemPosition]
                val newItem = list[newItemPosition]
                return oldItem == newItem
            }
        })

        items.clear()
        items.addAll(list)
        result.dispatchUpdatesTo(this)
    }

    fun setOnLoadMoreListener(onLoadMoreListener: (() -> Unit)?) {
        if (this.onLoadMoreListener != null && onLoadMoreListener == null) {
            this.onLoadMoreListener = null
            notifyItemRemoved(items.size)
        } else {
            this.onLoadMoreListener = onLoadMoreListener
        }
    }


    private class LoadingViewHolder(
        binding: ItemLoadMoreBinding,
    ) : RecyclerView.ViewHolder(binding.root)
}