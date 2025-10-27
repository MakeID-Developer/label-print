

### Reference Resources  

### JAR Package Resource Addition 

​	According to project planning, create a "lib" folder in the Model project, and place the "wewinPrinter_api_1.46.jar" file inside this folder. Example project directory structure:

> |-- app 
>
>     | --- libs 
>
>           | --- wewinPrinterExtapi.aar

  #### Project Dependency Reference 

​	Navigate to the Model project mentioned above, and add the following dependency in its "build.gradle" file:

```
dependencies {
	 implementation files('lib/wewinPrinterExtapi.aar')
 }
```

### Permission Request

#### 1. Permission Declaration

​	Locate the "AndroidManifest.xml" file in the Model project and add the following permission declarations:

```
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission 
    android:name="android.permission.BLUETOOTH_CONNECT" 
    android:minSdkVersion="31" />
<uses-permission 
    android:name="android.permission.BLUETOOTH_SCAN" 
    android:minSdkVersion="31" />
<uses-permission 
    android:name="android.permission.BLUETOOTH_ADVERTISE" 
    android:minSdkVersion="31" />
```

> **Note**:
>
> - Permissions `BLUETOOTH_CONNECT`, `BLUETOOTH_SCAN`, and `BLUETOOTH_ADVERTISE` are introduced from Android 12 (API level 31). The `android:minSdkVersion="31"` attribute ensures compatibility with lower Android versions.

#### 2. Permission Request

​	Implement a permission utility class to request required permissions before performing Bluetooth operations. This example uses the open-source **XXPermissions** framework. If this does not meet your requirements, you may replace it with another permission library.

​	Example code (from the `PermissionUtils` class in the project):

```
/**
 * Request Bluetooth permissions
 *
 * @param context  Context
 * @param callback OnPermissionCallback
 */
public static void requestBluetoothPermission(Context context, OnPermissionCallback callback) {
    // Android 12+ (API 31+)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        XXPermissions.with(context)
            .permission(PermissionLists.getBluetoothScanPermission())
            .permission(PermissionLists.getBluetoothAdvertisePermission())
            .permission(PermissionLists.getBluetoothConnectPermission())
            .request(callback);
    }
    // Android 10+ (API 29-30)
    else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        XXPermissions.with(context)
            .permission(PermissionLists.getAccessFineLocationPermission())
            .permission(PermissionLists.getBluetoothConnectPermission())
            .request(callback);
    }
    // Android 9 and below (API < 29)
    else {
        XXPermissions.with(context)
            .permission(PermissionLists.getBluetoothConnectPermission())
            .request(callback);
    }
}
```

> **Tip**:
>
> - Ensure that the `PermissionLists` class properly defines the required permission constants.
> - It is recommended to call `requestBluetoothPermission()` before initiating any Bluetooth scanning, connection, or printing operations.



# Print Control Utility Class - WwPrintUtils

**Location:** `cn.com.wewin.extapi.universal.WwPrintUtils`

---

## 1. Basic Operations

### 1.1 Initialization
- **Method:** `WwPrintUtils.getInstance(Context context)`
- **Note:** The `context` parameter can be `null`. However, if preview or progress dialog is required, a valid context must be provided.

### 1.2 Configuration Constants

| Property                           | Description                                                  | Type      | Default Value |
| ---------------------------------- | ------------------------------------------------------------ | --------- | ------------- |
| `previewFollowPaperDirection`      | Whether preview follows paper feed direction                 | `boolean` | `true`        |
| `cancelAlignmentAutoSwitch`        | Whether to disable automatic text block layout switching based on rotation | `boolean` | `true`        |
| `ifDebug`                          | Enable debug mode (currently only used to show color distinction during preview rendering) | `boolean` | `false`       |
| `ifShowBluetoothList` (Deprecated) | Whether to show Bluetooth selection list. Use `setShowDeviceList(false)` instead. | `boolean` | `false`       |
| `ifShowPrintCountEdit`             | Whether to show print count input box in preview             | `boolean` | `false`       |
| `ifCheckLabelType`                 | Whether to detect label type                                 | `boolean` | `false`       |
| `popMessage`                       | Message for display and paste usage                          | `String`  | `""`          |
| `ifShowPrintingAlert`              | Whether to show printing progress alert                      | `boolean` | `true`        |
| `ifCheckPermissionPop`             | Whether to enable permission check and prompt. If `false`, context is not required. | `boolean` | `true`        |
| `labelTitle`                       | Title for print preview (modifiable)                         | `String`  | `""`          |
| `ifShowConnectDialog`              | Whether to show connection progress dialog                   | `boolean` | `true`        |
| `ifSupportChannelPrinter`          | Whether to support channel version devices                   | `boolean` | `true`        |
| `ifSupportChannelPrinterOnly`      | Whether to support only channel version devices              | `boolean` | `false`       |

---

## 2. Print Control Methods

### 2.1 Synchronous Print without Preview - `syncPrint()`

#### 2.1.1 Parameters

| Parameter | Description                                     | Type     |
| --------- | ----------------------------------------------- | -------- |
| `object`  | Array of labels or images (Label[] or Bitmap[]) | `Object` |

#### 2.1.2 Return Type
- `PrintResult` (Print result enum)

#### 2.1.3 Example Usage
```
PrintResult printResult = WwPrintUtils.getInstance(MainActivity.this).syncPrint(TemplateUtils.initLabels(MainActivity.this));
```



### 2.2 Asynchronous Print without Preview - `asyncPrint()`

#### 2.2.1 Parameters

| Parameter             | Description                                     | Type                  |
| --------------------- | ----------------------------------------------- | --------------------- |
| `object`              | Array of labels or images (Label[] or Bitmap[]) | `Object`              |
| `iPrintLabelCallback` | Callback interface object                       | `IPrintLabelCallback` |

#### 2.2.2 Return Type
- `void`

#### 2.2.3 Example Usage
```
// Asynchronous printing - with progress dialog. Since callbacks involve UI operations, use a Handler.
WwPrintUtils.getInstance(MainActivity.this).asyncPrint(
    TemplateUtils.initLabels(MainActivity.this),
    new IPrintLabelCallback() {

        @Override
        public void OnPrintSuccessEvent() {
            System.out.println("*******" + "Print successful");
        }

        @Override
        public void OnPrintErrorEvent(PrintResult errorType) {
            System.out.println("*******" + errorType.getValue());
        }
    }
);

// Asynchronous printing - without progress dialog. Since callbacks involve UI operations, use a Handler.
WwPrintUtils.getInstance(null).asyncPrint(
    TemplateUtils.initLabels(MainActivity.this),
    new IPrintLabelCallback() {

        @Override
        public void OnPrintSuccessEvent() {
            System.out.println("*******" + "Print successful");
        }

        @Override
        public void OnPrintErrorEvent(PrintResult errorType) {
            System.out.println("*******" + errorType.getValue());
        }
    }
);
```



