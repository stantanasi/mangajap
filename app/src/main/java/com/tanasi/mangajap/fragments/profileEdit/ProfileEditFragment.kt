package com.tanasi.mangajap.fragments.profileEdit

import android.Manifest
import android.app.Activity
import android.app.DatePickerDialog
import android.content.Intent
import android.graphics.ImageDecoder
import android.os.Build
import android.os.Bundle
import android.provider.MediaStore
import android.text.Editable
import android.text.TextWatcher
import android.view.*
import android.widget.AdapterView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import com.squareup.picasso.MemoryPolicy
import com.squareup.picasso.NetworkPolicy
import com.squareup.picasso.Picasso
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.R
import com.tanasi.mangajap.adapters.SpinnerAdapter
import com.tanasi.mangajap.databinding.FragmentProfileEditBinding
import com.tanasi.mangajap.models.User
import com.tanasi.mangajap.utils.extensions.*
import java.util.*


class ProfileEditFragment : Fragment() {

    private var _binding: FragmentProfileEditBinding? = null
    private val binding: FragmentProfileEditBinding get() = _binding!!

    private val viewModel: ProfileEditViewModel by viewModels()

    private val requestPermission = registerForActivityResult(ActivityResultContracts.RequestPermission()) { permission ->
        if (permission) {
            Toast.makeText(requireContext(), getString(R.string.permissionGranted), Toast.LENGTH_SHORT).show()
        }
    }
    private val pickImage = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            result.data?.data?.let { uri ->
                val bitmap = when {
                    Build.VERSION.SDK_INT >= 29 -> ImageDecoder.decodeBitmap(ImageDecoder.createSource(requireActivity().contentResolver, uri))
                    else -> {
                        @Suppress("DEPRECATION")
                        MediaStore.Images.Media.getBitmap(requireActivity().contentResolver, uri)
                    }
                }
                binding.civProfileEditUserProfilePic.setImageBitmap(bitmap)
                user.putAvatar(bitmap.toBase64())
            }
        }
    }

    private lateinit var user: User

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentProfileEditBinding.inflate(inflater, container, false)
        viewModel.getUser()
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setToolbar(getString(R.string.editProfile), "")
        setHasOptionsMenu(true)

        viewModel.state.observe(viewLifecycleOwner) { state ->
            when (state) {
                ProfileEditViewModel.State.Loading -> binding.isLoading.cslIsLoading.visibility = View.VISIBLE
                is ProfileEditViewModel.State.SuccessLoading -> {
                    user = state.user
                    requireActivity().invalidateOptionsMenu()

                    displayProfile()
                    binding.isLoading.cslIsLoading.visibility = View.GONE
                }
                is ProfileEditViewModel.State.FailedLoading -> when (state.error) {
                    is JsonApiResponse.Error.ServerError -> state.error.body.errors.map {
                        Toast.makeText(requireContext(), it.title, Toast.LENGTH_SHORT).show()
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

                ProfileEditViewModel.State.Updating -> binding.isUpdating.cslIsUpdating.visibility = View.VISIBLE
                is ProfileEditViewModel.State.SuccessUpdating -> findNavController().navigateUp()
                is ProfileEditViewModel.State.FailedUpdating -> when (state.error) {
                    is JsonApiResponse.Error.ServerError -> state.error.body.errors.map {
                        Toast.makeText(requireContext(), it.title, Toast.LENGTH_SHORT).show()
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

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {
        if (this::user.isInitialized) {
            inflater.inflate(R.menu.menu_activity_edit_profile, menu)
        }
        super.onCreateOptionsMenu(menu, inflater)
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.save -> {
                if (this::user.isInitialized) viewModel.updateUser(user)
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }


    private fun displayProfile() {
        binding.trProfileEditUserProfilePic.setOnClickListener {
            if (requireContext().isStoragePermissionGranted()) {
                val intent = Intent(Intent.ACTION_GET_CONTENT)
                intent.type = "image/*"
                pickImage.launch(intent)
            } else {
                requestPermission.launch(Manifest.permission.WRITE_EXTERNAL_STORAGE)
            }
        }

        binding.civProfileEditUserProfilePic.apply {
            Picasso.get()
                    .load(user.avatar?.small)
                    .placeholder(R.drawable.default_user_avatar)
                    .error(R.drawable.default_user_avatar)
                    .networkPolicy(NetworkPolicy.NO_CACHE)
                    .memoryPolicy(MemoryPolicy.NO_CACHE)
                    .into(this)
        }

        binding.ivProfileEditDeleteUserProfilePic.setOnClickListener {
            binding.civProfileEditUserProfilePic.setImageResource(R.drawable.default_user_avatar)
            user.putAvatar(null)
        }


        binding.etProfileEditUserAbout.apply {
            append(user.about)
            addTextChangedListener(object : TextWatcher {
                override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
                override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {}
                override fun afterTextChanged(s: Editable) {
                    user.putAbout(s.toString())
                }
            })
        }

        binding.etProfileEditUserFirstName.apply {
            append(user.firstName)
            addTextChangedListener(object : TextWatcher {
                override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
                override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {}
                override fun afterTextChanged(s: Editable) {
                    user.putFirstName(s.toString())
                }
            })
        }

        binding.etProfileEditUserLastName.apply {
            append(user.lastName)
            addTextChangedListener(object : TextWatcher {
                override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}
                override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {}
                override fun afterTextChanged(s: Editable) {
                    user.putLastName(s.toString())
                }
            })
        }

        binding.tvProfileEditUserBirthday.apply {
            text = user.birthday?.format("dd MMMM yyyy") ?: ""
            setOnClickListener {
                (user.birthday ?: Calendar.getInstance()).let {
                    DatePickerDialog(
                        requireContext(),
                        { _, year, month, dayOfMonth ->
                            val date = Calendar.getInstance()
                            date[year, month] = dayOfMonth

                            user.putBirthday(date)
                            text = date.format("dd MMMM yyyy")
                        },
                        it[Calendar.YEAR],
                        it[Calendar.MONTH],
                        it[Calendar.DAY_OF_MONTH]
                    ).show()
                }
            }
        }

        binding.ivProfileEditDeleteUserBirthday.setOnClickListener {
            user.putBirthday(null)
            binding.tvProfileEditUserBirthday.text = ""
        }

        binding.spinnerProfileEditUserGender.apply {
            adapter = SpinnerAdapter(context, User.Gender.values().map { getString(it.stringId) })
            setSelection(user.gender?.ordinal ?: 0)
            onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
                override fun onItemSelected(parent: AdapterView<*>?, view: View, position: Int, id: Long) {
                    user.putGender(User.Gender.values()[position])
                }

                override fun onNothingSelected(parent: AdapterView<*>?) {}
            }
        }

        binding.spinnerProfileEditUserCountry.apply {
            val countries: MutableList<String> = mutableListOf()
            val countriesCode: MutableList<String> = mutableListOf()

            countries.add(context.resources.getString(R.string.none))
            countriesCode.add("")
            requireContext().getCountries()
                    .toList()
                    .sortedBy { (_, country) ->
                        country.toLowerCase(requireContext().locale())
                    }
                    .map { (code, country) ->
                        countries.add(country)
                        countriesCode.add(code)
                    }

            adapter = SpinnerAdapter(context, countries)
            setSelection(countriesCode.indexOf(user.country))
            onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
                override fun onItemSelected(parent: AdapterView<*>?, view: View, position: Int, id: Long) {
                    user.putCountry(countriesCode[position])
                }

                override fun onNothingSelected(parent: AdapterView<*>?) {}
            }
        }
    }
}