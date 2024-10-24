package com.tanasi.mangajap.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.RecyclerView
import com.tanasi.mangajap.adapters.viewholders.AdViewHolder
import com.tanasi.mangajap.adapters.viewholders.CategoryViewHolder
import com.tanasi.mangajap.adapters.viewholders.ChapterViewHolder
import com.tanasi.mangajap.adapters.viewholders.LoadingViewHolder
import com.tanasi.mangajap.adapters.viewholders.MangaViewHolder
import com.tanasi.mangajap.adapters.viewholders.VolumeViewHolder
import com.tanasi.mangajap.databinding.ItemAdDiscoverBinding
import com.tanasi.mangajap.databinding.ItemAdProfileBinding
import com.tanasi.mangajap.databinding.ItemAdSearchBinding
import com.tanasi.mangajap.databinding.ItemCategoryBinding
import com.tanasi.mangajap.databinding.ItemChapterBinding
import com.tanasi.mangajap.databinding.ItemLoadMoreBinding
import com.tanasi.mangajap.databinding.ItemMangaBinding
import com.tanasi.mangajap.databinding.ItemMangaFranchisesBinding
import com.tanasi.mangajap.databinding.ItemMangaGridBinding
import com.tanasi.mangajap.databinding.ItemMangaHeaderBinding
import com.tanasi.mangajap.databinding.ItemMangaProgressionBinding
import com.tanasi.mangajap.databinding.ItemMangaReviewsBinding
import com.tanasi.mangajap.databinding.ItemMangaSummaryBinding
import com.tanasi.mangajap.databinding.ItemMediaDiscoverBinding
import com.tanasi.mangajap.databinding.ItemMediaSearchAddBinding
import com.tanasi.mangajap.databinding.ItemMediaSearchBinding
import com.tanasi.mangajap.databinding.ItemVolumeBinding
import com.tanasi.mangajap.databinding.ItemVolumeMangaDetailsBinding
import com.tanasi.mangajap.models.Ad
import com.tanasi.mangajap.models.Anime
import com.tanasi.mangajap.models.AnimeEntry
import com.tanasi.mangajap.models.Category
import com.tanasi.mangajap.models.Chapter
import com.tanasi.mangajap.models.ChapterEntry
import com.tanasi.mangajap.models.Episode
import com.tanasi.mangajap.models.EpisodeEntry
import com.tanasi.mangajap.models.Follow
import com.tanasi.mangajap.models.Franchise
import com.tanasi.mangajap.models.Genre
import com.tanasi.mangajap.models.Header
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.models.MangaEntry
import com.tanasi.mangajap.models.People
import com.tanasi.mangajap.models.Request
import com.tanasi.mangajap.models.Review
import com.tanasi.mangajap.models.Season
import com.tanasi.mangajap.models.Staff
import com.tanasi.mangajap.models.Theme
import com.tanasi.mangajap.models.User
import com.tanasi.mangajap.models.Volume
import com.tanasi.mangajap.models.VolumeEntry

