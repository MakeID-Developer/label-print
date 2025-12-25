# 1. Prerequisites

## This printing SDK requires the print server software and printer driver to be installed and running before use.In fact, the printing js SDK will initiate an http request to the printing service software, pass the json data to be printed to the label print server software, and then the label print server software software will draw the corresponding template information, and then generate a print task and pass it to the system's printing service, without connecting to the printer for printing.

# 2. Import Instructions

## 1. JS Library References

```html
<script type="text/javascript" src="./labelimage/static/jquery-3.7.1.min.js"></script>
<script type="text/javascript" src="./labelimage/static/WewinPrintService.js"></script>
<script type="text/javascript" src="./code.js"></script>
```

## 2. Print Function

### 2.1 Method Name
**wewin.LabelPrint(Data, Object, PrintCallBack);**

### 2.2 Parameter Description

+ **Data (Print Data):**

| Parameter | Type | Description |
| :--- | :--- | --- |
| Data | Array/String | Array: Object array (JSON format)<br/>String: String (XML format) |

+ **Object (Print Configuration Parameters):**

| Parameter | Type | Default | Description |
| --- | :--- | --- | --- |
| noView | String | "" | Pass in the printer driver name to use |
| printNum | Number | 1 | Number of copies to print for each label, range 1-99 integer |
| imgPath | String | "./labelimage" | Set the relative path for preview and print logo images, i.e., the directory where images are located (relative to test.html in the test project) |
| debug | Boolean | false | Whether to enable debug mode<br/>+ true: Enable, after clicking print, preview the actual print effect without printing labels<br/>+ false: Disable, clicking print directly prints labels |

+ **PrintCallBack (Print Callback Function):**

| Parameter | Type | Description |
| :--- | :--- | --- |
| PrintCallBack(data) | Function | Print callback function<br/>data: Return value (Type: JSON object, detailed parameters below) |

+ **PrintCallBack Return Value data (Object) Parameter Description**

| Parameter | Type | Description |
| :--- | :--- | :--- |
| status | String | Status code |
| result | String | Print result |
| error | String | Error message |
| errCode | String | Error code |

+ **Return Data Reference Table**

| status (Status Code) | result (Print Result) | error (Error Message) | errCode (Error Code) |
| --- | --- | --- | --- |
| 0 | Debug successful |  | PRINTER_BASE64 |
| 1 | Print successful |  | PRINTER_ERROR_SUCCESS |
| 2 | Print failed | Label does not exist | PRINTER_ERROR_UNEXIST |
| 3 | Print failed | No print data | PRINTER_ERROR_NO_JSON |
| 4 | Print failed | Print data error | PRINTER_ERROR_JSON_WRONG |
| 5 | Print failed | Print data HASDRIVE missing | PRINTER_ERROR_HASDRIVE_LOST |
| 6 | Print failed | Print data PRINTER missing | PRINTER_ERROR_PRINTER_LOST |
| 7 | Print failed | Print data COPYNUM missing | PRINTER_ERROR_COPYNUM_LOST |
| 8 | Print failed | Print data HANDLETYPE missing | PRINTER_ERROR_HANDLETYPE_LOST |
| 9 | Print failed | Print data COPYNUM is empty | PRINTER_ERROR_COPYNUM_INVAID |
| 10 | Print failed | Failed to initialize printer, corresponding printer driver not found | PRINTER_ERROR_OPEN_PORT_FAIL |
| 11 | Print failed | Print data LABELS missing | PRINTER_ERROR_LABELS_LOST |
| 12 | Print failed | Waiting for print data timeout | PRINTER_ERROR_WAIT_FOR_JSON |
| 13 | Print failed | Print data LABELS is empty | PRINTER_ERROR_LABELS_IS_0 |
| 14 | Print failed | Print data labelWidth missing | PRINTER_ERROR_labelWidth_LOST |
| 15 | Print failed | Print data labelHeight missing | PRINTER_ERROR_labelHeight_LOST |
| 16 | Print failed | RFID initialization error | PRINTER_ERROR_RFID |
| 17 | Print queue full | Print queue full, please wait | PRINTER_ERROR_TASKFULL |

