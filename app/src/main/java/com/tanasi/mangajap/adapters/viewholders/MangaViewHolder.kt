package com.tanasi.mangajap.adapters.viewholders

import android.content.Context
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.view.LayoutInflater
import android.view.View
import android.widget.AdapterView
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.navigation.findNavController
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.bumptech.glide.Glide
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.squareup.picasso.Callback
import com.squareup.picasso.MemoryPolicy
import com.squareup.picasso.NetworkPolicy
import com.squareup.picasso.Picasso
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.adapters.SpinnerAdapter
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
import com.tanasi.mangajap.databinding.ItemSpinnerDropdownMediaStatusBinding
import com.tanasi.mangajap.databinding.ItemSpinnerMediaStatusBinding
import com.tanasi.mangajap.fragments.home.HomeFragment
import com.tanasi.mangajap.fragments.home.HomeFragmentDirections
import com.tanasi.mangajap.fragments.search.SearchFragment
import com.tanasi.mangajap.fragments.search.SearchFragmentDirections
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.models.MangaEntry
import com.tanasi.mangajap.models.Request
import com.tanasi.mangajap.models.User
import com.tanasi.mangajap.ui.SpacingItemDecoration
import com.tanasi.mangajap.ui.dialog.EditTextDialog
import com.tanasi.mangajap.ui.dialog.MediaEntryDateDialog
import com.tanasi.mangajap.ui.dialog.MediaEntryProgressionDialog
import com.tanasi.mangajap.ui.dialog.NumberPickerDialog
import com.tanasi.mangajap.utils.extensions.dpToPx
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.getAttrColor
import com.tanasi.mangajap.utils.extensions.locale
import com.tanasi.mangajap.utils.getCurrentFragment
import com.tanasi.mangajap.utils.toActivity
import java.text.DecimalFormat
import java.util.Calendar

