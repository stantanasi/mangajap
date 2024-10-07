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
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.databinding.FragmentRecyclerViewBinding

open class RecyclerViewFragment : Fragment() {

    private var _binding: FragmentRecyclerViewBinding? = null
    private val binding: FragmentRecyclerViewBinding get() = _binding!!

    val viewModel: RecyclerViewViewModel by viewModels()

    private lateinit var list: List<AppAdapter.Item>
    private lateinit var rvLayoutManager: RecyclerView.LayoutManager

    var adapter: AppAdapter? = null
    val recyclerView: RecyclerView? get() = _binding?.recyclerView

    private var paddingLeft: Int = 0
    private var paddingTop: Int = 0
    private var paddingRight: Int = 0
    private var paddingBottom: Int = 0
    private val decors = mutableListOf<RecyclerView.ItemDecoration>()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
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
            adapter = AppAdapter(list)

            displayList()

            binding.isLoading.root.visibility = View.GONE
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }


    private fun displayList() {
        binding.recyclerView.also { recyclerView ->
            recyclerView.layoutManager = when (rvLayoutManager) {
                is GridLayoutManager -> GridLayoutManager(
                    requireContext(),
                    (rvLayoutManager as GridLayoutManager).spanCount
                ).also {
                    it.spanSizeLookup = (rvLayoutManager as GridLayoutManager).spanSizeLookup
                }

                is LinearLayoutManager -> LinearLayoutManager(
                    requireContext(),
                    (rvLayoutManager as LinearLayoutManager).orientation,
                    (rvLayoutManager as LinearLayoutManager).reverseLayout
                )

                else -> LinearLayoutManager(requireContext())
            }
            recyclerView.adapter = adapter

            recyclerView.setPadding(
                paddingLeft,
                paddingTop,
                paddingRight,
                paddingBottom,
            )

            decors.forEach { recyclerView.addItemDecoration(it) }
        }
    }


    fun setList(list: List<AppAdapter.Item>, rvLayoutManager: RecyclerView.LayoutManager) {
        this.list = list
        this.rvLayoutManager = rvLayoutManager
    }

    fun setPadding(padding: Int) = setPadding(padding, padding, padding, padding)
    fun setPadding(left: Int, top: Int, right: Int, bottom: Int) {
        paddingLeft = left
        paddingTop = top
        paddingRight = right
        paddingBottom = bottom
    }

    fun addItemDecoration(decor: RecyclerView.ItemDecoration) = decors.add(decor)


    fun isLoading(isLoading: Boolean) {
        if (_binding == null) return

        if (isLoading) {
            binding.isLoading.root.visibility = View.VISIBLE
        } else {
            binding.isLoading.root.visibility = View.GONE
        }
    }
}