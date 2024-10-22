package com.tanasi.mangajap.fragments.image

import android.Manifest
import android.graphics.Bitmap
import android.os.Bundle
import android.view.LayoutInflater
import android.view.Menu
import android.view.MenuInflater
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup
import android.view.animation.AnimationUtils
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.fragment.app.Fragment
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.flowWithLifecycle
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.squareup.picasso.MemoryPolicy
import com.squareup.picasso.NetworkPolicy
import com.squareup.picasso.Picasso
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.main.MainActivity
import com.tanasi.mangajap.databinding.FragmentImageBinding
import com.tanasi.mangajap.utils.extensions.getAverageColor
import com.tanasi.mangajap.utils.extensions.isStoragePermissionGranted
import com.tanasi.mangajap.utils.extensions.save
import com.tanasi.mangajap.utils.extensions.viewModelsFactory
import kotlinx.coroutines.launch
import java.io.File

class ImageFragment : Fragment() {

    private var _binding: FragmentImageBinding? = null
    private val binding get() = _binding!!

    private val args by navArgs<ImageFragmentArgs>()
    private val viewModel by viewModelsFactory { ImageViewModel(args.imagePath) }

    private val requestPermission =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { permission ->
            if (permission) {
                saveImage()
            } else {
                Toast.makeText(
                    context,
                    getString(R.string.storagePermissionNotGranted),
                    Toast.LENGTH_SHORT
                ).show()
            }
        }

    private lateinit var image: Bitmap

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentImageBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        initializeImage()

        viewLifecycleOwner.lifecycleScope.launch {
            viewModel.state.flowWithLifecycle(lifecycle, Lifecycle.State.STARTED).collect { state ->
                when (state) {
                    ImageViewModel.State.Loading -> binding.isLoading.apply {
                        root.visibility = View.VISIBLE
                    }

                    is ImageViewModel.State.SuccessLoading -> {
                        image = state.image
                        requireActivity().invalidateOptionsMenu()
                        state.image.getAverageColor().let { averageColor ->
                            binding.root.setBackgroundColor(averageColor)
                        }
                        binding.isLoading.root.visibility = View.GONE
                    }

                    is ImageViewModel.State.FailedLoading -> requireActivity().invalidateOptionsMenu()
                }
            }
        }

        fullscreen(false)
        displayImage()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {
        if (this::image.isInitialized) {
            inflater.inflate(R.menu.menu_fragment_image, menu)
        }
        return super.onCreateOptionsMenu(menu, inflater)
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if (item.itemId == R.id.saveImage) {
            saveImage()
            return true
        }
        return super.onOptionsItemSelected(item)
    }


    private fun fullscreen(isFullScreen: Boolean) {
        if (isFullScreen) {
            (requireActivity() as MainActivity).supportActionBar?.hide()
            binding.vImageGradient.startAnimation(
                AnimationUtils.loadAnimation(
                    context,
                    R.anim.fade_out
                )
            )
            binding.vImageGradient.visibility = View.GONE
        } else {
            (requireActivity() as MainActivity).supportActionBar?.show()
            binding.vImageGradient.startAnimation(
                AnimationUtils.loadAnimation(
                    context,
                    R.anim.fade_in
                )
            )
            binding.vImageGradient.visibility = View.VISIBLE
        }

        binding.ivImage.setOnClickListener {
            fullscreen(!isFullScreen)
        }
    }

    private fun initializeImage() {
        binding.toolbar.also {
            it.title = ""
            (requireActivity() as MainActivity).setSupportActionBar(it)
            it.setNavigationOnClickListener { findNavController().navigateUp() }
        }
        setHasOptionsMenu(true)
    }

    private fun displayImage() {
        Picasso.get()
            .load(args.imagePath)
            .placeholder(R.drawable.placeholder)
            .error(R.drawable.placeholder)
            .networkPolicy(NetworkPolicy.NO_CACHE)
            .memoryPolicy(MemoryPolicy.NO_CACHE)
            .into(binding.ivImage)
    }

    private fun saveImage() {
        if (requireContext().isStoragePermissionGranted()) {
            val success = image.save(
                requireContext(),
                name = File(args.imagePath).nameWithoutExtension,
                extension = "jpg"
            )
            when (success) {
                true -> Toast.makeText(context, getString(R.string.imageSaved), Toast.LENGTH_SHORT)
                    .show()

                false -> Toast.makeText(
                    context,
                    getString(R.string.imageNotSaved),
                    Toast.LENGTH_LONG
                ).show()
            }
        } else {
            requestPermission.launch(Manifest.permission.WRITE_EXTERNAL_STORAGE)
        }
    }
}