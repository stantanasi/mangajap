package com.tanasi.mangajap.adapters.viewHolders

import android.content.Context
import android.view.View
import androidx.core.content.ContextCompat
import androidx.navigation.Navigation
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.squareup.picasso.Picasso
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.MainActivity
import com.tanasi.mangajap.databinding.ItemBookBinding
import com.tanasi.mangajap.databinding.ItemBookDetailsBinding
import com.tanasi.mangajap.fragments.books.BooksFragment
import com.tanasi.mangajap.fragments.books.BooksFragmentDirections
import com.tanasi.mangajap.fragments.browse.BrowseFragment
import com.tanasi.mangajap.fragments.browse.BrowseFragmentDirections
import com.tanasi.mangajap.fragments.manga.MangaFragment
import com.tanasi.mangajap.fragments.manga.MangaFragmentDirections
import com.tanasi.mangajap.models.Book
import com.tanasi.mangajap.models.Manga
import com.tanasi.mangajap.utils.extensions.getCurrentFragment
import com.tanasi.mangajap.utils.extensions.setColorFilter
import com.tanasi.mangajap.utils.preferences.MangaPreference

class VhBook(
        private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
        _binding.root
) {

    private val context: Context = itemView.context

    private lateinit var book: Book

    fun setVhBooks(book: Book) {
        this.book = book

        when (_binding) {
            is ItemBookDetailsBinding -> displayBookDetails(_binding)
            is ItemBookBinding -> displayBook(_binding)
        }
    }

    private fun navigateToReadingFragment() {
        if (context is MainActivity) {
            when (context.getCurrentFragment()) {
                is BooksFragment -> {
                    Navigation.findNavController(_binding.root).navigate(
                            BooksFragmentDirections.actionEbooksToReading(
                                    book.title,
                                    book.absolutePath
                            )
                    )
                }
                is BrowseFragment -> {
                    Navigation.findNavController(_binding.root).navigate(
                            BrowseFragmentDirections.actionBrowseToReading(
                                    book.title,
                                    book.absolutePath
                            )
                    )
                }
                is MangaFragment -> {
                    Navigation.findNavController(_binding.root).navigate(
                            MangaFragmentDirections.actionMangaToReading(
                                    book.title,
                                    book.absolutePath
                            )
                    )
                }
            }
        }
    }

    private fun displayBookDetails(binding: ItemBookDetailsBinding) {
        binding.book.apply {
            setOnClickListener {
                if (book.mangaId == null) {
                    navigateToReadingFragment()
                } else {
                    binding.bookCheckBox.apply {
                        isChecked = !isChecked

                        val mangaPreference = MangaPreference(context, Manga().also { it.id = book.mangaId!! })
                        if (isChecked) mangaPreference.books = mangaPreference.books + book.absolutePath
                        else mangaPreference.books = mangaPreference.books.filterNot { it == book.absolutePath }
                    }
                }
            }
        }

        binding.bookCheckBox.apply {
            if (book.mangaId == null) {
                visibility = View.GONE
            } else {
                val mangaPreference = MangaPreference(context, Manga().also { it.id = book.mangaId!! })
                visibility = View.VISIBLE
                isChecked = mangaPreference.books.any { it == book.absolutePath }
            }
        }

        binding.bookCoverImageView.apply {
            Picasso.get()
                    .load(book.cover)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .fit()
                    .into(this)
        }

        binding.bookTitleTextView.text = book.title

        binding.bookStatusTextView.apply {
            when (book.status) {
                Book.Status.NotStarted -> visibility = View.GONE
                Book.Status.Ongoing -> {
                    visibility = View.VISIBLE
                    text = context.getString(R.string.bookStatusOngoing)
                    background.setColorFilter(ContextCompat.getColor(context, R.color.bookStatusInProgress))
                }
                Book.Status.Completed -> {
                    visibility = View.VISIBLE
                    text = context.getString(R.string.bookStatusCompleted)
                    background.setColorFilter(ContextCompat.getColor(context, R.color.bookStatusCompleted))
                }
            }
        }

        binding.bookPagesCountTextView.apply {
            text = when (book.status) {
                Book.Status.NotStarted -> context.getString(R.string.pages, book.pageCount)
                Book.Status.Ongoing -> context.getString(R.string.actual_page, book.bookmark + 1, book.pageCount)
                Book.Status.Completed -> context.getString(R.string.pages, book.pageCount)
            }
        }

        binding.bookSizeTextView.text = context.getString(R.string.book_size_mo, book.size)

        binding.bookAbsolutePathTextView.text = book.absolutePath
    }

    private fun displayBook(binding: ItemBookBinding) {
        binding.book.apply {
            setOnClickListener {
                if (book.mangaId == null) {
                    navigateToReadingFragment()
                } else {
                    binding.bookCheckBox.apply {
                        isChecked = !isChecked

                        val mangaPreference = MangaPreference(context, Manga().also { it.id = book.mangaId!! })
                        if (isChecked) mangaPreference.books = mangaPreference.books + book.absolutePath
                        else mangaPreference.books = mangaPreference.books.filterNot { it == book.absolutePath }
                    }
                }
            }
        }

        binding.bookCheckBox.apply {
            if (book.mangaId == null) {
                visibility = View.GONE
            } else {
                val mangaPreference = MangaPreference(context, Manga().also { it.id = book.mangaId!! })
                visibility = View.VISIBLE
                isChecked = mangaPreference.books.any { it == book.absolutePath }
            }
        }

        binding.bookCoverImageView.apply {
            Picasso.get()
                    .load(book.cover)
                    .placeholder(R.drawable.placeholder)
                    .error(R.drawable.placeholder)
                    .fit()
                    .into(this)
        }

        binding.myBookProgressProgressBar.apply {
            progress = book.bookmark
            max = book.pageCount
            progressTintList = when (book.status) {
                Book.Status.NotStarted,
                Book.Status.Ongoing -> ContextCompat.getColorStateList(context, R.color.bookStatusInProgress)
                Book.Status.Completed -> ContextCompat.getColorStateList(context, R.color.bookStatusCompleted)
            }
        }
    }
}