package com.tanasi.mangajap.adapters.viewHolders

import android.content.Context
import android.content.Intent
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.view.View
import android.widget.AdapterView
import android.widget.AdapterView.OnItemSelectedListener
import android.widget.ArrayAdapter
import androidx.core.content.ContextCompat
import androidx.navigation.Navigation
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.squareup.picasso.MemoryPolicy
import com.squareup.picasso.NetworkPolicy
import com.squareup.picasso.Picasso
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.MainActivity
import com.tanasi.mangajap.databinding.*
import com.tanasi.mangajap.fragments.anime.AnimeFragment
import com.tanasi.mangajap.fragments.anime.AnimeFragmentDirections
import com.tanasi.mangajap.fragments.discover.DiscoverFragment
import com.tanasi.mangajap.fragments.discover.DiscoverFragmentDirections
import com.tanasi.mangajap.fragments.reviews.ReviewsFragment
import com.tanasi.mangajap.fragments.search.SearchFragment
import com.tanasi.mangajap.fragments.search.SearchFragmentDirections
import com.tanasi.mangajap.models.Anime
import com.tanasi.mangajap.models.AnimeEntry
import com.tanasi.mangajap.models.Request
import com.tanasi.mangajap.models.User
import com.tanasi.mangajap.ui.dialog.*
import com.tanasi.mangajap.utils.extensions.dpToPx
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.getCurrentFragment
import com.tanasi.mangajap.utils.extensions.locale
import com.tanasi.mangajap.utils.preferences.UserPreference
import java.text.DecimalFormat
import java.util.*