### 2.3 Example

```javascript
<input type="button" value="Label 1(123)" onclick="print123();" />

function print123() {
  // JSON method
  var json = [
    {"EntityTypeId":"123","Text":"Please enter content please enter content please enter content","Code":["123456789","123456789"]}
  ];
  // XML method
  var xml = "<?xml version=\"1.0\" encoding=\"utf-8\" ?><Data><Print><EntityTypeId>123</EntityTypeId><Text>Please enter content please enter content please enter content</Text><Code>123456789</Code><Code>123456789</Code></Print></Data>";
    
  // Call with JSON
  wewin.LabelPrint(json,{},function(data){
      // Print callback function
  });
  
  // Call with XML
  wewin.LabelPrint(xml,{},function(data){
      // Print callback function
  });  
}
```

# 3. Printing Principle

## 1. X-Y Coordinates

Based on the paper exit direction, the origin is located at **the upper left corner of the label, with the horizontal direction as the x-axis and the vertical direction as the y-axis**.

# 4. Directory File Structure Description

## 1. Directory Structure

Files:

+ /**test.html** file: Test web page file for calling print **(Run this file for print testing)**
+ /**code.js** file: All necessary adjustments are in this file **(Adjust label preview, label print styles, etc. For detailed function descriptions, see below)**
+ /labelimage/static/**jquery-3.7.1.min.js**: jQuery library
+ /labelimage/static/**WewinPrintService.js**: Required API library for printing

## 2. test.html File

Description:

①: Web page print button

②: Reference required JS libraries

③: Pass data to call print (XML or JSON)

## 3. code.js Function Description

Description:

①: Label print calling section

②: Specific printing section

# 5. Print API Description

## 1. Label Information - StartTag()

### 1.1 Parameter Description

| Parameter | Type | Description | Unit |
| --- | --- | --- | --- |
| labelWidth | number | Label width | mm |
| labelHeight | number | Label height | mm |
| rotate | wps.rotate (enum) | Rotation, clockwise from upper left corner<br/>wps.rotate.rotate0: Normal horizontal printing<br/>wps.rotate.rotate90: Left vertical printing<br/>wps.rotate.rotate180: Reverse horizontal printing<br/>wps.rotate.rotate270: Right vertical printing | |
| rfidType | wps.rfidType (enum) | RFID storage area (EPC:01, USER:03) |  |
| rfidWay | wps.rfidWay (enum) | RFID storage method (1 or 2)<br/>Single: Single character, character converted to ASCII code<br/>Double: Double character, written as hexadecimal string, but **characters can only include 0~9 A~F**<br/>Example (data is 0123):<br/>Single: Single character (0123 -> 0x30 0x31 0x32 0x33)<br/>Double: Double character (0123 -> 0x01 0x23) |  |
| rfidData | String | RFID content, for single character data length must be even, for double character data length must be a multiple of 4, if insufficient will be padded with 0 during printing |  |

### 1.2 Usage Example

```javascript
var label = new wps.Label();
label.labelWidth = 70;
label.labelHeight = 50;
label.rotate = wps.rotate.rotate90;
wps.StartTag(label);
```

## 2. Text Printing - PrintText()

### 2.1 Parameter Description

| Parameter | Type | Description | Unit |
| --- | --- | --- | --- |
| str | Array | Array of strings to be printed |  |
| fontHeight | Number | Font height | mm |
| printWidth | Number | Line wrap width | mm |
| fontWeight | Number | Font weight |  |
| x | Number | x coordinate | mm |
| y | Number | y coordinate | mm |
| rotate | wps.rotate (enum) | Rotation, clockwise from upper left corner<br/>wps.rotate.rotate0: Normal vertical printing (y increases)![]<br/><br/>wps.rotate.rotate90: Left horizontal printing (x decreases)![]<br/><br/>wps.rotate.rotate180: Reverse vertical printing (y decreases)![]<br/><br/>wps.rotate.rotate270: Right horizontal printing (x increases)![] |  |
| xoffset | Number | Text internal line spacing | mm |
| loffset | Number | Text external line spacing | mm |
| maxH | Number | Maximum height (for automatic text wrapping and automatic font reduction) | mm |
| horizontal | wps.horizontal (enum) | Alignment:<br/>wps.horizontal.left: Left align<br/>wps.horizontal.center: Center align<br/>wps.horizontal.right: Right align |  |
| vertical | wps.vertical (enum) | Alignment:<br/>wps.vertical.top: Top align<br/>wps.vertical.center: Center align<br/>wps.vertical.bottom: Bottom align |  |
| leftOffset (optional) | Object | Left whitespace below title |  |
| leftOffset.auto | boolean | Auto whitespace | false |
| leftOffset.offsetLen | Number | Manual whitespace, left whitespace distance |  |
| titleBold (optional) | boolean | Title bold | false |
| singleLine | boolean | Whether to display in single line | false |

### 2.2 Usage Example

```javascript
var textBlock = new wps.TextBlock();
textBlock.str = [Texts[0]];
textBlock.fontHeight = 4.00;
textBlock.fontWeight = 500;
textBlock.printWidth = 37.00;
textBlock.x = 2.50;
textBlock.y = 2;
textBlock.xoffset = 0.25;
textBlock.loffset = 0.13;
textBlock.rotate = wps.rotate.rotate0;
textBlock.maxH = 16;
textBlock.horizontal = wps.horizontal.left;
textBlock.vertical = wps.vertical.center;
// textBlock.leftOffset = {auto: true};
wps.PrintText(textBlock);
```

---

## 3. QR Code Printing - PrintQrcode()

### 3.1 Parameter Description

| Parameter | Type | Description | Unit |
| --- | :--- | :--- | --- |
| codeType | Number | Barcode type<br/>0 - QRCODE<br/>1 - PDF417<br/>2 - DATAMATRIX |  |
| str | String | QR code content to print |  |
| x | Number | x coordinate | mm |
| y | Number | y coordinate | mm |
| width | Number | QR code width | mm |
| height | Number | QR code height (optional) | mm |
| rotate | wps.rotate (enum) | Rotation, clockwise from upper left corner<br/>wps.rotate.rotate0: Normal vertical printing (y increases)<br/>wps.rotate.rotate90: Left horizontal printing (x decreases)<br/>wps.rotate.rotate180: Reverse vertical printing (y decreases)<br/>wps.rotate.rotate270: Right horizontal printing (x increases) |  |
| level (optional) | Number | Values 0, 1, 2, 3 correspond to QR code levels L M H Q |  |
| logo (optional) | String | Image address, can be omitted if no logo is needed |  |
| logosize (optional) | Number | Width of logo image, logo is square, can be omitted, will automatically calculate 7% of size | mm |

### 3.2 Usage Example

```javascript
var qrcodeBlock = new wps.QrcodeBlock();
qrcodeBlock.str = Codes[0];
qrcodeBlock.x = 45;
qrcodeBlock.y = 22;
qrcodeBlock.width = 21;
qrcodeBlock.rotate = wps.rotate.rotate0;
wps.PrintQrcode(qrcodeBlock);
```

---

## 4. Barcode Printing - PrintBarcode()

### 4.1 Parameter Description

| Parameter | Type | Description | Unit |
| :--- | :--- | :--- | :--- |
| codeType | Number | Barcode type<br/>0 - code128B<br/>1 - code39<br/>2 - code93<br/>Default: code128 |  |
| str | String | Barcode content to print |  |
| x | Number | x coordinate | mm |
| y | Number | y coordinate | mm |
| height | Number | Barcode height | mm |
| rotate | wps.rotate (enum) | Rotation, clockwise from upper left corner<br/>wps.rotate.rotate0: Normal vertical printing (y increases)<br/>wps.rotate.rotate90: Left horizontal printing (x decreases)<br/>wps.rotate.rotate180: Reverse vertical printing (y decreases)<br/>wps.rotate.rotate270: Right horizontal printing (x increases) |  |
| width | Number | Overall width of barcode | mm |

### 4.2 Usage Example

```javascript
var barcodeBlock = new wps.BarcodeBlock();
barcodeBlock.codeType = 5;
barcodeBlock.str = Codes[0];
barcodeBlock.x = 3;
barcodeBlock.y = 25;
barcodeBlock.width = 34;
barcodeBlock.height = 10;
barcodeBlock.rotate = wps.rotate.rotate0;
wps.PrintBarcode(barcodeBlock);
```

---

## 5. Line Printing - PrintLine()

### 5.1 Parameter Description

| Parameter | Type | Description | Unit |
| :--- | :--- | :--- | :--- |
| x | Number | Starting point x coordinate | mm |
| y | Number | Starting point y coordinate | mm |
| ex | Number | Ending point x coordinate | mm |
| ey | Number | Ending point y coordinate | mm |
| thickness | Number | Line thickness value |  |

### 5.2 Usage Example

```javascript
var lineBlock = new wps.LineBlock();
lineBlock.x = 2;
lineBlock.y = 20;
lineBlock.ex = 38;
lineBlock.ey = 20;
lineBlock.thickness = 5;
wps.PrintLine(lineBlock);
```

---

## 6. Image Printing - PrintLogo()

### 6.1 Parameter Description

| Parameter | Type | Description | Unit |
| :--- | :--- | :--- | :--- |
| path | String | Image absolute path |  |
| x | Number | x coordinate | mm |
| y | Number | y coordinate | mm |
| width | Number | Image width | mm |
| height | Number | Image height | mm |
| rotate | wps.rotate (enum) | Rotation, clockwise from upper left corner<br/>wps.rotate.rotate0: Normal vertical printing (y increases)<br/>wps.rotate.rotate90: Left horizontal printing (x decreases)<br/>wps.rotate.rotate180: Reverse vertical printing (y decreases)<br/>wps.rotate.rotate270: Right horizontal printing (x increases) |  |

### 6.2 Usage Example

```javascript
var graphicBlock = new wps.GraphicBlock();
graphicBlock.path = "http://www.wewin.com.cn/downloads/graphic_list/chinaMobile/chinaMobile_0.png";
graphicBlock.x = 45;
graphicBlock.y = 5;
graphicBlock.width = 15;
graphicBlock.height = 5;
graphicBlock.rotate = wps.rotate.rotate0;
wps.PrintLogo(graphicBlock);
```

> Image printing requires the project to be hosted on a server to work

---

## 7. Rectangle Printing - PrintRect()

### 7.1 Parameter Description

| Parameter | Type | Description | Unit |
| --- | :--- | --- | --- |
| x | Number | x coordinate | mm |
| y | Number | y coordinate | mm |
| width | Number | Width | mm |
| height | Number | Height | mm |
| thickness | Number | Line thickness value |  |
| radius | Number | Corner radius (when width=height and radius≥width/2, it becomes a circle) | mm |

### 7.2 Usage Example

```javascript
var rectBlock = new wps.RectBlock();
rectBlock.x = 42.5;
rectBlock.y = 20;
rectBlock.width = 25;
rectBlock.height = 25;
rectBlock.thickness = 4;
rectBlock.radius = 25;
wps.PrintRect(rectBlock);
```

## 8. Complete Single Template Drawing Example

```javascript
Please refer to the demo source code
```

## 9.Connect us
If you encounter any problems, please contact us via this email: soft_developer@makeid.com
