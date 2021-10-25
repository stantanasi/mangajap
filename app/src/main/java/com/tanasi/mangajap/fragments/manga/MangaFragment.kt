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
import com.tanasi.mangajap.utils.extensions.addOrLast
import com.tanasi.mangajap.utils.extensions.contains
import com.tanasi.mangajap.utils.extensions.setToolbar
import com.tanasi.mangajap.utils.extensions.shareText
import com.tanasi.mangajap.utils.preferences.UserPreference
import android.view.Gravity

class MangaFragment : Fragment() {

    // TODO: create Tab ?

    private var _binding: FragmentMangaBinding? = null
    private val binding: FragmentMangaBinding get() = _binding!!

    private val args: MangaFragmentArgs by navArgs()

    val viewModel: MangaViewModel by viewModels()

    private lateinit var manga: Manga
    var showDetailsVolume: Volume? = null

    private val mangaAboutList: MutableList<MangaJapAdapter.Item> = mutableListOf()
    private val mangaVolumeList: MutableList<MangaJapAdapter.Item> = mutableListOf()
    private val mangaMyBookList: MutableList<MangaJapAdapter.Item> = mutableListOf()

    private val mangaAboutFragment: RecyclerViewFragment = RecyclerViewFragment()
    private val mangaVolumeFragment: RecyclerViewFragment = RecyclerViewFragment()
    private val mangaBooksFragment: RecyclerViewFragment = RecyclerViewFragment()

    private var fragmentList: MutableList<Fragment> = mutableListOf()


    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentMangaBinding.inflate(inflater, container, false)
        viewModel.getManga(args.mangaId)
        mangaAboutFragment.setList(mangaAboutList, LinearLayoutManager(requireContext()))
        mangaVolumeFragment.setList(
                mangaVolumeList,
                GridLayoutManager(requireContext(), MANGA_VOLUME_SPAN_COUNT).apply {
                    spanSizeLookup = object : GridLayoutManager.SpanSizeLookup() {
                        override fun getSpanSize(position: Int): Int {
                            if (mangaVolumeList[position].typeLayout == MangaJapAdapter.Type.VOLUME_MANGA_DETAILS) return spanCount
                            return 1
                        }
                    }
                },
                7
        )
        mangaBooksFragment.setList(mangaMyBookList, GridLayoutManager(requireContext(), 3))
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setToolbar(args.mangaTitle, "")
        setHasOptionsMenu(true)

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
                if (mangaEntry.isAdd) inflater.inflate(R.menu.menu_manga_activity, menu)
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
                    setOnClickListener {
                        viewModel.addMangaEntry(mangaEntry.apply {
                            putAdd(true)
                        })
                    }
                }
            } ?: also {
                visibility = View.VISIBLE
                setOnClickListener {
                    viewModel.addMangaEntry(MangaEntry().also {
                        it.putAdd(true)
                        it.putStatus(MangaEntry.Status.reading)
                        it.putUser(User().apply { id = UserPreference(requireContext()).selfId })
                        it.putManga(manga)
                    })
                }
            }
        }

        binding.ivMangaProgressionAdd.setImageResource(R.drawable.ic_add_black_24dp)

        binding.pbMangaProgressionAdd.visibility = View.GONE

        binding.tvMangaProgressionAdd.text = getString(R.string.add_manga_to_library)

        setMangaAboutFragment()
        setMangaVolumeFragment()

        binding.tbManga.apply {
            addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
                override fun onTabSelected(tab: TabLayout.Tab) {
                    showFragment(fragmentList[tab.position])
                }
                override fun onTabUnselected(tab: TabLayout.Tab) {}
                override fun onTabReselected(tab: TabLayout.Tab) {}
            })
            getTabAt(selectedTabPosition)?.apply {
                select()
                showFragment(fragmentList[position])
            }
        }
    }

    private fun setMangaAboutFragment() {
        mangaAboutList.apply {
            clear()
            add(manga.clone().apply { typeLayout = MangaJapAdapter.Type.MANGA_HEADER })
            add(manga.clone().apply { typeLayout = MangaJapAdapter.Type.MANGA_HEADER_SUMMARY })
            if (manga.mangaEntry != null)
                add(manga.clone().apply { typeLayout = MangaJapAdapter.Type.MANGA_HEADER_PROGRESSION })
            add(manga.clone().apply { typeLayout = MangaJapAdapter.Type.MANGA_HEADER_REVIEWS })
        }

        if (mangaAboutFragment.isAdded) mangaAboutFragment.mangaJapAdapter?.notifyDataSetChanged()
        addFragment(mangaAboutFragment, getString(R.string.about))
    }

    private fun setMangaVolumeFragment() {
        mangaVolumeList.apply {
            clear()
            addAll(manga.volumes.map { volume ->
                volume.apply { typeLayout  = MangaJapAdapter.Type.VOLUME_MANGA }
            })

            showDetailsVolume?.let {
                mangaVolumeList.addOrLast(
                    (MANGA_VOLUME_SPAN_COUNT - mangaVolumeList.indexOf(it) % MANGA_VOLUME_SPAN_COUNT) + mangaVolumeList.indexOf(it),
                    it.clone().apply { typeLayout = MangaJapAdapter.Type.VOLUME_MANGA_DETAILS }
                )
            }
        }

        if (mangaVolumeList.isNotEmpty()) {
            if (mangaVolumeFragment.isAdded) mangaVolumeFragment.mangaJapAdapter?.notifyDataSetChanged()
            addFragment(mangaVolumeFragment, getString(R.string.volumes))
        }
    }

    private fun addFragment(fragment: Fragment, title: String) {
        val ft: FragmentTransaction = childFragmentManager.beginTransaction()

        if (!fragmentList.contains(fragment)) {
            fragmentList.add(fragment)
            binding.tbManga.addTab(binding.tbManga.newTab().setText(title))
            if (!fragment.isAdded) {
                ft.add(binding.flManga.id, fragment)
            }
        } else {
            if (!binding.tbManga.contains(title)) {
                binding.tbManga.addTab(binding.tbManga.newTab().setText(title))
                if (fragment.isAdded) {
                    ft.detach(fragment)
                    ft.attach(fragment)
                }
            }
        }

        ft.commitAllowingStateLoss()
    }

    private fun showFragment(fragment: Fragment) {
        val ft: FragmentTransaction = childFragmentManager.beginTransaction()
        for (i in fragmentList.indices) {
            if (fragmentList[i] === fragment) {
                ft.show(fragmentList[i])
            } else {
                ft.hide(fragmentList[i])
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

        popupMangaBinding.vPopupMangaDelete.setOnClickListener {
            manga.mangaEntry?.let { mangaEntry ->
                viewModel.updateMangaEntry(mangaEntry.apply {
                    putAdd(false)
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
