package com.demo.ext.util;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;

import androidx.core.app.ActivityCompat;

import cn.com.hjq.permissions.OnPermissionCallback;
import cn.com.hjq.permissions.Permission;
import cn.com.hjq.permissions.XXPermissions;


/**
 * Permission application utility class
 */
public class PermissionUtils {

    /**
     * Determine if Bluetooth permissions are granted
     *
     * @param context context
     * @return boolean
     */
    public static boolean hasBluetoothPermission(Context context) {
        if (context == null) return false;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
            boolean scan = ActivityCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_SCAN) == PackageManager.PERMISSION_GRANTED;
            boolean advertise = ActivityCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_ADVERTISE) == PackageManager.PERMISSION_GRANTED;
            boolean connect = ActivityCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_CONNECT) == PackageManager.PERMISSION_GRANTED;
            return scan && advertise && connect;
        } else if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
            boolean fineLocation = ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
            boolean bluetooth = ActivityCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH) == PackageManager.PERMISSION_GRANTED;
            return fineLocation && bluetooth;
        }
        // Android 9
        else {
            return ActivityCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH) == PackageManager.PERMISSION_GRANTED;
        }
    }

    /**
     * Request Bluetooth permissions
     *
     * @param context  Context
     * @param callback OnPermissionCallback
     */
    public static void requestBluetoothPermission(Context context, OnPermissionCallback callback) {
        // Android 12+
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
            XXPermissions.with(context)
                    .permission(Permission.BLUETOOTH_CONNECT, Permission.BLUETOOTH_ADVERTISE, Permission.BLUETOOTH_CONNECT)
                    .request(callback);
        }
        // Android 10+
        else if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
            XXPermissions.with(context)
                    .permission(Permission.ACCESS_FINE_LOCATION, Permission.BLUETOOTH_CONNECT).request(callback);
        }
        // Android 9
        else {
            XXPermissions.with(context)
                    .permission(Permission.BLUETOOTH_CONNECT).request(callback);
        }
    }

}
