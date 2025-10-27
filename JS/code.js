var wps = typeof require !== 'undefined' ? require("./labelimage/static/WewinPrintService")() : WewinPrintService();
window.wewin = wps;
wps.fontname = "黑体";

wps.PageDoLabelPrint = function () {

    // Start calling the label printing function
    wps.StartPrintTag(function (i) {

        // Parse data
        // Type
        var labelType = wps.ParseElement(i, "LabelType");

        // Label 1 (1001)
        if (labelType[0] == '1001') {
            // Text node
            var introduction = wps.ParseElement(i, "Introduction");

            var web = wps.ParseElement(i, "Website");
            // Qrcode node
            var qrcodes = wps.ParseElement(i, "Qrcode");
            // Barcode node
            var barcodes = wps.ParseElement(i, "Barcode");

            wps.SetPrintFunc(i, print_tag1001, [introduction, web, qrcodes, barcodes]);

        } else if (labelType[0] == '1002') {

            var fr = wps.ParseElement(i, "Fr");

            var to = wps.ParseElement(i, "To");

            var qrcodes = wps.ParseElement(i, "Qrcode");

            wps.SetPrintFunc(i, print_tag1002, [fr, to, qrcodes]);
        }
    });
};

// Label 1 (1001)
function print_tag1001(introduction, web, qrcodes, barcodes) {

    var label = new wps.Label();
    label.labelWidth = 150; //Label width (mm)
    label.labelHeight = 100; //Label height (mm)
    label.rotate = wps.rotate.rotate0; // Rotate label, set to 90 degrees if this model is designed for vertical output

    wps.StartTag(label);

        // Draw lines, line drawing for printing differs from preview and only has one type

         //Rect
        var rectBlock = new wps.RectBlock();
        rectBlock.x = 2;
        rectBlock.y = 2;
        rectBlock.thickness = 2;
        rectBlock.width = 146;
        rectBlock.height = 96;
        rectBlock.radius = 5;
        wps.PrintRect(rectBlock);

         //Line
        var lineBlock = new wps.LineBlock();
        lineBlock.x = 2;
        lineBlock.y = 45;
        lineBlock.ex = 148;
        lineBlock.ey = 45;
        lineBlock.thickness = 2;
        wps.PrintLine(lineBlock);

        //Text
        var textBlock = new wps.TextBlock();
        textBlock.str = [introduction[0]];
        textBlock.fontHeight = 20;//font size
        textBlock.fontWeight = 500;
        textBlock.x = 5;
        textBlock.y = 5;
        textBlock.printWidth = 140.00;
        textBlock.xoffset = 0.25;
        textBlock.loffset = 0.13;
        textBlock.rotate = wps.rotate.rotate0;
        textBlock.maxH = 26;
        textBlock.horizontal = wps.horizontal.left;
        textBlock.vertical = wps.vertical.top;
        textBlock.reverseColor = false;

        wps.PrintText(textBlock);

        var textBlock1 = new wps.TextBlock();
        textBlock1.str = [web[0]];
        textBlock1.fontHeight = 15;//font size
        textBlock1.fontWeight = 500;
        textBlock1.x = 3;
        textBlock1.y = 32;
        textBlock1.printWidth = 140.00;
        textBlock1.xoffset = 0.25;
        textBlock1.loffset = 0.13;
        textBlock1.rotate = wps.rotate.rotate0;
        textBlock1.maxH = 8;
        textBlock1.horizontal = wps.horizontal.left;
        textBlock1.vertical = wps.vertical.center;
        // textBlock1.reverseColor = true;
        wps.PrintText(textBlock1);
        
        // Add Qrcode
        var qrcodeBlock = new wps.QrcodeBlock();
        qrcodeBlock.str = qrcodes[0];
        qrcodeBlock.x = 5;
        qrcodeBlock.y = 50;
        qrcodeBlock.width = 40;
        qrcodeBlock.rotate = wps.rotate.rotate0;
        wps.PrintQrcode(qrcodeBlock);


        //Add barcode
        var barcodeBlock = new wps.BarcodeBlock();
        barcodeBlock.str = barcodes[0];
        barcodeBlock.x = 50;
        barcodeBlock.y = 50;
        barcodeBlock.width = 90;
        barcodeBlock.height = 20;
        barcodeBlock.rotate = wps.rotate.rotate0;
        wps.PrintBarcode(barcodeBlock);

        // Add logo image
        var graphicBlock = new wps.GraphicBlock();
        graphicBlock.path = "http://127.0.0.1:5500/labelimage/MakeID.png";//Image address
        graphicBlock.x = 50;
        graphicBlock.y = 72;
        graphicBlock.width = 90;
        graphicBlock.height = 20;
        graphicBlock.rotate = wps.rotate.rotate0;
        wps.PrintLogo(graphicBlock);

    wps.EndTag();
}

function print_tag1002(fr, to, qrcodes) {

    var label = new wps.Label();
    label.labelWidth = 38; //Label width (mm)
    label.labelHeight = 25; //Label height (mm)
    label.rotate = wps.rotate.rotate90; // Rotate label, set to 90 degrees if this model is designed for vertical output

    wps.StartTag(label);

    var textBlock1 = new wps.TextBlock();
    textBlock1.str = [fr[0], to[0]];
    textBlock1.fontHeight = 7;//font size
    textBlock1.fontWeight = 500;
    textBlock1.x = 1;
    textBlock1.y = 2;
    textBlock1.printWidth = 26;
    textBlock1.xoffset = 0.25;
    textBlock1.loffset = 0.13;
    textBlock1.rotate = wps.rotate.rotate0;
    textBlock1.maxH = 10;
    textBlock1.horizontal = wps.horizontal.left;
    textBlock1.vertical = wps.vertical.top;
    // textBlock1.reverseColor = true;
    wps.PrintText(textBlock1);

    // Add Qrcode
    var qrcodeBlock1 = new wps.QrcodeBlock();
    qrcodeBlock1.str = qrcodes[0];
    qrcodeBlock1.x = 27;
    qrcodeBlock1.y = 2;
    qrcodeBlock1.width = 9;
    qrcodeBlock1.rotate = wps.rotate.rotate0;
    wps.PrintQrcode(qrcodeBlock1);

    var textBlock2 = new wps.TextBlock();
    textBlock2.str = [fr[0], to[0]];
    textBlock2.fontHeight = 7;
    textBlock2.fontWeight = 500;
    textBlock2.x = 11;
    textBlock2.y = 14;
    textBlock2.printWidth = 26;
    textBlock2.xoffset = 0.25;
    textBlock2.loffset = 0.13;
    textBlock2.rotate = wps.rotate.rotate180;
    textBlock2.maxH = 10;
    textBlock2.horizontal = wps.horizontal.left;
    textBlock2.vertical = wps.vertical.top;

    wps.PrintText(textBlock2);

    var qrcodeBlock2 = new wps.QrcodeBlock();
    qrcodeBlock2.str = qrcodes[0];
    qrcodeBlock2.x = 1;
    qrcodeBlock2.y = 15;
    qrcodeBlock2.width = 9;
    qrcodeBlock2.rotate = wps.rotate.rotate180;
    wps.PrintQrcode(qrcodeBlock2);

    wps.EndTag();
}