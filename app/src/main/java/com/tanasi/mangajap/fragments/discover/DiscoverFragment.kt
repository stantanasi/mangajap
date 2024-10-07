package com.tanasi.mangajap.fragments.discover

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearSnapHelper
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.databinding.FragmentDiscoverBinding
import com.tanasi.mangajap.models.Ad
import com.tanasi.mangajap.models.Anime
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.ui.SpacingItemDecoration
import com.tanasi.mangajap.utils.extensions.addOrLast

class DiscoverFragment : Fragment() {

    private var _binding: FragmentDiscoverBinding? = null
    private val binding: FragmentDiscoverBinding get() = _binding!!

    val viewModel: DiscoverViewModel by viewModels()

    private val peopleList: MutableList<AppAdapter.Item> = mutableListOf()
    private val mangaRecentList: MutableList<Manga> = mutableListOf()
    private val animeRecentList: MutableList<Anime> = mutableListOf()

    private val peopleAdapter: AppAdapter = AppAdapter(peopleList)
    private val mangaRecentAdapter: AppAdapter = AppAdapter(mangaRecentList)
    private val animeRecentAdapter: AppAdapter = AppAdapter(animeRecentList)

    private val snapHelper: LinearSnapHelper = LinearSnapHelper()


    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentDiscoverBinding.inflate(inflater, container, false)
        viewModel.getDiscover()
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.llSearch.setOnClickListener {
            findNavController().navigate(
                    DiscoverFragmentDirections.actionDiscoverToSearch()
            )
        }

        viewModel.state.observe(viewLifecycleOwner) { state ->
            when (state) {
                DiscoverViewModel.State.Loading -> binding.isLoading.root.visibility = View.VISIBLE
                is DiscoverViewModel.State.SuccessLoading -> {
                    peopleList.apply {
                        clear()
                        addAll(state.peopleList)
                        addOrLast(1, Ad().also { it.itemType = AppAdapter.Type.AD_DISCOVER })
                    }
                    mangaRecentList.apply {
                        clear()
                        addAll(state.mangaRecentList)
                    }
                    animeRecentList.apply {
                        clear()
                        addAll(state.animeRecentList)
                    }

                    displayDiscover()
                    binding.isLoading.root.visibility = View.GONE
                }
                is DiscoverViewModel.State.FailedLoading -> when (state.error) {
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

                DiscoverViewModel.State.Updating -> binding.isUpdating.root.visibility = View.VISIBLE
                is DiscoverViewModel.State.SuccessUpdating -> {
                    mangaRecentAdapter.notifyDataSetChanged()
                    animeRecentAdapter.notifyDataSetChanged()
                    binding.isUpdating.root.visibility = View.GONE
                }
                is DiscoverViewModel.State.FailedUpdating -> when (state.error) {
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


    private fun displayDiscover() {
        binding.rvDiscoverPeople.apply {
            adapter = peopleAdapter
            snapHelper.attachToRecyclerView(this)
            addItemDecoration(SpacingItemDecoration(
                spacing = (resources.getDimension(R.dimen.discover_spacing) * 1).toInt()
            ))
        }

        binding.rvDiscoverRecentManga.apply {
            adapter = mangaRecentAdapter
            addItemDecoration(SpacingItemDecoration(
                spacing = (resources.getDimension(R.dimen.discover_spacing) * 0.4).toInt()
            ))
        }

        binding.rvDiscoverRecentAnime.apply {
            adapter = animeRecentAdapter
            addItemDecoration(SpacingItemDecoration(
                spacing = (resources.getDimension(R.dimen.discover_spacing) * 0.4).toInt()
            ))
        }
    }
}