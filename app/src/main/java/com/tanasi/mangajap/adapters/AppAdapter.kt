package com.tanasi.mangajap.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.RecyclerView
import com.tanasi.mangajap.adapters.viewholders.AdViewHolder
import com.tanasi.mangajap.adapters.viewholders.AnimeEntryViewHolder
import com.tanasi.mangajap.adapters.viewholders.AnimeViewHolder
import com.tanasi.mangajap.adapters.viewholders.EpisodeViewHolder
import com.tanasi.mangajap.adapters.viewholders.FollowViewHolder
import com.tanasi.mangajap.adapters.viewholders.FranchiseViewHolder
import com.tanasi.mangajap.adapters.viewholders.HeaderViewHolder
import com.tanasi.mangajap.adapters.viewholders.LoadMoreViewHolder
import com.tanasi.mangajap.adapters.viewholders.MangaEntryViewHolder
import com.tanasi.mangajap.adapters.viewholders.MangaViewHolder
import com.tanasi.mangajap.adapters.viewholders.PeopleViewHolder
import com.tanasi.mangajap.adapters.viewholders.ReviewViewHolder
import com.tanasi.mangajap.adapters.viewholders.SeasonViewHolder
import com.tanasi.mangajap.adapters.viewholders.StaffViewHolder
import com.tanasi.mangajap.adapters.viewholders.UserStatsViewHolder
import com.tanasi.mangajap.adapters.viewholders.UserViewHolder
import com.tanasi.mangajap.adapters.viewholders.VolumeViewHolder
import com.tanasi.mangajap.databinding.ItemAdDiscoverBinding
import com.tanasi.mangajap.databinding.ItemAdProfileBinding
import com.tanasi.mangajap.databinding.ItemAdSearchBinding
import com.tanasi.mangajap.databinding.ItemAgendaAnimeBinding
import com.tanasi.mangajap.databinding.ItemAgendaMangaBinding
import com.tanasi.mangajap.databinding.ItemAnimeFranchisesBinding
import com.tanasi.mangajap.databinding.ItemAnimeHeaderBinding
import com.tanasi.mangajap.databinding.ItemAnimeProgressionBinding
import com.tanasi.mangajap.databinding.ItemAnimeReviewsBinding
import com.tanasi.mangajap.databinding.ItemAnimeSummaryBinding
import com.tanasi.mangajap.databinding.ItemEpisodeAnimeBinding
import com.tanasi.mangajap.databinding.ItemFollowBinding
import com.tanasi.mangajap.databinding.ItemFranchiseBinding
import com.tanasi.mangajap.databinding.ItemLibraryStatusBinding
import com.tanasi.mangajap.databinding.ItemLoadMoreBinding
import com.tanasi.mangajap.databinding.ItemMangaFranchisesBinding
import com.tanasi.mangajap.databinding.ItemMangaHeaderBinding
import com.tanasi.mangajap.databinding.ItemMangaProgressionBinding
import com.tanasi.mangajap.databinding.ItemMangaReviewsBinding
import com.tanasi.mangajap.databinding.ItemMangaSummaryBinding
import com.tanasi.mangajap.databinding.ItemMediaDiscoverBinding
import com.tanasi.mangajap.databinding.ItemMediaLibraryBinding
import com.tanasi.mangajap.databinding.ItemMediaProfilePreviewBinding
import com.tanasi.mangajap.databinding.ItemMediaSearchAddBinding
import com.tanasi.mangajap.databinding.ItemMediaSearchBinding
import com.tanasi.mangajap.databinding.ItemPeopleDiscoverBinding
import com.tanasi.mangajap.databinding.ItemReviewBinding
import com.tanasi.mangajap.databinding.ItemReviewHeaderBinding
import com.tanasi.mangajap.databinding.ItemSeasonAnimeBinding
import com.tanasi.mangajap.databinding.ItemSeasonAnimeHeaderBinding
import com.tanasi.mangajap.databinding.ItemStaffPeopleBinding
import com.tanasi.mangajap.databinding.ItemStatsPreviewBinding
import com.tanasi.mangajap.databinding.ItemStatsTimeSpentPreviewBinding
import com.tanasi.mangajap.databinding.ItemUserBinding
import com.tanasi.mangajap.databinding.ItemVolumeMangaBinding
import com.tanasi.mangajap.databinding.ItemVolumeMangaDetailsBinding
import com.tanasi.mangajap.models.Ad
import com.tanasi.mangajap.models.Anime
import com.tanasi.mangajap.models.AnimeEntry
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
        AD_DISCOVER,
        AD_PROFILE,
        AD_SEARCH,

        ANIME_SEARCH,
        ANIME_SEARCH_ADD,
        ANIME_DISCOVER,

        ANIME_HEADER,
        ANIME_SUMMARY,
        ANIME_PROGRESSION,
        ANIME_REVIEWS,
        ANIME_FRANCHISES,

        ANIME_ENTRY_LIBRARY,
        ANIME_ENTRY_PREVIEW,
        ANIME_ENTRY_TO_WATCH,

        FRANCHISE,

        MANGA_SEARCH,
        MANGA_SEARCH_ADD,
        MANGA_DISCOVER,

        MANGA_HEADER,
        MANGA_HEADER_SUMMARY,
        MANGA_HEADER_PROGRESSION,
        MANGA_HEADER_REVIEWS,
        MANGA_HEADER_FRANCHISES,

        MANGA_ENTRY_LIBRARY,
        MANGA_ENTRY_PREVIEW,
        MANGA_ENTRY_TO_READ,

        VOLUME_MANGA,
        VOLUME_MANGA_DETAILS,

        EPISODE_ANIME,
        SEASON_ANIME,
        SEASON_ANIME_HEADER,
        USER,
        FOLLOWERS,
        FOLLOWING,
        PEOPLE_DISCOVER,
        STAFF_PEOPLE,

        HEADER_LIBRARY_STATUS,

        LOAD_MORE,
        REVIEW,
        REVIEW_HEADER,
        STATS_PREVIEW_MANGA_FOLLOWED,
        STATS_PREVIEW_MANGA_VOLUMES,
        STATS_PREVIEW_MANGA_CHAPTERS,
        STATS_PREVIEW_ANIME_FOLLOWED,
        STATS_PREVIEW_ANIME_TIME_SPENT,
        STATS_PREVIEW_ANIME_EPISODES,
    }

    var isLoading = false
    private var onLoadMoreListener: (() -> Unit)? = null

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder =
        when (Type.entries[viewType]) {
            Type.AD_DISCOVER -> AdViewHolder(
                ItemAdDiscoverBinding.inflate(
                    LayoutInflater.from(
                        parent.context
                    ), parent, false
                )
            )

            Type.AD_PROFILE -> AdViewHolder(
                ItemAdProfileBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.AD_SEARCH -> AdViewHolder(
                ItemAdSearchBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.ANIME_SEARCH -> AnimeViewHolder(
                ItemMediaSearchBinding.inflate(
                    LayoutInflater.from(
                        parent.context
                    ), parent, false
                )
            )

            Type.ANIME_SEARCH_ADD -> AnimeViewHolder(
                ItemMediaSearchAddBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.ANIME_HEADER -> AnimeViewHolder(
                ItemAnimeHeaderBinding.inflate(
                    LayoutInflater.from(
                        parent.context
                    ), parent, false
                )
            )

            Type.ANIME_SUMMARY -> AnimeViewHolder(
                ItemAnimeSummaryBinding.inflate(
                    LayoutInflater.from(
                        parent.context
                    ), parent, false
                )
            )

            Type.ANIME_PROGRESSION -> AnimeViewHolder(
                ItemAnimeProgressionBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.ANIME_REVIEWS -> AnimeViewHolder(
                ItemAnimeReviewsBinding.inflate(
                    LayoutInflater.from(
                        parent.context
                    ), parent, false
                )
            )

            Type.ANIME_FRANCHISES -> AnimeViewHolder(
                ItemAnimeFranchisesBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.ANIME_DISCOVER -> AnimeViewHolder(
                ItemMediaDiscoverBinding.inflate(
                    LayoutInflater.from(
                        parent.context
                    ), parent, false
                )
            )

            Type.ANIME_ENTRY_LIBRARY -> AnimeEntryViewHolder(
                ItemMediaLibraryBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.ANIME_ENTRY_PREVIEW -> AnimeEntryViewHolder(
                ItemMediaProfilePreviewBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.SEASON_ANIME_HEADER -> SeasonViewHolder(
                ItemSeasonAnimeHeaderBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.SEASON_ANIME -> SeasonViewHolder(
                ItemSeasonAnimeBinding.inflate(
                    LayoutInflater.from(
                        parent.context
                    ), parent, false
                )
            )

            Type.EPISODE_ANIME -> EpisodeViewHolder(
                ItemEpisodeAnimeBinding.inflate(
                    LayoutInflater.from(
                        parent.context
                    ), parent, false
                )
            )

            Type.FRANCHISE -> FranchiseViewHolder(
                ItemFranchiseBinding.inflate(
                    LayoutInflater.from(
                        parent.context
                    ), parent, false
                )
            )

            Type.MANGA_SEARCH -> MangaViewHolder(
                ItemMediaSearchBinding.inflate(
                    LayoutInflater.from(
                        parent.context
                    ), parent, false
                )
            )

            Type.MANGA_SEARCH_ADD -> MangaViewHolder(
                ItemMediaSearchAddBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.MANGA_HEADER -> MangaViewHolder(
                ItemMangaHeaderBinding.inflate(
                    LayoutInflater.from(
                        parent.context
                    ), parent, false
                )
            )

            Type.MANGA_HEADER_SUMMARY -> MangaViewHolder(
                ItemMangaSummaryBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.MANGA_HEADER_PROGRESSION -> MangaViewHolder(
                ItemMangaProgressionBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.MANGA_HEADER_REVIEWS -> MangaViewHolder(
                ItemMangaReviewsBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.MANGA_HEADER_FRANCHISES -> MangaViewHolder(
                ItemMangaFranchisesBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.MANGA_DISCOVER -> MangaViewHolder(
                ItemMediaDiscoverBinding.inflate(
                    LayoutInflater.from(
                        parent.context
                    ), parent, false
                )
            )

            Type.MANGA_ENTRY_LIBRARY -> MangaEntryViewHolder(
                ItemMediaLibraryBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.MANGA_ENTRY_PREVIEW -> MangaEntryViewHolder(
                ItemMediaProfilePreviewBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.REVIEW_HEADER -> ReviewViewHolder(
                ItemReviewHeaderBinding.inflate(
                    LayoutInflater.from(
                        parent.context
                    ), parent, false
                )
            )

            Type.REVIEW -> ReviewViewHolder(
                ItemReviewBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )


            Type.STATS_PREVIEW_MANGA_FOLLOWED,
            Type.STATS_PREVIEW_MANGA_VOLUMES,
            Type.STATS_PREVIEW_MANGA_CHAPTERS,
            Type.STATS_PREVIEW_ANIME_FOLLOWED,
            Type.STATS_PREVIEW_ANIME_EPISODES -> UserStatsViewHolder(
                ItemStatsPreviewBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.STATS_PREVIEW_ANIME_TIME_SPENT -> UserStatsViewHolder(
                ItemStatsTimeSpentPreviewBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.VOLUME_MANGA -> VolumeViewHolder(
                ItemVolumeMangaBinding.inflate(
                    LayoutInflater.from(
                        parent.context
                    ), parent, false
                )
            )

            Type.VOLUME_MANGA_DETAILS -> VolumeViewHolder(
                ItemVolumeMangaDetailsBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.USER -> UserViewHolder(
                ItemUserBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.FOLLOWERS -> FollowViewHolder(
                ItemFollowBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.FOLLOWING -> FollowViewHolder(
                ItemFollowBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.PEOPLE_DISCOVER -> PeopleViewHolder(
                ItemPeopleDiscoverBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.STAFF_PEOPLE -> StaffViewHolder(
                ItemStaffPeopleBinding.inflate(
                    LayoutInflater.from(
                        parent.context
                    ), parent, false
                )
            )

            Type.LOAD_MORE -> LoadMoreViewHolder(
                ItemLoadMoreBinding.inflate(
                    LayoutInflater.from(
                        parent.context
                    ), parent, false
                )
            )

            Type.HEADER_LIBRARY_STATUS -> HeaderViewHolder(
                ItemLibraryStatusBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.ANIME_ENTRY_TO_WATCH -> AnimeEntryViewHolder(
                ItemAgendaAnimeBinding.inflate(
                    LayoutInflater.from(parent.context),
                    parent,
                    false
                )
            )

            Type.MANGA_ENTRY_TO_READ -> MangaEntryViewHolder(
                ItemAgendaMangaBinding.inflate(
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
            is AdViewHolder -> holder.setVhAd(items[position] as Ad)
            is AnimeViewHolder -> holder.setVhAnime(items[position] as Anime)
            is AnimeEntryViewHolder -> holder.setVhAnimeEntry(items[position] as AnimeEntry)
            is EpisodeViewHolder -> holder.setVhEpisode(items[position] as Episode)
            is FollowViewHolder -> holder.setVhFollow(items[position] as Follow)
            is FranchiseViewHolder -> holder.setVhFranchise(items[position] as Franchise)
            is MangaViewHolder -> holder.setVhManga(items[position] as Manga)
            is MangaEntryViewHolder -> holder.setVhMangaEntry(items[position] as MangaEntry)
            is PeopleViewHolder -> holder.setVhPeople(items[position] as People)
            is ReviewViewHolder -> holder.setVhReview(items[position] as Review)
            is SeasonViewHolder -> holder.setVhSeason(items[position] as Season)
            is StaffViewHolder -> holder.setVhStaff(items[position] as Staff)
            is HeaderViewHolder -> holder.setVhStatusHeader(items[position] as Header)
            is UserViewHolder -> holder.setVhUser(items[position] as User)
            is UserStatsViewHolder -> holder.setVhUserStats(items[position] as User.Stats)
            is VolumeViewHolder -> holder.setVhVolume(items[position] as Volume)
        }
    }

    override fun getItemCount(): Int = items.size + when {
        onLoadMoreListener != null -> 1
        else -> 0
    }

    override fun getItemViewType(position: Int): Int = items.getOrNull(position)?.itemType?.ordinal
        ?: Type.LOAD_MORE.ordinal


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