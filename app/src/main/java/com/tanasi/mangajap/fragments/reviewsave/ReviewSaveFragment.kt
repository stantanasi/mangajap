package com.tanasi.mangajap.fragments.reviewsave

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.Menu
import android.view.MenuInflater
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.flowWithLifecycle
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.FragmentReviewSaveBinding
import com.tanasi.mangajap.models.Anime
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.models.Review
import com.tanasi.mangajap.models.User
import com.tanasi.mangajap.utils.extensions.setToolbar
import com.tanasi.mangajap.utils.extensions.viewModelsFactory
import kotlinx.coroutines.launch

class ReviewSaveFragment : Fragment() {

    enum class ReviewMediaType {
        Manga,
        Anime;
    }

    private var _binding: FragmentReviewSaveBinding? = null
    private val binding get() = _binding!!

    private val args by navArgs<ReviewSaveFragmentArgs>()
    private val viewModel by viewModelsFactory { ReviewSaveViewModel(args.reviewId) }

    private var review = Review()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentReviewSaveBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        initializeReview()

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.state.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED).collect { state ->
                when (state) {
                    ReviewSaveViewModel.State.Loading -> binding.isLoading.apply {
                        root.visibility = View.VISIBLE
                    }

                    is ReviewSaveViewModel.State.SuccessLoading -> {
                        review = state.review
                        displayReview(state.review)
                        binding.isLoading.root.visibility = View.GONE
                    }

                    is ReviewSaveViewModel.State.FailedLoading -> {
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

                    ReviewSaveViewModel.State.Saving -> binding.isLoading.apply {
                        root.visibility = View.VISIBLE
                    }

                    is ReviewSaveViewModel.State.SuccessSaving -> {
                        findNavController().navigateUp()
                    }

                    is ReviewSaveViewModel.State.FailedSaving -> {
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

    override fun onDetach() {
        super.onDetach()
        hideKeyboard()
    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {
        inflater.inflate(R.menu.menu_fragment_review_save, menu)
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

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }


    private fun initializeReview() {
        setToolbar("", "")
        setHasOptionsMenu(true)
    }

    private fun hideKeyboard() {
        val inputManager =
            requireContext().getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        val currentFocus = requireActivity().currentFocus
        if (currentFocus != null) inputManager.hideSoftInputFromWindow(
            currentFocus.windowToken,
            InputMethodManager.HIDE_NOT_ALWAYS
        )
    }

    private fun displayReview(review: Review) {
        binding.etReviewSave.text.append(this.review.content)
    }

    private fun publishReview() {
        val reviewContent = binding.etReviewSave.text.toString().trim { it <= ' ' }

        if (!reviewContent.isReviewValid()) {
            Toast.makeText(
                requireContext(),
                getString(R.string.reviewInvalid),
                Toast.LENGTH_SHORT
            ).show()
            return
        }

        review.also {
            when {
                review.id == null -> {
                    it.content = reviewContent
                    it.user = User(id = Firebase.auth.uid)
                    when (args.mediaType as ReviewMediaType) {
                        ReviewMediaType.Manga -> it.manga = Manga(id = args.mediaId!!)
                        ReviewMediaType.Anime -> it.anime = Anime(id = args.mediaId!!)
                    }
                }

                else -> {
                    it.content = reviewContent
                }
            }
        }
        viewModel.saveReview(review)
    }


    private fun String.isReviewValid(): Boolean = this.trim { it <= ' ' } != ""
}