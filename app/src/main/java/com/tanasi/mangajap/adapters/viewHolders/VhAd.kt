package com.tanasi.mangajap.adapters.viewHolders

import android.content.Context
import android.view.View
import android.widget.ImageView
import androidx.recyclerview.widget.RecyclerView
import androidx.viewbinding.ViewBinding
import com.google.android.gms.ads.AdListener
import com.google.android.gms.ads.AdLoader
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.nativead.NativeAd
import com.google.android.gms.ads.nativead.NativeAdOptions
import com.tanasi.mangajap.BuildConfig
import com.tanasi.mangajap.databinding.ItemAdDiscoverBinding
import com.tanasi.mangajap.databinding.ItemAdProfileBinding
import com.tanasi.mangajap.databinding.ItemAdSearchBinding
import com.tanasi.mangajap.models.Ad

class VhAd(
        private val _binding: ViewBinding
) : RecyclerView.ViewHolder(
        _binding.root
) {

    private val context: Context = itemView.context
    private lateinit var ad: Ad

    fun setVhAd(ad: Ad) {
        this.ad = ad

        val adUnitId = when {
            BuildConfig.DEBUG -> "ca-app-pub-3940256099942544/2247696110"
            else -> "ca-app-pub-4003468979821373/3588719008"
        }

        val adLoader = AdLoader.Builder(context, adUnitId)
                .forNativeAd {  nativeAd ->
                    when (_binding) {
                        is ItemAdDiscoverBinding -> displayDiscover(_binding, nativeAd)
                        is ItemAdProfileBinding -> displayProfile(_binding, nativeAd)
                        is ItemAdSearchBinding -> displaySearch(_binding, nativeAd)
                    }
                }
                .withAdListener(object : AdListener() {
                    override fun onAdFailedToLoad(adError: LoadAdError) {
                    }
                })
                .withNativeAdOptions(NativeAdOptions.Builder().build())
                .build()
        adLoader.loadAd(AdRequest.Builder().build())
    }

    private fun displayDiscover(binding: ItemAdDiscoverBinding, nativeAd: NativeAd) {
        binding.ivAdIcon.let {
            binding.adView.iconView = it
            nativeAd.icon?.drawable?.let { drawable ->
                it.visibility = View.VISIBLE
                it.setImageDrawable(drawable)
            } ?: {
                it.visibility = View.GONE
            }
        }

        binding.tvAdHeadline.let {
            binding.adView.headlineView = it
            it.text = nativeAd.headline
        }

        binding.tvAdBody.let {
            binding.adView.bodyView = it
            it.text = nativeAd.body
        }

        binding.adMediaView.let {
            binding.adView.mediaView = it
            it.setImageScaleType(ImageView.ScaleType.CENTER_CROP)
        }

        binding.adView.setNativeAd(nativeAd)
    }

    private fun displayProfile(binding: ItemAdProfileBinding, nativeAd: NativeAd) {
        binding.ivAdIcon.let {
            binding.adView.iconView = it
            nativeAd.icon?.drawable?.let { drawable ->
                it.visibility = View.VISIBLE
                it.setImageDrawable(drawable)
            } ?: {
                it.visibility = View.GONE
            }
        }

        binding.tvAdHeadline.let {
            binding.adView.headlineView = it
            it.text = nativeAd.headline
        }

        binding.adMediaView.let {
            binding.adView.mediaView = it
            it.setImageScaleType(ImageView.ScaleType.CENTER_CROP)
        }

        binding.adView.setNativeAd(nativeAd)
    }

    private fun displaySearch(binding: ItemAdSearchBinding, nativeAd: NativeAd) {
        binding.ivAdIcon.let {
            binding.adView.iconView = it
            nativeAd.icon?.drawable?.let { drawable ->
                it.visibility = View.VISIBLE
                it.setImageDrawable(drawable)
            } ?: {
                it.visibility = View.GONE
            }
        }

        binding.tvAdHeadline.let {
            binding.adView.headlineView = it
            it.text = nativeAd.headline
        }

        binding.tvAdBody.let {
            binding.adView.bodyView = it
            it.text = nativeAd.body
        }

        binding.adMediaView.let {
            binding.adView.mediaView = it
            it.setImageScaleType(ImageView.ScaleType.CENTER_CROP)
        }

        binding.adView.setNativeAd(nativeAd)
    }
}