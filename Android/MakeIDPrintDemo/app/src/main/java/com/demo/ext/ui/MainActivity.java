package com.demo.ext.ui;

import android.content.Intent;
import android.os.Bundle;

import androidx.activity.ComponentActivity;
import androidx.annotation.Nullable;
import androidx.databinding.DataBindingUtil;

import com.demo.ext.R;
import com.demo.ext.databinding.ActivityMainBinding;
import com.demo.ext.ui.print.PrintTemplateActivity;

/**
 * APP Program Entry Page
 */
public class MainActivity extends ComponentActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ActivityMainBinding binding = DataBindingUtil.setContentView(this, R.layout.activity_main);
        Intent templateIntent = new Intent(this, PrintTemplateActivity.class);
        //Template printing click event, navigate to the template printing page
        binding.printTemplate.setOnClickListener(v -> startActivity(templateIntent));
    }
}
