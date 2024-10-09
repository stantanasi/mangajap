package com.tanasi.mangajap.fragments.library

import android.content.res.Configuration
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.flowWithLifecycle
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.GridLayoutManager
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.adapters.SpinnerAdapter
import com.tanasi.mangajap.databinding.FragmentLibraryBinding
import com.tanasi.mangajap.models.AnimeEntry
import com.tanasi.mangajap.models.Header
import com.tanasi.mangajap.models.MangaEntry
import com.tanasi.mangajap.ui.SpacingItemDecoration
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.setToolbar
import com.tanasi.mangajap.utils.extensions.viewModelsFactory
import com.tanasi.mangajap.utils.preferences.LibraryPreference
import kotlinx.coroutines.launch

class LibraryFragment : Fragment() {

    enum class LibraryType {
        MangaList,
        MangaFavoritesList,
        AnimeList,
        AnimeFavoritesList
    }

    enum class SortBy(val stringId: Int) {
        Title(R.string.sortByTitle),
        ModificationDate(R.string.sortByModificationDate),
        Score(R.string.sortByScore),
        Progression(R.string.sortByProgression),
        ReleaseDate(R.string.sortByReleaseDate);

        companion object {
            fun getByName(name: String?): SortBy = try {
                valueOf(name!!)
            } catch (e: Exception) {
                ModificationDate
            }
        }
    }

    private var _binding: FragmentLibraryBinding? = null
    private val binding get() = _binding!!

    private val args by navArgs<LibraryFragmentArgs>()
    val viewModel by viewModelsFactory { LibraryViewModel(args.userId, args.libraryType) }

    private lateinit var libraryPreference: LibraryPreference

    private var spanCount: Int = 0

    private val appAdapter = AppAdapter()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentLibraryBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        libraryPreference = LibraryPreference(requireContext())

