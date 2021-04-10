package com.tanasi.mangajap.fragments.books

import android.Manifest
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.Animation
import android.view.animation.AnimationUtils
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.MainActivity
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.databinding.FragmentBooksBinding
import com.tanasi.mangajap.fragments.browse.BrowseFragment
import com.tanasi.mangajap.models.Book
import com.tanasi.mangajap.utils.extensions.getExternalStorageDirectory
import com.tanasi.mangajap.utils.extensions.getInternalStorageDirectory
import com.tanasi.mangajap.utils.extensions.isStoragePermissionGranted
import com.tanasi.mangajap.utils.extensions.setToolbar
import com.tanasi.mangajap.utils.preferences.GeneralPreference
import com.tanasi.mangajap.utils.preferences.SettingsPreference

class BooksFragment : Fragment() {

    private var _binding: FragmentBooksBinding? = null
    private val binding: FragmentBooksBinding get() = _binding!!

    private val args: BooksFragmentArgs by navArgs()

    private val viewModel: BooksViewModel by viewModels()

    private lateinit var generalPreference: GeneralPreference
    private lateinit var settingsPreference: SettingsPreference

    private val requestPermission = registerForActivityResult(ActivityResultContracts.RequestPermission()) { permission ->
        if (permission) {
            setBrowser()
            viewModel.getBooks(settingsPreference.booksFolder)
        } else {
            findNavController().navigateUp()
        }
    }

    private val bookList: MutableList<Book> = mutableListOf()
    private val mangaJapAdapter: MangaJapAdapter = MangaJapAdapter(bookList)
    
    private var mangaId: String? = null
    private var isFabOpen = false
    
    private lateinit var fadeInShadow: Animation
    private lateinit var fadeOutShadow: Animation
    private lateinit var fabOpen: Animation
    private lateinit var fabClose: Animation
    private lateinit var rotateForward: Animation
    private lateinit var rotateBackward: Animation

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentBooksBinding.inflate(inflater, container, false)
        mangaId = args.mangaId
        (requireActivity() as MainActivity).showBottomNavView(mangaId == null)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        generalPreference = GeneralPreference(requireContext())
        settingsPreference = SettingsPreference(requireContext())

        setToolbar(args.mangaTitle, getString(R.string.eBooks)).let {
            if (mangaId == null)
                it.visibility = View.GONE
            else
                it.visibility = View.VISIBLE
        }

        viewModel.state.observe(viewLifecycleOwner) { state ->
            when (state) {
                BooksViewModel.State.Loading -> binding.isLoading.cslIsLoading.visibility = View.VISIBLE
                is BooksViewModel.State.SuccessLoading -> {
                    bookList.apply {
                        clear()
                        addAll(state.books)
                    }
                    displayBooks()
                    binding.isLoading.cslIsLoading.visibility = View.GONE
                }
                is BooksViewModel.State.FailedLoading -> Toast.makeText(requireContext(), getString(R.string.error), Toast.LENGTH_SHORT).show()
            }
        }

