package com.tanasi.mangajap.fragments.manga

import android.content.Context
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.*
import android.widget.LinearLayout
import android.widget.PopupWindow
import android.widget.Toast
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.tabs.TabLayout
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.MainActivity
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.databinding.FragmentMangaBinding
import com.tanasi.mangajap.databinding.PopupMangaBinding
import com.tanasi.mangajap.fragments.recyclerView.RecyclerViewFragment
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.models.MangaEntry
import com.tanasi.mangajap.models.User
import com.tanasi.mangajap.models.Volume
import com.tanasi.mangajap.ui.SpacingItemDecoration
import com.tanasi.mangajap.utils.extensions.*

class MangaFragment : Fragment() {

    private enum class MangaTab(
        val stringId: Int,
        var fragment: RecyclerViewFragment = RecyclerViewFragment(),
        var list: MutableList<MangaJapAdapter.Item> = mutableListOf()
    ) {
        About(R.string.about),
        Volumes(R.string.volumes);
    }

    private var _binding: FragmentMangaBinding? = null
    private val binding: FragmentMangaBinding get() = _binding!!

    private val args: MangaFragmentArgs by navArgs()
    val viewModel: MangaViewModel by viewModels()

    private lateinit var manga: Manga
    var showDetailsVolume: Volume? = null


    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentMangaBinding.inflate(inflater, container, false)
        viewModel.getManga(args.mangaId)
        MangaTab.values().forEach {
            it.fragment = RecyclerViewFragment()
            it.list = mutableListOf()
        }
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setToolbar(args.mangaTitle, "")
        setHasOptionsMenu(true)

        MangaTab.About.let {
            it.fragment.setList(it.list, LinearLayoutManager(requireContext()))
            addTab(it)
        }
        MangaTab.Volumes.let {
            it.fragment.setList(
                it.list,
                GridLayoutManager(requireContext(), MANGA_VOLUME_SPAN_COUNT).apply {
                    spanSizeLookup = object : GridLayoutManager.SpanSizeLookup() {
                        override fun getSpanSize(position: Int): Int {
                            return when (it.list[position].typeLayout) {
                                MangaJapAdapter.Type.VOLUME_MANGA_DETAILS -> spanCount
                                else -> 1
                            }
                        }
                    }
                },
            )
            it.fragment.setPadding(resources.getDimension(R.dimen.manga_spacing).toInt())
            it.fragment.addItemDecoration(SpacingItemDecoration(
                vertical = (resources.getDimension(R.dimen.manga_spacing) * 1.5).toInt() / 2,
                horizontal = (resources.getDimension(R.dimen.manga_spacing) * 1.5).toInt(),
            ))
        }

