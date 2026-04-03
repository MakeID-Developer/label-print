# 1. Overview

## 1.1 Introduction

To use this print service, you need to run the print service plugin software locally on your PC. The software works by running an `http` server on two ports: `18188 (http)` and `18189 (https)`. To invoke any functionality, send a `POST` request to `http://127.0.0.1:18188` or `https://127.0.0.1:18189` with JSON data in the specified format.

## 1.2 Software Download

+ [../JS/label-print-server_***](https://github.com/MakeID-Developer/label-print/tree/main/JS)

# 2. Feature Reference

## 2.1 Get Printer List

### 2.1.1 handleType

Set `handleType` to **`0`**:

```json
{"handleType": "0"}
```

### 2.1.2 Response

```json
{
    "version:": "2.0.9",            // Print service plugin version number
    "handleType": 0,                 // Request type 0: get printer list
    "status": 1,
    "errCode": "PRINTER_ERROR_SUCCESS", // Status code; SUCCESS means successful
    "ieset": "1",
    "content": [{                    // Array of printer objects
        "USBID": "P51X21KS0002",     // Unique printer ID
        "dots": 11.81,               // Printer resolution in dots per mm
        "hasDrive": 1,               // Whether the printer has a driver (1 = yes)
        "printer": "wewin P51X21KS0002" // Printer name / driver name
    }, {
        "dots": 7.99,
        "hasDrive": 1,
        "printer": "POSTEK wewin_268"
    }, {
        "USBID": "P51X21JS0023",
        "dots": 11.81,
        "hasDrive": 1,
        "printer": "wewin P51X21JS0023_1"
    }, {
        "dots": 7.99,
        "hasDrive": 0,
        "printer": "wewin P50"
    }]
}
```

---

## 2.2 Print

### 2.2.1 handleType

Set `handleType` to **`1`**.

### 2.2.2 Request Example

```json
{
    "handleType": "1",          // 0: get printer list  1: print  2: debug (return preview image)
    "printer": "wewin P51_300 0", // Name of the printer to use
    "hasDrive": "1",            // Whether the printer has a driver: 0 = driverless, 1 = with driver
    "labels": [
        {
            "labelWidth": "400",    // Label width
            "labelHeight": "160",   // Label height
            "oritention": 0,        // Label rotation: 0=0°  1=90°  2=180°  3=270°
            "rfid": "011ABCD1234",  // RFID data (omit if not printing RFID; see RFID section below)
            "blocks": [
                {
                    "type": "0",            // Block type: 0=Text  1=Barcode  2=QR Code  3=Image  4=Line
                    "x": "277",             // X coordinate
                    "y": "36",              // Y coordinate
                    "fontHeight": "7",      // Font size
                    "fontWeight": "500",    // Font weight
                    "fontName": "宋体",     // Font name (optional)
                    "content": "Enter content here...", // Text content
                    "oritention": "3",      // Rotation: 0=0°  1=90°  2=180°  3=270°
                    "fullWidth": "779.46",  // Text box width (if not set, renders horizontally from x/y)
                    "fullHeight": "59",     // Text box height
                    "horizontal": "0",      // 0=left  1=center  2=right (applies when fullWidth & fullHeight > 0)
                    "vertical": "0",        // 0=top   1=middle  2=bottom (applies when fullWidth & fullHeight > 0)
                    "reverseColor": false   // Reverse color: true=white text on black, false=black text on white
                },
                {
                    "type": "1",        // 1D barcode
                    "codeType": "0",
                    "x": "13",          // X coordinate
                    "y": "32",          // Y coordinate
                    "width": "100",     // Barcode width
                    "height": "44",     // Barcode height
                    "content": "123456789", // Barcode content
                    "oritention": "1"   // Rotation: 0=0°  1=90°  2=180°  3=270°
                },
                {
                    "type": "2",        // QR code
                    "x": "72",          // X coordinate
                    "y": "166",         // Y coordinate
                    "width": "110",     // QR code size (width = height)
                    "content": "123456789", // QR code content
                    "oritention": "1",  // Rotation: 0=0°  1=90°  2=180°  3=270°
                    "level": "-1",      // Error correction level
                    "logo": "",         // Path to center logo image (optional)
                    "logosize": "-1"    // Logo size (optional)
                },
                {
                    "type": "3",        // Image
                    "x": "69",          // X coordinate
                    "y": "28",          // Y coordinate
                    "width": "118",     // Image width
                    "height": "113",    // Image height
                    "path": "file:///E:/AssetsSDK/PC/wewin/labelimage/CM1.bmp", // Local path, URL, or base64
                    "oritention": "1"   // Rotation: 0=0°  1=90°  2=180°  3=270°
                },
                {
                    "type": "4",        // Line
                    "x": "186",         // Start X coordinate
                    "y": "44",          // Start Y coordinate
                    "thickness": "5",   // Line thickness
                    "ex": "186",        // End X coordinate
                    "ey": "265"         // End Y coordinate
                },
                {
                    "type": "5",        // Border / frame
                    "x": "186",         // X coordinate
                    "y": "44",          // Y coordinate
                    "thickness": "5",   // Line thickness
                    "width": "186.00750000000002", // Width
                    "height": "265.725",           // Height
                    "radius": "3"                  // Corner radius
                }
            ]
        }
    ]
}
```

### 2.2.3 Parameter Reference

| Parameter | Description |
| --- | --- |
| `handleType` | Request type<br/>0: Get printer list<br/>1: Print<br/>2: Print preview |
| `printer` | Name of the target printer (obtained from section 2.1) |
| `hasDrive` | Whether the printer uses a driver (obtained from section 2.1) |
| `copyNum` | Number of copies to print |
| `labels` | Array of label objects |

**`labels` parameters**

| Parameter | Description |
| --- | --- |
| `labelWidth` | Label width — use `dots × mm` (label width in millimeters) from section 2.1 |
| `labelHeight` | Label height — use `dots × mm` (label height in millimeters) from section 2.1 |
| `oritention` | Rotation: 0=0°  1=90°  2=180°  3=270° |
| `rfid` | RFID data to write (omit if not applicable; see RFID section for details) |
| `blocks` | Array of label element objects |

**`blocks` — Text element parameters**

| Parameter | Required | Description |
| --- | :---: | --- |
| `type` | Yes | `0` — text element type |
| `x` | Yes | X coordinate (integer preferred) |
| `y` | Yes | Y coordinate (integer preferred) |
| `fontHeight` | Yes | Font size |
| `fontWeight` | Yes | Font weight (default: 500) |
| `fontName` | No | Font name (supports Song/Hei typefaces); optional |
| `content` | Yes | Text content |
| `oritention` | Yes | Rotation: 0=0°  1=90°  2=180°  3=270° |
| `fullWidth` | No | Text box width; if not set, renders horizontally from x/y |
| `fullHeight` | No | Text box height |
| `horizontal` | No | 0=left  1=center  2=right (only applies when `fullWidth` and `fullHeight` are both > 0) |
| `vertical` | No | 0=top  1=middle  2=bottom (only applies when `fullWidth` and `fullHeight` are both > 0) |
| `reverseColor` | No | Reverse color: `true`=white text on black, `false`=black text on white |

**`blocks` — 1D Barcode parameters**

| Parameter | Required | Description |
| --- | :---: | --- |
| `type` | Yes | `1` — 1D barcode element type |
| `codeType` | No | Encoding format: 0=Code128 / 1=Code39 / 2=Code93 |
| `x` | Yes | X coordinate (integer preferred) |
| `y` | Yes | Y coordinate (integer preferred) |
| `width` | Yes | Element width (integer preferred) |
| `height` | Yes | Element height (integer preferred) |
| `content` | Yes | Barcode content |
| `oritention` | Yes | Rotation: 0=0°  1=90°  2=180°  3=270° |

**`blocks` — QR Code parameters**

| Parameter | Required | Description |
| --- | :---: | --- |
| `type` | Yes | `2` — QR code element type |
| `x` | Yes | X coordinate (integer preferred) |
| `y` | Yes | Y coordinate (integer preferred) |
| `width` | Yes | Element size (integer preferred; width equals height for QR codes) |
| `codeType` | Yes | Code type: 0=QRCODE / 1=PDF417 / 2=DATAMATRIX (default: 0) |
| `content` | Yes | QR code content |
| `level` | Yes | Error correction level: 0=7% / 1=15% / 2=25% / 3=30% |
| `logo` | No | Center logo image path (default: empty string) |
| `logosize` | No | Logo size |
| `oritention` | Yes | Rotation: 0=0°  1=90°  2=180°  3=270° |

**`blocks` — Image parameters**

| Parameter | Required | Description |
| --- | :---: | --- |
| `type` | Yes | `3` — image element type |
| `x` | Yes | X coordinate (integer preferred) |
| `y` | Yes | Y coordinate (integer preferred) |
| `width` | Yes | Element width (integer preferred) |
| `height` | Yes | Element height (integer preferred) |
| `path` | Yes | Image source: local file path, network URL, or base64 string |
| `oritention` | Yes | Rotation: 0=0°  1=90°  2=180°  3=270° |

**`blocks` — Line parameters**

| Parameter | Required | Description |
| --- | :---: | --- |
| `type` | Yes | `4` — line element type |
| `x` | Yes | Start X coordinate (integer preferred) |
| `y` | Yes | Start Y coordinate (integer preferred) |
| `ex` | Yes | End X coordinate |
| `ey` | Yes | End Y coordinate |
| `thickness` | Yes | Line thickness |

**`blocks` — Border/Frame parameters**

| Parameter | Required | Description |
| --- | :---: | --- |
| `type` | Yes | `5` — border/frame element type |
| `x` | Yes | X coordinate (integer preferred) |
| `y` | Yes | Y coordinate (integer preferred) |
| `width` | Yes | Element width (integer preferred) |
| `height` | Yes | Element height (integer preferred) |
| `thickness` | Yes | Line thickness |
| `radius` | Yes | Corner radius |

### 2.2.4 Response

```json
{
    "handleType": 1,
    "status": 1,
    "errCode": "PRINTER_ERROR_SUCCESS",
    "content": [{
        "printer": "",
        "dots": "",
        "hasDrive": 1
    }]
}
```

Only `errCode` needs to be checked. Refer to the error code reference table in Section 4.

---

## 2.3 Print Preview

### 2.3.1 handleType

Set `handleType` to **`2`**. All other request parameters are the same as in section 2.2.

### 2.3.2 Response

```json
{
    "handleType": 2,
    "status": 1,
    "errCode": "PRINTER_BASE64",
    "content": "data:image/png;base64,Qk3GYQY........."
}
```

| Parameter | Description |
| --- | --- |
| `handleType` | Request type |
| `status` | Response status |
| `errCode` | Status code — refer to the error code reference table |
| `content` | Base64-encoded preview image |


---

# 3. RFID Parameters

## 3.1 Print Data

The print data is a combination of letters and digits. For example: `ABCD1234`

## 3.2 Memory Bank

- `01` — EPC bank
- `03` — USER bank

## 3.3 Storage Format

**1: ASCII storage**

When `ABCD1234` is written, the stored bytes are: `0x41 0x42 0x43 0x44 0x31 0x32 0x33 0x34`

> Note: The number of data characters must be even. If it is odd, `0x00` is appended.

Reference table: [https://www.runoob.com/w3cnote/ascii.html](https://www.runoob.com/w3cnote/ascii.html)

**2: HEX storage**

When `ABCD1234` is written, the stored bytes are: `0xAB 0xCD 0x12 0x34`

> Note: Data must consist of valid hexadecimal characters only (0–9, A–F), and the number of characters must be a multiple of 4. Padding `0x00` is added if necessary.

## 3.4 Transmitted Data Format

For example, to print RFID data `ABCD1234`:

- Memory bank = EPC, storage format = **ASCII** → transmitted data: `011ABCD1234`
- Memory bank = EPC, storage format = **HEX** → transmitted data: `012ABCD1234`

Format breakdown: `[bank code][storage type][data]`


---

# 4. `errCode` Reference Table

| status | Result | Error Description | errCode |
| :--- | :--- | --- | --- |
| 0 | Debug success | | `PRINTER_BASE64` |
| 1 | Print success | | `PRINTER_ERROR_SUCCESS` |
| 2 | Print failed | Label does not exist | `PRINTER_ERROR_UNEXIST` |
| 3 | Print failed | No print data | `PRINTER_ERROR_NO_JSON` |
| 4 | Print failed | Print data error | `PRINTER_ERROR_JSON_WRONG` |
| 5 | Print failed | `hasDrive` field missing | `PRINTER_ERROR_HASDRIVE_LOST` |
| 6 | Print failed | `printer` field missing | `PRINTER_ERROR_PRINTER_LOST` |
| 7 | Print failed | `copyNum` field missing | `PRINTER_ERROR_COPYNUM_LOST` |
| 8 | Print failed | `handleType` field missing | `PRINTER_ERROR_HANDLETYPE_LOST` |
| 9 | Print failed | `copyNum` is empty/invalid | `PRINTER_ERROR_COPYNUM_INVAID` |
| 10 | Print failed | Failed to initialize printer | `PRINTER_ERROR_OPEN_PORT_FAIL` |
| 11 | Print failed | `labels` field missing | `PRINTER_ERROR_LABELS_LOST` |
| 12 | Print failed | Timed out waiting for print data | `PRINTER_ERROR_WAIT_FOR_JSON` |
| 13 | Print failed | `labels` array is empty | `PRINTER_ERROR_LABELS_IS_0` |
| 14 | Print failed | `labelWidth` field missing | `PRINTER_ERROR_labelWidth_LOST` |
| 15 | Print failed | `labelHeight` field missing | `PRINTER_ERROR_labelHeight_LOST` |
| 16 | Print failed | RFID initialization error | `PRINTER_ERROR_RFID` |
