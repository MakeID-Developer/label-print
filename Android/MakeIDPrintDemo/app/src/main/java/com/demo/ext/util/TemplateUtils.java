package com.demo.ext.util;

import android.content.Context;

import java.util.ArrayList;
import java.util.List;

import cn.com.wewin.extapi.model.BarcodeBlock;
import cn.com.wewin.extapi.model.Block;
import cn.com.wewin.extapi.model.GraphicBlock;
import cn.com.wewin.extapi.model.Label;
import cn.com.wewin.extapi.model.LineBlock;
import cn.com.wewin.extapi.model.QrcodeBlock;
import cn.com.wewin.extapi.model.RectBlock;
import cn.com.wewin.extapi.model.TextBlock;
import cn.com.wewin.extapi.universal.WwCommon;

public class TemplateUtils {
    /**
     * Create an array of Label objects and initialize the print content (all positions and sizes are in millimeters)
     * The demo 1 demonstrates the creation of all elements
     *
     * @return List<Label>
     */
    public static List<Label> initLabels1(Context context) {
        List<Label> labels = new ArrayList<>();

        Label label = new Label();
        label.labelWidth = 150;
        label.labelHeight = 100;
        label.oritention = WwCommon.Oritention.Oritention90;
        Block[] blocks = new Block[]{};
        // Text
        TextBlock textBlock = new TextBlock();
        textBlock.x = 5;
        textBlock.y = 5;
        textBlock.maxW = 140;
        textBlock.maxH = 30;
        textBlock.needResize = true;
        textBlock.fontSize = 15;
        textBlock.oritention = WwCommon.Oritention.Oritention0;
        textBlock.content = "MakeID is the product brand of Chongqing Pinsheng Technology Co., Ltd." +
                " Established in 2006, MakeID focuses on IoT intelligent technologies such as " +
                "labeling/sensing, and develops and manufactures label printers, " +
                "labeling and reading products.";
        blocks = insertElement(blocks, textBlock, blocks.length);
        // Text
        TextBlock txtBlock1 = new TextBlock();
        txtBlock1.x = 5;
        txtBlock1.y = 35;
        txtBlock1.content = "Official website address: www.makeid.com";
        txtBlock1.maxW = 140;
        txtBlock1.maxH = 10;
        txtBlock1.oritention = WwCommon.Oritention.Oritention0;
        txtBlock1.fontSize = 15;
        blocks = insertElement(blocks, txtBlock1, blocks.length);
        //Line
        LineBlock lineBlock = new LineBlock();
        lineBlock.x = 2;
        lineBlock.y = 45;
        lineBlock.width = 146;
        lineBlock.height = 0.5f;
        blocks = insertElement(blocks, lineBlock, blocks.length);
        //Qrcode
        QrcodeBlock qrcodeBlock = new QrcodeBlock();
        qrcodeBlock.x = 5;
        qrcodeBlock.y = 50;
        qrcodeBlock.width = 40;
        qrcodeBlock.needResize = true;
        qrcodeBlock.content = "www.makeid.com";
        blocks = insertElement(blocks, qrcodeBlock, blocks.length);
        //Barcode
        BarcodeBlock barcodeBlock = new BarcodeBlock();
        barcodeBlock.x = 50;
        barcodeBlock.y = 50;
        barcodeBlock.width = 90;
        barcodeBlock.height = 20;
        barcodeBlock.needResize = true;
        barcodeBlock.content = "1234567890";
        blocks = insertElement(blocks, barcodeBlock, blocks.length);
        //Graphic
        GraphicBlock graphicBlock = new GraphicBlock(context);
        graphicBlock.x = 50;
        graphicBlock.y = 72;
        graphicBlock.width = 90;
        graphicBlock.height = 20;
        graphicBlock.graphic = "makeid.png";
        graphicBlock.oritention = WwCommon.Oritention.Oritention0;
        blocks = insertElement(blocks, graphicBlock, blocks.length);
        //Rect
        RectBlock rectBlock = new RectBlock();
        rectBlock.x = 2;
        rectBlock.y = 2;
        rectBlock.thickness = 0.5f;
        rectBlock.width = 146;
        rectBlock.height = 96;
        rectBlock.radius = 5;
        blocks = insertElement(blocks, rectBlock, blocks.length);
        label.blocks = blocks;
        labels.add(label);
        return labels;
    }

    /**
     * The demo 2 illustrates the creation of common elements for cable labels
     */
    public static List<Label> initLabels2() {
        List<Label> labels = new ArrayList<>();
        Block[] blocks = new Block[]{};

        Label label = new Label();
        label.labelWidth = 38; //the label width(mm)
        label.labelHeight = 25; //the label height(mm)
        label.oritention = WwCommon.Oritention.Oritention90;
        label.previewGraphicName = "VQS-02F.png";
        // Text
        TextBlock txtBlock = new TextBlock();
        txtBlock.x = 2;
        txtBlock.y = 2;
        txtBlock.maxW = 24;
        txtBlock.maxH = 10;
        //When needResize is set to true, the font size will be adjusted adaptively according to the set maxW and maxH, ensuring it is displayed in full
        txtBlock.needResize = true;
        txtBlock.fontSize = 7;
        txtBlock.oritention = WwCommon.Oritention.Oritention0;
        txtBlock.content = "FR:Low-voltage box router-00001 \nTO:Room 101, 11th Floor";
        blocks = insertElement(blocks, txtBlock, blocks.length);
        // QrCode
        QrcodeBlock qrcodeBlock = new QrcodeBlock();
        qrcodeBlock.x = 27;
        qrcodeBlock.y = 2;
        qrcodeBlock.width = 9;
        qrcodeBlock.needResize = true;
        qrcodeBlock.content = "www.makeid.com";
        blocks = insertElement(blocks, qrcodeBlock, blocks.length);
        // Text
        TextBlock txtBlock2 = new TextBlock();
        txtBlock2.x = 12;
        txtBlock2.y = 13;
        txtBlock2.maxW = 24;
        txtBlock2.maxH = 10;
        //When needResize is set to true, the font size will be adjusted adaptively according to the set maxW and maxH, ensuring it is displayed in full
        txtBlock2.needResize = true;
        txtBlock2.fontSize = 8;
        txtBlock2.oritention = WwCommon.Oritention.Oritention0;
        txtBlock2.content = "FR:Low-voltage box router-00001 \nTO:Room 101, 11th Floor";
        blocks = insertElement(blocks, txtBlock2, blocks.length);
        // QrCode
        QrcodeBlock qrcodeBlock2 = new QrcodeBlock();
        qrcodeBlock2.x = 2;
        qrcodeBlock2.y = 14;
        qrcodeBlock2.width = 9;
        qrcodeBlock2.needResize = true;
        qrcodeBlock2.oritention = WwCommon.Oritention.Oritention180;
        qrcodeBlock2.content = "www.makeid.com";
        blocks = insertElement(blocks, qrcodeBlock2, blocks.length);
        label.blocks = blocks;
        labels.add(label);
        return labels;
    }

    public static Block[] insertElement(Block[] original, Block element,
                                        int index) {
        int length = original.length;
        Block[] destination = new Block[length + 1];
        System.arraycopy(original, 0, destination, 0, index);
        destination[index] = element;
        System.arraycopy(original, index, destination, index + 1, length
                - index);
        return destination;
    }


}
