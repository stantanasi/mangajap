package com.tanasi.mangajap.adapters.viewholders

import android.content.Context
import android.widget.ImageView
import androidx.navigation.Navigation
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.squareup.picasso.Picasso
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.ItemPeopleDiscoverBinding
import com.tanasi.mangajap.fragments.discover.DiscoverFragmentDirections
import com.tanasi.mangajap.models.Anime
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.models.People

class PeopleViewHolder(
        private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
        _binding.root
) {

    private val context: Context = itemView.context
    private lateinit var people: People
    fun bind(people: People) {
        this.people = people
        when (_binding) {
            is ItemPeopleDiscoverBinding -> displayPeopleDiscover(_binding)
        }
    }

    private fun displayPeopleDiscover(binding: ItemPeopleDiscoverBinding) {
        binding.tvPeopleName.text = if (people.pseudo == "") people.firstName + " " + people.lastName else people.pseudo


        fun displayManga(imageView: ImageView, manga: Manga) {
            Picasso.get()
                    .load(manga.coverImage)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .into(imageView)
            imageView.setOnClickListener {
//                Navigation.findNavController(binding.root).navigate(
//                        DiscoverFragmentDirections.actionDiscoverToManga(
//                                manga.id,
//                                manga.title
//                        )
//                )
            }
        }

        fun displayAnime(imageView: ImageView, anime: Anime) {
            Picasso.get()
                    .load(anime.coverImage)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .into(imageView)
            imageView.setOnClickListener {
                Navigation.findNavController(binding.root).navigate(
                        DiscoverFragmentDirections.actionDiscoverToAnime(
                                anime.id,
                                anime.title
                        )
                )
            }
        }


        binding.ivPeople1StaffCover.apply {
            people.staff.getOrNull(0)?.let { staff ->
                staff.manga?.let { manga ->
                    displayManga(this, manga)
                } ?: staff.anime?.let { anime ->
                    displayAnime(this, anime)
                }
            }
        }

        binding.ivPeople2StaffCover.apply {
            people.staff.getOrNull(1)?.let { staff ->
                staff.manga?.let { manga ->
                    displayManga(this, manga)
                } ?: staff.anime?.let { anime ->
                    displayAnime(this, anime)
                }
            }
        }

        binding.ivPeople3StaffCover.apply {
            people.staff.getOrNull(2)?.let { staff ->
                staff.manga?.let { manga ->
                    displayManga(this, manga)
                } ?: staff.anime?.let { anime ->
                    displayAnime(this, anime)
                }
            }
        }

        binding.tvPeopleSeeAllStaff.setOnClickListener {
            val peopleName = if (people.pseudo == "") people.firstName + " " + people.lastName else people.pseudo
            Navigation.findNavController(binding.root).navigate(
                    DiscoverFragmentDirections.actionDiscoverToPeople(
                            people.id,
                            peopleName
                    )
            )
        }
    }
}