### 2.3 Asynchronous Print with Preview - `previewPrint()`

#### 2.3.1 Parameters

| Parameter             | Description                                     | Type                  |
| --------------------- | ----------------------------------------------- | --------------------- |
| `object`              | Array of labels or images (Label[] or Bitmap[]) | `Object`              |
| `iPrintLabelCallback` | Callback interface object                       | `IPrintLabelCallback` |

#### 2.3.2 Return Type
- `void`

#### 2.3.3 Example Usage
```
WwPrintUtils.getInstance(MainActivity.this).previewPrint(
    TemplateUtils.initLabels(MainActivity.this),
    new IPrintLabelCallback() {
        @Override
        public void OnPrintSuccessEvent() {
            System.out.println("*******" + "print success");
        }

        @Override
        public void OnPrintErrorEvent(PrintResult errorType) {
            System.out.println("*******" + errorType.getValue());
        }
    });
```



### 2.4 Get Instance (Singleton) - `getInstance()`

#### 2.4.1 Parameters

| Parameter  | Description         | Type      |
| ---------- | ------------------- | --------- |
| `_context` | Application context | `Context` |

#### 2.4.2 Return Type
- `WwPrintUtils` (Singleton instance)

---

### 2.5 Search Bluetooth Devices - `searchDevice`

#### 2.5.1 Parameters

| Parameter                 | Description               | Type                                            |
| ------------------------- | ------------------------- | ----------------------------------------------- |
| `searchBluetoothListener` | Bluetooth search listener | `BluetoothSearchHelper.SearchBluetoothListener` |

#### Notes:
- `onSearchBluetoothFailed(BluetoothErrorType errorType)`:
  - Called once when search ends with failure.
  - Error types:
    - `SEARCH_BLUETOOTH_TIMEOUT`: Bluetooth scan timeout.
    - `NO_BLUETOOTH_FOUND`: No Bluetooth device found.
    - `BLUETOOTH_ENABLE_ERROR`: Failed to enable Bluetooth module.
    - `BLUETOOTH_ADAPTER_ERROR`: Failed to get Bluetooth adapter.
    - `NO_CONTEXT`: Context not available.

- `onSearchBluetoothSuccess(List<BluetoothDevice> results)`:
  - Called repeatedly as devices are found (for real-time UI updates).

- `onSearchBluetoothOver(List<BluetoothDevice> results)`:
  - Called once when search completes successfully.

> `onSearchBluetoothFailed` and `onSearchBluetoothOver` are mutually exclusive.

#### 2.5.2 Return Type
- `void`

#### 2.5.3 Example Usage
```
// Note: For Android < 12, location permission is required for Bluetooth scanning. Please ensure the permission is declared in AndroidManifest: <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

WwPrintUtils.getInstance(MainActivity.this).searchDevice(new BluetoothSearchHelper.SearchBluetoothListener() {
    @Override
    public void onSearchBluetoothFailed(BluetoothSearchHelper.BluetoothErrorType bluetoothErrorType) {
        System.out.println(bluetoothErrorType);
    }

    @Override
    public void onSearchBluetoothSuccess(List<BluetoothDevice> list) {

    }

    @Override
    public void onSearchBluetoothOver(List<BluetoothDevice> list) {
        for (int i = 0; i < list.size(); i++) {
            System.out.println(list.get(i).getName());
            if (list.get(i).getName().equals("P5018J1592")) {
                WwPrintUtils.getInstance(MainActivity.this).connectDevice(
                    wewinPrinterOperateAPI.wewinPrinterOperatePrinterType.bluetooth,
                    list.get(i),
                    new wewinPrinterOperateAPI.IPrinterConnectionInterface() {
                        @Override
                        public void OnPrinterConnectionChangeListener(boolean b, Object o) {
                            if (b) {
                                System.out.println("Connection successful");
                            }
                        }

                        @Override
                        public void OnPrinterDisconnectChangeListener(wewinPrinterOperateAPI.PrinterDisconnectReason printerDisconnectReason) {
                            System.out.println("Connection failed, reason: " + printerDisconnectReason);
                        }
                    });
            }
        }
    }
});
```



### 2.6 Search WiFi Devices - `searchDevice`

#### 2.6.1 Parameters

| Parameter            | Description          | Type                                  |
| -------------------- | -------------------- | ------------------------------------- |
| `searchWifiListener` | WiFi search listener | `WifiSearchHelper.SearchWifiListener` |

#### Notes:
- `onSearchWifiFailed(ErrorType errorType)`:
  - Called once on search failure.
  - Error types:
    - `SEARCH_WIFI_TIMEOUT`: WiFi scan timeout.
    - `NO_WIFI_FOUND`: No WiFi signal found.
    - `WIFI_ENABLE_ERROR`: Failed to enable WiFi module.
    - `WIFI_ADAPTER_ERROR`: Failed to get WiFi adapter.
    - `NO_CONTEXT`: Context not available.

- `onSearchWifiSuccess(List<ScanResult> results)`:
  - Called repeatedly as devices are found.

- `onSearchWifiOver(List<ScanResult> results)`:
  - Called once when search completes successfully.

> `onSearchWifiFailed` and `onSearchWifiOver` are mutually exclusive.

#### 2.6.2 Return Type
- `void`

