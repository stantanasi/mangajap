package com.tanasi.mangajap.fragments.reviewSave

import android.content.Context
import android.os.Bundle
import android.view.*
import android.view.inputmethod.InputMethodManager
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.FragmentReviewSaveBinding
import com.tanasi.mangajap.models.Anime
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.models.Review
import com.tanasi.mangajap.models.User
import com.tanasi.mangajap.utils.extensions.setToolbar
import com.tanasi.mangajap.utils.preferences.UserPreference

class ReviewSaveFragment : Fragment() {

    enum class ReviewMediaType {
        Manga,
        Anime;
    }

    private var _binding: FragmentReviewSaveBinding? = null
    private val binding: FragmentReviewSaveBinding get() = _binding!!

    private val args: ReviewSaveFragmentArgs by navArgs()

    private val viewModel: ReviewSaveViewModel by viewModels()

    private var reviewId: String? = null
    private lateinit var mediaType: ReviewMediaType
    private lateinit var mediaId: String

    private var review: Review = Review()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentReviewSaveBinding.inflate(inflater, container, false)
        reviewId = args.reviewId
        viewModel.getReview(args.reviewId)
        mediaType = args.mediaType
        mediaId = args.mediaId ?: ""
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setToolbar("", "")
        setHasOptionsMenu(true)

        viewModel.state.observe(viewLifecycleOwner) { state ->
            when (state) {
                ReviewSaveViewModel.State.Loading -> binding.isLoading.cslIsLoading.visibility = View.VISIBLE
                is ReviewSaveViewModel.State.SuccessLoading -> {
                    review = state.review
                    displayReview()
                    binding.isLoading.cslIsLoading.visibility = View.GONE
                }
                is ReviewSaveViewModel.State.FailedLoading -> when (state.error) {
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

                ReviewSaveViewModel.State.Saving -> binding.isLoading.cslIsLoading.visibility = View.VISIBLE
                is ReviewSaveViewModel.State.SuccessSaving -> findNavController().navigateUp()
                is ReviewSaveViewModel.State.FailedSaving -> when (state.error) {
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

    override fun onDetach() {
        super.onDetach()
        hideKeyboard()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {
        inflater.inflate(R.menu.menu_reviews_activity, menu)
        super.onCreateOptionsMenu(menu, inflater)
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            R.id.publishReview -> {
                publishReview()
                return true
            }
        }
        return super.onOptionsItemSelected(item)
    }


    private fun hideKeyboard() {
        val inputManager = requireContext().getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        val currentFocus = requireActivity().currentFocus
        if (currentFocus != null) inputManager.hideSoftInputFromWindow(currentFocus.windowToken, InputMethodManager.HIDE_NOT_ALWAYS)
    }

    private fun displayReview() {
        binding.etReviewSave.text.append(review.content)
    }

    private fun publishReview() {
        val reviewContent = binding.etReviewSave.text.toString().trim { it <= ' ' }

        if (reviewContent.isReviewValid()) {
            if (review.id == "") {
                viewModel.createReview(review.apply {
                    putContent(reviewContent)
                    putUser(User().apply { id = UserPreference(requireContext()).selfId })
                    when (mediaType) {
                        ReviewMediaType.Manga -> putManga(Manga().apply { id = mediaId })
                        ReviewMediaType.Anime -> putAnime(Anime().apply { id = mediaId })
                    }
                })
            } else {
                viewModel.updateReview(review.apply {
                    putContent(reviewContent)
                })
            }
        } else {
            Toast.makeText(requireContext(), getString(R.string.reviewInvalid), Toast.LENGTH_SHORT).show()
        }
    }


    private fun String.isReviewValid(): Boolean = this.trim { it <= ' ' } != ""
}