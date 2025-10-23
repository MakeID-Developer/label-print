
# Preface
**Please read the precautions before importing**

# Precautions
1. When creating a project, you need to add `WewinPrintLib.framework` and `WewinPrintExtApi.framework` files

2. Import the header file where you need to use printing and create templates: `#import <WewinPrintExtApi/WewinPrintExtApi.h>`

3. Add `WewinPrintLib.framework`, `WewinPrintExtApi.framework`, and `libxml2.tbd` references to `Linked Frameworks and Libraries`, as shown below:
<img width="814" height="155" alt="image" src="https://github.com/user-attachments/assets/8832ac95-77de-45e9-9794-c645a61c9a6a" />

4. **For dynamic library integration**, perform the operations as shown in the figure: `Project->General->Change to Embed&Sign`

<img width="609" height="183" alt="image" src="https://github.com/user-attachments/assets/ddd6be5e-6279-4a7b-a25c-dbe30b7d5149" />

5. If you need to use Bluetooth printing and want to continuously send data in the background, you can set `Background Modes` in `Capabilities`

<img width="1062" height="268" alt="image" src="https://github.com/user-attachments/assets/ee651814-b512-4050-8de0-87136386188f" />

8. **For iOS13 and later**, the following permissions are required. Please add the following permission declarations in `info.plist`
9. 
<img width="625" height="127" alt="image" src="https://github.com/user-attachments/assets/b7f58420-4c5b-4784-b546-237122ad1f94" />

Right-click on `info.plist` and select `open as -> Source Code`, then add the following code:

```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>Bluetooth is needed to connect to the printer for printing</string>
<key>NSBluetoothPeripheralUsageDescription</key>
<string>Bluetooth is needed to connect to the printer for printing</string>
<key>NSCameraUsageDescription</key>
<string>Camera is needed to scan QR codes</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Location service is needed</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>WiFi location is needed</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Photo library access is needed</string>
```

# III. Print Control Operations Class - `WwPrintUtils`

## 1. Basic Operations
1. Initialize: `[WwPrintUtils getInstance];`
2. Description: Asset management printing utility class initialization

## 2. Member Variables
| Member | Description | Type | Default Value |
| --- | --- | --- | --- |
| `ifAutoReConnect` | Whether to enable auto-reconnection on disconnect | BOOL | NO |
| `ifAutoHint` | Whether to use error prompt UI | BOOL | YES |
| `ifAutoHUD` | Whether to use HUD | BOOL | YES |
| `previewFollowPaperDirection` | Whether preview image follows paper output direction | BOOL | YES |
| `iPrintPieceLabelCallback` | Callback when single sheet printing succeeds. Will receive result callback after each sheet is printed | IPrintPieceLabelCallback | nil |
| `ifDebug` | Whether to enable debug mode. In debug mode, preview images will have background colors for each module to distinguish areas, no effect on printing | BOOL | NO |
| `ifShowPrintCountEdit` | Whether to enable copy count mode in preview, default NO | BOOL | NO |
| `popMessage` | Label XML | NSString | @"" |
| `searchType` | Connection types to display on device search page, multiple types e.g. searchType = WwSearchTypeBLE \| WwSearchTypeLAN; | WwSearchType | WwSearchTypeBLE |
| `defaultSearchType` | Default search type, must set searchType first. When searchType has multiple values, sets the initial default search page | WwSearchType | WwSearchTypeBLE |
| `themeColor` | Theme color for buttons and fonts on preview and search pages | UIColor | 0x1606FC |

## 3. Print Control
### (1) Print without Preview - `asyncPrint`
#### 5.3.1.1. Parameter Description
| Property | Description | Type |
| --- | --- | --- |
| `array` | Label array (array of Label objects) | NSArray |
| `iPrintLabelCallback` | Callback interface object | IPrintLabelCallback |

#### 5.3.1.2. Usage Example

```objectivec
WwPrintUtils *printUtils = [WwPrintUtils getInstance];
[printUtils asyncPrint:[TemplateUtils initLabels:nil] IPrintLabelCallback:^(WwPrintResult result) {
    NSLog(@"Async print result: %d", (int)result);
}];
```

### (2) Preview Print - `previewPrint`
#### 5.3.2.1. Parameter Description