#### 2.6.3 Example Usage
```
WwPrintUtils.getInstance(MainActivity.this).searchDevice(new WifiSearchHelper.SearchWifiListener() {
    @Override
    public void onSearchWifiFailed(WifiSearchHelper.ErrorType errorType) {
        System.out.println("Error");
    }

    @Override
    public void onSearchWifiSuccess(List<ScanResult> list) {

    }

    @Override
    public void onSearchWifiOver(List<ScanResult> list) {
        for (int i = 0; i < list.size(); i++) {
            System.out.println(list.get(i).SSID);
            if (list.get(i).SSID.equals("P5018J1592")) {
                WwPrintUtils.getInstance(MainActivity.this).connectDevice(
                    wewinPrinterOperateAPI.wewinPrinterOperatePrinterType.wifi,
                    list.get(i),
                    new wewinPrinterOperateAPI.IPrinterConnectionInterface() {
                        @Override
                        public void OnPrinterConnectionChangeListener(boolean b, Object o) {
                            if (b) {
                                System.out.println("Connection successful");
                            }
                        }

                        @Override
                        public void OnPrinterDisconnectChangeListener(wewinPrinterOperateAPI.PrinterDisconnectReason printerDisconnectReason) {
                            System.out.println("Connection failed, reason: " + printerDisconnectReason);
                        }
                    });
            }
        }
    }
});
```



### 2.7 Connect Device (Bluetooth/WiFi) - `connectDevice`

#### 2.7.1 Parameters

| Parameter                     | Description                                     | Type                                                 |
| ----------------------------- | ----------------------------------------------- | ---------------------------------------------------- |
| `operatePrinterType`          | Printer connection type (`bluetooth` or `wifi`) | `wewinPrinterOperatePrinterType`                     |
| `deviceObject`                | Connection object                               | `Object`                                             |
| `iPrinterConnectionInterface` | Connection callback                             | `wewinPrinterOperateAPI.IPrinterConnectionInterface` |

##### `deviceObject` Details:

| Connection Type | Object Type                         | Description                                                  |
| --------------- | ----------------------------------- | ------------------------------------------------------------ |
| **WiFi**        | `String`                            | SSID (e.g., `P7012345678`)                                   |
| **Bluetooth**   | `String`                            | MAC address (e.g., `84:0D:8E:07:50:E2`)                      |
| **WiFi**        | `String[]`                          | `{SSID, IP, Port}` (e.g., `{"P7012345678", "192.168.10.100", "8866"}`) |
| **Bluetooth**   | `String[]`                          | `null`                                                       |
| **WiFi**        | `ScanResult` or `WifiConfiguration` | WiFi device object                                           |
| **Bluetooth**   | `BluetoothDevice`                   | Bluetooth device object                                      |

##### Callbacks:
- `OnPrinterConnectionChangeListener(boolean isConnected, Object deviceObject)`:
  - `isConnected`: `true` if connected, `false` if disconnected.
  - `deviceObject`: `BluetoothDevice` (Bluetooth) or `WifiInfo` (WiFi).
- `OnPrinterDisconnectChangeListener(PrinterDisconnectReason reason)`:
  - `reason`: Enum indicating disconnect reason:
    - `power_off`: Printer powered off.
    - `occupied`: Occupied by another device.
    - `others`: Other reasons.

#### 2.7.2 Return Type
- `void`

#### 2.7.3 Example Usage
```
String macStr = "8C:AA:B5:91:B1:56"; 
// Can set MAC address, or use the object returned from search
WwPrintUtils.getInstance(MainActivity.this).connectDevice(
        wewinPrinterOperateAPI.wewinPrinterOperatePrinterType.bluetooth,
        macStr,
        new wewinPrinterOperateAPI.IPrinterConnectionInterface() {

    @Override
    public void OnPrinterConnectionChangeListener(boolean b, wewinPrinterOperateObject wewinPrinterOperateObject) {

    }

    @Override
    public void OnPrinterDisconnectChangeListener(wewinPrinterOperateAPI.PrinterDisconnectReason printerDisconnectReason) {
        System.out.println("Connection failed, reason: " + printerDisconnectReason);
    }

    @Override
    public void OnPrinterGetDPIListener(byte[] bytes) {

    }
});
```



### 2.8 Get ExtApi SDK Version - `getVersion()`

#### 2.8.1 Return Type
- `String`: Version number

#### 2.8.2 Example Usage
```
String version = WwPrintUtils.getInstance(MainActivity.this).getVersion();
```



### 2.9 Set Per-Label Print Success Callback -setiPrintPieceLabelCallback`

#### 2.9.1 Return Type
- `void`

#### 2.9.2 Example Usage
```
WwPrintUtils.getInstance(MainActivity.this).setiPrintPieceLabelCallback(new IPrintPieceLabelCallback() {
    @Override
    public void OnPrintPieceSuccessEvent(int index) {
        System.out.println("Printed label " + index + " successfully");
    }
});
```



### 2.10 Check if Printer is Connected - `isConnected()`

#### 2.10.1 Return Type
- `boolean`

#### 2.10.2 Example Usage
```
boolean isConnected = WwPrintUtils.getInstance(MainActivity.this).isConnected();
```



### 2.11 Check if Printer is Currently Printing - `isPrinting()`

#### 2.11.1 Return Type
- `void`

> **Note:** This appears to be an error in the original documentation — a method checking printing status should return `boolean`, not `void`.

#### 2.11.2 Example Usage
```
boolean isPrinting = WwPrintUtils.getInstance(MainActivity.this).isPrinting();
```



### 2.12 Show Device Selection List - `setShowDeviceList`

#### 2.12.1 Return Type
- `void`

#### 2.12.2 Example Usage
```
PrintResult printResult = WwPrintUtils.getInstance(MainActivity.this) // context cannot be null
    .setConnectType(WwCommon.ConnectType.bluetooth)
    .setShowDeviceList(true) // Whether to show the search list
    .syncPrint(TemplateUtils.initLabels(MainActivity.this));
```



### 2.13 Set Search Prefix Filter - `setSearchDeviceStartWith`

#### 2.13.1 Return Type
- `void`

#### 2.13.2 Example Usage
```
PrintResult printResult = WwPrintUtils.getInstance(MainActivity.this) // context cannot be null
    .setConnectType(WwCommon.ConnectType.bluetooth)
    .setShowDeviceList(true) // Whether to show the search list
    .setSearchDeviceStartWith("p51") // Printer serial number prefix or full name
    .syncPrint(TemplateUtils.initLabels(MainActivity.this));
```



### 2.14 Set Search Type - `setSearchType`

#### 2.14.1 Return Type
- `void`

#### 2.14.2 Example Usage
```
PrintResult printResult = WwPrintUtils.getInstance(MainActivity.this) // context cannot be null
    .setConnectType(WwCommon.ConnectType.bluetooth)
    .setShowDeviceList(true) // Whether to show the search list
    .setSearchDeviceStartWith("p51") // Printer serial number prefix or full name
    // Can set two options at the same time, separated by '|', or set only one (reflected on the function buttons in the search list)
    .setSearchType(WwSearchTypeBluetooth | WwSearchTypeLAN) // Default is WwSearchTypeBluetooth | WwSearchTypeLAN
    .syncPrint(TemplateUtils.initLabels(MainActivity.this));
```



