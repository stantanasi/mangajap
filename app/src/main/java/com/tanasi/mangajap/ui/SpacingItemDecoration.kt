package com.tanasi.mangajap.ui

import android.graphics.Rect
import android.view.View
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView

class SpacingItemDecoration(
    private val vertical: Int,
    private val horizontal: Int,
) : RecyclerView.ItemDecoration() {

    constructor(spacing: Int): this(spacing, spacing)

    override fun getItemOffsets(
        outRect: Rect,
        view: View,
        parent: RecyclerView,
        state: RecyclerView.State
    ) {
        val position = parent.getChildAdapterPosition(view)
        val count = parent.adapter?.itemCount ?: 0

        when (val layoutManager = parent.layoutManager) {
            is GridLayoutManager -> {
                val spanCount = layoutManager.spanCount / layoutManager.spanSizeLookup.getSpanSize(position)
                val column = position % spanCount

                outRect.left = column * horizontal / spanCount
                outRect.right = horizontal - (column + 1) * horizontal / spanCount
                if (position >= spanCount) {
                    outRect.top = vertical
                }
            }

            is LinearLayoutManager -> {
                if (position != count - 1) {
                    when (layoutManager.orientation) {
                        RecyclerView.VERTICAL -> outRect.bottom = vertical
                        RecyclerView.HORIZONTAL -> outRect.right = horizontal
                    }
                }
            }
        }
    }
}