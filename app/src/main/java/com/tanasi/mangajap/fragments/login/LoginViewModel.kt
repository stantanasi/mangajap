package com.tanasi.mangajap.fragments.login

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.tanasi.jsonapi.JsonApiParams
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.services.MangaJapApiService
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await

class LoginViewModel : ViewModel() {

    private val mangaJapApiService: MangaJapApiService = MangaJapApiService.build()

    private val _state: MutableLiveData<State> = MutableLiveData()
    val state: LiveData<State> = _state

    sealed class State {
        object Loading: State()

        data class LoginSucceed(val user: FirebaseUser, val userId: String): State()
        data class LoginFailed(val error: Exception): State()

        data class PasswordResetEmailSuccess(val succeed: Boolean): State()
        data class PasswordResetEmailFailed(val error: Exception): State()
    }

    fun login(email: String, password: String) = viewModelScope.launch {
        _state.value = State.Loading

        _state.value = try {
            val authResult = Firebase.auth
                .signInWithEmailAndPassword(email, password).await()

            val response = mangaJapApiService.getUsers(
                JsonApiParams(
                    fields = mapOf("users" to listOf("pseudo", "email")),
                    filter = mapOf("self" to listOf("true"))
                )
            )

            val user = when (response) {
                is JsonApiResponse.Success -> response.body.data!!.first()
                else -> null
            }

            authResult?.user?.let { firebaseUser ->
                State.LoginSucceed(firebaseUser, user?.id ?: "")
            } ?: State.LoginFailed(Exception("Login failed"))
        } catch (e: Exception) {
            State.LoginFailed(e)
        }
    }

    fun resetPassword(email: String) = viewModelScope.launch {
        _state.value = State.Loading

        _state.value = try {
            Firebase.auth.sendPasswordResetEmail(email).await()
            State.PasswordResetEmailSuccess(true)
        } catch (e: Exception) {
            State.PasswordResetEmailFailed(e)
        }
    }
}