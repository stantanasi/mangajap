package com.tanasi.mangajap.fragments.recyclerView

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.databinding.FragmentRecyclerViewBinding
import com.tanasi.mangajap.utils.extensions.dpToPx

open class RecyclerViewFragment : Fragment() {

    private var _binding: FragmentRecyclerViewBinding? = null
    private val binding: FragmentRecyclerViewBinding get() = _binding!!

    val viewModel: RecyclerViewViewModel by viewModels()

    private lateinit var list: List<MangaJapAdapter.Item>
    private lateinit var rvLayoutManager: RecyclerView.LayoutManager
    private var padding: Int = 0
    var mangaJapAdapter: MangaJapAdapter? = null
    val recyclerView: RecyclerView? get() = _binding?.recyclerView

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        _binding = FragmentRecyclerViewBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        // TODO: use ViewModel
//        viewModel.state.observe(viewLifecycleOwner) { state ->
//            when (state) {
//                RecyclerViewViewModel.State.Loading -> binding.isLoading.cslIsLoading.visibility = View.VISIBLE
//                is RecyclerViewViewModel.State.SuccessLoading -> {
//                    list = state.list
//                    mediaAdapter = MediaAdapter(list)
//                    rvLayoutManager = state.layoutManager
//                    padding = state.padding
//                    displayList()
//                    binding.isLoading.cslIsLoading.visibility = View.GONE
//                }
//                is RecyclerViewViewModel.State.FailedLoading -> Toast.makeText(requireContext(), getString(R.string.error), Toast.LENGTH_SHORT).show()
//            }
//        }

        if (this::list.isInitialized && this::rvLayoutManager.isInitialized) {
            mangaJapAdapter = MangaJapAdapter(list)

            displayList()

            binding.isLoading.root.visibility = View.GONE
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }


    private fun displayList() {
        binding.recyclerView.apply {
            layoutManager = when (rvLayoutManager) {
                is GridLayoutManager -> {
                    GridLayoutManager(requireContext(), (rvLayoutManager as GridLayoutManager).spanCount).also {
                        it.spanSizeLookup = (rvLayoutManager as GridLayoutManager).spanSizeLookup
                    }
                }
                is LinearLayoutManager -> LinearLayoutManager(requireContext(), (rvLayoutManager as LinearLayoutManager).orientation, (rvLayoutManager as LinearLayoutManager).reverseLayout)
                else -> LinearLayoutManager(requireContext())
            }
            adapter = mangaJapAdapter
            setPadding(
                padding.dpToPx(requireContext()),
                padding.dpToPx(requireContext()),
                padding.dpToPx(requireContext()),
                padding.dpToPx(requireContext()),
            )
        }
    }

    fun setList(list: List<MangaJapAdapter.Item>, rvLayoutManager: RecyclerView.LayoutManager, padding: Int = 0) {
        this.list = list
        this.rvLayoutManager = rvLayoutManager
        this.padding = padding
    }

    fun isLoading(isLoading: Boolean) {
        if (_binding == null) return

        if (isLoading) {
            binding.isLoading.root.visibility = View.VISIBLE
        } else {
            binding.isLoading.root.visibility = View.GONE
        }
    }
}