package com.tanasi.mangajap.fragments.register

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.models.MangaEntry
import com.tanasi.mangajap.models.User
import com.tanasi.mangajap.services.MangaJapApiService
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await

class RegisterViewModel : ViewModel() {

    private val mangaJapApiService = MangaJapApiService.build()

    private val _state: MutableLiveData<State> = MutableLiveData()
    val state: LiveData<State> = _state

    sealed class State {
        object Loading : State()

        data class RegisterSucceed(val user: User) : State()
        data class RegisterFailed(val error: JsonApiResponse.Error) : State()
    }

    fun register(pseudo: String, email: String, password: String) = viewModelScope.launch {
        _state.value = State.Loading

        _state.value = try {
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
                is JsonApiResponse.Success -> State.RegisterSucceed(response.body.data!!)
                is JsonApiResponse.Error -> State.RegisterFailed(response)
            }
        } catch (e: Exception) {
            State.RegisterFailed(JsonApiResponse.Error.UnknownError(e))
        }
    }
}