        viewModel.state.observe(viewLifecycleOwner) { state ->
            when (state) {
                MangaViewModel.State.Loading -> binding.isLoading.root.visibility = View.VISIBLE
                is MangaViewModel.State.SuccessLoading -> {
                    manga = state.manga
                    displayManga()
                    binding.isLoading.root.visibility = View.GONE
                }
                is MangaViewModel.State.FailedLoading -> when (state.error) {
                    is JsonApiResponse.Error.ServerError -> state.error.body.errors.map {
                        Toast.makeText(requireContext(), it.title, Toast.LENGTH_SHORT).show()
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

                MangaViewModel.State.AddingEntry -> {
                    binding.clMangaProgressionAdd.setOnClickListener(null)
                    binding.ivMangaProgressionAdd.visibility = View.GONE
                    binding.pbMangaProgressionAdd.visibility = View.VISIBLE
                }
                is MangaViewModel.State.SuccessAddingEntry -> {
                    manga.mangaEntry = state.mangaEntry
                    binding.ivMangaProgressionAdd.apply {
                        visibility = View.VISIBLE
                        setImageResource(R.drawable.ic_check_black_24dp)
                    }
                    binding.pbMangaProgressionAdd.visibility = View.GONE
                    binding.tvMangaProgressionAdd.text = getString(R.string.added_to_library)
                    Handler(Looper.getMainLooper()).postDelayed({
                        displayManga()
                    }, 1 * 1000.toLong())
                }
                is MangaViewModel.State.FailedAddingEntry -> when (state.error) {
                    is JsonApiResponse.Error.ServerError -> state.error.body.errors.map {
                        Toast.makeText(requireContext(), it.title, Toast.LENGTH_SHORT).show()
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

                MangaViewModel.State.Updating -> binding.isUpdating.root.visibility = View.VISIBLE
                is MangaViewModel.State.SuccessUpdating -> {
                    manga.mangaEntry = state.mangaEntry
                    displayManga()
                    binding.isUpdating.root.visibility = View.GONE
                }
                is MangaViewModel.State.FailedUpdating -> when (state.error) {
                    is JsonApiResponse.Error.ServerError -> state.error.body.errors.map {
                        Toast.makeText(requireContext(), it.title, Toast.LENGTH_SHORT).show()
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

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {
        if (this::manga.isInitialized) {
            manga.mangaEntry?.let { mangaEntry ->
                if (mangaEntry.isAdd) inflater.inflate(R.menu.menu_fragment_manga, menu)
                else inflater.inflate(R.menu.menu_share, menu)
            } ?: let {
                inflater.inflate(R.menu.menu_share, menu)
            }
        }
        super.onCreateOptionsMenu(menu, inflater)
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            R.id.more -> {
                displayPopupWindow()
                return true
            }
            R.id.share -> {
                shareText(getString(R.string.shareManga, manga.title))
                return true
            }
        }
        return super.onOptionsItemSelected(item)
    }


    fun displayManga() {
        if (_binding == null) {
            (requireActivity() as MainActivity).reloadActivity()
            return
        }

        activity?.invalidateOptionsMenu()

        binding.pbMangaProgressionProgress.apply {
            manga.mangaEntry?.let { mangaEntry ->
                progress = mangaEntry.getProgress(manga)
                progressTintList = ContextCompat.getColorStateList(requireContext(), mangaEntry.getProgressColor(manga))
            }
        }

        binding.clMangaProgressionAdd.apply {
            manga.mangaEntry?.let { mangaEntry ->
                if (mangaEntry.isAdd) {
                    visibility =  View.GONE
                } else {
                    visibility = View.VISIBLE
                    setOnClickListener { _ ->
                        viewModel.addMangaEntry(mangaEntry.also {
                            it.isAdd = true
                        })
                    }
                }
            } ?: also {
                visibility = View.VISIBLE
                setOnClickListener {
                    viewModel.addMangaEntry(MangaEntry().also {
                        it.isAdd = true
                        it.status = MangaEntry.Status.reading
                        it.user = User(id = Firebase.auth.uid)
                        it.manga = manga
                    })
                }
            }
        }

        binding.ivMangaProgressionAdd.setImageResource(R.drawable.ic_add_black_24dp)

        binding.pbMangaProgressionAdd.visibility = View.GONE

        binding.tvMangaProgressionAdd.text = getString(R.string.add_manga_to_library)

        setMangaAboutFragment()
        setMangaVolumeFragment()

        binding.tlManga.apply {
            addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
                override fun onTabSelected(tab: TabLayout.Tab) {
                    MangaTab.values()
                        .find { getString(it.stringId) == tab.text.toString() }
                        ?.let {
                            showTab(it)
                        }
                }
                override fun onTabUnselected(tab: TabLayout.Tab) {}
                override fun onTabReselected(tab: TabLayout.Tab) {}
            })
            getTabAt(selectedTabPosition)?.apply {
                select()
                MangaTab.values()
                    .find { getString(it.stringId) == text.toString() }
                    ?.let {
                        showTab(it)
                    }
            }
        }
    }

    private fun setMangaAboutFragment() {
        MangaTab.About.list.apply {
            clear()
            add(manga.clone().apply { typeLayout = MangaJapAdapter.Type.MANGA_HEADER })
            add(manga.clone().apply { typeLayout = MangaJapAdapter.Type.MANGA_HEADER_SUMMARY })
            if (manga.mangaEntry != null)
                add(manga.clone().apply { typeLayout = MangaJapAdapter.Type.MANGA_HEADER_PROGRESSION })
            if (manga.franchises.isNotEmpty())
                add(manga.clone().apply { typeLayout = MangaJapAdapter.Type.MANGA_HEADER_FRANCHISES })
            add(manga.clone().apply { typeLayout = MangaJapAdapter.Type.MANGA_HEADER_REVIEWS })
        }

        if (MangaTab.About.fragment.isAdded)
            MangaTab.About.fragment.mangaJapAdapter?.notifyDataSetChanged()
    }

    private fun setMangaVolumeFragment() {
        MangaTab.Volumes.list.apply {
            clear()
            addAll(manga.volumes.map { volume ->
                volume.apply { typeLayout  = MangaJapAdapter.Type.VOLUME_MANGA }
            })

            showDetailsVolume?.let {
                MangaTab.Volumes.list.addOrLast(
                    index = (MANGA_VOLUME_SPAN_COUNT - MangaTab.Volumes.list.indexOf(it) % MANGA_VOLUME_SPAN_COUNT)
                            + MangaTab.Volumes.list.indexOf(it),
                    it.clone().apply { typeLayout = MangaJapAdapter.Type.VOLUME_MANGA_DETAILS }
                )
            }
        }

        if (MangaTab.Volumes.list.isNotEmpty()) {
            if (MangaTab.Volumes.fragment.isAdded)
                MangaTab.Volumes.fragment.mangaJapAdapter?.notifyDataSetChanged()
            addTab(MangaTab.Volumes)
        }
    }

    private fun addTab(mangaTab: MangaTab) {
        val ft: FragmentTransaction = childFragmentManager.beginTransaction()

        if (!binding.tlManga.contains(getString(mangaTab.stringId))) {
            binding.tlManga.add(getString(mangaTab.stringId))
            if (mangaTab.fragment.isAdded) {
                ft.detach(mangaTab.fragment)
                ft.attach(mangaTab.fragment)
            } else {
                ft.add(binding.flManga.id, mangaTab.fragment)
            }
        }

        ft.commitAllowingStateLoss()
    }

    private fun showTab(mangaTab: MangaTab) {
        val ft: FragmentTransaction = childFragmentManager.beginTransaction()

        MangaTab.values().forEach {
            when (mangaTab) {
                it -> ft.show(mangaTab.fragment)
                else -> ft.hide(it.fragment)
            }
        }

        ft.commitAllowingStateLoss()
    }

    private fun displayPopupWindow() {
        val layoutInflater = requireActivity().getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val popupMangaBinding = PopupMangaBinding.inflate(layoutInflater)

        val popupWindow = PopupWindow(
            popupMangaBinding.root,
            ConstraintLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT,
            true
        ).apply {
            elevation = 25f
            showAtLocation(popupMangaBinding.root, Gravity.TOP or Gravity.END, 100, 200)
        }


        popupMangaBinding.tvPopupMangaStatus.text = getString(manga.mangaEntry?.status?.stringId ?: MangaEntry.Status.reading.stringId)

        popupMangaBinding.vPopupMangaDelete.setOnClickListener { _ ->
            manga.mangaEntry?.let { mangaEntry ->
                viewModel.updateMangaEntry(mangaEntry.also {
                    it.isAdd = false
                })
            }
            popupWindow.dismiss()
        }

        popupMangaBinding.vPopupMangaShare.setOnClickListener {
            shareText(getString(R.string.shareManga, manga.title))
        }
    }


    companion object {
        const val MANGA_SYNOPSIS_MAX_LINES: Int = 3
        private const val MANGA_VOLUME_SPAN_COUNT: Int = 3
    }
}
