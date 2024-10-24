package com.tanasi.mangajap.models

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Rect

class Page(
    val image: String,
    val isShuffle: Boolean = false,
) {

    fun unshuffle(shuffledBitmap: Bitmap): Bitmap {
        val rows = 6
        val cols = 4

        val pieceWidth = 200
        val pieceHeight = 200

        val unshuffledBitmap = Bitmap.createBitmap(
            shuffledBitmap.width,
            shuffledBitmap.height,
            shuffledBitmap.config
        )
        val canvas = Canvas(unshuffledBitmap)

        val correctOrder = arrayOf(
            1, 13, 17, 12,
            3, 0, 16, 19,
            15, 18, 7, 5,
            9, 10, 6, 8,
            4, 2, 11, 14,
            20, 22, 23, 21,
        )

        for (index in correctOrder.indices) {
            val fromRow = index / cols
            val fromCol = index % cols

            val originalPiece = Bitmap.createBitmap(
                shuffledBitmap,
                fromCol * pieceWidth,
                fromRow * pieceHeight,
                pieceWidth,
                if (fromRow == rows - 1) shuffledBitmap.height - (pieceHeight * (rows - 1))
                else pieceHeight
            )

            val toRow = correctOrder[index] / cols
            val toCol = correctOrder[index] % cols

            val destinationRect = Rect(
                toCol * pieceWidth,
                toRow * pieceHeight,
                (toCol + 1) * pieceWidth,
                toRow * pieceHeight + originalPiece.height
            )

            canvas.drawBitmap(originalPiece, null, destinationRect, null)
        }

        return unshuffledBitmap
    }
}