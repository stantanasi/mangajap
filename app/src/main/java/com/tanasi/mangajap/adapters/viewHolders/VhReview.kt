package com.tanasi.mangajap.adapters.viewHolders

import android.content.Context
import android.view.View
import androidx.navigation.Navigation
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.squareup.picasso.MemoryPolicy
import com.squareup.picasso.NetworkPolicy
import com.squareup.picasso.Picasso
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.ItemReviewBinding
import com.tanasi.mangajap.databinding.ItemReviewHeaderBinding
import com.tanasi.mangajap.fragments.reviewSave.ReviewSaveFragment
import com.tanasi.mangajap.fragments.reviews.ReviewsFragmentDirections
import com.tanasi.mangajap.models.Review
import com.tanasi.mangajap.utils.extensions.format

class VhReview(
        private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
        _binding.root
) {

    private val context: Context = itemView.context

    private lateinit var review: Review

    fun setVhReview(review: Review) {
        this.review = review
        when (_binding) {
            is ItemReviewHeaderBinding -> displayReviewHeader(_binding)
            is ItemReviewBinding -> displayReview(_binding)
        }
    }

    private fun displayReviewHeader(binding: ItemReviewHeaderBinding) {
        binding.root.setOnClickListener {
            review.manga?.let { manga ->
                Navigation.findNavController(binding.root).navigate(
                        ReviewsFragmentDirections.actionReviewsToReviewSave(
                                ReviewSaveFragment.ReviewMediaType.Manga,
                                manga.id,
                                null
                        )
                )
            } ?: review.anime?.let { anime ->
                Navigation.findNavController(binding.root).navigate(
                        ReviewsFragmentDirections.actionReviewsToReviewSave(
                                ReviewSaveFragment.ReviewMediaType.Anime,
                                anime.id,
                                null
                        )
                )
            }
        }
    }

    private fun displayReview(binding: ItemReviewBinding) {
        binding.vReviewUser.setOnClickListener {
            Navigation.findNavController(binding.root).navigate(
                    ReviewsFragmentDirections.actionReviewsToProfile(
                            review.user?.id
                    )
            )
        }

        binding.civReviewUserProfilePic.apply {
            Picasso.get()
                    .load(review.user?.avatar?.tiny)
                    .placeholder(R.drawable.default_user_avatar)
                    .error(R.drawable.default_user_avatar)
                    .networkPolicy(NetworkPolicy.NO_CACHE)
                    .memoryPolicy(MemoryPolicy.NO_CACHE)
                    .into(this)
        }

        binding.tvReviewPseudo.text = review.user?.pseudo ?: ""

        binding.tvReviewLastUpdated.text = review.updatedAt?.format("dd MMMM yyyy")

        binding.ivEdit.apply {
            if (review.user?.id == Firebase.auth.uid) {
                visibility = View.VISIBLE
                setOnClickListener {
                    Navigation.findNavController(binding.root).navigate(
                            ReviewsFragmentDirections.actionReviewsToReviewSave(
                                    ReviewSaveFragment.ReviewMediaType.Manga,
                                    reviewId = review.id
                            )
                    )
                }
            } else {
                visibility = View.GONE
            }

        }

        binding.tvReviewContent.text = review.content
    }
}