| Property | Description | Type |
| --- | --- | --- |
| `array` | Label array (array of Label objects) | `NSArray` |
| `iPrintLabelCallback` | Callback interface object | `IPrintLabelCallback` |

#### 5.3.2.2. Usage Example

```objectivec
[[WwPrintUtils getInstance] previewPrint:[TemplateUtils initLabels] IPrintLabelCallback:^(WwPrintResult result) {
    NSLog(@"Preview print result: %d", (int)result);
}];
```

### (3) Single Printer Darkness Setting (P50, P30, P1200, H50) - `singleSetDarkness`
#### 5.3.3.1. Parameter Description

| Property | Description | Type |
| --- | --- | --- |
| `darkness` | Darkness value | `int` |
| `iPrintSetCallback` | Callback interface object | `IPrintSetCallback` |

#### 5.3.3.2. Usage Example

```objectivec
[[WwPrintUtils getInstance] singleSetDarkness:10 IPrintSetCallback:^(WwSetResult result) {
    NSLog(@"Darkness setting result: %d", (int)result);
}];
```

### (4) P50 Single Cutter Setting - `singleSetCutOption`
#### 5.3.4.1. Parameter Description
| Member | Description | Type |
| --- | --- | --- |
| `cutOption` | Cutter enumeration | `CutOption` |
| `iPrintSetCallback` | Callback interface object | `IPrintSetCallback` |

#### 5.3.4.2. Usage Example

```objectivec
[[WwPrintUtils getInstance] singleSetCutOption:CutOptionCut IPrintSetCallback:^(WwSetResult result) {
    NSLog(@"Cutter setting result: %d", (int)result);
}];
```

### (6) Get Print Utility Class, Singleton - `getInstance`
#### 5.3.6.1. Parameter Description
`void`

#### 5.3.6.2. Return Type
`WwPrintUtils` singleton reference object

### (7) Get Bluetooth Device List - `searchDevice`
#### 5.3.7.1. Parameter Description
| Member | Description | Type |
| --- | --- | --- |
| `bleCallBack` | Bluetooth operation callback<br/>Return parameter 1: state - search status<br/>Return parameter 2: result - NSArray Bluetooth list | IPrintBleCallBack |

#### 5.3.7.2. Usage Example

```objectivec
[[WwPrintUtils getInstance] searchDevice:^(BaseState state, id result) {
    if (state == BaseSearchStateSuccess) {//Search successful
        if (result) {
            //Get Bluetooth devices
            NSArray *bleArray = (NSArray *)result;
        }
    }
}];
```

### (8) Connect Bluetooth Device - `connectDevice`
#### 5.3.8.1. Parameter Description
| Member | Description | Type |
| --- | --- | --- |
| `deviceName` | Bluetooth device name returned from Bluetooth list | NSString |
| `bleCallBack` | Bluetooth operation callback<br/>Return parameter 1: state - connection status<br/>Return parameter 2: result - nil | IPrintBleCallBack |

#### 5.3.8.2. Usage Example

```objectivec
[[WwPrintUtils getInstance] connectDevice:deviceName CallBack:^(BaseState state, id result) {
    if (state == BaseConnectStateSuccess) {
        //Connection successful
    } else {
        //Connection failed
    }
}];
```

### (9) Get SDK Version - `getVersion`
#### 5.3.9.1. Parameter Description
| Member | Description | Type |
| --- | --- | --- |
| Return String | Version number | NSString |

#### 5.3.9.2. Usage Example

```objectivec
NSLog(@"Current version: %@", [WwPrintUtils getInstance].getVersion);
```

# IV. `WwLabel` Object and `WWBlock` Object Introduction
## 1. Label Object - `WwLabel`
### 6.1.1. Parameter Description

