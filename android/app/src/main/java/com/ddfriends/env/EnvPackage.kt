// Caminho: android/app/src/main/java/com/ddfriends/env/EnvPackage.kt

package com.ddfriends.env

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class EnvPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(
            EnvModule(reactContext)
        )
    }

    // A CORREÇÃO ESTÁ AQUI: "Csontext" foi trocado por "Context"
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}