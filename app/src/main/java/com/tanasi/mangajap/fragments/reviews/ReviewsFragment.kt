package com.tanasi.mangajap.fragments.reviews

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.databinding.FragmentReviewsBinding
import com.tanasi.mangajap.models.Anime
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.models.Review
import com.tanasi.mangajap.utils.extensions.getAttrColor
import com.tanasi.mangajap.utils.extensions.setToolbar

class ReviewsFragment : Fragment() {

    enum class ReviewsType {
        Manga,
        Anime;
    }

    private var _binding: FragmentReviewsBinding? = null
    private val binding: FragmentReviewsBinding get() = _binding!!

    private val args: ReviewsFragmentArgs by navArgs()

    private val viewModel: ReviewsViewModel by viewModels()

    private var reviewsList: MutableList<Review> = mutableListOf()

    private lateinit var mediaType: ReviewsType
    private lateinit var mediaId: String
    private lateinit var mediaTitle: String


    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentReviewsBinding.inflate(inflater, container, false)
        mediaType = args.mediaType
        mediaId = args.mediaId
        mediaTitle = args.mediaTitle
        when (mediaType) {
            ReviewsType.Manga -> viewModel.getMangaReviews(mediaId)
            ReviewsType.Anime -> viewModel.getAnimeReviews(mediaId)
        }
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setToolbar(mediaTitle, "")

        viewModel.state.observe(viewLifecycleOwner) { state ->
            when (state) {
                ReviewsViewModel.State.Loading -> {
                    binding.isLoading.cslIsLoading.visibility = View.VISIBLE
                }
                is ReviewsViewModel.State.SuccessLoading -> {
                    displayReviews(state.reviews)
                    binding.isLoading.cslIsLoading.visibility = View.GONE
                }
                is ReviewsViewModel.State.FailedLoading -> when (state.error) {
                    is JsonApiResponse.Error.ServerError -> state.error.body.errors.map {
                        Toast.makeText(requireContext(), it.title, Toast.LENGTH_SHORT).show()
                    }
                    is JsonApiResponse.Error.NetworkError -> Toast.makeText(
                        requireContext(),
                        state.error.error.message,
                        Toast.LENGTH_SHORT
                    ).show()
                    is JsonApiResponse.Error.UnknownError -> Toast.makeText(
                        requireContext(),
                        state.error.error.message,
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


    private fun displayReviews(reviews: List<Review>) {
        when (mediaType) {
            ReviewsType.Manga -> {
                reviewsList.apply {
                    clear()
                    add(Review().also { review ->
                        review.manga = Manga().apply { id = mediaId }
                        review.typeLayout = MangaJapAdapter.Type.REVIEW_HEADER
                    })
                    addAll(reviews)
                }
            }
            ReviewsType.Anime -> {
                reviewsList.apply {
                    clear()
                    add(Review().also { review ->
                        review.anime = Anime().apply { id = mediaId }
                        review.typeLayout = MangaJapAdapter.Type.REVIEW_HEADER
                    })
                    addAll(reviews)
                }
            }
        }

        binding.rvReviews.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = MangaJapAdapter(reviewsList)
        }
    }
}