### 2.15 Set Default Search Type - `setDefaultSearchType`

#### 2.15.1 Return Type
- `void`

#### 2.15.2 Example Usage
```
PrintResult printResult = WwPrintUtils.getInstance(MainActivity.this) // context cannot be null
    .setConnectType(WwCommon.ConnectType.bluetooth)
    .setShowDeviceList(true) // Whether to show the device search list
    .setSearchDeviceStartWith("p51") // Printer serial number prefix or full name
    // Two options can be set simultaneously, separated by '|', or only one option can be set
    .setSearchType(WwSearchTypeBluetooth | WwSearchTypeLAN) // Default is WwSearchTypeBluetooth | WwSearchTypeLAN
    // Only one can be set, otherwise it will fail (reflected in the initial search type of the search list)
    .setDefaultSearchType(WwSearchTypeBluetooth) // Default is WwSearchTypeBluetooth
    .syncPrint(TemplateUtils.initLabels(MainActivity.this));
```



## 3. Bitmap Utility Class - `BitmapUtils`

**Location:** `cn.com.wewin.extapi.bitmap.BitmapUtils`

### 3.1 Create Label Bitmap Array - `createLabelBitmap`

#### 3.1.1 Parameters

| Parameter   | Description                                  | Type           |
| ----------- | -------------------------------------------- | -------------- |
| `labels`    | Array of labels or images                    | `List<Object>` |
| `dot`       | DPI dots per mm                              | `float`        |
| `ifDebug`   | Debug mode (adds background color to blocks) | `boolean`      |
| `ifPreView` | Whether called for preview                   | `boolean`      |

#### 3.1.2 Return Type
- `List<Bitmap>`: List of generated label bitmaps

#### 3.1.3 Example Usage
```
List<Bitmap> labelBitmapList = BitmapUtils.createLabelBitmap(labelList,DPIDots.Dots8.getValue(), false, false);
```



### 3.2 Create Single Label Bitmap - `createLabelBitmap`

#### 3.2.1 Parameters

| Parameter   | Description                | Type      |
| ----------- | -------------------------- | --------- |
| `label`     | Single label object        | `Label`   |
| `dot`       | DPI dots per mm            | `float`   |
| `ifDebug`   | Debug mode                 | `boolean` |
| `ifPreView` | Whether called for preview | `boolean` |

#### 3.2.2 Return Type
- `Bitmap`: Generated label bitmap

#### 3.2.3 Example Usage
```
Bitmap labelBitmap = BitmapUtils.createLabelBitmap(label,DPIDots.Dots8.getValue(), false, false);
```



### 3.3 Load Bitmap from Assets or Drawable - `invokeResouceBitmap`

#### 3.3.1 Parameters

| Parameter     | Description                    | Type      |
| ------------- | ------------------------------ | --------- |
| `context`     | Context                        | `Context` |
| `graphicName` | Resource name (with extension) | `String`  |

#### 3.3.2 Return Type
- `Bitmap`

### 3.4 Convert Object List to Bitmap List - `objectConvert2Bitmap`

#### 3.4.1 Parameters

| Parameter    | Description                       | Type           |
| ------------ | --------------------------------- | -------------- |
| `objectList` | List of objects (Label or Bitmap) | `List<Object>` |

#### 3.4.2 Return Type
- List<Bitmap>

### 3.5 Convert Object List to Label List - `objectConvert2Label`

#### 3.5.1 Parameters

| Parameter    | Description                       | Type           |
| ------------ | --------------------------------- | -------------- |
| `objectList` | List of objects (Label or Bitmap) | `List<Object>` |

#### 3.5.2 Return Type
- `List<Label>`

## 4. Canvas Utility Class - `CanvasUtils`

**Location:** `cn.com.wewin.extapi.bitmap.CanvasUtils`

### 4.1 Draw Text with Auto-Scaling - `drawText`

#### 4.1.1 Parameters

| Parameter             | Description                                      | Type                           |
| --------------------- | ------------------------------------------------ | ------------------------------ |
| `text`                | Content                                          | `String`                       |
| `textPaint`           | Text paint                                       | `TextPaint`                    |
| `maxW`                | Max width                                        | `int`                          |
| `maxH`                | Max height                                       | `int`                          |
| `lineOffset`          | Line spacing                                     | `int`                          |
| `degree`              | Rotation degree                                  | `int`                          |
| `horizontalAlignment` | Horizontal alignment (`Left`, `Right`, `Center`) | `WwCommon.HorizontalAlignment` |
| `verticalAlignment`   | Vertical alignment (`Top`, `Center`, `Bottom`)   | `WwCommon.VerticalAlignment`   |
| `needResize`          | Whether to auto-scale                            | `boolean`                      |
| `backgroundColor`     | Background color                                 | `int`                          |
| `textFormat`          | Text formatting style                            | `WwTextFormat`                 |
| `shrinkIdentify`      | Character to identify shrink (default: `":"`)    | `String`                       |
| `shrinkWordNum`       | Number of characters to indent (default: `-1`)   | `int`                          |
| `ifShrinkBold`        | Whether to bold text before colon                | `boolean`                      |

#### 4.1.2 Return Type
- `Bitmap`

#### 4.1.3 Example Usage
```
TextBlock txtBlock = (TextBlock) block;
// 创建画笔
TextPaint txtPaint = new TextPaint();
// 设置画笔颜色
txtPaint.setColor(Color.BLACK);
// 字号
txtPaint.setTextSize(txtBlock.fontSize * dot.getValue());
// 字体
Typeface font = Typeface.create(txtBlock.fontName,txtBlock.textStyle);
txtPaint.setTypeface(font);

// 自适应绘制文字
txtBlock.maxW = txtBlock.maxW <= 0 ? label.labelWidth : txtBlock.maxW;
txtBlock.maxH = txtBlock.maxH <= 0 ? label.labelHeight : txtBlock.maxH;

Bitmap txtBitmap = CanvasUtils.drawText(txtBlock.content,txtPaint, 
                                        (int) (txtBlock.maxW * dot.getValue()),
                                        (int) (txtBlock.maxH * dot.getValue()),
                                        (int) (txtBlock.lineOffset * dot.getValue()),
                                        txtBlock.oritention.getValue(),
                                        txtBlock.horizontalAlignment,
                                        txtBlock.verticalAlignment, 
                                        txtBlock.needResize,
                                        ifDebug ? Color.parseColor(backColorString) : Color.TRANSPARENT);
txtBlock.textFormat = WwCommon.WwTextFormat.wwTextFormatShrink;
txtBlock.shrinkIdentify ="!";
txtBlock.shrinkWordNum = 7;
txtBlock.ifShrinkBold = true;
```



