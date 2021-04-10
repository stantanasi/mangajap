package com.tanasi.mangajap.fragments.reading

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.SeekBar
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.PagerSnapHelper
import androidx.recyclerview.widget.RecyclerView
import androidx.recyclerview.widget.SnapHelper
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.MainActivity
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.databinding.FragmentReadingBinding
import com.tanasi.mangajap.models.Book
import com.tanasi.mangajap.utils.extensions.setToolbar
import com.tanasi.mangajap.utils.preferences.BookPreference
import com.tanasi.mangajap.utils.preferences.SettingsPreference

class ReadingFragment : Fragment() {

    private var _binding: FragmentReadingBinding? = null
    private val binding: FragmentReadingBinding get() = _binding!!

    private val args: ReadingFragmentArgs by navArgs()

    private val viewModel: ReadingViewModel by viewModels()

    private lateinit var book: Book

    private lateinit var bookPreference: BookPreference
    private lateinit var settingsPreference: SettingsPreference

    var isNavigationToolsOpen: Boolean = false

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentReadingBinding.inflate(inflater, container, false)
        viewModel.getBook(args.bookPath)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        settingsPreference = SettingsPreference(requireContext())

        setToolbar(args.bookTitle, "")

        viewModel.state.observe(viewLifecycleOwner) { state ->
            when (state) {
                ReadingViewModel.State.Loading -> binding.isLoading.cslIsLoading.visibility = View.VISIBLE
                is ReadingViewModel.State.SuccessLoading -> {
                    book = state.book
                    displayPages()
                    binding.isLoading.cslIsLoading.visibility = View.GONE
                }
                is ReadingViewModel.State.FailedLoading -> Toast.makeText(requireContext(), getString(R.string.error), Toast.LENGTH_SHORT).show()
            }
        }

        showNavigationTools(true)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }


    fun showNavigationTools(show: Boolean) {
        if (show) {
            (requireActivity() as MainActivity).supportActionBar?.show()
        } else {
            (requireActivity() as MainActivity).supportActionBar?.hide()
        }

        binding.navigationToolsLinearLayout.apply {
            visibility = if (show) {
                View.VISIBLE
            } else {
                View.GONE
            }
        }

        isNavigationToolsOpen = show
    }

    private fun displayPages() {
        bookPreference = BookPreference(requireContext(), book.name)

        binding.readingRecyclerView.apply {
            val mediaAdapter = MangaJapAdapter(book.pages)
            val snapHelper: SnapHelper = PagerSnapHelper()

            snapHelper.attachToRecyclerView(this)
            layoutManager = LinearLayoutManager(requireContext(), settingsPreference.isVerticalReading, settingsPreference.isReverseReading)
            adapter = mediaAdapter
            addOnScrollListener(object : RecyclerView.OnScrollListener() {
                override fun onScrolled(recyclerView: RecyclerView, dx: Int, dy: Int) {
                    super.onScrolled(recyclerView, dx, dy)
                    displayCurrentPage((layoutManager as LinearLayoutManager?)?.findLastVisibleItemPosition() ?: 0)
                }
            })

            if (settingsPreference.openBookmark) {
                scrollToPosition(bookPreference.savedBookmark)
            }
        }
    }

    private fun displayCurrentPage(position: Int) {
        bookPreference.savedBookmark = position

        binding.currentPageTextView.text = (position + 1).toString()

        binding.totalPageTextView.text = book.pageCount.toString()

        binding.progressReadingSeekBar.apply {
            max = book.pageCount - 1
            progress = position
            setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
                override fun onProgressChanged(seekBar: SeekBar, progress: Int, b: Boolean) {
                    binding.currentPageTextView.text = (progress + 1).toString()
                }

                override fun onStartTrackingTouch(seekBar: SeekBar) {}
                override fun onStopTrackingTouch(seekBar: SeekBar) {
                    binding.readingRecyclerView.scrollToPosition(seekBar.progress)
                }
            })
        }
    }
}