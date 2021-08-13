package com.tanasi.mangajap.services

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.tanasi.mangajap.R
import com.tanasi.mangajap.activities.MainActivity

class NotificationService : FirebaseMessagingService() {

    override fun onMessageReceived(p0: RemoteMessage) {
        p0.notification?.let { notification ->
            val title = notification.title
            val body = notification.body

            if (title != null && body != null) {
                displayNotification(title, body)
            }
        } ?: let {
            val title = p0.data["title"]
            val body = p0.data["body"]

            if (title != null && body != null) {
                displayNotification(title, body)
            }
        }
    }

    override fun onNewToken(p0: String) {
        super.onNewToken(p0)
    }


    private fun displayNotification(title: String, body: String) {
        val intent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_ONE_SHOT)

        val notificationBuilder = NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_logo_notifications)
            .setColor(ContextCompat.getColor(this, R.color.colorApp))
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION))
            .setContentIntent(pendingIntent)
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            notificationManager.createNotificationChannel(NotificationChannel(
                NOTIFICATION_CHANNEL_ID,
                getString(R.string.app_name),
                NotificationManager.IMPORTANCE_HIGH
            ))
        }

        notificationManager.notify(NOTIFICATION_TAG, NOTIFICATION_ID, notificationBuilder.build())
    }

    companion object {
        private const val NOTIFICATION_ID = 7
        private const val NOTIFICATION_TAG = "MANGAJAP"
        private const val NOTIFICATION_CHANNEL_ID = "MangaJap"
    }
}