### 4.2 Draw Barcode - `drawBarcode`

#### 4.2.1 Parameters

| Parameter              | Description            | Type                   |
| ---------------------- | ---------------------- | ---------------------- |
| `text`                 | Content                | `String`               |
| `width`                | Barcode width          | `int`                  |
| `height`               | Barcode height         | `int`                  |
| `needResize`           | Force fixed size       | `boolean`              |
| `needReverseColor`     | Invert colors          | `boolean`              |
| `errorCorrectionLevel` | Error correction level | `ErrorCorrectionLevel` |
| `degree`               | Rotation degree        | `int`                  |
| `backgroundColor`      | Background color       | `int`                  |

#### 4.2.2 Return Type
- `Bitmap`

#### 4.2.3 Example Usage
```
BarcodeBlock barcodeBlock = new BarcodeBlock();
barcodeBlock.x = 2;
barcodeBlock.y = 3;
barcodeBlock.content = "690123456789";
barcodeBlock.width = 10;
barcodeBlock.height = 5;
barcodeBlock.oritention = WwCommon.Oritention.Oritention90;
```



### 4.3 Draw QR Code - `drawQrcode`

#### 4.3.1 Parameters

| Parameter              | Description                                        | Type                   |
| ---------------------- | -------------------------------------------------- | ---------------------- |
| `text`                 | Content                                            | `String`               |
| `width`                | QR code width                                      | `int`                  |
| `needResize`           | Force fixed size                                   | `boolean`              |
| `needReverseColor`     | Invert colors                                      | `boolean`              |
| `errorCorrectionLevel` | Error correction level                             | `ErrorCorrectionLevel` |
| `qrVersion`            | QR version (1–40)                                  | `int`                  |
| `degree`               | Rotation degree                                    | `int`                  |
| `backgroundColor`      | Background color                                   | `int`                  |
| `logoWidth`            | Logo width                                         | `int`                  |
| `logoHeight`           | Logo height                                        | `int`                  |
| `logo`                 | Logo (resource name, asset, drawable, or `Bitmap`) | `Object`               |
| `context`              | Required if logo is a resource                     | `Context`              |

#### 4.3.2 Return Type
- `Bitmap`

#### 4.3.3 Example Usage
```
QrcodeBlock qrcodeBlock = new QrcodeBlock();
qrcodeBlock.x = 20;
qrcodeBlock.y = 5;
qrcodeBlock.content = "asfdghjhgfdsdfghjkjhgfdsasdfghjkjhgfd";
qrcodeBlock.width = 30;
qrcodeBlock.ifPreViewStatic = false;
qrcodeBlock.logo = bitmap;
qrcodeBlock.oritention = WwCommon.Oritention.Oritention0;
```



### 4.4 Draw Graphic - `drawGraphic`

#### 4.4.1 Parameters

| Parameter         | Description         | Type      |
| ----------------- | ------------------- | --------- |
| `context`         | Drawing context     | `Context` |
| `width`           | Width               | `int`     |
| `height`          | Height              | `int`     |
| `graphic`         | Image resource name | `String`  |
| `degree`          | Rotation degree     | `int`     |
| `backgroundColor` | Background color    | `int`     |

#### 4.4.2 Return Type
- `Bitmap`

#### 4.4.3 Example Usage
```
GraphicBlock graphicBlock = new GraphicBlock(context);
graphicBlock.x = 45;
graphicBlock.y = 7;
graphicBlock.width = 20;
graphicBlock.height = 6;
graphicBlock.graphic = "chinaMobile.png";
```



### 4.5 Draw Line - `drawLine`

#### 4.5.1 Parameters

| Parameter         | Description      | Type    |
| ----------------- | ---------------- | ------- |
| `width`           | Line width       | `int`   |
| `height`          | Line height      | `int`   |
| `degree`          | Rotation degree  | `int`   |
| `paint`           | Paint object     | `Paint` |
| `backgroundColor` | Background color | `int`   |

#### 4.5.2 Return Type
- `Bitmap`

#### 4.5.3 Example Usage
```
LineBlock lineBlock = new LineBlock();
lineBlock.x = 2;
lineBlock.y = 20;
lineBlock.width = 36;
lineBlock.height = 0.4f;
```

### 4.6 Draw Rectangle - `drawRect`

#### 4.6.1 Parameters

| Parameter         | Description      | Type    |
| ----------------- | ---------------- | ------- |
| `width`           | Width            | `int`   |
| `height`          | Height           | `int`   |
| `thinkness`       | Line thickness   | `int`   |
| `radius`          | Corner radius    | `int`   |
| `degree`          | Rotation degree  | `int`   |
| `paint`           | Paint object     | `Paint` |
| `backgroundColor` | Background color | `int`   |

#### 4.6.2 Return Type
- `Bitmap`

#### 4.6.3 Example Usage
```
RectBlock rectBlock = new RectBlock();
rectBlock.x = 56.75f;
rectBlock.y = 9.75f;
rectBlock.width = 5;
rectBlock.height = 5;
rectBlock.thickness = 0.4f;
rectBlock.radius = 2.5f;
```

### 4.7 Rotate Bitmap - `rotateBitmap`

#### 4.7.1 Parameters

| Parameter | Description      | Type     |
| --------- | ---------------- | -------- |
| `bitmap`  | Bitmap to rotate | `Bitmap` |
| `degree`  | Rotation degree  | `int`    |

#### 4.7.2 Return Type
- `Bitmap`: Rotated bitmap

---

### 4.8 Scale Bitmap - `scaleBitmap`

#### 4.8.1 Parameters

| Parameter | Description     | Type     |
| --------- | --------------- | -------- |
| `bitmap`  | Bitmap to scale | `Bitmap` |
| `width`   | Target width    | `int`    |
| `height`  | Target height   | `int`    |

#### 4.8.2 Return Type
- `Bitmap`: Scaled bitmap

