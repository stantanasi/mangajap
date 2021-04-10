package com.tanasi.mangajap.adapters.viewHolders

import android.content.Context
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.view.View
import android.widget.TextView
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
import com.tanasi.mangajap.fragments.discover.DiscoverFragment
import com.tanasi.mangajap.fragments.discover.DiscoverFragmentDirections
import com.tanasi.mangajap.fragments.manga.MangaFragment
import com.tanasi.mangajap.fragments.manga.MangaFragmentDirections
import com.tanasi.mangajap.fragments.reviews.ReviewsFragment
import com.tanasi.mangajap.fragments.search.SearchFragment
import com.tanasi.mangajap.fragments.search.SearchFragmentDirections
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.models.MangaEntry
import com.tanasi.mangajap.models.Request
import com.tanasi.mangajap.models.User
import com.tanasi.mangajap.ui.dialog.*
import com.tanasi.mangajap.utils.extensions.*
import com.tanasi.mangajap.utils.preferences.UserPreference
import java.text.DecimalFormat
import java.util.*

class VhManga(
        private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
        _binding.root
) {

    private val context: Context = itemView.context

    private lateinit var manga: Manga

    fun setVhManga(manga: Manga) {
        this.manga = manga
        when (_binding) {
            is ItemMediaSearchBinding -> displaySearch(_binding)
            is ItemMediaSearchAddBinding -> displaySearchAdd(_binding)
            is ItemMediaTrendingBinding -> displayTrending(_binding)

            is ItemMangaHeaderBinding -> displayHeader(_binding)
            is ItemMangaSummaryBinding -> displaySummary(_binding)
            is ItemMangaProgressionBinding -> displayProgression(_binding)
            is ItemMangaReviewsBinding -> displayReviews(_binding)
        }
    }


    private fun createMangaEntry(mangaEntry: MangaEntry) {
        if (context is MainActivity) {
            when (val fragment = context.getCurrentFragment()) {
                is SearchFragment -> fragment.viewModel.createMangaEntry(manga, mangaEntry)
                is DiscoverFragment -> fragment.viewModel.createMangaEntry(manga, mangaEntry)
            }
        }
    }

    private fun updateMangaEntry(mangaEntry: MangaEntry) {
        if (context is MainActivity) {
            when (val fragment = context.getCurrentFragment()) {
                is MangaFragment -> fragment.viewModel.updateMangaEntry(mangaEntry)
                is SearchFragment -> fragment.viewModel.updateMangaEntry(manga, mangaEntry)
                is DiscoverFragment -> fragment.viewModel.updateMangaEntry(manga, mangaEntry)
            }
        }
    }

    private fun createMangaRequest(request: Request) {
        if (context is MainActivity) {
            when (val fragment = context.getCurrentFragment()) {
                is SearchFragment -> fragment.viewModel.createRequest(request)
            }
        }
    }

    private fun displaySearch(binding: ItemMediaSearchBinding) {
        binding.media.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                    SearchFragmentDirections.actionSearchToManga(
                            manga.id,
                            manga.canonicalTitle
                    )
            )
        }

        binding.mediaCoverImageView.apply {
            Picasso.get()
                    .load(manga.coverImage)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .into(this)
        }

        binding.mediaTitleTextView.text = manga.canonicalTitle

        binding.mediaTypeTextView.text = manga.mangaType?.stringId?.let { context.resources.getString(it) }

        binding.mediaMembersTextView.text = context.resources.getString(R.string.userCount, manga.userCount)

        binding.mediaIsAddCheckBox.apply {
            isChecked = manga.mangaEntry?.isAdd ?: false
            setOnClickListener {
                manga.mangaEntry?.let { mangaEntry ->
                    updateMangaEntry(mangaEntry.also {
                        it.putAdd(isChecked)
                    })
                } ?: createMangaEntry(MangaEntry().also {
                    it.putAdd(isChecked)
                    it.putStatus(MangaEntry.Status.reading)
                    it.putUser(User().apply { id = UserPreference(context).selfId })
                    it.putManga(manga)
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
                    context.getString(R.string.propose_manga),
                    context.getString(R.string.manga_title),
                    query
            ) { dialog, _, text ->
                createMangaRequest(Request().also {
                    it.putRequestType(Request.RequestType.manga)
                    it.putData(text)
                    it.putUser(User().apply { id = UserPreference(context).selfId })
                })
                dialog.dismiss()
            }.show()
        }

        binding.tvMediaTitle.text = context.getString(R.string.propose_manga)

        binding.tvMediaSubtitle.text = context.getString(R.string.propose_manga_summary)
    }

    private fun displayTrending(binding: ItemMediaTrendingBinding) {
        binding.media.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                    DiscoverFragmentDirections.actionDiscoverToManga(
                            manga.id,
                            manga.canonicalTitle
                    )
            )
        }

        binding.mediaCoverImageView.apply {
            Picasso.get()
                    .load(manga.coverImage)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .into(this)
        }

        binding.mediaIsAddCheckBox.apply {
            isChecked = manga.mangaEntry?.isAdd ?: false
            visibility = if (manga.mangaEntry?.isAdd == true) View.GONE else View.VISIBLE
            setOnClickListener {
                manga.mangaEntry?.let { mangaEntry ->
                    updateMangaEntry(mangaEntry.also {
                        it.putAdd(isChecked)
                    })
                } ?: createMangaEntry(MangaEntry().also {
                    it.putAdd(isChecked)
                    it.putStatus(MangaEntry.Status.reading)
                    it.putUser(User().apply { id = UserPreference(context).selfId })
                    it.putManga(manga)
                })
            }
        }

        binding.mediaProgressProgressBar.apply {
            manga.mangaEntry?.let { mangaEntry ->
                visibility = View.VISIBLE
                progress = mangaEntry.getProgress(manga)
                progressTintList = ContextCompat.getColorStateList(context, mangaEntry.getProgressColor(manga))
            } ?: let {
                visibility = View.GONE
            }
        }
    }

    private fun displayHeader(binding: ItemMangaHeaderBinding) {
        binding.mangaBannerImageView.apply {
            Picasso.get()
                    .load(manga.bannerImage ?: manga.coverImage)
                    .networkPolicy(NetworkPolicy.NO_CACHE)
                    .memoryPolicy(MemoryPolicy.NO_CACHE)
                    .into(this)
            setOnClickListener {
                Navigation.findNavController(binding.root).navigate(
                        MangaFragmentDirections.actionMangaToImage(
                                manga.bannerImage ?: manga.coverImage!!
                        )
                )
            }
        }

        binding.mangaCoverImageView.apply {
            Picasso.get().load(manga.coverImage).into(this)
            setOnClickListener {
                Navigation.findNavController(binding.root).navigate(
                        MangaFragmentDirections.actionMangaToImage(
                                manga.coverImage!!
                        )
                )
            }
        }

        binding.mangaTitleTextView.text = manga.canonicalTitle

        binding.mangaStaff.apply {
            if (manga.staff.isEmpty()) {
                visibility = View.GONE
            } else {
                if (childCount > 0) {
                    removeAllViews()
                }
                for (staff in manga.staff) {
                    TextView(context).also {
                        val peopleName = if (staff.people!!.pseudo == "") "${staff.people!!.firstName} ${staff.people!!.lastName}" else staff.people!!.pseudo
                        it.text = peopleName
                        it.setTextColor(context.getAttrColor(R.attr.textSecondaryColor))
                        it.typeface = Typeface.DEFAULT_BOLD
                        it.setOnClickListener {
                            Navigation.findNavController(binding.root).navigate(
                                    MangaFragmentDirections.actionMangaToPeople(
                                            staff.people!!.id,
                                            peopleName
                                    )
                            )
                        }
                        addView(it)
                    }
                }
                visibility = View.VISIBLE
            }
        }

        binding.mangaTypeTextView.text = context.resources.getString(manga.mangaType!!.stringId)
    }

    private fun displaySummary(binding: ItemMangaSummaryBinding) {
        binding.mangaSummarySubtitleTextView.apply {
            text = context.getString(R.string.manga_metadata,
                    manga.startDate?.format("yyyy"),
                    manga.endDate?.format("yyyy") ?: context.getString(manga.status.stringId),
                    manga.origin?.getDisplayCountry(context.locale()))
        }

        binding.mangaScoreTextView.text = if (manga.averageRating == null) "- / 5" else DecimalFormat("#.#").format(manga.averageRating!! / 20.0 * 5) + " / 5"

        binding.mangaSynopsisTextView.apply {
            text = manga.synopsis
            maxLines = MangaFragment.MANGA_SYNOPSIS_MAX_LINES
        }

        binding.mangaReadMore.apply {
            visibility = View.VISIBLE
            setOnClickListener {
                binding.mangaSynopsisTextView.maxLines = Int.MAX_VALUE
                visibility = View.GONE
            }
        }

        binding.mangaRankedTextView.text = context.getString(R.string.manga_rating, (manga.ratingRank ?: ""))

        binding.mangaVolumeCountTextView.text = when (manga.status) {
            Manga.Status.publishing -> context.resources.getString(R.string.approximatelyVolumeCount, manga.volumeCount)
            else -> context.resources.getString(R.string.volumeCount, manga.volumeCount)
        }

        binding.mangaChapterCountTextView.text = when (manga.status) {
            Manga.Status.publishing -> context.resources.getString(R.string.approximatelyChapterCount, manga.chapterCount)
            else -> context.resources.getString(R.string.chapterCount, manga.chapterCount)
        }

        binding.mangaUserCountTextView.text = context.resources.getString(R.string.mangaUserCount, manga.userCount)
    }

    private fun displayProgression(binding: ItemMangaProgressionBinding) {
        // TODO: faire du bouton status un spinner
        binding.mangaEntryStatusTextView.apply {
            (background as GradientDrawable).setStroke(context.dpToPx(1), ContextCompat.getColor(context, manga.mangaEntry!!.getProgressColor(manga)))
            setTextColor(ContextCompat.getColor(context, manga.mangaEntry!!.getProgressColor(manga)))
            text = context.resources.getString(manga.mangaEntry!!.status.stringId)
            setOnClickListener {
                RadioGroupDialog(
                        context,
                        context.getString(R.string.status),
                        context.getString(manga.mangaEntry!!.status.stringId),
                        MangaEntry.Status.values().map { context.getString(it.stringId) }
                ) { position ->
                    manga.mangaEntry?.let { mangaEntry ->
                        updateMangaEntry(mangaEntry.apply {
                            putStatus(MangaEntry.Status.values()[position])
                            when (MangaEntry.Status.values()[position]) {
                                MangaEntry.Status.reading -> if (mangaEntry.startedAt == null) putStartedAt(Calendar.getInstance())
                                MangaEntry.Status.completed,
                                MangaEntry.Status.on_hold,
                                MangaEntry.Status.dropped -> if (mangaEntry.finishedAt == null) putFinishedAt(Calendar.getInstance())
                                else -> {
                                }
                            }
                        })
                    }
                }.show()
            }
        }

        binding.mangaMyDateTextView.apply {
            val startedAt = manga.mangaEntry?.startedAt?.format("dd MMMM yyyy") ?: "-"
            val finishedAt = manga.mangaEntry?.finishedAt?.format("dd MMMM yyyy") ?: "-"

            visibility = when (manga.mangaEntry!!.status) {
                MangaEntry.Status.planned -> View.GONE
                else -> View.VISIBLE
            }
            text = when (manga.mangaEntry!!.status) {
                MangaEntry.Status.reading -> context.resources.getString(R.string.SinceThe, startedAt)
                MangaEntry.Status.completed -> context.resources.getString(R.string.CompletedSinceThe, finishedAt)
                MangaEntry.Status.on_hold -> context.resources.getString(R.string.OnHoldSinceThe, finishedAt)
                MangaEntry.Status.dropped -> context.resources.getString(R.string.DroppedSinceThe, finishedAt)
                else -> ""
            }
            setOnClickListener {
                MediaEntryDateDialog(
                        context,
                        context.getString(R.string.progression),
                        manga.mangaEntry?.startedAt,
                        manga.mangaEntry?.finishedAt,
                ) { startedAt, finishedAt ->
                    updateMangaEntry(manga.mangaEntry!!.apply {
                        putStartedAt(startedAt)
                        putFinishedAt(finishedAt)
                    })
                }.show()
            }
        }

        binding.mangaVolumesRead.setOnClickListener {
            MediaEntryProgressionDialog(
                    context,
                    context.getString(R.string.volumesRead),
                    manga.mangaEntry!!.volumesRead
            ) { value ->
                updateMangaEntry(manga.mangaEntry!!.apply {
                    putVolumesRead(value)
                })
            }.show()
        }

        binding.mangaVolumesReadTextView.text = manga.mangaEntry!!.volumesRead.toString()

        binding.mangaVolumesTextView.text = context.resources.getString(R.string.VolumesRead, manga.volumeCount
                ?: 0)

        binding.mangaChaptersRead.setOnClickListener {
            MediaEntryProgressionDialog(
                    context,
                    context.getString(R.string.chaptersRead),
                    manga.mangaEntry!!.chaptersRead
            ) { value ->
                updateMangaEntry(manga.mangaEntry!!.apply {
                    putChaptersRead(value)
                })
            }.show()
        }

        binding.mangaChaptersReadTextView.text = manga.mangaEntry!!.chaptersRead.toString()

        binding.mangaChaptersTextView.text = context.resources.getString(R.string.ChaptersRead, manga.chapterCount
                ?: 0)

        binding.mangaEntryRatingTextView.apply {
            text = "${manga.mangaEntry?.rating ?: "-"} / 20"
            setOnClickListener {
                NumberPickerDialog(
                        context,
                        context.getString(R.string.score),
                        0,
                        20,
                        manga.mangaEntry!!.rating
                ) { value ->
                    updateMangaEntry(manga.mangaEntry!!.apply {
                        putRating(value)
                    })
                }.show()
            }
        }

        binding.mangaEntryRemoveRatingImageView.setOnClickListener {
            updateMangaEntry(manga.mangaEntry!!.apply {
                putRating(null)
            })
        }

        binding.mangaEntryIsFavoritesImageView.apply {
            if (manga.mangaEntry!!.isFavorites) setImageResource(R.drawable.ic_favorite_black_24dp)
            else setImageResource(R.drawable.ic_favorite_border_black_24dp)
            setOnClickListener {
                updateMangaEntry(manga.mangaEntry!!.also {
                    it.putFavorites(!manga.mangaEntry!!.isFavorites)
                })
            }
        }
    }

    private fun displayReviews(binding: ItemMangaReviewsBinding) {
        binding.llMangaAllReviews.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                    MangaFragmentDirections.actionMangaToReviews(
                            ReviewsFragment.ReviewsType.Manga,
                            manga.id,
                            manga.canonicalTitle
                    )
            )
        }

        binding.tvMangaReviewCount.text = manga.reviewCount.toString()
    }
}