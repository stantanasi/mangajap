package com.tanasi.mangajap.fragments.discover

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.LinearSnapHelper
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.databinding.FragmentDiscoverBinding
import com.tanasi.mangajap.models.Ad
import com.tanasi.mangajap.models.Anime
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.utils.jsonApi.JsonApiResponse

class DiscoverFragment : Fragment() {

    private var _binding: FragmentDiscoverBinding? = null
    private val binding: FragmentDiscoverBinding get() = _binding!!

    val viewModel: DiscoverViewModel by viewModels()

    private val peopleList: MutableList<MangaJapAdapter.Item> = mutableListOf()
    private val mangaList: MutableList<Manga> = mutableListOf()
    private val animeList: MutableList<Anime> = mutableListOf()

    private val peopleAdapter: MangaJapAdapter = MangaJapAdapter(peopleList)
    private val mangaAdapter: MangaJapAdapter = MangaJapAdapter(mangaList)
    private val animeAdapter: MangaJapAdapter = MangaJapAdapter(animeList)

    private val snapHelper: LinearSnapHelper = LinearSnapHelper()


    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentDiscoverBinding.inflate(inflater, container, false)
        viewModel.getDiscover()
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.search.setOnClickListener {
            findNavController().navigate(
                    DiscoverFragmentDirections.actionDiscoverToSearch()
            )
        }

        viewModel.state.observe(viewLifecycleOwner) { state ->
            when (state) {
                DiscoverViewModel.State.Loading -> binding.isLoading.cslIsLoading.visibility = View.VISIBLE
                is DiscoverViewModel.State.SuccessLoading -> {
                    peopleList.apply {
                        clear()
                        addAll(state.peopleList)
                        add(1, Ad().also { it.typeLayout = MangaJapAdapter.Type.AD_DISCOVER })
                    }
                    mangaList.apply {
                        clear()
                        addAll(state.mangaList)
                    }
                    animeList.apply {
                        clear()
                        addAll(state.animeList)
                    }

                    displayDiscover()
                    binding.isLoading.cslIsLoading.visibility = View.GONE
                }
                is DiscoverViewModel.State.FailedLoading -> when (state.error) {
                    is JsonApiResponse.Error.ServerError -> Toast.makeText(requireContext(), getString(R.string.serverError), Toast.LENGTH_SHORT).show()
                    is JsonApiResponse.Error.NetworkError -> Toast.makeText(requireContext(), getString(R.string.serverError), Toast.LENGTH_SHORT).show()
                    is JsonApiResponse.Error.UnknownError -> Toast.makeText(requireContext(), getString(R.string.error), Toast.LENGTH_SHORT).show()
                }

                DiscoverViewModel.State.Updating -> binding.isUpdating.cslIsUpdating.visibility = View.VISIBLE
                is DiscoverViewModel.State.SuccessUpdating -> {
                    mangaAdapter.notifyDataSetChanged()
                    animeAdapter.notifyDataSetChanged()
                    binding.isUpdating.cslIsUpdating.visibility = View.GONE
                }
                is DiscoverViewModel.State.FailedUpdating -> when (state.error) {
                    is JsonApiResponse.Error.ServerError -> Toast.makeText(requireContext(), getString(R.string.serverError), Toast.LENGTH_SHORT).show()
                    is JsonApiResponse.Error.NetworkError -> Toast.makeText(requireContext(), getString(R.string.serverError), Toast.LENGTH_SHORT).show()
                    is JsonApiResponse.Error.UnknownError -> Toast.makeText(requireContext(), getString(R.string.error), Toast.LENGTH_SHORT).show()
                }
            }
        }

//        val adLoader = AdLoader.Builder(requireContext(), "ca-app-pub-3940256099942544/2247696110")
//                .forUnifiedNativeAd { unifiedNativeAd ->
//                    val adView = layoutInflater.inflate(R.layout.item_ad_discover, null) as UnifiedNativeAdView
//
//                    val headlineView = adView.findViewById<TextView>(R.id.tv_ad_headline)
//                    headlineView.text = unifiedNativeAd.headline
//                    adView.headlineView = headlineView
//
//                    val mediaView = adView.findViewById<MediaView>(R.id.ad_media_view)
//                    adView.mediaView = mediaView
//
//                    adView.setNativeAd(unifiedNativeAd)
//
//                    binding.adFrame.removeAllViews()
//                    binding.adFrame.addView(adView)
//                }
//                .withAdListener(object : AdListener() {
//                    override fun onAdFailedToLoad(adError: LoadAdError) {
//                        // Handle the failure by logging, altering the UI, and so on.
//                    }
//                })
//                .withNativeAdOptions(NativeAdOptions.Builder()
//                        // Methods in the NativeAdOptions.Builder class can be
//                        // used here to specify individual options settings.
//                        .build())
//                .build()
//        adLoader.loadAd(AdRequest.Builder().build())
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }


    private fun displayDiscover() {
        binding.peopleRecyclerView.apply {
            layoutManager = LinearLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false)
            adapter = peopleAdapter
            snapHelper.attachToRecyclerView(this)
        }

        binding.trendingMangaRecyclerView.apply {
            layoutManager = LinearLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false)
            adapter = mangaAdapter
        }

        binding.trendingAnimeRecyclerView.apply {
            layoutManager = LinearLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false)
            adapter = animeAdapter
        }
    }
}