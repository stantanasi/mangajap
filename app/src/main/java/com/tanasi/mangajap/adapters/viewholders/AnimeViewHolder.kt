package com.tanasi.mangajap.adapters.viewholders

import android.content.Context
import android.content.Intent
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.view.LayoutInflater
import android.view.View
import android.widget.AdapterView
import android.widget.AdapterView.OnItemSelectedListener
import androidx.core.content.ContextCompat
import androidx.navigation.Navigation
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.squareup.picasso.Callback
import com.squareup.picasso.MemoryPolicy
import com.squareup.picasso.NetworkPolicy
import com.squareup.picasso.Picasso
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.adapters.SpinnerAdapter
import com.tanasi.mangajap.databinding.*
import com.tanasi.mangajap.fragments.anime.AnimeFragment
import com.tanasi.mangajap.fragments.anime.AnimeFragmentDirections
import com.tanasi.mangajap.fragments.discover.DiscoverFragment
import com.tanasi.mangajap.fragments.discover.DiscoverFragmentDirections
import com.tanasi.mangajap.fragments.reviews.ReviewsFragment
import com.tanasi.mangajap.fragments.search.SearchFragment
import com.tanasi.mangajap.models.Anime
import com.tanasi.mangajap.models.AnimeEntry
import com.tanasi.mangajap.models.Request
import com.tanasi.mangajap.models.User
import com.tanasi.mangajap.ui.SpacingItemDecoration
import com.tanasi.mangajap.ui.dialog.EditTextDialog
import com.tanasi.mangajap.ui.dialog.MediaEntryDateDialog
import com.tanasi.mangajap.ui.dialog.MediaEntryProgressionDialog
import com.tanasi.mangajap.ui.dialog.NumberPickerDialog
import com.tanasi.mangajap.utils.extensions.*
import java.lang.Exception
import java.text.DecimalFormat
import java.util.*