        initializeLibrary()

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.state.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED).collect { state ->
                when (state) {
                    LibraryViewModel.State.Loading -> binding.isLoading.apply {
                        root.visibility = View.VISIBLE
                    }

                    is LibraryViewModel.State.SuccessLoading -> {
                        displayLibrary(state.itemList)
                        binding.isLoading.root.visibility = View.GONE
                    }

                    is LibraryViewModel.State.FailedLoading -> {
                        when (state.error) {
                            is JsonApiResponse.Error.ServerError -> state.error.body.errors.map {
                                Toast.makeText(requireContext(), it.title, Toast.LENGTH_SHORT)
                                    .show()
                            }

                            is JsonApiResponse.Error.NetworkError -> Toast.makeText(
                                requireContext(),
                                state.error.error.message ?: "",
                                Toast.LENGTH_SHORT
                            ).show()

                            is JsonApiResponse.Error.UnknownError -> Toast.makeText(
                                requireContext(),
                                state.error.error.message ?: "",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    }
                }
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }


    private fun initializeLibrary() {
        var pseudo = args.userPseudo
        if (args.userId == Firebase.auth.uid) pseudo = ""
        when (args.libraryType as LibraryType) {
            LibraryType.MangaList -> setToolbar(getString(R.string.mangaList), pseudo)
            LibraryType.AnimeList -> setToolbar(getString(R.string.animeList), pseudo)
            LibraryType.MangaFavoritesList -> setToolbar(getString(R.string.favoritesManga), pseudo)
            LibraryType.AnimeFavoritesList -> setToolbar(getString(R.string.favoritesAnime), pseudo)
        }

        binding.spinnerLibrarySortBy.apply {
            adapter = SpinnerAdapter(context, SortBy.entries.map { getString(it.stringId) })
            setSelection(libraryPreference.sortBy.ordinal)
        }

        binding.filter.apply {
            visibility = when (args.libraryType as LibraryType) {
                LibraryType.MangaList,
                LibraryType.AnimeList -> View.VISIBLE

                LibraryType.MangaFavoritesList,
                LibraryType.AnimeFavoritesList -> View.GONE
            }
        }

        binding.rvLibrary.apply {
            spanCount = when (this.resources.configuration.orientation) {
                Configuration.ORIENTATION_PORTRAIT -> 3
                Configuration.ORIENTATION_LANDSCAPE -> 4
                else -> 3
            }
            layoutManager = GridLayoutManager(context, spanCount)
            adapter = appAdapter
            addItemDecoration(
                SpacingItemDecoration(
                    spacing = resources.getDimension(R.dimen.library_spacing).toInt()
                )
            )
        }
    }

    private fun displayLibrary(itemList: List<AppAdapter.Item>) {
        var items = itemList

        binding.spinnerLibrarySortBy.apply {
            var isFirstLaunch = true
            onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
                override fun onItemSelected(
                    parent: AdapterView<*>?,
                    view: View?,
                    position: Int,
                    id: Long
                ) {
                    // OnItemSelected se lance au demarrage donc verifier si lancement ou pas
                    if (!isFirstLaunch) {
                        if (libraryPreference.sortBy == SortBy.entries[position]) {
                            libraryPreference.sortInReverse = !libraryPreference.sortInReverse
                        } else {
                            libraryPreference.sortBy = SortBy.entries[position]
                            libraryPreference.sortInReverse = false
                        }
                        displayLibrary(itemList)
                    }
                    isFirstLaunch = false
                }

                override fun onNothingSelected(parent: AdapterView<*>?) {}
            }
            setSelection(libraryPreference.sortBy.ordinal)
        }

        binding.filter.apply {
            setOnClickListener {
                libraryPreference.showStatusHeader = !libraryPreference.showStatusHeader
                displayLibrary(itemList)
            }
        }

        binding.tvLibraryEmptyList.visibility = when {
            itemList.isEmpty() -> View.VISIBLE
            else -> View.GONE
        }

        when (libraryPreference.sortBy) {
            SortBy.Title -> {
                items = itemList.sortedBy { item ->
                    when (item) {
                        is MangaEntry -> item.manga?.title ?: ""
                        is AnimeEntry -> item.anime?.title ?: ""
                        else -> ""
                    }
                }
            }

            SortBy.ModificationDate -> {
                items =  itemList.sortedByDescending { item ->
                    when (item) {
                        is MangaEntry -> item.updatedAt?.format("yyyy-MM-dd") ?: ""
                        is AnimeEntry -> item.updatedAt?.format("yyyy-MM-dd") ?: ""
                        else -> ""
                    }
                }
            }

            SortBy.Score -> {
                items = itemList.sortedBy { item ->
                    when (item) {
                        is MangaEntry -> item.rating ?: 0
                        is AnimeEntry -> item.rating ?: 0
                        else -> 0
                    }
                }
            }

            SortBy.Progression -> {
                items = itemList.sortedByDescending { item ->
                    when (item) {
                        is MangaEntry -> item.manga?.let { item.getProgress(it) } ?: 0
                        is AnimeEntry -> item.anime?.let { item.getProgress(it) } ?: 0
                        else -> 0
                    }
                }
            }

            SortBy.ReleaseDate -> {
                items = itemList.sortedByDescending { item ->
                    when (item) {
                        is MangaEntry -> item.manga?.startDate?.format("yyyy-MM-dd") ?: ""
                        is AnimeEntry -> item.anime?.startDate?.format("yyyy-MM-dd") ?: ""
                        else -> ""
                    }
                }
            }
        }

        if (libraryPreference.sortInReverse) items = itemList.reversed()

        val itemListFull: List<AppAdapter.Item> = items.toList()
        when (args.libraryType as LibraryType) {
            LibraryType.MangaFavoritesList, LibraryType.AnimeFavoritesList -> {
                items = itemListFull.filterNot { it is Header }
            }

            LibraryType.MangaList, LibraryType.AnimeList -> {
                if (!libraryPreference.showStatusHeader) {
                    items = itemListFull.filterNot { it is Header }
                } else {
                    items = itemListFull
                        .filterNot { it is Header }
                        .sortedBy {
                            when (it) {
                                is MangaEntry -> it.status.ordinal
                                is AnimeEntry -> it.status.ordinal
                                else -> 0
                            }
                        }
                        .groupBy {
                            when (it) {
                                is MangaEntry -> it.status.ordinal
                                is AnimeEntry -> it.status.ordinal
                                else -> 0
                            }
                        }
                        .map {
                            val list = mutableListOf<AppAdapter.Item>()
                            when (val media = it.value[0]) {
                                is MangaEntry -> list.add(Header(getString(media.status.stringId)).apply {
                                    itemType = AppAdapter.Type.LIBRARY_STATUS_HEADER
                                })

                                is AnimeEntry -> list.add(Header(getString(media.status.stringId)).apply {
                                    itemType = AppAdapter.Type.LIBRARY_STATUS_HEADER
                                })

                                else -> {}
                            }
                            list.addAll(it.value)
                            list
                        }
                        .flatten()
                }
            }
        }

        (binding.rvLibrary.layoutManager as GridLayoutManager).also {
            it.spanSizeLookup = object : GridLayoutManager.SpanSizeLookup() {
                override fun getSpanSize(position: Int): Int {
                    if (items[position] is Header) return it.spanCount
                    return 1
                }
            }
        }

        appAdapter.submitList(items.onEach {
            it.itemType = when (args.libraryType as LibraryType) {
                LibraryType.MangaList -> AppAdapter.Type.MANGA_ENTRY_LIBRARY_ITEM
                LibraryType.MangaFavoritesList -> AppAdapter.Type.MANGA_ENTRY_LIBRARY_ITEM
                LibraryType.AnimeList -> AppAdapter.Type.ANIME_ENTRY_LIBRARY_ITEM
                LibraryType.AnimeFavoritesList -> AppAdapter.Type.ANIME_ENTRY_LIBRARY_ITEM
            }
        })
    }
}