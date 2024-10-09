package com.tanasi.mangajap.fragments.reviews

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
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.AppAdapter
import com.tanasi.mangajap.databinding.FragmentReviewsBinding
import com.tanasi.mangajap.models.Anime
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.models.Review
import com.tanasi.mangajap.ui.SpacingItemDecoration
import com.tanasi.mangajap.utils.extensions.setToolbar
import com.tanasi.mangajap.utils.extensions.viewModelsFactory
import kotlinx.coroutines.launch

class ReviewsFragment : Fragment() {

    enum class ReviewsType {
        Manga,
        Anime;
    }

    private var _binding: FragmentReviewsBinding? = null
    private val binding get() = _binding!!

    private val args by navArgs<ReviewsFragmentArgs>()
    private val viewModel by viewModelsFactory { ReviewsViewModel(args.mediaType, args.mediaId) }

    private val appAdapter = AppAdapter()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentReviewsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        initializeReviews()

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.state.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED).collect { state ->
                when (state) {
                    ReviewsViewModel.State.Loading -> binding.isLoading.apply {
                        root.visibility = View.VISIBLE
                    }

                    is ReviewsViewModel.State.SuccessLoading -> {
                        displayReviews(state.reviews)
                        binding.isLoading.root.visibility = View.GONE
                    }

                    is ReviewsViewModel.State.FailedLoading -> {
                        when (state.error) {
                            is JsonApiResponse.Error.ServerError -> state.error.body.errors.map {
                                Toast.makeText(requireContext(), it.title, Toast.LENGTH_SHORT)
                                    .show()
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

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }


    private fun initializeReviews() {
        setToolbar(args.mediaTitle, "")

        binding.rvReviews.apply {
            adapter = appAdapter
            addItemDecoration(
                SpacingItemDecoration(
                    spacing = resources.getDimension(R.dimen.reviews_spacing).toInt()
                )
            )
        }
    }

    private fun displayReviews(reviews: List<Review>) {
        reviews.onEach {
            it.itemType = AppAdapter.Type.REVIEW_ITEM
        }

        appAdapter.submitList(listOf(
            Review().also { review ->
                when (args.mediaType as ReviewsType) {
                    ReviewsType.Manga -> review.manga = Manga(id = args.mediaId)
                    ReviewsType.Anime -> review.anime = Anime(id = args.mediaId)
                }

                review.itemType = AppAdapter.Type.REVIEW_HEADER
            },
        ) + reviews.onEach {
            it.itemType = AppAdapter.Type.REVIEW_ITEM
        })
    }
}