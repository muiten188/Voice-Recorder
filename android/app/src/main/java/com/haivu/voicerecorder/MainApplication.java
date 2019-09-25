package com.haivu.voicerecorder;
import android.app.Application;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.voximplant.foregroundservice.VIForegroundServicePackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.transistorsoft.rnbackgroundfetch.RNBackgroundFetchPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.christopherdro.htmltopdf.RNHTMLtoPDFPackage;
import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {

            @SuppressWarnings("UnnecessaryLocalVariable")
            List<ReactPackage> packages = new PackageList(this).getPackages();
            return packages;
        }



        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };



    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
//        ReadableNativeArray.setUseNativeAccessor(true);
//        ReadableNativeMap.setUseNativeAccessor(true);
    }
}