| Member | Description | Type | Default Value | Unit |
| --- | --- | --- | --- | --- |
| `labelWidth` | Label width | float |  | mm |
| `labelHeight` | Label height | float |  | mm |
| `previewGraphicName` | Template image name, can be used for preview, can be placed in assets or mainBundle | NSString |  |  |
| `isBackground` | Whether to print background image directly | BOOL | NO |  |
| `rfid` | RFID content | NSString |  |  |
| `rfidStorageType` | RFID storage area (default EPC) | RFIDStorageType | RFIDStorageTypeUIIOrESP |  |
| `rfidCharStorageType` | RFID storage method (default single character) | RfidCharStorageType | RfidCharStorageTypeSingle |  |
| `ddfLength` | >=0: DDF | float | -1.f |  |
| `labelType` (Updated) | WwLabelTypeDefault = 0, //Default printer setting<br/>WwLabelTypeBlackMark = 1, //Gap - Black mark<br/>WwLabelTypeTranslucent = 2, //Gap - Translucent (most are translucent)<br/>WwLabelTypeDDF = 3, //Gapless DDF<br/>WwLabelTypeTransparent = 4, //Gap - Transparent, currently only supports I70 | WwLabelType | WwLabelTypeDefault |  |
| `cutOption` | CutOptionTear: Move to tear position after printing<br/>CutOptionCut: Move to cut position after printing<br/>CutOptionContinuousCutting: Continuous auto-cutting<br/>CutOptionCutAfterTheEnd: Cut after current task ends<br/>CutOptionContinuousManualCutting: Continuous manual cutting | CutOption | CutOptionTear |  |
| `oritention` | Rotation direction<br/>wwOritention0:0, wwOritention90:90, wwOritention180:180, wwOritention270:270 | WwOritention | wwOritention0 |  |
| `blocks` | Content block array | Block[] |  |  |
| `textNeedFontBlocks` | Array of textBlocks that need equal font sizes<br/>Do not pass if not needed | NSArray<TextBlock*> | nil |  |
| `labelInfo` | Label title displayed in preview, optional. Will be displayed during preview if set | NSString | @"" |  |
| `extInfo` | Additional information | NSDictionary | nil |  |
| `detectionTypeKey` | P30, P31 label detection only (pass in label type, will match label during printing) | NSString | @"" |  |

### 6.1.2. Usage Example

```objectivec
NSMutableArray *labels = [NSMutableArray array];
    
//Example of creating three labels
for(int i=0; i<1; i++){
    // Initialize single label
    WwLabel *label = [[WwLabel alloc] init];
    label.labelWidth = 45;
    label.labelHeight = 30;
        
    // Text
    WwTextBlock *txtBlock = [[WwTextBlock alloc] init];
    txtBlock.x = 0;
    txtBlock.y = 0;
    txtBlock.content = @"This is a text block";
    txtBlock.maxW = 45;
    txtBlock.maxH = 30;
    txtBlock.lineOffset = 2.1;
    txtBlock.fontSize = 4.2;
        
    // QR Code
    WwQrcodeBlock *qrcodeBlock = [[WwQrcodeBlock alloc]init];
    qrcodeBlock.x = 1;
    qrcodeBlock.y = 2;
    qrcodeBlock.content = @"www.makeid.com";
    qrcodeBlock.width = 17;
        
    // Barcode
    WwBarcodeBlock *barcodeBlock = [[WwBarcodeBlock alloc] init];
    barcodeBlock.x = 0;
    barcodeBlock.y = 1;
    barcodeBlock.content = @"1234567890";
    barcodeBlock.width = 30;
    barcodeBlock.height = 10;
       
    // Image
    WwGraphicBlock *graphicBlock = [[WwGraphicBlock alloc] init];
    graphicBlock.x = 0;
    graphicBlock.y = 0;
    graphicBlock.width = 45;
    graphicBlock.height = 30;
    graphicBlock.graphic = @"(30-45)";
    graphicBlock.oritention = wwOritention90;
        
    // Line
    WwLineBlock *lineBlock = [[WwLineBlock alloc] init];
    lineBlock.x = 0;
    lineBlock.y = 0;
    lineBlock.width = 20;
    lineBlock.height = 1;
    lineBlock.oritention = wwOritention0;
        
    // Rectangle
    WwRectBlock *rectBlock = [[WwRectBlock alloc] init];
    rectBlock.x = 10;
    rectBlock.y = 27.5;
    rectBlock.thinkness = 1;
    rectBlock.width = 30;
    rectBlock.height = 15;
        
    // Add to label
    NSArray *blocks = @[qrcodeBlock];
    label.blocks = blocks;
        
    [labels addObject:label];
}
```

