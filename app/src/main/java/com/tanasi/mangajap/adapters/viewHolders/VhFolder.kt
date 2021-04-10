package com.tanasi.mangajap.adapters.viewHolders

import android.content.Context
import android.view.View
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.MainActivity
import com.tanasi.mangajap.databinding.ItemFolderBinding
import com.tanasi.mangajap.fragments.browse.BrowseFragment
import com.tanasi.mangajap.models.Folder
import com.tanasi.mangajap.utils.extensions.getFragment
import java.io.File

class VhFolder(
        private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
        _binding.root
) {

    private val context: Context = itemView.context

    private lateinit var folder: Folder

    fun setFolder(folder: Folder) {
        this.folder = folder
        when (_binding) {
            is ItemFolderBinding -> displayFolder(_binding)
        }
    }

    private fun displayFolder(binding: ItemFolderBinding) {
        val fragment: BrowseFragment = (context as MainActivity).getFragment(BrowseFragment::class.java)!!

        binding.folder.apply {
            setOnClickListener {
                if (!fragment.selectFolder) {
                    fragment.displayBrowser(File(folder.absolutePath))
                } else {
                    binding.folderIsCheckCheckBox.also {
                        it.isChecked = !it.isChecked
                        if (it.isChecked) {
                            fragment.savedFolder.add(folder)
                        } else {
                            fragment.savedFolder.remove(folder)
                            if (fragment.savedFolder.isEmpty()) {
                                fragment.selectFolder = false
                                fragment.binding.bottomBar.visibility = View.GONE
                            }
                        }
                    }
                    fragment.mangaJapAdapter.notifyDataSetChanged()
                }
            }

            setOnLongClickListener {
                if (!fragment.selectFolder) {
                    fragment.selectFolder = true
                    fragment.savedFolder.clear()
                    fragment.savedFolder.add(folder)
                    binding.folderIsCheckCheckBox.visibility = View.VISIBLE
                    fragment.binding.bottomBar.visibility = View.VISIBLE
                    fragment.mangaJapAdapter.notifyDataSetChanged()
                } else {
                    fragment.selectFolder = true
                    fragment.savedFolder.clear()
                    fragment.savedFolder.add(folder)
                    binding.folderIsCheckCheckBox.visibility = View.VISIBLE
                    fragment.binding.bottomBar.visibility = View.VISIBLE
                    fragment.mangaJapAdapter.notifyDataSetChanged()
                }
                true
            }
        }

        binding.folderNameTextView.text = folder.name

        binding.folderPathTextView.text = folder.absolutePath

        binding.folderIsCheckCheckBox.apply {
            if (!fragment.selectFolder) {
                visibility = View.INVISIBLE
            } else {
                visibility = View.VISIBLE
                isChecked = fragment.savedFolder.contains(folder)
            }
        }

        fragment.binding.tvBrowseBottomBar.apply {
            if (fragment.selectFolder) {
                text = context.getString(R.string.folderCount, fragment.savedFolder.size)
            }
        }
    }
}