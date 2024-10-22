package com.tanasi.mangajap.adapters.viewholders

import android.content.Context
import androidx.navigation.Navigation
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.squareup.picasso.Picasso
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.ItemStaffPeopleBinding
import com.tanasi.mangajap.fragments.people.PeopleFragmentDirections
import com.tanasi.mangajap.models.Staff
import com.tanasi.mangajap.utils.extensions.format

class StaffViewHolder(
        private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
        _binding.root
) {

    private val context: Context = itemView.context
    private lateinit var staff: Staff
    fun bind(staff: Staff) {
        this.staff = staff
        when (_binding) {
            is ItemStaffPeopleBinding -> displayStaffPeople(_binding)
        }
    }

    private fun displayStaffPeople(binding: ItemStaffPeopleBinding) {
        binding.root.apply {
            staff.manga?.let {manga ->
                setOnClickListener {
//                    Navigation.findNavController(binding.root).navigate(
//                            PeopleFragmentDirections.actionPeopleToManga(
//                                    manga.id,
//                                    manga.title
//                            )
//                    )
                }
            } ?: staff.anime?.let { anime ->
                setOnClickListener {
                    Navigation.findNavController(binding.root).navigate(
                            PeopleFragmentDirections.actionPeopleToAnime(
                                    anime.id,
                                    anime.title
                            )
                    )
                }
            }
        }

        binding.ivStaffMediaCover.apply {
            staff.manga?.let {manga ->
                Picasso.get()
                        .load(manga.coverImage)
                        .placeholder(R.drawable.placeholder)
                        .error(R.drawable.placeholder)
                        .into(this)
            } ?: staff.anime?.let { anime ->
                Picasso.get()
                        .load(anime.coverImage)
                        .placeholder(R.drawable.placeholder)
                        .error(R.drawable.placeholder)
                        .into(this)
            }
        }

        binding.tvStaffMediaTitle.apply {
            staff.manga?.let {manga ->
                text = manga.title
            } ?: staff.anime?.let { anime ->
                text = anime.title
            }
        }

        binding.tvStaffMediaStartDate.apply {
            staff.manga?.let {manga ->
                text = manga.startDate?.format("YYYY")
            } ?: staff.anime?.let { anime ->
                text = anime.startDate?.format("YYYY")
            }
        }

        binding.tvStaffRole.text = context.getString(staff.role?.stringId ?: Staff.Role.STORY_AND_ART.stringId)
    }
}