## 2. `WwBlock` Object
### (1) Base - `WwBlock`
#### 6.2.1.1. Parameter Description
| Member | Description | Type | Default Value | Unit |
| --- | --- | --- | --- | --- |
| `type` | Block type (0:text, 1:barcode, 2:QR code, 3:image, 4:line, 5:rectangle) | `BlockType` | 0 |  |
| `x` | X coordinate | `float` |  | `mm` |
| `y` | Y coordinate | `float` |  | `mm` |
| `oritention` | Rotation direction (0:0, 1:90, 2:180, 3:270) | `Oritention` | 0 |  |

### (2) Text Object - `WwTextBlock`
#### 6.2.2.1. Parameter Description
| Member | Description | Type | Default Value | Unit |
| --- | --- | --- | --- | --- |
| `type` | Block type | WwBlockType | wwText(0) |  |
| `x` | X coordinate | float |  | mm |
| `y` | Y coordinate | float |  | mm |
| `fontSize` | Maximum font size | float | 3 | mm |
| `textStyle` | Font style | WwTextStyle | wwTextStyleNormal |  |
| `fontName` | Font name (can pass custom font name) | String | Heiti (Black) |  |
| `maxW` | Maximum print width | float |  | mm |
| `maxH` | Maximum print height | float |  | mm |
| `lineOffset` | Line spacing | float | 0 | mm |
| `content` | Print content | String |  |  |
| `horizontalAlignment` | Horizontal alignment (Left:left, Right:right, Center:center) | WwHorizontalAlignment | Left |  |
| `verticalAlignment` | Vertical alignment (Top:top, Center:center, Bottom:bottom) | WwVerticalAlignment | Top |  |
| `needResize` | Whether auto-resize is needed | boolean | true |  |
| `oritention` | Rotation direction (0:0, 1:90, 2:180, 3:270) | Oritention | 0 |  |
| `ifAutoLine` | Whether to auto wrap (Default Yes, when set to NO, will limit lines based on lineNum property) | boolean | true |  |
| `lineNum` | Used with ifAutoLine, only effective when ifAutoLine is NO, default is 1, value must be >0 | int | 1 | lines |
| `textFormat` | Used to set text paragraph format | WwTextFormat | wwTextFormatNormal |  |
| `shrinkIdentify` | Content to identify for paragraph indentation, default is ":", can be unset when indent count is known | String | : |  |
| `shrinkWordNum` | When paragraph format is wwTextFormatShrink, the number of characters to indent, default -1, can be unset, will auto-find first Chinese ":" in wwTextFormatShrink case | int | -1 | characters |
| `ifShrinkBold` | Whether to bold the preceding content after auto-shrink. Default NO | BOOL | NO |  |

#### 6.2.2.2. Usage Example

```objectivec
// Text
WwTextBlock *txtBlock = [[WwTextBlock alloc] init];
txtBlock.x = 0;
txtBlock.y = 0;
txtBlock.content = @"Asset management special text content";
txtBlock.maxW = 45;
txtBlock.maxH = 30;
txtBlock.lineOffset = 2.1;
txtBlock.fontSize = 4.2;
```

### (3) Barcode Object - `WwBarcodeBlock`
#### 6.2.3.1. Parameter Description
| Member | Description | Type | Default Value | Unit |
| --- | --- | --- | --- | --- |
| `type` | Block type | BlockType | wwBarcode(1) |  |
| `x` | X coordinate | float |  | mm |
| `y` | Y coordinate | float |  | mm |
| `width` | Barcode width | float |  | mm |
| `height` | Barcode height | float |  | mm |
| `content` | Barcode content (string with length 1-100) | String |  |  |
| `oritention` | Rotation direction (0:0, 1:90, 2:180, 3:270) | Oritention | 0 |  |
| `needReverseColor` | Whether to reverse colors | Bool | NO |  |
| `needResize` | Whether to force fixed size | Bool | NO |  |

#### 6.2.3.2. Usage Example

```objectivec
// Barcode
WwBarcodeBlock *barcodeBlock = [[WwBarcodeBlock alloc] init];
barcodeBlock.x = 0;
barcodeBlock.y = 1;
barcodeBlock.content = @"1234567890ssss";
barcodeBlock.width = 30;
barcodeBlock.height = 10;
```

