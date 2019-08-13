package com.ati.mshop;

import android.app.Application;

import android.util.Log;

import com.facebook.react.PackageList;
import com.facebook.hermes.reactexecutor.HermesExecutorFactory;
import com.facebook.react.bridge.JavaScriptExecutorFactory;

import com.facebook.react.ReactApplication;
import com.swmansion.reanimated.ReanimatedPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import org.pgsqlite.SQLitePluginPackage;

//import com.solinor.bluetoothstatus.RNBluetoothManagerPackage;
//import com.polidea.reactnativeble.BlePackage;
//import com.ocetnik.timer.BackgroundTimerPackage;
//import com.localz.PinchPackage;
//import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
//import com.reactnativecommunity.netinfo.NetInfoPackage;
//import com.RNFetchBlob.RNFetchBlobPackage;
//import com.rt2zz.reactnativecontacts.ReactNativeContacts;
//import com.krazylabs.OpenAppSettingsPackage;
//import com.learnium.RNDeviceInfo.RNDeviceInfo;
//import com.BV.LinearGradient.LinearGradientPackage;
//import com.imagepicker.ImagePickerPackage;
//import org.reactnative.camera.RNCameraPackage;
//import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
//import com.dylanvann.fastimage.FastImageViewPackage;
//import com.horcrux.svg.SvgPackage;
//import com.oblador.vectoricons.VectorIconsPackage;
//import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
//import com.github.wuxudong.rncharts.MPAndroidChartPackage;


import com.facebook.soloader.SoLoader;

import java.util.Arrays;
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
            packages.add(new RNFirebaseCrashlyticsPackage());
            packages.add(new RNFirebaseMessagingPackage());
            packages.add(new RNFirebaseNotificationsPackage());
            packages.add(new SQLitePluginPackage());

//            packages.add(new RNFirebasePackage());
//            packages.add(new RNBluetoothManagerPackage());
//            packages.add(new BlePackage());
//            packages.add(new BackgroundTimerPackage());
//            packages.add(new PinchPackage());
//            packages.add(new AsyncStoragePackage());
//            packages.add(new NetInfoPackage());
//            packages.add(new RNFetchBlobPackage());
//            packages.add(new ReactNativeContacts());
//            packages.add(new OpenAppSettingsPackage());
//            packages.add(new RNDeviceInfo());
//            packages.add(new LinearGradientPackage());
//            packages.add(new ImagePickerPackage());
//            packages.add(new RNCameraPackage());
//            packages.add(new FastImageViewPackage());
//            packages.add(new SvgPackage());
//            packages.add(new VectorIconsPackage());
//            packages.add(new RNGestureHandlerPackage());
//            packages.add(new RNI18nPackage());
//            packages.add(new MPAndroidChartPackage());

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
