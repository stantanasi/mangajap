package com.tanasi.mangajap.fragments.register

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.models.User
import com.tanasi.mangajap.services.MangaJapApiService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await

class RegisterViewModel : ViewModel() {

    private val mangaJapApiService = MangaJapApiService.build()

    private val _state = MutableStateFlow<State?>(null)
    val state: Flow<State?> = _state

    sealed class State {
        data object Loading : State()
        data class RegisterSucceed(val user: User) : State()
        data class RegisterFailed(val error: JsonApiResponse.Error) : State()
    }

    fun register(pseudo: String, email: String, password: String) = viewModelScope.launch {
        _state.emit(State.Loading)

        try {
            val result = try {
                Firebase.auth
                    .signInWithEmailAndPassword(email, password).await()
            } catch (e: Exception) {
                Firebase.auth
                    .createUserWithEmailAndPassword(email, password).await()
            }
            val user = result?.user!!

            val response = mangaJapApiService.createUser(User(
                id = user.uid
            ).also {
                it.pseudo = pseudo
            })

            when (response) {
                is JsonApiResponse.Success -> {
                    _state.emit(State.RegisterSucceed(response.body.data!!))
                }

                is JsonApiResponse.Error -> {
                    _state.emit(State.RegisterFailed(response))
                }
            }
        } catch (e: Exception) {
            _state.emit(State.RegisterFailed(JsonApiResponse.Error.UnknownError(e)))
        }
    }
}