### (4) QR Code Object - `WwQrcodeBlock`
#### 6.2.4.1. Parameter Description
| Member | Description | Type | Default Value | Unit |
| --- | --- | --- | --- | --- |
| `type` | Block type | `WwBlockType` | `wwQrcode(2)` |  |
| `x` | X coordinate | `float` |  | `mm` |
| `y` | Y coordinate | `float` |  | `mm` |
| `width` | QR code width/height | `float` |  | `mm` |
| `errorCorrectionLevel` | Error correction level | `WwQrCodeCorrectionLevel` | `wwQrCodeCorrectionLevelL` |  |
| `content` | QR code content | `String` |  |  |
| `oritention` | Rotation direction (0:0, 1:90, 2:180, 3:270) | `Oritention` | 0 |  |
| `needReverseColor` | Whether to reverse colors | `Bool` | `NO` |  |
| `needResize` | Whether to force fixed size | `Bool` | `NO` |  |
| `logo` | Whether to add logo on QR code. Logo can be UIImage or image name<br/>Size can be unset, logo size will be 0.07 of actual QR code size | `id` | `nil` |  |
| `logoSize` | Manually set QR code logo size, generally default to 0,0, can be unset, calculated by SDK | `CGSize` | `0,0` |  |
| `ifPreViewStatic` | Whether to enable static QR code preview (default NO) | `Bool` | `NO` |  |

#### 6.2.4.2. Usage Example

```objectivec
// QR Code
WwQrcodeBlock *qrcodeBlock = [[WwQrcodeBlock alloc]init];
qrcodeBlock.x = 1;
qrcodeBlock.y = 2;
qrcodeBlock.content = @"www.makeid.com";
qrcodeBlock.width = 17;
```

### (5) Image Object - `WwGraphicBlock`
#### 6.2.5.1. Parameter Description
| Member | Description | Type | Default Value | Unit |
| --- | --- | --- | --- | --- |
| `type` | Block type | `WwBlockType` | `wwGraphic(3)` |  |
| `x` | X coordinate | `float` |  | `mm` |
| `y` | Y coordinate | `float` |  | `mm` |
| `width` | Image width | `float` |  | `mm` |
| `height` | Image height | `float` |  | `mm` |
| `context` | Context handle for reading image resources | `Context` |  |  |
| `graphic` | Image name, can be placed in assets or mainBundle, or custom UIImage object | `Object` |  |  |
| `oritention` | Rotation direction (0:0, 1:90, 2:180, 3:270) | `Oritention` | 0 |  |

#### 6.2.5.2. Usage Example

```objectivec
// Image
WwGraphicBlock *graphicBlock = [[WwGraphicBlock alloc] init];
graphicBlock.x = 0;
graphicBlock.y = 0;
graphicBlock.width = 45;
graphicBlock.height = 30;
graphicBlock.graphic = @"(30-45)";
```

### (6) Line Object - `WwLineBlock`
#### 6.2.6.1. Parameter Description
| Member | Description | Type | Default Value | Unit |
| --- | --- | --- | --- | --- |
| `type` | Block type | `WwBlockType` | `wwLine(4)` |  |
| `x` | Line start X coordinate | `float` |  | `mm` |
| `y` | Line start Y coordinate | `float` |  | `mm` |
| `width` | Width | `float` |  | `mm` |
| `height` | Height | `float` |  | `mm` |
| `oritention` | Rotation direction (0:0, 1:90, 2:180, 3:270) | `Oritention` | 0 |  |

#### 6.2.6.2. Usage Example

```objectivec
// Line
WwLineBlock *lineBlock = [[WwLineBlock alloc] init];
lineBlock.x = 0;
lineBlock.y = 0;
lineBlock.width = 20;
lineBlock.height = 1;
```

### (7) Rectangle Object - `WwRectBlock`
#### 6.2.7.1. Parameter Description
| Member | Description | Type | Default Value | Unit |
| --- | --- | --- | --- | --- |
| `type` | Block type | `WwBlockType` | `wwRect(5)` |  |
| `x` | X coordinate | `float` |  | `mm` |
| `y` | Y coordinate | `float` |  | `mm` |
| `width` | Width | `float` |  | `mm` |
| `height` | Height | `float` |  | `mm` |
| `thinkness` | Line thickness | `float` | `1.f` | `mm` |
| `oritention` | Rotation direction (0:0, 1:90, 2:180, 3:270) | `Oritention` | 0 |  |

