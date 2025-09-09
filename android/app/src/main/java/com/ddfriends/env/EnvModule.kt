// Caminho: android/app/src/main/java/com/ddfriends/env/EnvModule.kt
package com.ddfriends.env

import com.ddfriends.BuildConfig
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule

class EnvModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    // O nome que usaremos no JavaScript para acessar o módulo
    override fun getName() = "EnvModule"

    override fun getConstants(): Map<String, Any> {
        val constants = HashMap<String, Any>()
        // Expõe a variável do build.gradle para o JavaScript
        constants["GOOGLE_WEB_CLIENT_ID"] = BuildConfig.GOOGLE_WEB_CLIENT_ID
        return constants
    }
}