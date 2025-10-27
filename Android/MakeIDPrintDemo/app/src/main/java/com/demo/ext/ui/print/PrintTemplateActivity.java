package com.demo.ext.ui.print;

import android.os.Bundle;

import androidx.activity.ComponentActivity;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.databinding.DataBindingUtil;

import com.demo.ext.R;
import com.demo.ext.databinding.ActivityPrintTemplateBinding;
import com.demo.ext.ui.common.Constant;
import com.demo.ext.util.PermissionUtils;
import com.demo.ext.util.TemplateUtils;

import java.util.List;

import cn.com.hjq.permissions.OnPermissionCallback;
import cn.com.hjq.permissions.XXPermissions;
import cn.com.wewin.extapi.imp.IPrintLabelCallback;
import cn.com.wewin.extapi.model.Label;
import cn.com.wewin.extapi.universal.WwCommon;
import cn.com.wewin.extapi.universal.WwPrintUtils;

/**
 * Template printing page
 */
public class PrintTemplateActivity extends ComponentActivity implements IPrintLabelCallback {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ActivityPrintTemplateBinding binding = DataBindingUtil.setContentView(this, R.layout.activity_print_template);
        binding.printTemplateBack.setOnClickListener(v -> finish());
        //Create Labels2 label data
        List<Label> labels2 = TemplateUtils.initLabels2();
        //Create Labels1 label data
        List<Label> labels1 = TemplateUtils.initLabels1(PrintTemplateActivity.this);
        //No preview print demo1 click event
        binding.printNoPreview1.setOnClickListener(v -> requestBluetoothPermission(() ->
                //Call no preview print
                WwPrintUtils.getInstance(PrintTemplateActivity.this).asyncPrint(labels1, PrintTemplateActivity.this))
        );
        //No preview print demo2 click event
        binding.printNoPreview2.setOnClickListener(v -> requestBluetoothPermission(() ->
                //Call no preview print
                WwPrintUtils.getInstance(PrintTemplateActivity.this).asyncPrint(labels2, this)));
        //Preview print demo1 click event
        binding.printWithPreview1.setOnClickListener(v -> requestBluetoothPermission(() ->
                //Call preview print
                WwPrintUtils.getInstance(PrintTemplateActivity.this).previewPrint(labels1, this)));
        //Preview print demo2 click event
        binding.printWithPreview2.setOnClickListener(v -> requestBluetoothPermission(() ->
                //Call preview print
                WwPrintUtils.getInstance(PrintTemplateActivity.this).previewPrint(labels2, this)));
        //Disconnect from the printer
        binding.printDisconnect.setOnClickListener(v->{
            WwPrintUtils.getInstance(PrintTemplateActivity.this).closeConnection();
        });
    }

    /**
     * Bluetooth permission request. Bluetooth permission must be requested before connecting to a printer.
     *
     * @param run Runnable callback method after permission is granted
     */
    private void requestBluetoothPermission(Runnable run) {
        if (PermissionUtils.hasBluetoothPermission(this)) {
            if (run != null) {
                run.run();
            }
            return;
        }
        PermissionUtils.requestBluetoothPermission(PrintTemplateActivity.this, new OnPermissionCallback() {
            @Override
            public void onGranted(@NonNull List<String> list, boolean b) {
                if (run != null) {
                    run.run();
                }
            }

            @Override
            public void onDenied(@NonNull List<String> list, boolean b) {
                boolean doNotAskAgain = XXPermissions.isDoNotAskAgainPermissions(PrintTemplateActivity.this, list);
                // "Don't ask again" option checked, navigate to app settings
                if (doNotAskAgain) {
                    System.out.println("Don't ask again option checked, navigate to app settings");
                }
            }
        });
    }

    @Override
    public void OnPrintSuccessEvent() {
        System.out.println(Constant.TAG + "--->print success");
    }

    @Override
    public void OnPrintErrorEvent(WwCommon.PrintResult printResult) {
        System.out.println(Constant.TAG + "--->error type--->" + printResult.getValue());
    }
}