## 5. Constants Class - `WwCommon`

**Location:** `cn.com.wewin.extapi.universal.WwCommon`

### 5.1 Print Settings Result - `SetResult`

| Constant              | Description               | Value |
| --------------------- | ------------------------- | ----- |
| `darknessSetSuccess`  | Darkness setting success  | `0`   |
| `darknessSetfailed`   | Darkness setting failed   | `1`   |
| `cutOptionSetSuccess` | Cutter option set success | `2`   |
| `cutOptionSetfailed`  | Cutter option set failed  | `3`   |

**Methods:**
- `SetResult(int value)`
- `getValue()` → `int`

---

### 5.2 Print Result Enum - `PrintResult`

| Constant             | Description                     | Value |
| -------------------- | ------------------------------- | ----- |
| `unknowError`        | Unknown error                   | `-1`  |
| `connectError`       | Connection error                | `-3`  |
| `connectDeviceError` | Device connection error         | `-4`  |
| `createLabelError`   | Label creation error            | `-5`  |
| `printError`         | Print error                     | `-6`  |
| `printingError`      | Printer busy / already printing | `-7`  |
| `previewError`       | Preview error                   | `-8`  |
| `labelTypeError`     | Label type mismatch             | `-9`  |
| `printCancel`        | Print canceled                  | `-10` |
| `permissionError`    | Permission error                | `-11` |
| `printSuccess`       | Print successful                | `0`   |

**Methods:**
- `PrintResult(int value)`
- `getValue()` → `int`

---

### 5.3 Connection Types - `ConnectType`

| Constant        | Description                          |
| --------------- | ------------------------------------ |
| `unknow`        | Unknown                              |
| `bluetooth`     | Bluetooth SPP                        |
| `bluetooth_ble` | Bluetooth BLE                        |
| `serialport`    | Serial port (embedded apps like H51) |
| `usb`           | USB                                  |
| `network`       | Network (LAN, e.g., I70)             |
| `wifi`          | WiFi                                 |
| `w10`           | W10                                  |
| `h50_old`       | H50 old version                      |

---

### 5.4 Block Types - `BlockType`

| Constant  | Description | Value |
| --------- | ----------- | ----- |
| `Text`    | Text        | `0`   |
| `Barcode` | Barcode     | `1`   |
| `Qrcode`  | QR Code     | `2`   |
| `Graphic` | Image       | `3`   |
| `Line`    | Line        | `4`   |
| `Rect`    | Rectangle   | `5`   |

**Methods:**
- `BlockType(int value)`
- `getValue()` → `int`

---

### 5.5 Orientation - `Oritention`

| Constant        | Description | Value |
| --------------- | ----------- | ----- |
| `Oritention0`   | 0 degrees   | `0`   |
| `Oritention90`  | 90 degrees  | `90`  |
| `Oritention180` | 180 degrees | `180` |
| `Oritention270` | 270 degrees | `270` |

**Methods:**
- `Oritention(int value)`
- `getValue()` → `int`

---

### 5.6 Cutter Options - `CutOption`

| Constant  | Description               | Value |
| --------- | ------------------------- | ----- |
| `Default` | Keep printer default      | `-1`  |
| `Option0` | Stop at tear-off position | `0`   |
| `Option1` | Stop at cut position      | `1`   |
| `Option2` | Continuous auto-cut       | `2`   |
| `Option3` | Cut after current task    | `3`   |
| `Option4` | Continuous manual cut     | `4`   |

**Methods:**
- `CutOption(int value)`
- `getValue()` → `int`

---

### 5.7 DPI Dots - `DPIDots`

| Constant | Description | Value |
| -------- | ----------- | ----- |
| `Dots7`  | 7 dots/mm   | `7`   |
| `Dots8`  | 8 dots/mm   | `8`   |
| `Dots11` | 11 dots/mm  | `11`  |
| `Dots12` | 12 dots/mm  | `12`  |
| `Dots24` | 24 dots/mm  | `24`  |

**Methods:**
- `DPIDots(int value)`
- `getValue()` → `int`

---

### 5.8 Text Alignment

#### Horizontal Alignment
| Constant | Description    |
| -------- | -------------- |
| `Left`   | Left-aligned   |
| `Right`  | Right-aligned  |
| `Center` | Center-aligned |

#### Vertical Alignment
| Constant | Description    |
| -------- | -------------- |
| `Top`    | Top-aligned    |
| `Bottom` | Bottom-aligned |
| `Center` | Center-aligned |

---

### 5.9 Label Types - `LabelType`

| Constant         | Description         |
| ---------------- | ------------------- |
| `defualt`        | Default (gap label) |
| `spaceLabel`     | Gap label           |
| `ddfLabel`       | No-gap label        |
| `blackMarkLabel` | Black mark label    |

---

### 5.10 Label Metadata Keys - `MapKey`

| Constant              | Description                   |
| --------------------- | ----------------------------- |
| `LabelTitle`          | Preview dialog title          |
| `DissablePrint`       | Whether to disable printing   |
| `DissablePrintReason` | Reason for disabling printing |

---

### 5.11 Text Formatting - `WwTextFormat`

| Constant                 | Description                          |
| ------------------------ | ------------------------------------ |
| `wwTextFormatNormal`     | Normal layout                        |
| `wwTextFormatShrink`     | Align after colon                    |
| `wwTextFormatShrinkBold` | Align after colon, bold before colon |

---

## 6. Label and Block Objects

### 6.1 Label Object - `Label`

**Location:** `cn.com.wewin.extapi.model.Label`

