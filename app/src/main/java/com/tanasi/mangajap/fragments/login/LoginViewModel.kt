package com.tanasi.mangajap.fragments.login

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tanasi.jsonapi.JsonApiResponse
import com.tanasi.mangajap.services.MangaJapApiService
import com.tanasi.oauth2.OAuth2Response
import kotlinx.coroutines.launch

class LoginViewModel : ViewModel() {

    private val mangaJapApiService: MangaJapApiService = MangaJapApiService.build()

    private val _state: MutableLiveData<State> = MutableLiveData()
    val state: LiveData<State> = _state

    sealed class State {
        object Loading: State()

        data class LoginSucceed(val accessToken: String, val userId: String): State()
        data class LoginFailed(val error: OAuth2Response.Error): State()

        data class ResetPasswordSucceed(val accessToken: String, val userId: String): State()
        data class ResetPasswordFailed(val error: OAuth2Response.Error): State()

        data class ChangePasswordSucceed(val succeed: Boolean): State()
        data class ChangePasswordFailed(val error: JsonApiResponse.Error): State()
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

    fun forgotPassword(pseudo: String, email: String) = viewModelScope.launch {
        _state.value = State.Loading

        val response = mangaJapApiService.forgotPassword(
                email,
                pseudo
        )
        _state.value = try {
            when (response) {
                is OAuth2Response.Success -> State.ResetPasswordSucceed(response.body.accessToken, response.body.sub!!)
                is OAuth2Response.Error -> State.ResetPasswordFailed(response)
            }
        } catch (e: Exception) {
            State.ResetPasswordFailed(OAuth2Response.Error.UnknownError(e))
        }
    }

    fun changePassword(accessToken: String, newPassword: String) = viewModelScope.launch {
        _state.value = State.Loading

        val response = mangaJapApiService.resetPassword(
                accessToken,
                newPassword
        )
        _state.value = try {
            when (response) {
                is JsonApiResponse.Success -> State.ChangePasswordSucceed(true)
                is JsonApiResponse.Error -> State.ChangePasswordFailed(response)
            }
        } catch (e: Exception) {
            State.ChangePasswordFailed(JsonApiResponse.Error.UnknownError(e))
        }
    }
}