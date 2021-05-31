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
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.GridLayoutManager
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.adapters.SpinnerAdapter
import com.tanasi.mangajap.databinding.FragmentLibraryBinding
import com.tanasi.mangajap.models.AnimeEntry
import com.tanasi.mangajap.models.Header
import com.tanasi.mangajap.models.MangaEntry
import com.tanasi.mangajap.utils.extensions.format
import com.tanasi.mangajap.utils.extensions.getAttrColor
import com.tanasi.mangajap.utils.extensions.setToolbar
import com.tanasi.mangajap.utils.preferences.LibraryPreference
import com.tanasi.mangajap.utils.preferences.UserPreference

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
    private val binding: FragmentLibraryBinding get() = _binding!!
    
    val viewModel: LibraryViewModel by viewModels()
    
    private val args: LibraryFragmentArgs by navArgs()

    private lateinit var libraryPreference: LibraryPreference

    private lateinit var userId: String
    private lateinit var userPseudo: String
    private lateinit var libraryType: LibraryType
    private var spanCount: Int = 0

    val itemList: MutableList<MangaJapAdapter.Item> = mutableListOf()
    val mangaJapAdapter: MangaJapAdapter = MangaJapAdapter(itemList)

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentLibraryBinding.inflate(inflater, container, false)
        userId = args.userId
        userPseudo = args.userPseudo
        libraryType = args.libraryType
        when (libraryType) {
            LibraryType.MangaList -> viewModel.getMangaLibrary(userId)
            LibraryType.AnimeList -> viewModel.getAnimeLibrary(userId)
            LibraryType.MangaFavoritesList -> viewModel.getMangaFavorites(userId)
            LibraryType.AnimeFavoritesList -> viewModel.getAnimeFavorites(userId)
        }
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        libraryPreference = LibraryPreference(requireContext())

        userPseudo.let {
            var pseudo = it
            if ((userId == UserPreference(requireContext()).selfId)) pseudo = ""
            when (libraryType) {
                LibraryType.MangaList -> setToolbar(getString(R.string.mangaList), pseudo)
                LibraryType.AnimeList -> setToolbar(getString(R.string.animeList), pseudo)
                LibraryType.MangaFavoritesList -> setToolbar(getString(R.string.favoritesManga), pseudo)
                LibraryType.AnimeFavoritesList -> setToolbar(getString(R.string.favoritesAnime), pseudo)
            }
        }

        viewModel.state.observe(viewLifecycleOwner) { state ->
            when (state) {
                LibraryViewModel.State.Loading -> {
                    if (binding.swipeRefreshLayout.isRefreshing) {
                        binding.swipeRefreshLayout.isRefreshing = true
                    } else {
                        binding.isLoading.cslIsLoading.visibility = View.VISIBLE
                    }
                }
                is LibraryViewModel.State.SuccessLoading -> {
                    itemList.apply {
                        clear()
                        addAll(state.itemList)
                    }
                    displayLibrary()
                    mangaJapAdapter.notifyDataSetChanged()
                    binding.swipeRefreshLayout.isRefreshing = false
                    binding.isLoading.cslIsLoading.visibility = View.GONE
                }
                is LibraryViewModel.State.FailedLoading -> when (state.error) {
                    is JsonApiResponse.Error.ServerError -> Toast.makeText(requireContext(), getString(R.string.serverError), Toast.LENGTH_SHORT).show()
                    is JsonApiResponse.Error.NetworkError -> Toast.makeText(requireContext(), getString(R.string.serverError), Toast.LENGTH_SHORT).show()
                    is JsonApiResponse.Error.UnknownError -> Toast.makeText(requireContext(), getString(R.string.error), Toast.LENGTH_SHORT).show()
                }

                LibraryViewModel.State.Saving -> binding.isUpdating.cslIsUpdating.visibility = View.VISIBLE
                is LibraryViewModel.State.SuccessSaving -> {
                    itemList
                            .find {
                                when (it) {
                                    is MangaEntry -> it.id == state.jsonApiResource.id
                                    else -> false
                                }
                            }
                            ?.let {
                                when (state.jsonApiResource) {
                                    is MangaJapAdapter.Item -> itemList[itemList.indexOf(it)] = state.jsonApiResource
                                }
                            }
                    mangaJapAdapter.notifyDataSetChanged()
                    binding.isUpdating.cslIsUpdating.visibility = View.GONE
                }
                is LibraryViewModel.State.FailedSaving -> when (state.error) {
                    is JsonApiResponse.Error.ServerError -> Toast.makeText(requireContext(), getString(R.string.serverError), Toast.LENGTH_SHORT).show()
                    is JsonApiResponse.Error.NetworkError -> Toast.makeText(requireContext(), getString(R.string.serverError), Toast.LENGTH_SHORT).show()
                    is JsonApiResponse.Error.UnknownError -> Toast.makeText(requireContext(), getString(R.string.error), Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }


    private fun displayLibrary() {
        binding.sortBySpinner.apply {
            var isFirstLaunch = true

            adapter = SpinnerAdapter(context, SortBy.values().map { getString(it.stringId) })
            onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
                override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                    // OnItemSelected se lance au demarrage donc verifier si lancement ou pas
                    if (!isFirstLaunch) {
                        if (libraryPreference.sortBy == SortBy.values()[position]) {
                            libraryPreference.sortInReverse = !libraryPreference.sortInReverse
                        } else {
                            libraryPreference.sortBy = SortBy.values()[position]
                            libraryPreference.sortInReverse = false
                        }
                        displayList()
                    }
                    isFirstLaunch = false
                }

                override fun onNothingSelected(parent: AdapterView<*>?) {}
            }
            setSelection(libraryPreference.sortBy.ordinal)
        }

        binding.filter.apply {
            visibility = when (libraryType) {
                LibraryType.MangaList,
                LibraryType.AnimeList -> View.VISIBLE
                LibraryType.MangaFavoritesList,
                LibraryType.AnimeFavoritesList -> View.GONE
            }
            setOnClickListener {
                libraryPreference.showStatusHeader = !libraryPreference.showStatusHeader
                displayList()
            }
        }

        binding.swipeRefreshLayout.apply {
            setProgressBackgroundColorSchemeColor(requireContext().getAttrColor(R.attr.backgroundPrimaryColor))
            setColorSchemeColors(requireContext().getAttrColor(R.attr.colorAccent))
            setOnRefreshListener {
                when (libraryType) {
                    LibraryType.MangaList -> viewModel.getMangaLibrary(userId)
                    LibraryType.AnimeList -> viewModel.getAnimeLibrary(userId)
                    LibraryType.MangaFavoritesList -> viewModel.getMangaFavorites(userId)
                    LibraryType.AnimeFavoritesList -> viewModel.getAnimeFavorites(userId)
                }
            }
        }

        binding.emptyListTextView.visibility = if (itemList.isEmpty()) View.VISIBLE else View.GONE

        if (itemList.isEmpty()) return

        displayList()

        binding.libraryRecyclerView.apply {
            spanCount = when (this.resources.configuration.orientation) {
                Configuration.ORIENTATION_PORTRAIT -> 3
                Configuration.ORIENTATION_LANDSCAPE -> 4
                else -> 3
            }
            layoutManager = GridLayoutManager(context, spanCount).also {
                it.spanSizeLookup = object : GridLayoutManager.SpanSizeLookup() {
                    override fun getSpanSize(position: Int): Int {
                        if (itemList[position] is Header) return it.spanCount
                        return 1
                    }
                }
            }
            adapter = mangaJapAdapter
        }
    }

    private fun displayList() {
        sortList()
        headerStatus()
    }

    private fun sortList() {
        when (libraryPreference.sortBy) {
            SortBy.Title -> {
                itemList.sortBy { item ->
                    when (item) {
                        is MangaEntry -> item.manga?.canonicalTitle ?: ""
                        is AnimeEntry -> item.anime?.canonicalTitle ?: ""
                        else -> ""
                    }
                }
            }
            SortBy.ModificationDate -> {
                itemList.sortByDescending { item ->
                    when (item) {
                        is MangaEntry -> item.updatedAt?.format("yyyy-MM-dd") ?: ""
                        is AnimeEntry -> item.updatedAt?.format("yyyy-MM-dd") ?: ""
                        else -> ""
                    }
                }
            }
            SortBy.Score -> {
                itemList.sortBy { item ->
                    when (item) {
                        is MangaEntry -> item.rating ?: 0
                        is AnimeEntry -> item.rating ?: 0
                        else -> 0
                    }
                }
            }
            SortBy.Progression -> {
                itemList.sortByDescending { item ->
                    when (item) {
                        is MangaEntry -> item.manga?.let { item.getProgress(it) } ?: 0
                        is AnimeEntry -> item.anime?.let { item.getProgress(it) } ?: 0
                        else -> 0
                    }
                }
            }
            SortBy.ReleaseDate -> {
                itemList.sortByDescending { item ->
                    when (item) {
                        is MangaEntry -> item.manga?.startDate?.format("yyyy-MM-dd") ?: ""
                        is AnimeEntry -> item.anime?.startDate?.format("yyyy-MM-dd") ?: ""
                        else -> ""
                    }
                }
            }
        }
        if (libraryPreference.sortInReverse) itemList.reverse()
        mangaJapAdapter.notifyDataSetChanged()
    }

    private fun headerStatus() {
        val itemListFull: List<MangaJapAdapter.Item> = itemList.toList()
        itemList.clear()
        when (libraryType) {
            LibraryType.MangaFavoritesList, LibraryType.AnimeFavoritesList -> {
                itemList.addAll(itemListFull.filterNot { it is Header })
            }
            LibraryType.MangaList, LibraryType.AnimeList -> {
                if (!libraryPreference.showStatusHeader) {
                    itemList.addAll(itemListFull.filterNot { it is Header })
                } else {
                    itemListFull
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
                                when (val media = it.value[0]) {
                                    is MangaEntry -> itemList.add(Header(getString(media.status.stringId)).apply { typeLayout = MangaJapAdapter.Type.HEADER_LIBRARY_STATUS })
                                    is AnimeEntry -> itemList.add(Header(getString(media.status.stringId)).apply { typeLayout = MangaJapAdapter.Type.HEADER_LIBRARY_STATUS })
                                    else -> {}
                                }
                                itemList.addAll(it.value)
                            }
                }
            }
        }
        mangaJapAdapter.notifyDataSetChanged()
    }
}