# V. Constants Class - `WwCommon`
### 1. Printer Setting Result Types - `WwSetResult`
#### 7.1.1. Parameter Description
| Member | Description | Type | Value |
| --- | --- | --- | --- |
| `wwDarknessSetSuccess` | Darkness setting successful | `enum` | 0 |
| `wwDarknessSetfailed` | Darkness setting failed | `enum` | 1 |
| `wwCutOptionSetSuccess` | Cutter setting successful | `enum` | 2 |
| `wwCutOptionSetfailed` | Cutter setting failed | `enum` | 3 |

### 2. Printer Result Types Enumeration - `WwPrintResult`
#### 7.2.1. Parameter Description
| Member | Description | Type | Value |
| --- | --- | --- | --- |
| `wwUnknowError` | Unknown error | `enum` | -1 |
| `wwConnectError` | Connection operation error | `enum` | -3 |
| `wwConnectDeviceError` | Connect device error | `enum` | -4 |
| `wwCreateLabelError` | Create label error | `enum` | -5 |
| `wwPrintError` | Print error | `enum` | -6 |
| `wwPrintingError` | Printer occupied (or printing) | `enum` | -7 |
| `wwPreviewError` | Preview error | `enum` | -8 |
| `wwLabelTypeError` | Label type error | `enum` | -9 |
| `wwPrintCancel` | Print cancelled | `enum` | -10 |
| `wwPrintSuccess` | Print successful | `enum` | 0 |

### 3. Printer Connection Type - `ConnectModel`
#### 7.3.1. Parameter Description
| Member | Description | Type |
| --- | --- | --- |
| `ConnectModelWiFi` | `WIFI` | `enum` |
| `ConnectModelBle` | Bluetooth BLE | `enum` |
| `ConnectModelLAN` | LAN | `enum` |

### 4. Block Type - `WwBlockType`
#### 7.4.1. Parameter Description
| Member | Description | Type | Value |
| --- | --- | --- | --- |
| `wwText` | Text | `enum` | 0 |
| `wwBarcode` | Barcode | `enum` | 1 |
| `wwQrcode` | QR Code | `enum` | 2 |
| `wwGraphic` | Image | `enum` | 3 |
| `wwLine` | Line | `enum` | 4 |
| `wwRect` | Rectangle | `enum` | 5 |

### 5. Print Object Block Rotation Type - `WwOritention`
#### 7.5.1. Parameter Description
| Member | Description | Type | Value |
| --- | --- | --- | --- |
| `wwOritention0` | 0 degrees | `enum` | 0 |
| `wwOritention90` | 90 degrees | `enum` | 90 |
| `wwOritention180` | 180 degrees | `enum` | 180 |
| `wwOritention270` | 270 degrees | `enum` | 270 |

### 6. Cutter Enumeration - `CutOption`
#### 7.6.1. Parameter Description
| Member | Description | Type | Value |
| --- | --- | --- | --- |
| `CutOptionTear` | Move to tear position after printing ends | `enum` | 0 |
| `CutOptionCut` | Move to cut position after printing ends | `enum` | 1 |
| `CutOptionContinuousCutting` | Continuous automatic cutting | `enum` | 2 |
| `CutOptionCutAfterTheEnd` | Cut after current task ends | `enum` | 3 |
| `CutOptionContinuousManualCutting` | Continuous manual cutting | `enum` | 4 |

### 7. Text `Alignment`

#### 7.7.1. Horizontal Position - `WwHorizontalAlignment`
| Member | Description | Type |
| --- | --- | --- |
| `wwHorizontalLeft` | Horizontal left | `enum` |
| `wwHorizontalRight` | Horizontal right | `enum` |
| `wwHorizontalCenter` | Horizontal center | `enum` |

#### 7.7.2. Vertical Position - `WwVerticalAlignment`
| Member | Description | Type |
| --- | --- | --- |
| `wwVerticalTop` | Vertical top | `enum` |
| `wwVerticalBottom` | Vertical bottom | `enum` |
| `wwVerticalCenter` | Vertical center | `enum` |

### 8. Label Type Enumeration - `WwLabelType`

#### 7.8.1. Parameter Description
| Member | Description | Type |
| --- | --- | --- |
| `wwDefaultLabel` | Keep default | `enum` |
| `wwSpaceLabel` | Gap label | `enum` |
| `wwDdfLabel` | Gapless label | `enum` |
| `wwBlackMarkLabel` | Black mark label | `enum` |

---