class VhAnime(
        private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
        _binding.root
) {

    private val context: Context = itemView.context
    private lateinit var anime: Anime

    fun setVhAnime(anime: Anime) {
        this.anime = anime
        when (_binding) {
            is ItemMediaSearchBinding -> displaySearch(_binding)
            is ItemMediaSearchAddBinding -> displaySearchAdd(_binding)
            is ItemMediaTrendingBinding -> displayTrending(_binding)

            is ItemAnimeHeaderBinding -> displayHeader(_binding)
            is ItemAnimeSummaryBinding -> displaySummary(_binding)
            is ItemAnimeProgressionBinding -> displayProgression(_binding)
            is ItemAnimeReviewsBinding -> displayReviews(_binding)
        }
    }

    private fun createAnimeEntry(animeEntry: AnimeEntry) {
        if (context is MainActivity) {
            when (val fragment = context.getCurrentFragment()) {
                is SearchFragment -> fragment.viewModel.createAnimeEntry(anime, animeEntry)
                is DiscoverFragment -> fragment.viewModel.createAnimeEntry(anime, animeEntry)
            }
        }
    }

    private fun updateAnimeEntry(animeEntry: AnimeEntry) {
        if (context is MainActivity) {
            when (val fragment = context.getCurrentFragment()) {
                is AnimeFragment -> fragment.viewModel.updateAnimeEntry(animeEntry)
                is SearchFragment -> fragment.viewModel.updateAnimeEntry(anime, animeEntry)
                is DiscoverFragment -> fragment.viewModel.updateAnimeEntry(anime, animeEntry)
            }
        }
    }

    private fun createAnimeRequest(request: Request) {
        if (context is MainActivity) {
            when (val fragment = context.getCurrentFragment()) {
                is SearchFragment -> fragment.viewModel.createRequest(request)
            }
        }
    }

    private fun displaySearch(binding: ItemMediaSearchBinding) {
        binding.media.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                    SearchFragmentDirections.actionSearchToAnime(
                            anime.id,
                            anime.canonicalTitle
                    )
            )
        }

        binding.mediaCoverImageView.apply {
            Picasso.get()
                    .load(anime.coverImage)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .into(this)
        }

        binding.mediaTitleTextView.text = anime.canonicalTitle

        binding.mediaTypeTextView.text = anime.animeType?.stringId?.let { context.resources.getString(it) }

        binding.mediaMembersTextView.text = context.resources.getString(R.string.userCount, anime.userCount)

        binding.mediaIsAddCheckBox.apply {
            isChecked = anime.animeEntry?.isAdd ?: false
            setOnClickListener {
                anime.animeEntry?.let { animeEntry ->
                    updateAnimeEntry(animeEntry.also {
                        it.putAdd(isChecked)
                    })
                } ?: createAnimeEntry(AnimeEntry().also {
                    it.putAdd(isChecked)
                    it.putStatus(AnimeEntry.Status.watching)
                    it.putUser(User().apply { id = UserPreference(context).selfId })
                    it.putAnime(anime)
                })
            }
        }
    }

    private fun displaySearchAdd(binding: ItemMediaSearchAddBinding) {
        binding.media.setOnClickListener {
            var query = ""
            if (context is MainActivity && context.getCurrentFragment() is SearchFragment) {
                when (val fragment = context.getCurrentFragment()) {
                    is SearchFragment -> query = fragment.query
                }
            }

            EditTextDialog(
                    context,
                    context.getString(R.string.propose_anime),
                    context.getString(R.string.anime_title),
                    query
            ) { dialog, _, text ->
                createAnimeRequest(Request().also {
                    it.putRequestType(Request.RequestType.anime)
                    it.putData(text)
                    it.putUser(User().apply { id = UserPreference(context).selfId })
                })
                dialog.dismiss()
            }.show()
        }

        binding.tvMediaTitle.text = context.getString(R.string.propose_anime)

        binding.tvMediaSubtitle.text = context.getString(R.string.propose_anime_summary)
    }

    private fun displayTrending(binding: ItemMediaTrendingBinding) {
        binding.media.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                    DiscoverFragmentDirections.actionDiscoverToAnime(
                            anime.id,
                            anime.canonicalTitle
                    )
            )
        }

        binding.mediaCoverImageView.apply {
            Picasso.get()
                    .load(anime.coverImage)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .into(this)
        }

        binding.mediaIsAddCheckBox.apply {
            isChecked = anime.animeEntry?.isAdd ?: false
            visibility = if (anime.animeEntry?.isAdd == true) View.GONE else View.VISIBLE
            setOnClickListener {
                anime.animeEntry?.let { animeEntry ->
                    updateAnimeEntry(animeEntry.also {
                        it.putAdd(isChecked)
                    })
                } ?: createAnimeEntry(AnimeEntry().also {
                    it.putAdd(isChecked)
                    it.putStatus(AnimeEntry.Status.watching)
                    it.putUser(User().apply { id = UserPreference(context).selfId })
                    it.putAnime(anime)
                })
            }
        }

        binding.mediaProgressProgressBar.apply {
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
        binding.animeBannerImageView.apply {
            Picasso.get()
                    .load(anime.bannerImage ?: anime.coverImage)
                    .networkPolicy(NetworkPolicy.NO_CACHE)
                    .memoryPolicy(MemoryPolicy.NO_CACHE)
                    .into(this)
            setOnClickListener {
                Navigation.findNavController(binding.root).navigate(
                        AnimeFragmentDirections.actionAnimeToImage(
                                anime.bannerImage ?: anime.coverImage!!
                        )
                )
            }
        }

        binding.animeCoverImageView.apply {
            Picasso.get().load(anime.coverImage).into(this)
            setOnClickListener {
                Navigation.findNavController(binding.root).navigate(
                        AnimeFragmentDirections.actionAnimeToImage(
                                anime.coverImage!!
                        )
                )
            }
        }

        binding.animeTitleTextView.text = anime.canonicalTitle

        binding.animeReleaseDateTextView.text = anime.startDate?.format("dd MMMM yyyy") ?: "-"

        binding.animeTypeTextView.text = anime.animeType?.stringId?.let { context.resources.getString(it) }
    }

    private fun displaySummary(binding: ItemAnimeSummaryBinding) {
        binding.animeSummarySubtitleTextView.apply {
            text = context.getString(R.string.anime_metadata,
                    anime.startDate?.format("yyyy"),
                    anime.endDate?.format("yyyy") ?: context.getString(anime.status.stringId),
                    anime.origin?.getDisplayCountry(context.locale()))
        }

        binding.animeRatingTextView.text = anime.averageRating?.let { DecimalFormat("#.#").format(it / 20.0 * 5) + " / 5" } ?: "- / 5"

        binding.animeSynopsisTextView.apply {
            text = anime.synopsis
            maxLines = AnimeFragment.ANIME_SYNOPSIS_MAX_LINES
        }

        binding.animeReadMore.apply {
            visibility = View.VISIBLE
            setOnClickListener {
                binding.animeSynopsisTextView.maxLines = Int.MAX_VALUE
                visibility = View.GONE
            }
        }

        binding.animeRankedTextView.text = context.getString(R.string.anime_rating, (anime.ratingRank ?: ""))

        binding.animeTrailerImageView.apply {
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

        binding.animeSeasonCountTextView.text = when (anime.status) {
            Anime.Status.airing -> context.resources.getString(R.string.approximatelySeasonCount, anime.seasonCount)
            else -> context.resources.getString(R.string.seasonCount, anime.seasonCount)
        }

        binding.animeEpisodeCountTextView.text = when (anime.status) {
            Anime.Status.airing -> context.resources.getString(R.string.approximatelyEpisodeCount, anime.episodeCount)
            else -> context.resources.getString(R.string.episodeCount, anime.episodeCount)
        }

        binding.animeUserCountTextView.text = context.resources.getString(R.string.animeUserCount, anime.userCount)
    }

    private fun displayProgression(binding: ItemAnimeProgressionBinding) {
        // TODO: faire du bouton status un spinner
        binding.animeEntryStatusTextView.apply {
            (background as GradientDrawable).setStroke(context.dpToPx(1), ContextCompat.getColor(context, anime.animeEntry!!.getProgressColor(anime)))
            setTextColor(ContextCompat.getColor(context, anime.animeEntry!!.getProgressColor(anime)))
            text = context.resources.getString(anime.animeEntry!!.status.stringId)
            setOnClickListener {
                RadioGroupDialog(
                        context,
                        context.getString(R.string.status),
                        context.getString(anime.animeEntry!!.status.stringId),
                        AnimeEntry.Status.values().map { context.getString(it.stringId) }
                ) { position ->
                    anime.animeEntry?.let { animeEntry ->
                        updateAnimeEntry(animeEntry.apply {
                            putStatus(AnimeEntry.Status.values()[position])
                            when (AnimeEntry.Status.values()[position]) {
                                AnimeEntry.Status.watching -> if (animeEntry.startedAt == null) putStartedAt(Calendar.getInstance())
                                AnimeEntry.Status.completed,
                                AnimeEntry.Status.on_hold,
                                AnimeEntry.Status.dropped -> if (animeEntry.finishedAt == null) putFinishedAt(Calendar.getInstance())
                                else -> {}
                            }
                        })
                    }
                }.show()
            }
        }

        binding.animeEntryDateTextView.apply {
            val startedAt = anime.animeEntry?.startedAt?.format("dd MMMM yyyy") ?: "-"
            val finishedAt = anime.animeEntry?.finishedAt?.format("dd MMMM yyyy") ?: "-"

            visibility = when (anime.animeEntry!!.status) {
                AnimeEntry.Status.planned -> View.GONE
                else -> View.VISIBLE
            }
            text = when (anime.animeEntry!!.status) {
                AnimeEntry.Status.watching -> context.resources.getString(R.string.SinceThe, startedAt)
                AnimeEntry.Status.completed -> context.resources.getString(R.string.CompletedSinceThe, finishedAt)
                AnimeEntry.Status.on_hold -> context.resources.getString(R.string.OnHoldSinceThe, finishedAt)
                AnimeEntry.Status.dropped -> context.resources.getString(R.string.DroppedSinceThe, finishedAt)
                else -> ""
            }
            setOnClickListener {
                MediaEntryDateDialog(
                        context,
                        context.getString(R.string.progression),
                        anime.animeEntry?.startedAt,
                        anime.animeEntry?.finishedAt
                ) { startedAt, finishedAt ->
                    updateAnimeEntry(anime.animeEntry!!.also {
                        it.putStartedAt(startedAt)
                        it.putFinishedAt(finishedAt)
                    })
                }.show()
            }
        }

        binding.animeSeasonsSpinner.apply {
            adapter = ArrayAdapter(context, R.layout.item_spinner, anime.seasons.map { context.getString(R.string.seasonNumber, it.seasonNumber) })
            onItemSelectedListener = object : OnItemSelectedListener {
                override fun onItemSelected(parent: AdapterView<*>?, view: View, position: Int, id: Long) {
                    val season = anime.seasons[position]
                    binding.animeEpisodeWatchTextView.text = season.episodeWatched.toString()
                    binding.animeEpisodeCountTextView.text = context.resources.getString(R.string.EpisodesWatch, season.episodeCount)
                    binding.animeEpisodeWatch.setOnClickListener {
                        MediaEntryProgressionDialog(
                                context,
                                context.getString(R.string.episodes_watched),
                                season.episodeWatched
                        ) { value ->
                            updateAnimeEntry(anime.animeEntry!!.also { animeEntry ->
                                animeEntry.putEpisodesWatch(value + anime.seasons.map { if (it.seasonNumber < season.seasonNumber) it.episodeCount else 0 }.sum())
                            })
                        }.show()
                    }
                }

                override fun onNothingSelected(parent: AdapterView<*>?) {}
            }
            setSelection(anime.seasons.indexOfFirst { season ->
                season.episodeWatched < season.episodeCount || season.episodeWatched > season.episodeCount
            })
        }

        binding.animeEntryRatingTextView.apply {
            text = "${anime.animeEntry?.rating ?: "-"} / 20"
            setOnClickListener {
                NumberPickerDialog(
                        context,
                        context.getString(R.string.score),
                        0,
                        20,
                        anime.animeEntry!!.rating
                ) { value ->
                    updateAnimeEntry(anime.animeEntry!!.also {
                        it.putRating(value)
                    })
                }.show()
            }
        }

        binding.animeEntryRemoveRatingImageView.setOnClickListener {
            updateAnimeEntry(anime.animeEntry!!.also {
                it.putRating(null)
            })
        }

        binding.animeEntryIsFavoritesImageView.apply {
            if (anime.animeEntry!!.isFavorites) setImageResource(R.drawable.ic_favorite_black_24dp)
            else setImageResource(R.drawable.ic_favorite_border_black_24dp)
            setOnClickListener {
                updateAnimeEntry(anime.animeEntry!!.also {
                    it.putFavorites(!anime.animeEntry!!.isFavorites)
                })
            }
        }
    }

    private fun displayReviews(binding: ItemAnimeReviewsBinding) {
        binding.llAnimeAllReviews.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                    AnimeFragmentDirections.actionAnimeToReviews(
                            ReviewsFragment.ReviewsType.Anime,
                            anime.id,
                            anime.canonicalTitle
                    )
            )
        }

        binding.tvAnimeReviewCount.text = anime.reviewCount.toString()
    }
}