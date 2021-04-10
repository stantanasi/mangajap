package com.tanasi.mangajap.fragments.browse

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.databinding.FragmentBrowseBinding
import com.tanasi.mangajap.models.Folder
import com.tanasi.mangajap.utils.extensions.onBackPressed
import com.tanasi.mangajap.utils.extensions.setToolbar
import com.tanasi.mangajap.utils.preferences.SettingsPreference
import java.io.File

class BrowseFragment : Fragment() {

    private var _binding: FragmentBrowseBinding? = null
    val binding: FragmentBrowseBinding get() = _binding!!

    private val viewModel: BrowseViewModel by viewModels()

    private val args: BrowseFragmentArgs by navArgs()

    private lateinit var folderPath: String
    private var actualFolder: File? = null

    private val itemList: MutableList<MangaJapAdapter.Item> = mutableListOf()

    var mangaJapAdapter: MangaJapAdapter = MangaJapAdapter(itemList)
    var selectFolder: Boolean = false
    val savedFolder: MutableList<Folder> = mutableListOf()

    private lateinit var settingsPreference: SettingsPreference

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentBrowseBinding.inflate(inflater, container, false)
        folderPath = args.folderPath
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        settingsPreference = SettingsPreference(requireContext())

        when (folderPath) {
            FOLDER_LOCATION -> displayFolderLocation()
            else -> displayBrowser(File(folderPath))
        }

        onBackPressed {
            if (selectFolder) {
                savedFolder.clear()
                selectFolder = false
                binding.bottomBar.visibility = View.GONE
                mangaJapAdapter.notifyDataSetChanged()
            } else {
                if (actualFolder == null) findNavController().navigateUp()
                else {
                    if ((folderPath == FOLDER_LOCATION)) displayFolderLocation()
                    else {
                         if (actualFolder!!.parentFile == null || (actualFolder!!.absolutePath == folderPath)) findNavController().navigateUp()
                         else displayBrowser(actualFolder!!.parentFile!!)
                    }
                }
            }
        }

        viewModel.state.observe(viewLifecycleOwner) { state ->
            when (state) {
                BrowseViewModel.State.Loading -> binding.isLoading.cslIsLoading.visibility = View.VISIBLE
                is BrowseViewModel.State.LoadingSucceed -> {
                    itemList.apply {
                        clear()
                        addAll(state.fileList)
                    }
                    binding.fileBrowserRecyclerView.apply {
                        layoutManager = LinearLayoutManager(requireContext())
                        adapter = mangaJapAdapter
                    }
                    binding.isLoading.cslIsLoading.visibility = View.GONE
                }
                is BrowseViewModel.State.FailedLoading -> Toast.makeText(requireContext(), getString(R.string.error), Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }



    private fun displayBottomBar() {
        binding.bottomBar.visibility = View.GONE

        binding.closeBottomBar.apply {
            setOnClickListener {
                savedFolder.clear()
                selectFolder = false
                binding.bottomBar.visibility = View.GONE
                mangaJapAdapter.notifyDataSetChanged()
            }
        }

        binding.bottomBarActionImageView.apply {
            when (actualFolder) {
                null -> setImageResource(R.drawable.ic_delete_black_24dp)
                else -> setImageResource(R.drawable.ic_add_black_24dp)
            }

            setOnClickListener {
                if (actualFolder == null) {
                    settingsPreference.booksFolder = settingsPreference.booksFolder
                            .filterNot { path ->
                                savedFolder.map { it.absolutePath }.contains(path)
                            }
                } else {
                    settingsPreference.booksFolder = settingsPreference.booksFolder + savedFolder.map { it.absolutePath }
                }
                findNavController().navigateUp()
            }
        }
    }

    private fun displayFolderLocation() {
        actualFolder = null
        setToolbar(resources.getString(R.string.folderLocations), "")
        displayBottomBar()

        viewModel.getFolders(settingsPreference.booksFolder)
    }

    fun displayBrowser(actualFolder: File) {
        this.actualFolder = actualFolder
        setToolbar(actualFolder.name, "")
        displayBottomBar()

        viewModel.getFiles(actualFolder)
    }


    companion object {
        const val FOLDER_LOCATION: String = "folderLocation"
    }
}