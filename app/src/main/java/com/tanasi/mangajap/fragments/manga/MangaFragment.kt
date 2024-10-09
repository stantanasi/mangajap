package com.tanasi.mangajap.fragments.manga

import android.content.Context
import android.os.Bundle
import android.view.Gravity
import android.view.LayoutInflater
import android.view.Menu
import android.view.MenuInflater
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.PopupWindow
import android.widget.Toast
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.flowWithLifecycle
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.navArgs
import com.google.android.material.tabs.TabLayout
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.FragmentMangaBinding
import com.tanasi.mangajap.databinding.PopupMangaBinding
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.models.MangaEntry
import com.tanasi.mangajap.models.User
import com.tanasi.mangajap.utils.extensions.setToolbar
import com.tanasi.mangajap.utils.extensions.shareText
import com.tanasi.mangajap.utils.extensions.viewModelsFactory
import kotlinx.coroutines.launch

class MangaFragment : Fragment() {

    private enum class MangaTab(val stringId: Int) {
        ABOUT(R.string.about),
        VOLUMES(R.string.volumes);
    }

    private var _binding: FragmentMangaBinding? = null
    private val binding get() = _binding!!

    private val args by navArgs<MangaFragmentArgs>()
    val viewModel by viewModelsFactory {
        MangaViewModel(args.mangaId)
    }

    private lateinit var manga: Manga
    private val aboutFragment by lazy { binding.fMangaAbout.getFragment<MangaAboutFragment>() }
    private val volumesFragment by lazy { binding.fMangaVolumes.getFragment<MangaVolumesFragment>() }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentMangaBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        initializeManga()

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.state.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED).collect { state ->
                when (state) {
                    MangaViewModel.State.Loading -> binding.isLoading.apply {
                        root.visibility = View.VISIBLE
                    }

                    is MangaViewModel.State.SuccessLoading -> {
                        displayManga(state.manga)
                        binding.isLoading.root.visibility = View.GONE
                    }

                    is MangaViewModel.State.FailedLoading -> {
                        when (state.error) {
                            is JsonApiResponse.Error.ServerError -> state.error.body.errors.map {
                                Toast.makeText(
                                    requireContext(),
                                    it.title,
                                    Toast.LENGTH_SHORT
                                ).show()
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

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }


    private fun initializeManga() {
        setToolbar(args.mangaTitle, "")
        setHasOptionsMenu(true)

        binding.tlManga.apply {
            MangaTab.entries
                .map { newTab().setText(getString(it.stringId)) }
                .forEach { addTab(it) }

            addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
                override fun onTabSelected(tab: TabLayout.Tab) {
                    showTab(MangaTab.entries[tab.position])
                }

                override fun onTabUnselected(tab: TabLayout.Tab) {}
                override fun onTabReselected(tab: TabLayout.Tab) {}
            })
            getTabAt(selectedTabPosition)?.apply {
                select()
                showTab(MangaTab.entries[selectedTabPosition])
            }
        }
    }

    private fun displayManga(manga: Manga) {
        this.manga = manga
        requireActivity().invalidateOptionsMenu()

        binding.pbMangaProgressionProgress.apply {
            progress = manga.mangaEntry?.getProgress(manga) ?: 0
            progressTintList = manga.mangaEntry?.let {
                ContextCompat.getColorStateList(
                    requireContext(),
                    it.getProgressColor(manga)
                )
            }
        }

        binding.clMangaProgressionAdd.apply {
            setOnClickListener { _ ->
                val mangaEntry = manga.mangaEntry?.also {
                    it.isAdd = true
                } ?: MangaEntry().also {
                    it.isAdd = true
                    it.status = MangaEntry.Status.READING
                    it.user = User(id = Firebase.auth.uid)
                    it.manga = manga
                }

                viewModel.saveMangaEntry(mangaEntry)

                setOnClickListener(null)
                binding.ivMangaProgressionAdd.visibility = View.GONE
                binding.pbMangaProgressionAdd.visibility = View.VISIBLE
            }

            visibility = when {
                manga.mangaEntry?.isAdd == true -> View.GONE
                else -> View.VISIBLE
            }
        }

        binding.ivMangaProgressionAdd.visibility = View.VISIBLE

        binding.pbMangaProgressionAdd.visibility = View.GONE

        binding.tvMangaProgressionAdd.text = getString(R.string.add_manga_to_library)
    }

    private fun showTab(mangaTab: MangaTab) {
        childFragmentManager.beginTransaction().apply {
            when (mangaTab) {
                MangaTab.ABOUT -> show(aboutFragment)
                else -> hide(aboutFragment)
            }
            when (mangaTab) {
                MangaTab.VOLUMES -> show(volumesFragment)
                else -> hide(volumesFragment)
            }
            commitAllowingStateLoss()
        }
    }

    private fun displayPopupWindow() {
        val layoutInflater =
            requireActivity().getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
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


        popupMangaBinding.tvPopupMangaStatus.text = getString(
            manga.mangaEntry?.status?.stringId
                ?: MangaEntry.Status.READING.stringId
        )

        popupMangaBinding.vPopupMangaDelete.setOnClickListener { _ ->
            manga.mangaEntry?.let { mangaEntry ->
                viewModel.saveMangaEntry(mangaEntry.also {
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
    }
}