class MangaViewHolder(
        private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
        _binding.root
) {

    private val context: Context = itemView.context

    private lateinit var manga: Manga

    fun bind(manga: Manga) {
        this.manga = manga
        when (_binding) {
            is ItemMangaBinding -> displayItem(_binding)
            is ItemMangaGridBinding -> displayGridItem(_binding)
            is ItemMediaSearchBinding -> displaySearch(_binding)
            is ItemMediaSearchAddBinding -> displaySearchAdd(_binding)
            is ItemMediaDiscoverBinding -> displayTrending(_binding)

            is ItemMangaHeaderBinding -> displayHeader(_binding)
            is ItemMangaSummaryBinding -> displaySummary(_binding)
            is ItemMangaProgressionBinding -> displayProgression(_binding)
            is ItemMangaReviewsBinding -> displayReviews(_binding)
            is ItemMangaFranchisesBinding -> displayFranchises(_binding)
        }
    }


    private fun createMangaEntry(mangaEntry: MangaEntry) {
//        when (val fragment = context.toActivity()?.getCurrentFragment()) {
////            is SearchFragment -> fragment.mangaFragment.saveMangaEntry(manga, mangaEntry)
//            is DiscoverFragment -> fragment.viewModel.saveMangaEntry(manga, mangaEntry)
//        }
    }

    private fun updateMangaEntry(mangaEntry: MangaEntry) {
//        when (val fragment = context.toActivity()?.getCurrentFragment()) {
////            is MangaFragment -> fragment.viewModel.saveMangaEntry(mangaEntry)
////            is SearchFragment -> fragment.mangaFragment.saveMangaEntry(manga, mangaEntry)
//            is DiscoverFragment -> fragment.viewModel.saveMangaEntry(manga, mangaEntry)
//        }
    }

    private fun createMangaRequest(request: Request) {
//        when (val fragment = context.toActivity()?.getCurrentFragment()) {
////            is SearchFragment -> fragment.mangaFragment.saveRequest(request)
//        }
    }


    private fun displayItem(binding: ItemMangaBinding) {
        binding.root.apply {
            setOnClickListener {
                when (context.toActivity()?.getCurrentFragment()) {
                    is HomeFragment -> findNavController().navigate(
                        HomeFragmentDirections.actionHomeToManga(
                            id = manga.id,
                        )
                    )
                }
            }
        }

        Glide.with(context)
            .load(manga.coverImage)
            .centerCrop()
            .into(binding.ivMangaPoster)

        binding.tvMangaTitle.text = manga.title
    }

    private fun displayGridItem(binding: ItemMangaGridBinding) {
        binding.root.apply {
            setOnClickListener {
                when (context.toActivity()?.getCurrentFragment()) {
                    is SearchFragment -> findNavController().navigate(
                        SearchFragmentDirections.actionSearchToManga(
                            id = manga.id,
                        )
                    )
                }
            }
        }

        Glide.with(context)
            .load(manga.coverImage)
            .centerCrop()
            .into(binding.ivMangaPoster)

        binding.tvMangaTitle.text = manga.title
    }

    private fun displaySearch(binding: ItemMediaSearchBinding) {
        binding.root.setOnClickListener {
//            Navigation.findNavController(binding.root).navigate(
//                    SearchFragmentDirections.actionSearchToManga(
//                            manga.id,
//                            manga.title
//                    )
//            )
        }

        binding.ivSearchMediaCover.apply {
            Picasso.get()
                    .load(manga.coverImage)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .into(this)
        }

        binding.tvSearchMediaTitle.text = manga.title

        binding.tvSearchMediaType.text = manga.mangaType.stringId.let { context.resources.getString(it) }

        binding.tvSearchMediaUserCount.text = context.resources.getString(R.string.userCount, manga.userCount)

        binding.cbSearchMediaIsAdd.apply {
            isChecked = manga.mangaEntry?.isAdd ?: false
            setOnClickListener {
                manga.mangaEntry?.let { mangaEntry ->
                    mangaEntry.isAdd = isChecked
                    updateMangaEntry(mangaEntry)

                } ?: MangaEntry().also {
                    it.isAdd = isChecked
                    it.status = MangaEntry.Status.READING
                    it.user = User(id = Firebase.auth.uid)
                    it.manga = manga
                    createMangaEntry(it)
                }
            }
        }
    }

    private fun displaySearchAdd(binding: ItemMediaSearchAddBinding) {
        binding.root.setOnClickListener {
            val query = ""

            EditTextDialog(
                    context,
                    context.getString(R.string.propose_manga),
                    context.getString(R.string.manga_title),
                    query
            ) { dialog, _, text ->
                createMangaRequest(Request().also {
                    it.requestType = Request.RequestType.MANGA
                    it.data = text
                    it.user = User(id = Firebase.auth.uid)
                })
                dialog.dismiss()
            }.show()
        }

        binding.tvSearchAddTitle.text = context.getString(R.string.propose_manga)

        binding.tvSearchAddSubtitle.text = context.getString(R.string.propose_manga_summary)
    }

    private fun displayTrending(binding: ItemMediaDiscoverBinding) {
        binding.root.setOnClickListener {
//            Navigation.findNavController(binding.root).navigate(
//                    DiscoverFragmentDirections.actionDiscoverToManga(
//                            manga.id,
//                            manga.title
//                    )
//            )
        }

        binding.ivTrendingMediaCover.apply {
            Picasso.get()
                    .load(manga.coverImage)
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

        binding.tvTrendingMediaTitlePlaceholder.text = manga.title

        binding.cbTrendingMediaIsAdd.apply {
            isChecked = manga.mangaEntry?.isAdd ?: false
            visibility = if (manga.mangaEntry?.isAdd == true) View.GONE else View.VISIBLE
            setOnClickListener {
                manga.mangaEntry?.let {
                    it.isAdd = isChecked
                    updateMangaEntry(it)
                } ?: MangaEntry().also {
                    it.isAdd = isChecked
                    it.status = MangaEntry.Status.READING
                    it.user = User(id = Firebase.auth.uid)
                    it.manga = manga
                    createMangaEntry(it)
                }
            }
        }

        binding.pbTrendingMediaProgress.apply {
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
        binding.ivMangaBanner.apply {
            Picasso.get()
                    .load(manga.bannerImage ?: manga.coverImage)
                    .networkPolicy(NetworkPolicy.NO_CACHE)
                    .memoryPolicy(MemoryPolicy.NO_CACHE)
                    .into(this)
            setOnClickListener {
//                Navigation.findNavController(binding.root).navigate(
//                        MangaFragmentDirections.actionMangaToImage(
//                                manga.bannerImage ?: manga.coverImage ?: ""
//                        )
//                )
            }
        }

        binding.ivMangaCover.apply {
            Picasso.get().load(manga.coverImage).into(this)
            setOnClickListener {
//                Navigation.findNavController(binding.root).navigate(
//                        MangaFragmentDirections.actionMangaToImage(
//                                manga.coverImage ?: ""
//                        )
//                )
            }
        }

        binding.tvMangaTitle.text = manga.title

        binding.llMangaStaff.apply {
            visibility = when (manga.staff.isEmpty()) {
                true -> View.GONE
                false -> View.VISIBLE
            }

            if (childCount > 0) {
                removeAllViews()
            }
            manga.staff.forEach { staff ->
                addView(TextView(context).also { textView ->
                    staff.people?.let { people ->
                        val peopleName = when (people.pseudo) {
                            "" -> "${people.firstName} ${people.lastName}"
                            else -> people.pseudo
                        }
                        textView.text = peopleName
                        textView.setTextColor(context.getAttrColor(R.attr.textSecondaryColor))
                        textView.typeface = Typeface.DEFAULT_BOLD
                        textView.setOnClickListener {
//                            Navigation.findNavController(binding.root).navigate(
//                                MangaFragmentDirections.actionMangaToPeople(
//                                    people.id,
//                                    peopleName
//                                )
//                            )
                        }
                    }
                })
            }
        }

        binding.tvMangaType.text = context.getString(manga.mangaType.stringId)
    }

    private fun displaySummary(binding: ItemMangaSummaryBinding) {
        binding.tvMangaSummarySubtitle.apply {
            text = context.getString(R.string.manga_metadata,
                    manga.startDate?.format("yyyy"),
                    manga.endDate?.format("yyyy") ?: context.getString(manga.status.stringId),
                    manga.origin?.getDisplayCountry(context.locale()))
        }

        binding.tvMangaSummaryRating.text = manga.averageRating?.let { DecimalFormat("#.#").format(it / 20.0 * 5) + " / 5" } ?: "- / 5"

        fun readMoreSynopsis(readMore: Boolean) {
//            binding.tvMangaSummarySynopsis.maxLines = when (readMore) {
//                false -> MangaFragment.MANGA_SYNOPSIS_MAX_LINES
//                true -> Int.MAX_VALUE
//            }

            binding.vMangaSummarySynopsisGradient.visibility = when (readMore) {
                false -> View.VISIBLE
                true -> View.GONE
            }

            binding.tvMangaSummarySynopsisReadMore.visibility = when (readMore) {
                false -> View.VISIBLE
                true -> View.GONE
            }
        }
        readMoreSynopsis(false)

        binding.tvMangaSummarySynopsis.text = manga.synopsis

        binding.tvMangaSummarySynopsisReadMore.setOnClickListener {
            readMoreSynopsis(true)
        }

        binding.tvMangaSummaryRank.text = context.getString(R.string.manga_rating, (manga.ratingRank ?: ""))

        binding.tvMangaSummaryVolumeCount.text = when (manga.status) {
            Manga.Status.PUBLISHING -> context.resources.getString(R.string.approximatelyVolumeCount, manga.volumeCount)
            else -> context.resources.getString(R.string.volumeCount, manga.volumeCount)
        }

        binding.tvMangaSummaryChapterCount.text = when (manga.status) {
            Manga.Status.PUBLISHING -> context.resources.getString(R.string.approximatelyChapterCount, manga.chapterCount)
            else -> context.resources.getString(R.string.chapterCount, manga.chapterCount)
        }

        binding.tvMangaSummaryUserCount.text = context.resources.getString(R.string.mangaUserCount, manga.userCount)
    }

    private fun displayProgression(binding: ItemMangaProgressionBinding) {
        binding.spinnerMangaProgressionStatus.apply {
            (background as GradientDrawable).setStroke(1.dpToPx(context), ContextCompat.getColor(context, manga.mangaEntry?.getProgressColor(manga) ?: MangaEntry.Status.READING.colorId))

            adapter = SpinnerAdapter(
                context,
                MangaEntry.Status.values().asList(),
            ).apply {
                onView = { position, context, parent ->
                    ItemSpinnerMediaStatusBinding.inflate(LayoutInflater.from(context), parent, false).also {
                        it.root.text = context.getString(MangaEntry.Status.values()[position].stringId)
                        it.root.setTextColor(ContextCompat.getColor(context, manga.mangaEntry?.getProgressColor(manga) ?: MangaEntry.Status.READING.colorId))
                    }.root
                }
                onBind = { position, context, parent ->
                    ItemSpinnerDropdownMediaStatusBinding.inflate(LayoutInflater.from(context), parent, false).also {
                        it.root.text = context.getString(MangaEntry.Status.values()[position].stringId)
                        it.root.setTextColor(ContextCompat.getColor(context, MangaEntry.Status.values()[position].colorId))
                    }.root
                }
            }

            onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
                override fun onItemSelected(parent: AdapterView<*>?, view: View, position: Int, id: Long) {
                    manga.mangaEntry?.let {
                        if (MangaEntry.Status.values()[position] != it.status) {
                            it.status = MangaEntry.Status.values()[position]
                            when (MangaEntry.Status.values()[position]) {
                                MangaEntry.Status.READING ->
                                    if (it.startedAt == null) it.startedAt = Calendar.getInstance()
                                MangaEntry.Status.COMPLETED,
                                MangaEntry.Status.ON_HOLD,
                                MangaEntry.Status.DROPPED ->
                                    if (it.finishedAt == null) it.finishedAt = Calendar.getInstance()
                                else -> {}
                            }
                            updateMangaEntry(it)
                        }
                    }
                }

                override fun onNothingSelected(parent: AdapterView<*>?) {}
            }
            setSelection(manga.mangaEntry?.status?.ordinal ?: 0)
        }

        binding.tvMangaProgressionSubtitle.apply {
            val startedAt = manga.mangaEntry?.startedAt?.format("dd MMMM yyyy") ?: "-"
            val finishedAt = manga.mangaEntry?.finishedAt?.format("dd MMMM yyyy") ?: "-"

            visibility = when (manga.mangaEntry?.status) {
                MangaEntry.Status.PLANNED -> View.GONE
                else -> View.VISIBLE
            }
            text = when (manga.mangaEntry?.status) {
                MangaEntry.Status.READING -> context.resources.getString(R.string.SinceThe, startedAt)
                MangaEntry.Status.COMPLETED -> context.resources.getString(R.string.CompletedSinceThe, finishedAt)
                MangaEntry.Status.ON_HOLD -> context.resources.getString(R.string.OnHoldSinceThe, finishedAt)
                MangaEntry.Status.DROPPED -> context.resources.getString(R.string.DroppedSinceThe, finishedAt)
                else -> ""
            }
            setOnClickListener {
                MediaEntryDateDialog(
                        context,
                        context.getString(R.string.progression),
                        manga.mangaEntry?.startedAt,
                        manga.mangaEntry?.finishedAt,
                ) { startedAt, finishedAt ->
                    manga.mangaEntry?.let {
                        it.startedAt = startedAt
                        it.finishedAt = finishedAt
                        updateMangaEntry(it)
                    }
                }.show()
            }
        }

        binding.vMangaProgressionVolume.setOnClickListener {
            MediaEntryProgressionDialog(
                    context,
                    context.getString(R.string.volumesRead),
                    manga.mangaEntry?.volumesRead ?: 0
            ) { value ->
                manga.mangaEntry?.let {
                    it.volumesRead = value
                    updateMangaEntry(it)
                }
            }.show()
        }

        binding.tvMangaProgressionVolumeRead.text = manga.mangaEntry?.volumesRead?.toString() ?: "0"

        binding.tvMangaProgressionVolumeCount.text = context.getString(
            R.string.VolumesRead,
            manga.volumeCount
        )

        binding.vMangaProgressionChapter.setOnClickListener {
            MediaEntryProgressionDialog(
                    context,
                    context.getString(R.string.chaptersRead),
                    manga.mangaEntry?.chaptersRead ?: 0
            ) { value ->
                manga.mangaEntry?.let {
                    it.chaptersRead = value
                    updateMangaEntry(it)
                }
            }.show()
        }

        binding.tvMangaProgressionChapterRead.text = manga.mangaEntry?.chaptersRead?.toString() ?: "0"

        binding.tvMangaProgressionChapterCount.text = context.getString(
            R.string.ChaptersRead,
            manga.chapterCount
        )

        binding.tvMangaProgressionRating.apply {
            text = "${manga.mangaEntry?.rating ?: "-"} / 20"
            setOnClickListener {
                NumberPickerDialog(
                        context,
                        context.getString(R.string.score),
                        0,
                        20,
                        manga.mangaEntry?.rating
                ) { value ->
                    manga.mangaEntry?.let {
                        it.rating = value
                        updateMangaEntry(it)
                    }
                }.show()
            }
        }

        binding.ivMangaProgressionDeleteRating.setOnClickListener {
            manga.mangaEntry?.let {
                it.rating = null
                updateMangaEntry(it)
            }
        }

        binding.ivMangaProgressionIsFavorites.apply {
            if (manga.mangaEntry?.isFavorites == true) setImageResource(R.drawable.ic_favorite_black_24dp)
            else setImageResource(R.drawable.ic_favorite_border_black_24dp)
            setOnClickListener { _ ->
                manga.mangaEntry?.let {
                    it.isFavorites = !it.isFavorites
                    updateMangaEntry(it)
                }
            }
        }
    }

    private fun displayReviews(binding: ItemMangaReviewsBinding) {
        binding.root.setOnClickListener {
//            Navigation.findNavController(binding.root).navigate(
//                    MangaFragmentDirections.actionMangaToReviews(
//                            ReviewsFragment.ReviewsType.Manga,
//                            manga.id,
//                            manga.title
//                    )
//            )
        }

        binding.tvMangaReviewCount.text = manga.reviewCount.toString()
    }

    private fun displayFranchises(binding: ItemMangaFranchisesBinding) {
        binding.rvMangaFranchises.apply {
            adapter = AppAdapter().apply {
                submitList(manga.franchises)
            }
            addItemDecoration(SpacingItemDecoration(
                spacing = (resources.getDimension(R.dimen.manga_spacing) * 0.5).toInt()
            ))
        }
    }
}