class AnimeViewHolder(
        private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
        _binding.root
) {

    private val context: Context = itemView.context
    private lateinit var anime: Anime

    fun bind(anime: Anime) {
        this.anime = anime
        when (_binding) {
            is ItemMediaSearchBinding -> displaySearch(_binding)
            is ItemMediaSearchAddBinding -> displaySearchAdd(_binding)
            is ItemMediaDiscoverBinding -> displayTrending(_binding)

            is ItemAnimeHeaderBinding -> displayHeader(_binding)
            is ItemAnimeSummaryBinding -> displaySummary(_binding)
            is ItemAnimeProgressionBinding -> displayProgression(_binding)
            is ItemAnimeReviewsBinding -> displayReviews(_binding)
            is ItemAnimeFranchisesBinding -> displayFranchises(_binding)
        }
    }

    private fun createAnimeEntry(animeEntry: AnimeEntry) {
        when (val fragment = context.toActivity()?.getCurrentFragment()) {
            is SearchFragment -> fragment.animeFragment.saveAnimeEntry(anime, animeEntry)
            is DiscoverFragment -> fragment.viewModel.saveAnimeEntry(anime, animeEntry)
        }
    }

    private fun updateAnimeEntry(animeEntry: AnimeEntry) {
        when (val fragment = context.toActivity()?.getCurrentFragment()) {
            is AnimeFragment -> fragment.viewModel.saveAnimeEntry(animeEntry)
            is SearchFragment -> fragment.animeFragment.saveAnimeEntry(anime, animeEntry)
            is DiscoverFragment -> fragment.viewModel.saveAnimeEntry(anime, animeEntry)
        }
    }

    private fun createAnimeRequest(request: Request) {
        when (val fragment = context.toActivity()?.getCurrentFragment()) {
            is SearchFragment -> fragment.animeFragment.saveRequest(request)
        }
    }

    private fun displaySearch(binding: ItemMediaSearchBinding) {
        binding.root.setOnClickListener {
//            Navigation.findNavController(binding.root).navigate(
//                    SearchFragmentDirections.actionSearchToAnime(
//                            anime.id,
//                            anime.title
//                    )
//            )
        }

        binding.ivSearchMediaCover.apply {
            Picasso.get()
                    .load(anime.coverImage)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .into(this)
        }

        binding.tvSearchMediaTitle.text = anime.title

        binding.tvSearchMediaType.text = anime.animeType?.stringId?.let { context.resources.getString(it) }

        binding.tvSearchMediaUserCount.text = context.resources.getString(R.string.userCount, anime.userCount)

        binding.cbSearchMediaIsAdd.apply {
            isChecked = anime.animeEntry?.isAdd ?: false
            setOnClickListener {
                anime.animeEntry?.let { animeEntry ->
                    updateAnimeEntry(animeEntry.also {
                        it.isAdd = isChecked
                    })
                } ?: createAnimeEntry(AnimeEntry().also {
                    it.isAdd = isChecked
                    it.status = AnimeEntry.Status.WATCHING
                    it.user = User(id = Firebase.auth.uid)
                    it.anime = anime
                })
            }
        }
    }

    private fun displaySearchAdd(binding: ItemMediaSearchAddBinding) {
        binding.root.setOnClickListener {
            val query = ""

            EditTextDialog(
                    context,
                    context.getString(R.string.propose_anime),
                    context.getString(R.string.anime_title),
                    query
            ) { dialog, _, text ->
                createAnimeRequest(Request().also {
                    it.requestType = Request.RequestType.ANIME
                    it.data = text
                    it.user = User(id = Firebase.auth.uid)
                })
                dialog.dismiss()
            }.show()
        }

        binding.tvSearchAddTitle.text = context.getString(R.string.propose_anime)

        binding.tvSearchAddSubtitle.text = context.getString(R.string.propose_anime_summary)
    }

    private fun displayTrending(binding: ItemMediaDiscoverBinding) {
        binding.root.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                    DiscoverFragmentDirections.actionDiscoverToAnime(
                            anime.id,
                            anime.title
                    )
            )
        }

        binding.ivTrendingMediaCover.apply {
            Picasso.get()
                    .load(anime.coverImage)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .into(this, object : Callback {
                        override fun onSuccess() {
                            binding.tvTrendingMediaTitlePlaceholder.visibility = View.GONE
                        }

                        override fun onError(e: Exception?) {
                            binding.tvTrendingMediaTitlePlaceholder.visibility = View.VISIBLE
                        }
                    })
        }

        binding.tvTrendingMediaTitlePlaceholder.text = anime.title

        binding.cbTrendingMediaIsAdd.apply {
            isChecked = anime.animeEntry?.isAdd ?: false
            visibility = if (anime.animeEntry?.isAdd == true) View.GONE else View.VISIBLE
            setOnClickListener {
                anime.animeEntry?.let { animeEntry ->
                    updateAnimeEntry(animeEntry.also {
                        it.isAdd = isChecked
                    })
                } ?: createAnimeEntry(AnimeEntry().also {
                    it.isAdd = isChecked
                    it.status = AnimeEntry.Status.WATCHING
                    it.user = User(id = Firebase.auth.uid)
                    it.anime = anime
                })
            }
        }

        binding.pbTrendingMediaProgress.apply {
            anime.animeEntry?.let { animeEntry ->
                visibility = View.VISIBLE
                progress = animeEntry.getProgress(anime)
                progressTintList = ContextCompat.getColorStateList(context, animeEntry.getProgressColor(anime))
            } ?: let {
                visibility = View.GONE
            }
        }
    }

    private fun displayHeader(binding: ItemAnimeHeaderBinding) {
        binding.ivAnimeBanner.apply {
            Picasso.get()
                    .load(anime.bannerImage ?: anime.coverImage)
                    .networkPolicy(NetworkPolicy.NO_CACHE)
                    .memoryPolicy(MemoryPolicy.NO_CACHE)
                    .into(this)
            setOnClickListener {
                Navigation.findNavController(binding.root).navigate(
                        AnimeFragmentDirections.actionAnimeToImage(
                                anime.bannerImage ?: anime.coverImage ?: ""
                        )
                )
            }
        }

        binding.ivAnimeCover.apply {
            Picasso.get()
                .load(anime.coverImage)
                .into(this)

            setOnClickListener {
                Navigation.findNavController(binding.root).navigate(
                        AnimeFragmentDirections.actionAnimeToImage(
                                anime.coverImage ?: ""
                        )
                )
            }
        }

        binding.tvAnimeTitle.text = anime.title

        binding.tvAnimeReleaseDate.text = anime.startDate?.format("dd MMMM yyyy") ?: "-"

        binding.tvAnimeType.text = anime.animeType?.stringId?.let { context.resources.getString(it) }
    }

    private fun displaySummary(binding: ItemAnimeSummaryBinding) {
        binding.tvAnimeSummarySubtitle.apply {
            text = context.getString(R.string.anime_metadata,
                    anime.startDate?.format("yyyy"),
                    anime.endDate?.format("yyyy") ?: context.getString(anime.status.stringId),
                    anime.origin?.getDisplayCountry(context.locale()))
        }

        binding.tvAnimeSummaryRating.text = anime.averageRating?.let { DecimalFormat("#.#").format(it / 20.0 * 5) + " / 5" } ?: "- / 5"


        fun readMoreSynopsis(readMore: Boolean) {
            binding.tvAnimeSummarySynopsis.maxLines = when (readMore) {
                false -> AnimeFragment.ANIME_SYNOPSIS_MAX_LINES
                true -> Int.MAX_VALUE
            }

            binding.vAnimeSummarySynopsisGradient.visibility = when (readMore) {
                false -> View.VISIBLE
                true -> View.GONE
            }

            binding.tvAnimeSummarySynopsisReadMore.visibility = when (readMore) {
                false -> View.VISIBLE
                true -> View.GONE
            }
        }
        readMoreSynopsis(false)

        binding.tvAnimeSummarySynopsis.text = anime.synopsis

        binding.tvAnimeSummarySynopsisReadMore.setOnClickListener {
            readMoreSynopsis(true)
        }

        binding.tvAnimeSummaryRank.text = context.getString(R.string.anime_rating, (anime.ratingRank ?: ""))

        binding.ivAnimeSummaryTrailer.apply {
            clipToOutline = true
            Picasso.get()
                    .load("http://img.youtube.com/vi/${anime.youtubeVideoId}/0.jpg")
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .networkPolicy(NetworkPolicy.NO_CACHE)
                    .memoryPolicy(MemoryPolicy.NO_CACHE)
                    .into(this)
            setOnClickListener {
                context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://www.youtube.com/watch?v=${anime.youtubeVideoId}")))
            }
        }

        binding.tvAnimeSummarySeasonCount.text = when (anime.status) {
            Anime.Status.AIRING -> context.resources.getString(R.string.approximatelySeasonCount, anime.seasonCount)
            else -> context.resources.getString(R.string.seasonCount, anime.seasonCount)
        }

        binding.tvAnimeSummaryEpisodeCount.text = when (anime.status) {
            Anime.Status.AIRING -> context.resources.getString(R.string.approximatelyEpisodeCount, anime.episodeCount)
            else -> context.resources.getString(R.string.episodeCount, anime.episodeCount)
        }

        binding.tvAnimeSummaryUserCount.text = context.resources.getString(R.string.animeUserCount, anime.userCount)
    }

    private fun displayProgression(binding: ItemAnimeProgressionBinding) {
        binding.spinnerAnimeProgressionStatus.apply {
            (background as GradientDrawable).setStroke(1.dpToPx(context), ContextCompat.getColor(context, anime.animeEntry?.getProgressColor(anime) ?: AnimeEntry.Status.WATCHING.colorId))

            adapter = SpinnerAdapter(
                context,
                AnimeEntry.Status.values().asList(),
            ).apply {
                onView = { position, context, parent ->
                    ItemSpinnerMediaStatusBinding.inflate(LayoutInflater.from(context), parent, false).also {
                        it.root.text = context.getString(AnimeEntry.Status.values()[position].stringId)
                        it.root.setTextColor(ContextCompat.getColor(context, anime.animeEntry?.getProgressColor(anime) ?: AnimeEntry.Status.WATCHING.colorId))
                    }.root
                }
                onBind = { position, context, parent ->
                    ItemSpinnerDropdownMediaStatusBinding.inflate(LayoutInflater.from(context), parent, false).also {
                        it.root.text = context.getString(AnimeEntry.Status.values()[position].stringId)
                        it.root.setTextColor(ContextCompat.getColor(context, AnimeEntry.Status.values()[position].colorId))
                    }.root
                }
            }

            onItemSelectedListener = object : OnItemSelectedListener {
                override fun onItemSelected(parent: AdapterView<*>?, view: View, position: Int, id: Long) {
                    anime.animeEntry?.let { animeEntry ->
                        if (AnimeEntry.Status.values()[position] != animeEntry.status) {
                            updateAnimeEntry(animeEntry.also {
                                it.status = AnimeEntry.Status.values()[position]
                                when (AnimeEntry.Status.values()[position]) {
                                    AnimeEntry.Status.WATCHING ->
                                        if (animeEntry.startedAt == null) it.startedAt = Calendar.getInstance()
                                    AnimeEntry.Status.COMPLETED,
                                    AnimeEntry.Status.ON_HOLD,
                                    AnimeEntry.Status.DROPPED ->
                                        if (animeEntry.finishedAt == null) it.finishedAt = Calendar.getInstance()
                                    else -> {}
                                }
                            })
                        }
                    }
                }

                override fun onNothingSelected(parent: AdapterView<*>?) {}
            }
            setSelection(anime.animeEntry?.status?.ordinal ?: 0)
        }

        binding.tvAnimeProgressionSubtitle.apply {
            val startedAt = anime.animeEntry?.startedAt?.format("dd MMMM yyyy") ?: "-"
            val finishedAt = anime.animeEntry?.finishedAt?.format("dd MMMM yyyy") ?: "-"

            visibility = when (anime.animeEntry?.status) {
                AnimeEntry.Status.PLANNED -> View.GONE
                else -> View.VISIBLE
            }
            text = when (anime.animeEntry?.status) {
                AnimeEntry.Status.WATCHING -> context.resources.getString(R.string.SinceThe, startedAt)
                AnimeEntry.Status.COMPLETED -> context.resources.getString(R.string.CompletedSinceThe, finishedAt)
                AnimeEntry.Status.ON_HOLD -> context.resources.getString(R.string.OnHoldSinceThe, finishedAt)
                AnimeEntry.Status.DROPPED -> context.resources.getString(R.string.DroppedSinceThe, finishedAt)
                else -> ""
            }
            setOnClickListener {
                MediaEntryDateDialog(
                        context,
                        context.getString(R.string.progression),
                        anime.animeEntry?.startedAt,
                        anime.animeEntry?.finishedAt
                ) { startedAt, finishedAt ->
                    anime.animeEntry?.let {
                        it.startedAt = startedAt
                        it.finishedAt = finishedAt
                        updateAnimeEntry(it)
                    }
                }.show()
            }
        }

        binding.spinnerAnimeProgressionSelectSeason.apply {
            adapter = SpinnerAdapter(context, anime.seasons.map { context.getString(R.string.seasonNumber, it.number) })
            onItemSelectedListener = object : OnItemSelectedListener {
                override fun onItemSelected(parent: AdapterView<*>?, view: View, position: Int, id: Long) {
                    val season = anime.seasons[position]
                    binding.tvAnimeProgressionSeasonEpisodeWatched.text = season.episodeWatched.toString()
                    binding.tvAnimeProgressionSeasonEpisodeCount.text = context.resources.getString(R.string.EpisodesWatch, season.episodeCount)
                    binding.vAnimeProgressionSeasonEpisode.setOnClickListener {
                        MediaEntryProgressionDialog(
                                context,
                                context.getString(R.string.episodes_watched),
                                season.episodeWatched
                        ) { value ->
                            anime.animeEntry?.let { animeEntry ->
                                animeEntry.episodesWatch = (value + anime.seasons.map { if (it.number < season.number) it.episodeCount else 0 }.sum())
                                updateAnimeEntry(animeEntry)
                            }
                        }.show()
                    }
                }

                override fun onNothingSelected(parent: AdapterView<*>?) {}
            }
            setSelection(anime.seasons.indexOfFirst { season ->
                season.episodeWatched < season.episodeCount || season.episodeWatched > season.episodeCount
            })
        }

        binding.tvAnimeProgressionRating.apply {
            text = "${anime.animeEntry?.rating ?: "-"} / 20"
            setOnClickListener {
                NumberPickerDialog(
                        context,
                        context.getString(R.string.score),
                        0,
                        20,
                        anime.animeEntry?.rating
                ) { value ->
                    anime.animeEntry?.let {
                        it.rating = value
                        updateAnimeEntry(it)
                    }
                }.show()
            }
        }

        binding.ivAnimeProgressionDeleteRating.setOnClickListener {
            anime.animeEntry?.let {
                it.rating = null
                updateAnimeEntry(it)
            }
        }

        binding.ivAnimeProgressionIsFavorites.apply {
            when (anime.animeEntry?.isFavorites) {
                true -> setImageResource(R.drawable.ic_favorite_black_24dp)
                else -> setImageResource(R.drawable.ic_favorite_border_black_24dp)
            }
            setOnClickListener {
                anime.animeEntry?.let {
                    it.isFavorites = !it.isFavorites
                    updateAnimeEntry(it)
                }
            }
        }
    }

    private fun displayReviews(binding: ItemAnimeReviewsBinding) {
        binding.root.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                    AnimeFragmentDirections.actionAnimeToReviews(
                            ReviewsFragment.ReviewsType.Anime,
                            anime.id,
                            anime.title
                    )
            )
        }

        binding.tvAnimeReviewCount.text = anime.reviewCount.toString()
    }

    private fun displayFranchises(binding: ItemAnimeFranchisesBinding) {
        binding.rvAnimeFranchises.apply {
            adapter = AppAdapter().apply {
                submitList(anime.franchises)
            }
            addItemDecoration(SpacingItemDecoration(
                spacing = (resources.getDimension(R.dimen.anime_spacing) * 0.5).toInt()
            ))
        }
    }
}