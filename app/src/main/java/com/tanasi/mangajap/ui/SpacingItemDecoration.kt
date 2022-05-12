package com.tanasi.mangajap.ui

import android.graphics.Rect
import android.view.View
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView

class SpacingItemDecoration(
    private val spacing: Int
) : RecyclerView.ItemDecoration() {

    override fun getItemOffsets(
        outRect: Rect,
        view: View,
        parent: RecyclerView,
        state: RecyclerView.State
    ) {
        val position = parent.getChildAdapterPosition(view)
        val count = parent.adapter?.itemCount ?: 0

        when (val layoutManager = parent.layoutManager) {
            is LinearLayoutManager -> {
                if (position != count - 1) {
                    when (layoutManager.orientation) {
                        RecyclerView.VERTICAL -> outRect.bottom = spacing
                        RecyclerView.HORIZONTAL -> outRect.right = spacing
                    }
                }
            }

            is GridLayoutManager -> {
            }
        }
    }
}