class AppAdapter(
    private val items: MutableList<Item> = mutableListOf(),
) : RecyclerView.Adapter<RecyclerView.ViewHolder>() {

    interface Item {
        var itemType: Type
    }

    enum class Type {
        AD_DISCOVER_ITEM,
        AD_PROFILE_ITEM,
        AD_SEARCH_ITEM,

        ANIME_SEARCH_ITEM,
        ANIME_SEARCH_ADD_ITEM,
        ANIME_DISCOVER_ITEM,

        ANIME,
        ANIME_SUMMARY,
        ANIME_PROGRESSION,
        ANIME_REVIEWS,
        ANIME_FRANCHISES,

        ANIME_ENTRY_LIBRARY_ITEM,
        ANIME_ENTRY_PROFILE_ITEM,
        ANIME_ENTRY_TO_WATCH_ITEM,

        CATEGORY_ITEM,

        CHAPTER_ITEM,

        EPISODE_ITEM,

        FOLLOWER_ITEM,
        FOLLOWING_ITEM,

        FRANCHISE_ITEM,

        LIBRARY_STATUS_HEADER,
        LOADING_ITEM,

        MANGA_ITEM,
        MANGA_GRID_ITEM,
        MANGA_SEARCH_ITEM,
        MANGA_SEARCH_ADD_ITEM,
        MANGA_DISCOVER_ITEM,

        MANGA,
        MANGA_SUMMARY,
        MANGA_PROGRESSION,
        MANGA_REVIEWS,
        MANGA_FRANCHISES,

        MANGA_ENTRY_LIBRARY_ITEM,
        MANGA_ENTRY_PROFILE_ITEM,
        MANGA_ENTRY_TO_READ_ITEM,

        PEOPLE_DISCOVER_ITEM,

        REVIEW_ITEM,
        REVIEW_HEADER,

        SEASON_ITEM,
        SEASON_ANIME_HEADER,

        STAFF_ITEM,

        STATS_PROFILE_MANGA_FOLLOWED_ITEM,
        STATS_PROFILE_MANGA_VOLUMES_ITEM,
        STATS_PROFILE_MANGA_CHAPTERS_ITEM,
        STATS_PROFILE_ANIME_FOLLOWED_ITEM,
        STATS_PROFILE_ANIME_TIME_SPENT_ITEM,
        STATS_PROFILE_ANIME_EPISODES_ITEM,

        USER_ITEM,

        VOLUME_ITEM,
        VOLUME_DETAILS_ITEM,
    }

    var isLoading = false
    private var onLoadMoreListener: (() -> Unit)? = null

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder =
        when (Type.entries[viewType]) {
            Type.AD_DISCOVER_ITEM -> AdViewHolder(
                ItemAdDiscoverBinding.inflate(
                    LayoutInflater.from(
                        parent.context
                    ), parent, false
                )
            )

            Type.AD_PROFILE_ITEM -> AdViewHolder(
                ItemAdProfileBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.AD_SEARCH_ITEM -> AdViewHolder(
                ItemAdSearchBinding.inflate(
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

            Type.VOLUME_ITEM -> VolumeViewHolder(
                ItemVolumeBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            else -> TODO()
        }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        if (position >= itemCount - 5 && !isLoading) {
            onLoadMoreListener?.invoke()
            isLoading = true
        }

        when (holder) {
            is AdViewHolder -> holder.bind(items[position] as Ad)
            is CategoryViewHolder -> holder.bind(items[position] as Category)
            is ChapterViewHolder -> holder.bind(items[position] as Chapter)
            is MangaViewHolder -> holder.bind(items[position] as Manga)
            is VolumeViewHolder -> holder.bind(items[position] as Volume)
        }
    }

    override fun getItemCount(): Int = items.size + when {
        onLoadMoreListener != null -> 1
        else -> 0
    }

    override fun getItemViewType(position: Int): Int = items.getOrNull(position)?.itemType?.ordinal
        ?: Type.LOADING_ITEM.ordinal


    fun submitList(list: List<Item>) {
        val result = DiffUtil.calculateDiff(object : DiffUtil.Callback() {
            override fun getOldListSize() = items.size

            override fun getNewListSize() = list.size

            override fun areItemsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
                val oldItem = items[oldItemPosition]
                val newItem = list[newItemPosition]
                return when {
                    oldItem is Ad && newItem is Ad -> oldItem == newItem
                    oldItem is Anime && newItem is Anime -> oldItem.id == newItem.id
                    oldItem is AnimeEntry && newItem is AnimeEntry -> oldItem.id == newItem.id
                    oldItem is Category && newItem is Category -> oldItem.name == newItem.name
                    oldItem is Chapter && newItem is Chapter -> oldItem.id == newItem.id
                    oldItem is ChapterEntry && newItem is ChapterEntry -> oldItem.id == newItem.id
                    oldItem is Episode && newItem is Episode -> oldItem.id == newItem.id
                    oldItem is EpisodeEntry && newItem is EpisodeEntry -> oldItem.id == newItem.id
                    oldItem is Follow && newItem is Follow -> oldItem.id == newItem.id
                    oldItem is Franchise && newItem is Franchise -> oldItem.id == newItem.id
                    oldItem is Genre && newItem is Genre -> oldItem.id == newItem.id
                    oldItem is Header && newItem is Header -> oldItem.title == newItem.title
                    oldItem is Manga && newItem is Manga -> oldItem.id == newItem.id
                    oldItem is MangaEntry && newItem is MangaEntry -> oldItem.id == newItem.id
                    oldItem is People && newItem is People -> oldItem.id == newItem.id
                    oldItem is Request && newItem is Request -> oldItem.id == newItem.id
                    oldItem is Review && newItem is Review -> oldItem.id == newItem.id
                    oldItem is Season && newItem is Season -> oldItem.id == newItem.id
                    oldItem is Staff && newItem is Staff -> oldItem.id == newItem.id
                    oldItem is Theme && newItem is Theme -> oldItem.id == newItem.id
                    oldItem is User && newItem is User -> oldItem.id == newItem.id
                    oldItem is User.Stats && newItem is User.Stats -> oldItem == newItem
                    oldItem is Volume && newItem is Volume -> oldItem.id == newItem.id
                    oldItem is VolumeEntry && newItem is VolumeEntry -> oldItem.id == newItem.id
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
}