package com.tanasi.mangajap.fragments.people

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.tabs.TabLayout
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.MangaJapAdapter
import com.tanasi.mangajap.databinding.FragmentPeopleBinding
import com.tanasi.mangajap.fragments.recyclerView.RecyclerViewFragment
import com.tanasi.mangajap.models.People
import com.tanasi.mangajap.models.Staff
import com.tanasi.mangajap.utils.extensions.contains
import com.tanasi.mangajap.utils.extensions.setToolbar
import com.tanasi.mangajap.utils.jsonApi.JsonApiResponse

class PeopleFragment : Fragment() {

    private var _binding: FragmentPeopleBinding? = null
    private val binding: FragmentPeopleBinding get() = _binding!!

    private val viewModel: PeopleViewModel by viewModels()

    private val args: PeopleFragmentArgs by navArgs()

    private lateinit var people: People

    private val mangaFragment: RecyclerViewFragment = RecyclerViewFragment()
    private val animeFragment: RecyclerViewFragment = RecyclerViewFragment()

    private val mangaStaffList: MutableList<Staff> = mutableListOf()
    private val animeStaffList: MutableList<Staff> = mutableListOf()

    private val fragmentList: MutableList<Fragment> = mutableListOf()

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentPeopleBinding.inflate(inflater, container, false)
        viewModel.getPeople(args.peopleId)
        mangaFragment.setList(mangaStaffList, LinearLayoutManager(context))
        animeFragment.setList(animeStaffList, LinearLayoutManager(context))
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setToolbar(args.peopleName, "")

        viewModel.state.observe(viewLifecycleOwner) { state ->
            when (state) {
                PeopleViewModel.State.Loading -> binding.isLoading.cslIsLoading.visibility = View.VISIBLE
                is PeopleViewModel.State.SuccessLoading -> {
                    people = state.people
                    displayPeople()
                    binding.isLoading.cslIsLoading.visibility = View.GONE
                }
                is PeopleViewModel.State.FailedLoading -> when (state.error) {
                    is JsonApiResponse.Error.ServerError -> Toast.makeText(requireContext(), getString(R.string.serverError), Toast.LENGTH_SHORT).show()
                    is JsonApiResponse.Error.NetworkError -> Toast.makeText(requireContext(), getString(R.string.serverError), Toast.LENGTH_SHORT).show()
                    is JsonApiResponse.Error.UnknownError -> Toast.makeText(requireContext(), getString(R.string.error), Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }


    private fun displayPeople() {
        setMangaFragment()
        setAnimeFragment()

        binding.peopleTabLayout.apply {
            addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
                override fun onTabSelected(tab: TabLayout.Tab) {
                    showFragment(fragmentList[tab.position])
                }

                override fun onTabUnselected(tab: TabLayout.Tab) {}
                override fun onTabReselected(tab: TabLayout.Tab) {}
            })
            getTabAt(selectedTabPosition)?.apply {
                select()
                showFragment(fragmentList[position])
            }
        }
    }

    private fun setMangaFragment() {
        mangaStaffList.apply {
            clear()
            people.mangaStaff
                    .sortedByDescending { it.manga?.startDate }
                    .map {staff ->
                        add(staff.also { it.typeLayout = MangaJapAdapter.Type.STAFF_PEOPLE })
                    }
        }

        if (mangaStaffList.isNotEmpty()) {
            if (mangaFragment.isAdded) mangaFragment.mangaJapAdapter?.notifyDataSetChanged()
            addFragment(mangaFragment, getString(R.string.manga))
        }
    }

    private fun setAnimeFragment() {
        animeStaffList.apply {
            clear()
            people.animeStaff
                    .sortedByDescending { it.anime?.startDate }
                    .map {staff ->
                        add(staff.also { it.typeLayout = MangaJapAdapter.Type.STAFF_PEOPLE })
                    }
        }

        if (animeStaffList.isNotEmpty()) {
            if (animeFragment.isAdded) animeFragment.mangaJapAdapter?.notifyDataSetChanged()
            addFragment(animeFragment, getString(R.string.anime))
        }
    }

    private fun addFragment(fragment: Fragment, title: String) {
        val ft: FragmentTransaction = childFragmentManager.beginTransaction()

        if (!fragmentList.contains(fragment)) {
            fragmentList.add(fragment)
            binding.peopleTabLayout.addTab(binding.peopleTabLayout.newTab().setText(title))
            if (!fragment.isAdded) {
                ft.add(binding.peopleFrameLayout.id, fragment)
            }
        } else {
            if (!binding.peopleTabLayout.contains(title)) {
                binding.peopleTabLayout.addTab(binding.peopleTabLayout.newTab().setText(title))
                if (fragment.isAdded) {
                    ft.detach(fragment)
                    ft.attach(fragment)
                }
            }
        }

        ft.commitAllowingStateLoss()
    }

    private fun showFragment(fragment: Fragment) {
        val ft: FragmentTransaction = childFragmentManager.beginTransaction()
        for (i in fragmentList.indices) {
            if (fragmentList[i] === fragment) {
                ft.show(fragmentList[i])
            } else {
                ft.hide(fragmentList[i])
            }
        }
        ft.commitAllowingStateLoss()
    }
}