        if (requireContext().isStoragePermissionGranted()) {
            viewModel.getBooks(settingsPreference.booksFolder)
            setBrowser()
        } else {
            requestPermission.launch(Manifest.permission.WRITE_EXTERNAL_STORAGE)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    
    private fun displayBooks() {
        binding.anyBooksTextView.apply {
            if (bookList.isEmpty()) {
                text = getString(R.string.anyEBooksIn, settingsPreference.booksFolder.joinToString("") { "- $it\n" })
                visibility = View.VISIBLE
            } else {
                visibility = View.GONE
            }
        }
        
        binding.myBooksRecyclerView.apply { 
            if (bookList.isNotEmpty()) {
                if (mangaId == null) {
                    changeItemView(generalPreference.savedBookLayoutType)
                    addOnScrollListener(object : RecyclerView.OnScrollListener() {
                        override fun onScrolled(recyclerView: RecyclerView, dx: Int, dy: Int) {
                            if (dy > 0) {
                                binding.changeItemLayout.visibility = View.GONE
                                binding.fabOpen.hide()
                            } else if (dy < 0) {
                                binding.changeItemLayout.visibility = View.VISIBLE
                                binding.fabOpen.show()
                            }
                        }
                    })
                } else {
                    bookList.forEach {
                        it.typeLayout = MangaJapAdapter.Type.BOOK
                        it.mangaId = mangaId
                    }
                    layoutManager = GridLayoutManager(requireContext(), 2)
                }

                adapter = mangaJapAdapter
            }
        }
    }

    private fun setBrowser() {
        isFabOpen = false

        fadeInShadow = AnimationUtils.loadAnimation(requireContext(), R.anim.fade_in_shadow)
        fadeOutShadow = AnimationUtils.loadAnimation(requireContext(), R.anim.fade_out_shadow)
        fabOpen = AnimationUtils.loadAnimation(requireContext(), R.anim.fab_open)
        fabClose = AnimationUtils.loadAnimation(requireContext(), R.anim.fab_close)
        rotateForward = AnimationUtils.loadAnimation(requireContext(), R.anim.rotate_forward)
        rotateBackward = AnimationUtils.loadAnimation(requireContext(), R.anim.rotate_backward)

        binding.changeItemLayout.apply {
            if (mangaId != null) {
                visibility = View.GONE
            }
            setOnClickListener {
                if (bookList.isNotEmpty()) {
                    when (bookList[0].typeLayout) {
                        MangaJapAdapter.Type.BOOK -> {
                            generalPreference.savedBookLayoutType = MangaJapAdapter.Type.BOOK_DETAILS
                            changeItemView(MangaJapAdapter.Type.BOOK_DETAILS)
                        }
                        MangaJapAdapter.Type.BOOK_DETAILS -> {
                            generalPreference.savedBookLayoutType = MangaJapAdapter.Type.BOOK
                            changeItemView(MangaJapAdapter.Type.BOOK)
                        }
                        else -> {}
                    }
                }
            }
        }

        binding.shadow.apply {
            visibility = View.GONE
            setOnClickListener { openFab(false) }
        }

        binding.fabOpen.apply {
            if (mangaId == null) {
                show()
            } else {
                hide()
            }
            setOnClickListener { openFab(!isFabOpen) }
        }

        binding.fabInternalStorage.apply {
            hide()
            setOnClickListener {
                findNavController().navigate(
                        BooksFragmentDirections.actionEbooksToBrowse(
                                requireContext().getInternalStorageDirectory().absolutePath
                        )
                )
            }
        }

        binding.fabExternalStorage.apply {
            hide()
            setOnClickListener {
                findNavController().navigate(
                        BooksFragmentDirections.actionEbooksToBrowse(
                                requireContext().getExternalStorageDirectory().absolutePath
                        )
                )
            }
        }

        binding.fabDirectorySaved.apply {
            hide()
            setOnClickListener {
                findNavController().navigate(
                        BooksFragmentDirections.actionEbooksToBrowse(
                                BrowseFragment.FOLDER_LOCATION
                        )
                )
            }
        }
    }

    private fun changeItemView(typeLayout: MangaJapAdapter.Type) {
        for (i in bookList.indices) {
            bookList[i].typeLayout = typeLayout
        }

        binding.ivChangeItemLayout.apply {
            when (typeLayout) {
                MangaJapAdapter.Type.BOOK -> setImageResource(R.drawable.ic_view_module_black_24dp)
                MangaJapAdapter.Type.BOOK_DETAILS -> setImageResource(R.drawable.ic_view_stream_black_24dp)
                else -> {}
            }
        }

        binding.myBooksRecyclerView.apply {
            layoutManager = when (typeLayout) {
                MangaJapAdapter.Type.BOOK -> GridLayoutManager(requireContext(), 3)
                MangaJapAdapter.Type.BOOK_DETAILS -> LinearLayoutManager(requireContext())
                else -> LinearLayoutManager(requireContext())
            }
        }

        mangaJapAdapter.notifyDataSetChanged()
    }

    private fun openFab(open: Boolean) {
        binding.shadow.apply {
            visibility = if (open) {
                startAnimation(fadeInShadow)
                View.VISIBLE
            } else {
                startAnimation(fadeOutShadow)
                View.GONE
            }
        }

        binding.fabOpen.apply {
            if (open) startAnimation(rotateForward)
            else startAnimation(rotateBackward)
        }

        binding.fabInternalStorage.apply {
            if (open) {
                startAnimation(fabOpen)
                show()
            } else {
                startAnimation(fabClose)
                hide()
            }
        }

        binding.fabExternalStorage.apply {
            if (open) {
                startAnimation(fabOpen)
                show()
            } else {
                startAnimation(fabClose)
                hide()
            }
        }

        binding.fabDirectorySaved.apply {
            if (open) {
                startAnimation(fabOpen)
                show()
            } else {
                startAnimation(fabClose)
                hide()
            }
        }

        isFabOpen = open
    }
}