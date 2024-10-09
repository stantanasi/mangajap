package com.tanasi.mangajap.fragments.login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await

class LoginViewModel : ViewModel() {

    private val _state = MutableStateFlow<State?>(null)
    val state: Flow<State?> = _state

    sealed class State {
        data object Loading : State()

        data class LoginSucceed(val firebaseUser: FirebaseUser) : State()
        data class LoginFailed(val error: Exception) : State()

        data class PasswordResetEmailSuccess(val succeed: Boolean) : State()
        data class PasswordResetEmailFailed(val error: Exception) : State()
    }

    fun login(email: String, password: String) = viewModelScope.launch(Dispatchers.IO) {
        _state.emit(State.Loading)

        try {
            val authResult = Firebase.auth
                .signInWithEmailAndPassword(email, password).await()

            val firebaseUser = authResult?.user

            if (firebaseUser != null) {
                _state.emit(State.LoginSucceed(firebaseUser))
            } else {
                _state.emit(State.LoginFailed(Exception("Login failed")))
            }
        } catch (e: Exception) {
            _state.emit(State.LoginFailed(e))
        }
    }

    fun resetPassword(email: String) = viewModelScope.launch(Dispatchers.IO) {
        _state.emit(State.Loading)

        try {
            Firebase.auth.sendPasswordResetEmail(email).await()

            _state.emit(State.PasswordResetEmailSuccess(true))
        } catch (e: Exception) {
            _state.emit(State.PasswordResetEmailFailed(e))
        }
    }
}