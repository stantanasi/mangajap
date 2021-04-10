package com.tanasi.mangajap.fragments.register

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.mangajap.models.User
import com.tanasi.mangajap.services.MangaJapApiService
import com.tanasi.mangajap.utils.jsonApi.JsonApiResponse
import com.tanasi.mangajap.utils.oauth2.OAuth2Response
import kotlinx.coroutines.launch

class RegisterViewModel : ViewModel() {

    private val mangaJapApiService: MangaJapApiService = MangaJapApiService.build()

    private val _state: MutableLiveData<State> = MutableLiveData()
    val state: LiveData<State> = _state

    sealed class State {
        object Loading: State()

        data class RegisterSucceed(val user: User): State()
        data class RegisterFailed(val error: JsonApiResponse.Error): State()

        data class LoginSucceed(val accessToken: String, val userId: String): State()
        data class LoginFailed(val error: OAuth2Response.Error): State()
    }

    fun register(user: User) = viewModelScope.launch {
        _state.value = State.Loading

        val response = mangaJapApiService.createUser(
                user
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.RegisterSucceed(response.body.data!!)
                is JsonApiResponse.Error -> State.RegisterFailed(response)
            }
        } catch (e: Exception) {
            State.RegisterFailed(JsonApiResponse.Error.UnknownError(e))
        }
    }

    fun login(pseudo: String, password: String) = viewModelScope.launch {
        _state.value = State.Loading

        val response = mangaJapApiService.login(
                pseudo,
                password
        )
        _state.value = try {
            when (response) {
                is OAuth2Response.Success -> State.LoginSucceed(response.body.accessToken, response.body.sub!!)
                is OAuth2Response.Error -> State.LoginFailed(response)
            }
        } catch (e: Exception) {
            State.LoginFailed(OAuth2Response.Error.UnknownError(e))
        }
    }
}