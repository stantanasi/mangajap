package com.tanasi.mangajap.adapters.viewHolders

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.AsyncTask
import android.view.View
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.MainActivity
import com.tanasi.mangajap.databinding.ItemReadingsBinding
import com.tanasi.mangajap.fragments.reading.ReadingFragment
import com.tanasi.mangajap.models.BookPage
import com.tanasi.mangajap.utils.extensions.getCurrentFragment

class VhBookPage(
        private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
        _binding.root
) {

    private val context: Context = itemView.context
    private lateinit var bookPage: BookPage
    fun setVhBookPage(bookPage: BookPage) {
        this.bookPage = bookPage
        when (_binding) {
            is ItemReadingsBinding -> displayPage(_binding)
        }
    }

    private fun displayPage(binding: ItemReadingsBinding) {
        binding.page.setOnClickListener {
            if (context is MainActivity) {
                when (val fragment = context.getCurrentFragment()) {
                    is ReadingFragment -> fragment.showNavigationTools(!fragment.isNavigationToolsOpen)
                }
            }
        }

        class Get: AsyncTask<Void?, Void?, Bitmap?>() {
            override fun onPreExecute() {
                binding.isLoading.cslIsLoading.visibility = View.VISIBLE
            }

            override fun doInBackground(vararg p0: Void?): Bitmap? {
                return bookPage.zipFile.getInputStream(bookPage.entry).use { BitmapFactory.decodeStream(it) }
            }

            override fun onPostExecute(bitmap: Bitmap?) {
                if (bitmap == null) {
                    Toast.makeText(context, context.resources.getString(R.string.error), Toast.LENGTH_SHORT).show()
                } else {
                    binding.isLoading.cslIsLoading.visibility = View.GONE
                    binding.pageImageView.setImageBitmap(bitmap)
                }
            }
        }
        Get().execute()
    }
}