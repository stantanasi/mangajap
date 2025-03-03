package com.tanasi.mangajap.fragments.reader

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.flowWithLifecycle
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearSnapHelper
import com.tanasi.mangajap.databinding.FragmentReaderBinding
import com.tanasi.mangajap.models.Page
import com.tanasi.mangajap.utils.viewModelsFactory
import kotlinx.coroutines.launch

class ReaderFragment : Fragment() {

    enum class ReaderType {
        CHAPTER,
        VOLUME;
    }

    private var _binding: FragmentReaderBinding? = null
    private val binding get() = _binding!!

    private val args by navArgs<ReaderFragmentArgs>()
    private val viewModel by viewModelsFactory { ReaderViewModel(args.id, args.readerType) }

    private val readerAdapter = ReaderAdapter()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentReaderBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        initializeReader()

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.state.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED).collect { state ->
                when (state) {
                    ReaderViewModel.State.Loading -> binding.isLoading.apply {
                        root.visibility = View.VISIBLE
                        pbIsLoading.visibility = View.VISIBLE
                        gIsLoadingRetry.visibility = View.GONE
                    }

                    is ReaderViewModel.State.SuccessLoading -> {
                        displayReader(state.pages)
                        binding.isLoading.root.visibility = View.GONE
                    }

                    is ReaderViewModel.State.FailedLoading -> {
                        Toast.makeText(
                            requireContext(),
                            state.error.message ?: "",
                            Toast.LENGTH_SHORT
                        ).show()
                        binding.isLoading.apply {
                            pbIsLoading.visibility = View.GONE
                            gIsLoadingRetry.visibility = View.VISIBLE
                            btnIsLoadingRetry.setOnClickListener {
                                viewModel.getPages(args.id, args.readerType)
                            }
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


    private fun initializeReader() {
        binding.rvReader.apply {
            adapter = readerAdapter
            LinearSnapHelper().attachToRecyclerView(this)
        }
    }

    private fun displayReader(pages: List<Page>) {
        readerAdapter.submitList(pages)
    }
}