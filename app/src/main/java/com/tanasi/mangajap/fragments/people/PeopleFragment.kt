package com.tanasi.mangajap.fragments.people

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.flowWithLifecycle
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.navArgs
import com.google.android.material.tabs.TabLayout
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.R
import com.tanasi.mangajap.databinding.FragmentPeopleBinding
import com.tanasi.mangajap.models.People
import com.tanasi.mangajap.utils.extensions.setToolbar
import com.tanasi.mangajap.utils.extensions.viewModelsFactory
import kotlinx.coroutines.launch

class PeopleFragment : Fragment() {

    private enum class PeopleTab(val stringId: Int) {
        Manga(R.string.manga),
        Anime(R.string.anime);
    }

    private var _binding: FragmentPeopleBinding? = null
    private val binding get() = _binding!!

    private val args by navArgs<PeopleFragmentArgs>()
    private val viewModel by viewModelsFactory { PeopleViewModel(args.peopleId) }

    private val mangaFragment by lazy { binding.fPeopleManga.getFragment<PeopleMangaFragment>() }
    private val animeFragment by lazy { binding.fPeopleAnime.getFragment<PeopleAnimeFragment>() }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentPeopleBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        initializePeople()

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.state.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED).collect { state ->
                when (state) {
                    PeopleViewModel.State.Loading -> binding.isLoading.apply {
                        root.visibility = View.VISIBLE
                    }

                    is PeopleViewModel.State.SuccessLoading -> {
                        displayPeople(state.people)
                        binding.isLoading.root.visibility = View.GONE
                    }

                    is PeopleViewModel.State.FailedLoading -> {
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

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }


    private fun initializePeople() {
        setToolbar(args.peopleName, "")

        binding.tlPeople.apply {
            PeopleTab.entries
                .map { newTab().setText(getString(it.stringId)) }
                .forEach { addTab(it) }

            addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
                override fun onTabSelected(tab: TabLayout.Tab) {
                    showTab(PeopleTab.entries[selectedTabPosition])
                }

                override fun onTabUnselected(tab: TabLayout.Tab) {}
                override fun onTabReselected(tab: TabLayout.Tab) {}
            })
            getTabAt(selectedTabPosition)?.apply {
                select()
                showTab(PeopleTab.entries[selectedTabPosition])
            }
        }
    }

    private fun displayPeople(people: People) {

    }

    private fun showTab(peopleTab: PeopleTab) {
        childFragmentManager.beginTransaction().apply {
            when (peopleTab) {
                PeopleTab.Manga -> show(mangaFragment)
                else -> hide(mangaFragment)
            }
            when (peopleTab) {
                PeopleTab.Anime -> show(animeFragment)
                else -> hide(animeFragment)
            }
            commitAllowingStateLoss()
        }
    }
}