| Field                 | Description                                                  | Type                  | Default       | Unit |
| --------------------- | ------------------------------------------------------------ | --------------------- | ------------- | ---- |
| `labelWidth`          | Label width                                                  | `float`               |               | `mm` |
| `labelHeight`         | Label height                                                 | `float`               |               | `mm` |
| `previewGraphicName`  | Template image name (assets/drawable)                        | `String`              |               |      |
| `isBackground`        | Print background image                                       | `Boolean`             | `false`       |      |
| `context`             | Context for resource loading                                 | `Context`             |               |      |
| `rfid`                | RFID content                                                 | `String`              |               |      |
| `rfidStorageLocation` | RFID storage area (default: EPC)                             | `RFIDStorageLocation` | `epc`         |      |
| `rfidStorageByteType` | RFID storage type (default: single byte)                     | `RFIDStorageByteType` | `single_byte` |      |
| `ddfLength`           | DDF length (≥0)                                              | `float`               | `-1.f`        |      |
| `labelType`           | Label type (`default`, `spaceLabel`, `ddfLabel`, `blackMarkLabel`) | `LabelType`           | `defualt`     |      |
| `cutOption`           | Cutter option (-1: default, 0: tear-off, 1: cut, 2: auto-cut, 3: task-cut) | `CutOption`           | `-1`          |      |
| `oritention`          | Orientation (0:0°, 1:90°, 2:180°, 3:270°)                    | `Oritention`          | `0`           |      |
| `labelExtInfoMap`     | Extended label info                                          | `Map`                 |               |      |
| `blocks`              | Array of content blocks                                      | `Block[]`             |               |      |
| `detectionTypeKey`    | Label model/name (used for P31 when `ifCheckLabelType=true`) | `String`              |               |      |
| `textNeedFontBlocks`  | Font blocks array                                            | `TextBlock[]`         |               |      |

**Example:**

```
// Single label initialization
Label label = new Label();
label.labelWidth = 100;
label.labelHeight = 45;
label.oritention = WwCommon.Oritention.Oritention90;

// Configure preview box display information
Map<String, Object> map = new HashMap<>();
// title
map.put(WwCommon.MapKey.LabelTitle.getValue(), "QS-02F");
// Show print count input
map.put(WwCommon.MapKey.IfShowPrintCountEdit.getValue(), true);
label.labelExtInfoMap = map;

// Text
TextBlock txtBlock = new TextBlock();
txtBlock.x = 0;
txtBlock.y = 0;
txtBlock.content = "HelloWorld";
txtBlock.fontSize = 4;
txtBlock.verticalAlignment = WwCommon.VerticalAlignment.Center;
txtBlock.textStyle = Typeface.ITALIC;
txtBlock.needResize = false;

// Text 2
TextBlock txtBlock2 = new TextBlock();
txtBlock2.x = 0;
txtBlock2.y = 0;
txtBlock2.content = "HelloWorld2";
txtBlock2.fontSize = 7;

// Text 3
TextBlock txtBlock3 = new TextBlock();
txtBlock3.x = 0;
txtBlock3.y = 0;
txtBlock3.content = "HelloWorld3";
txtBlock3.fontSize = 4;

// Append to label
Block blocks[] = { txtBlock };
label.blocks = blocks;

// Uniform font size for block2 and block3
TextBlock textBlocks[] = {txtBlock2, txtBlock3};
label.textNeedFontBlocks = textBlocks;

// Append preview extension display information
Map<String, Object> map = new HashMap<>();
// Preview title header
map.put(WwCommon.MapKey.LabelTitle.getValue(), "50-20");
// Whether print button is enabled in preview interface
map.put(WwCommon.MapKey.DissablePrint.getValue(), true);
// Toast message when disabled
map.put(WwCommon.MapKey.DissablePrintReason.getValue(), "Error message");
label.labelExtInfoMap = map;

// Initialize label array
List<Label> labels = new ArrayList<Label>();
// Add a label
labels.add(label);
```

### 6.2 Block Objects

#### 6.2.1 Base Block - `Block`

**Location:** `cn.com.wewin.extapi.model.Block`

| Field           | Description                                                  | Type         | Default | Unit |
| --------------- | ------------------------------------------------------------ | ------------ | ------- | ---- |
| `type`          | Block type (0:Text, 1:Barcode, 2:QR, 3:Image, 4:Line, 5:Rect) | `BlockType`  | `0`     |      |
| `x`             | X coordinate                                                 | `float`      |         | `mm` |
| `y`             | Y coordinate                                                 | `float`      |         | `mm` |
| `oritention`    | Orientation                                                  | `Oritention` | `0`     |      |
| `ifOnlyPreview` | Show only in preview, not printed                            | `Boolean`    | `false` |      |

#### 6.2.2 Text Block - `TextBlock`

**Location:** `cn.com.wewin.extapi.model.TextBlock`

| Field                 | Description                                        | Type                           | Default              | Unit |
| --------------------- | -------------------------------------------------- | ------------------------------ | -------------------- | ---- |
| `type`                | Block type                                         | `BlockType`                    | `0`                  |      |
| `x`                   | X coordinate                                       | `float`                        |                      | `mm` |
| `y`                   | Y coordinate                                       | `float`                        |                      | `mm` |
| `fontSize`            | Max font size                                      | `float`                        | `3`                  | `mm` |
| `textStyle`           | Font style                                         | `int`                          | `Typeface.NORMAL`    |      |
| `fontName`            | Font name                                          | `String`                       | `"SimHei"`           |      |
| `maxW`                | Max print width                                    | `float`                        |                      | `mm` |
| `maxH`                | Max print height                                   | `float`                        |                      | `mm` |
| `lineOffset`          | Line spacing                                       | `float`                        |                      | `mm` |
| `textNodeOffset`      | Spacing between text nodes                         | `float`                        |                      | `mm` |
| `content`             | Content                                            | `String`                       |                      |      |
| `horizontalAlignment` | Horizontal alignment                               | `WwCommon.HorizontalAlignment` | `Left`               |      |
| `verticalAlignment`   | Vertical alignment                                 | `WwCommon.VerticalAlignment`   | `Top`                |      |
| `needResize`          | Auto-scale text                                    | `boolean`                      | `true`               |      |
| `oritention`          | Orientation                                        | `Oritention`                   | `0`                  |      |
| `myFont`              | Custom font (overrides `fontName` and `textStyle`) | `Typeface`                     |                      |      |
| `textFormat`          | Text formatting style                              | `WwTextFormat`                 | `wwTextFormatNormal` |      |

**Example:**

```
TextBlock txtBlock = new TextBlock();
txtBlock.x = 0;
txtBlock.y = 0;
txtBlock.content = "HelloWorld";
txtBlock.lineOffset = 0;
txtBlock.textNodeOffset = 1;
txtBlock.maxW = 20;
txtBlock.fontSize = 4;
txtBlock.textFormat = WwCommon.WwTextFormat.wwTextFormatNormal;
//需要自定义字体
//txtBlock.myFont= Typeface.createFromAsset(context.getAssets(),"fonts/RYGBK.TTF");
txtBlock.verticalAlignment = WwCommon.VerticalAlignment.Center;
txtBlock.textStyle = Typeface.ITALIC;
txtBlock.needResize = false;
```

