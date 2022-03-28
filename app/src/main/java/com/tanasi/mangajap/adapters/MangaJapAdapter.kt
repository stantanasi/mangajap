package com.tanasi.mangajap.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.tanasi.mangajap.adapters.viewHolders.*
import com.tanasi.mangajap.databinding.*
import com.tanasi.mangajap.models.*

class MangaJapAdapter(
        private val items: List<Item>
) : RecyclerView.Adapter<RecyclerView.ViewHolder>() {

    interface Item {
        var typeLayout: Type
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

        HEADER_AGENDA,
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

    private var onLoadMoreListener: (() -> Unit)? = null

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder = when (Type.values()[viewType]) {
        Type.AD_DISCOVER -> VhAd(ItemAdDiscoverBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.AD_PROFILE -> VhAd(ItemAdProfileBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.AD_SEARCH -> VhAd(ItemAdSearchBinding.inflate(LayoutInflater.from(parent.context), parent, false))

        Type.ANIME_SEARCH -> VhAnime(ItemMediaSearchBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.ANIME_SEARCH_ADD -> VhAnime(ItemMediaSearchAddBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.ANIME_HEADER -> VhAnime(ItemAnimeHeaderBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.ANIME_SUMMARY -> VhAnime(ItemAnimeSummaryBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.ANIME_PROGRESSION -> VhAnime(ItemAnimeProgressionBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.ANIME_REVIEWS -> VhAnime(ItemAnimeReviewsBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.ANIME_FRANCHISES -> VhAnime(ItemAnimeFranchisesBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.ANIME_DISCOVER -> VhAnime(ItemMediaTrendingBinding.inflate(LayoutInflater.from(parent.context), parent, false))

        Type.ANIME_ENTRY_LIBRARY -> VhAnimeEntry(ItemMediaLibraryBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.ANIME_ENTRY_PREVIEW -> VhAnimeEntry(ItemMediaProfilePreviewBinding.inflate(LayoutInflater.from(parent.context), parent, false))

        Type.SEASON_ANIME_HEADER -> VhSeason(ItemSeasonAnimeHeaderBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.SEASON_ANIME -> VhSeason(ItemSeasonAnimeBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.EPISODE_ANIME -> VhEpisode(ItemEpisodeAnimeBinding.inflate(LayoutInflater.from(parent.context), parent, false))

        Type.FRANCHISE -> VhFranchise(ItemFranchiseBinding.inflate(LayoutInflater.from(parent.context), parent, false))

        Type.MANGA_SEARCH -> VhManga(ItemMediaSearchBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.MANGA_SEARCH_ADD -> VhManga(ItemMediaSearchAddBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.MANGA_HEADER -> VhManga(ItemMangaHeaderBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.MANGA_HEADER_SUMMARY -> VhManga(ItemMangaSummaryBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.MANGA_HEADER_PROGRESSION -> VhManga(ItemMangaProgressionBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.MANGA_HEADER_REVIEWS -> VhManga(ItemMangaReviewsBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.MANGA_HEADER_FRANCHISES -> VhManga(ItemMangaFranchisesBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.MANGA_DISCOVER -> VhManga(ItemMediaTrendingBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.MANGA_ENTRY_LIBRARY -> VhMangaEntry(ItemMediaLibraryBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.MANGA_ENTRY_PREVIEW -> VhMangaEntry(ItemMediaProfilePreviewBinding.inflate(LayoutInflater.from(parent.context), parent, false))

        Type.REVIEW_HEADER -> VhReview(ItemReviewHeaderBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.REVIEW -> VhReview(ItemReviewBinding.inflate(LayoutInflater.from(parent.context), parent, false))


        Type.STATS_PREVIEW_MANGA_FOLLOWED,
        Type.STATS_PREVIEW_MANGA_VOLUMES,
        Type.STATS_PREVIEW_MANGA_CHAPTERS,
        Type.STATS_PREVIEW_ANIME_FOLLOWED,
        Type.STATS_PREVIEW_ANIME_EPISODES -> VhUserStats(ItemStatsPreviewBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.STATS_PREVIEW_ANIME_TIME_SPENT -> VhUserStats(ItemStatsTimeSpentPreviewBinding.inflate(LayoutInflater.from(parent.context), parent, false))

        Type.VOLUME_MANGA -> VhVolume(ItemVolumeMangaBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.VOLUME_MANGA_DETAILS -> VhVolume(ItemVolumeMangaDetailsBinding.inflate(LayoutInflater.from(parent.context), parent, false))

        Type.USER -> VhUser(ItemUserBinding.inflate(LayoutInflater.from(parent.context), parent, false))

        Type.FOLLOWERS -> VhFollow(ItemFollowBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.FOLLOWING -> VhFollow(ItemFollowBinding.inflate(LayoutInflater.from(parent.context), parent, false))

        Type.PEOPLE_DISCOVER -> VhPeople(ItemPeopleDiscoverBinding.inflate(LayoutInflater.from(parent.context), parent, false))

        Type.STAFF_PEOPLE -> VhStaff(ItemStaffPeopleBinding.inflate(LayoutInflater.from(parent.context), parent, false))

        Type.LOAD_MORE -> VhLoadMore(ItemLoadMoreBinding.inflate(LayoutInflater.from(parent.context), parent, false))

        Type.HEADER_AGENDA -> VhHeader(ItemAgendaHeaderBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.HEADER_LIBRARY_STATUS -> VhHeader(ItemLibraryStatusBinding.inflate(LayoutInflater.from(parent.context), parent, false))

        Type.ANIME_ENTRY_TO_WATCH -> VhAnimeEntry(ItemAnimeToWatchBinding.inflate(LayoutInflater.from(parent.context), parent, false))
        Type.MANGA_ENTRY_TO_READ -> VhMangaEntry(ItemMangaToReadBinding.inflate(LayoutInflater.from(parent.context), parent, false))
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        onLoadMoreListener?.let { onLoadMoreListener ->
            when (val loadMore = items.last()) {
                is LoadMore -> {
                    if (position >= itemCount - 3 && !loadMore.isLoading && loadMore.isMoreDataAvailable) {
                        onLoadMoreListener()
                        loadMore.isLoading = true
                    }
                }
            }
        }

        when (holder) {
            is VhAd -> holder.setVhAd(items[position] as Ad)
            is VhAnime -> holder.setVhAnime(items[position] as Anime)
            is VhAnimeEntry -> holder.setVhAnimeEntry(items[position] as AnimeEntry)
            is VhEpisode -> holder.setVhEpisode(items[position] as Episode)
            is VhFollow -> holder.setVhFollow(items[position] as Follow)
            is VhFranchise -> holder.setVhFranchise(items[position] as Franchise)
            is VhLoadMore -> holder.setLoadMore(items[position] as LoadMore)
            is VhManga -> holder.setVhManga(items[position] as Manga)
            is VhMangaEntry -> holder.setVhMangaEntry(items[position] as MangaEntry)
            is VhPeople -> holder.setVhPeople(items[position] as People)
            is VhReview -> holder.setVhReview(items[position] as Review)
            is VhSeason -> holder.setVhSeason(items[position] as Season)
            is VhStaff -> holder.setVhStaff(items[position] as Staff)
            is VhHeader -> holder.setVhStatusHeader(items[position] as Header)
            is VhUser -> holder.setVhUser(items[position] as User)
            is VhUserStats -> holder.setVhUserStats(items[position] as User.Stats)
            is VhVolume -> holder.setVhVolume(items[position] as Volume)
        }
    }

    override fun getItemCount(): Int = items.size

    override fun getItemViewType(position: Int): Int = items[position].typeLayout.ordinal


    fun setOnLoadMoreListener(onLoadMoreListener: () -> Unit) {
        this.onLoadMoreListener = onLoadMoreListener
    }
}