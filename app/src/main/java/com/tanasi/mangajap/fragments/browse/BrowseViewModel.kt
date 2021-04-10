package com.tanasi.mangajap.fragments.browse

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.models.Book
import com.tanasi.mangajap.models.Folder
import com.tanasi.mangajap.utils.extensions.isBook
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.File

class BrowseViewModel : ViewModel() {

    private val _state: MutableLiveData<State> = MutableLiveData(State.Loading)
    val state: LiveData<State> = _state

    sealed class State {
        object Loading: State()
        data class LoadingSucceed(val fileList: List<MangaJapAdapter.Item>): State()
        data class FailedLoading(val throwable: Throwable): State()
    }


    fun getFiles(folder: File) = viewModelScope.launch(Dispatchers.Main) {
        _state.value = State.Loading

        val fileList: MutableList<MangaJapAdapter.Item> = mutableListOf()

        val files: List<File> = folder.listFiles()?.toList() ?: listOf()
        files
                .filter { file ->
                    when {
                        file.isDirectory -> !file.name.startsWith(".")
                        file.isFile -> file.isBook()
                        else -> false
                    }
                }
                .sortedBy { it.name.toLowerCase() }
                .sortedBy { !it.isDirectory } // Dossier en premier
                .map { file ->
                    when {
                        file.isDirectory -> fileList.add(Folder(file).apply { typeLayout = MangaJapAdapter.Type.FOLDER })
                        file.isFile -> fileList.add(Book(file).loadCover().apply { typeLayout = MangaJapAdapter.Type.BOOK_DETAILS })
                        else -> {}
                    }
                }

        _state.value = try {
            State.LoadingSucceed(fileList)
        } catch (e: Exception) {
            State.FailedLoading(e)
        }
    }

    fun getFolders(folderList: List<String>) = viewModelScope.launch(Dispatchers.Main) {
        _state.value = State.Loading

        _state.value = try {
            State.LoadingSucceed(folderList
                    .map { Folder(File(it)) }
                    .sortedBy { it.name.toLowerCase() }
                    .map { it.apply { typeLayout = MangaJapAdapter.Type.FOLDER } })
        } catch (e: Exception) {
            State.FailedLoading(e)
        }
    }
}