#### 6.3 Barcode Block - `BarcodeBlock`

**Location:** `cn.com.wewin.extapi.model.BarcodeBlock`

| Field                  | Description                              | Type                   | Default    | Unit |
| ---------------------- | ---------------------------------------- | ---------------------- | ---------- | ---- |
| `type`                 | Block type                               | `BlockType`            | `1`        |      |
| `x`                    | X coordinate                             | `float`                |            | `mm` |
| `y`                    | Y coordinate                             | `float`                |            | `mm` |
| `width`                | Barcode width                            | `float`                |            | `mm` |
| `height`               | Barcode height                           | `float`                |            | `mm` |
| `needResize`           | Force fixed size                         | `boolean`              | `false`    |      |
| `needReverseColor`     | Invert colors                            | `boolean`              | `false`    |      |
| `errorCorrectionLevel` | Error correction level                   | `ErrorCorrectionLevel` | `L`        |      |
| `barcodeFormat`        | Format: `CODE_39`, `CODE_93`, `CODE_128` | `BarcodeFormat`        | `CODE_128` |      |
| `content`              | Barcode content (1–100 chars)            | `String`               |            |      |
| `oritention`           | Orientation                              | `Oritention`           | `0`        |      |

**Example:**

```
BarcodeBlock barcodeBlock = new BarcodeBlock();
barcodeBlock.x = 2;
barcodeBlock.y = 3;
barcodeBlock.content = "1234567890";
barcodeBlock.width = 15;
barcodeBlock.height = 5;
barcodeBlock.needResize = true;
```

#### 6.4 QR Code Block - `QrcodeBlock`

**Location:** `cn.com.wewin.extapi.model.QrcodeBlock`

| Field                  | Description                                        | Type                   | Default   | Unit |
| ---------------------- | -------------------------------------------------- | ---------------------- | --------- | ---- |
| `type`                 | Block type                                         | `BlockType`            | `2`       |      |
| `x`                    | X coordinate                                       | `float`                |           | `mm` |
| `y`                    | Y coordinate                                       | `float`                |           | `mm` |
| `width`                | QR code width/height                               | `float`                |           | `mm` |
| `needResize`           | Force fixed size                                   | `boolean`              | `false`   |      |
| `needReverseColor`     | Invert colors                                      | `boolean`              | `false`   |      |
| `ifPreViewStatic`      | Static preview                                     | `boolean`              | `false`   |      |
| `errorCorrectionLevel` | Error correction level                             | `ErrorCorrectionLevel` | `L`       |      |
| `barcodeFormat`        | Format: `QR_CODE`, `DATA_MATRIX`                   | `BarcodeFormat`        | `QR_CODE` |      |
| `content`              | Content                                            | `String`               |           |      |
| `qrVersion`            | QR version (1–40; 0 = auto)                        | `int`                  | `0`       |      |
| `oritention`           | Orientation                                        | `Oritention`           | `0`       |      |
| `logoWidth`            | Logo width (ignored if logo is `Bitmap`)           | `float`                | `0`       | `mm` |
| `logoHeight`           | Logo height (ignored if logo is `Bitmap`)          | `float`                | `0`       | `mm` |
| `logo`                 | Logo (resource name, asset, drawable, or `Bitmap`) | `Object`               |           |      |
| `context`              | Context for loading logo                           | `Context`              |           |      |

**Example:**

```
QrcodeBlock qrcodeBlock = new QrcodeBlock();
qrcodeBlock.x =5;
qrcodeBlock.y = 8;
qrcodeBlock.content = "dghujbkaxnhgh";
qrcodeBlock.width = 10;
qrcodeBlock.needResize = true;
```

#### 6.5 Graphic Block - `GraphicBlock`

**Location:** `cn.com.wewin.extapi.model.GraphicBlock`

| Field        | Description                     | Type         | Default | Unit |
| ------------ | ------------------------------- | ------------ | ------- | ---- |
| `type`       | Block type                      | `BlockType`  | `3`     |      |
| `x`          | X coordinate                    | `float`      |         | `mm` |
| `y`          | Y coordinate                    | `float`      |         | `mm` |
| `width`      | Image width                     | `float`      |         | `mm` |
| `height`     | Image height                    | `float`      |         | `mm` |
| `context`    | Context for loading image       | `Context`    |         |      |
| `graphic`    | Image resource name or `Bitmap` | `Object`     |         |      |
| `oritention` | Orientation                     | `Oritention` | `0`     |      |

**Example:**

```
GraphicBlock graphicBlock = new GraphicBlock(context);
graphicBlock.x = 15;
graphicBlock.y = 8;
graphicBlock.width = 10;
graphicBlock.height = 10;
graphicBlock.graphic = "test.png";
```

#### 6.6 Line Block - `LineBlock`

**Location:** `cn.com.wewin.extapi.model.LineBlock`

| Field        | Description | Type         | Default | Unit |
| ------------ | ----------- | ------------ | ------- | ---- |
| `type`       | Block type  | `BlockType`  | `4`     |      |
| `x`          | Start X     | `float`      |         | `mm` |
| `y`          | Start Y     | `float`      |         | `mm` |
| `width`      | Width       | `float`      |         | `mm` |
| `height`     | Height      | `float`      |         | `mm` |
| `oritention` | Orientation | `Oritention` | `0`     |      |

**Example:**
```
LineBlock lineBlock = new LineBlock();
lineBlock.x = 5;
lineBlock.y = 5;
lineBlock.width = 10;
lineBlock.height = 0.5f;
```

#### 6.7 Rectangle Block - `RectBlock`

**Location:** `cn.com.wewin.extapi.model.RectBlock`

| Field        | Description    | Type         | Default | Unit |
| ------------ | -------------- | ------------ | ------- | ---- |
| `type`       | Block type     | `BlockType`  | `5`     |      |
| `x`          | X coordinate   | `float`      |         | `mm` |
| `y`          | Y coordinate   | `float`      |         | `mm` |
| `width`      | Width          | `float`      |         | `mm` |
| `height`     | Height         | `float`      |         | `mm` |
| `thinkness`  | Line thickness | `float`      | `1.f`   |      |
| `oritention` | Orientation    | `Oritention` | `0`     |      |

**Example:**

```
RectBlock rectBlock = new RectBlock();
rectBlock.x = 5;
rectBlock.y = 5;
rectBlock.thinkness = 0.5f;
rectBlock.width = 40;
rectBlock.height = 12;
```