//
//  TemplateUtils.m
//  PrintExtApiDemo
//
//  Copyright © 2025 MakeID. All rights reserved.
//

#import "TemplateUtils.h"
#import <WewinPrintExtApi/WewinPrintExtApi.h>

@implementation TemplateUtils

/**
 * Create an array of Label objects and initialize the print content (all positions and sizes are in millimeters)
 * The demo 1 demonstrates the creation of all elements
 * @return NSArray
 */
+ (NSArray *)initLabel_1 {
    
    NSMutableArray *labels = [NSMutableArray array];
        
    //If multiple labels need to be printed at once
    for (int i = 0; i < 1; i ++) {

        WwLabel *label = [[WwLabel alloc] init];
        label.labelWidth = 150; //the label width(mm)
        label.labelHeight = 100; //the label height(mm)
        label.oritention = wwOritention90;
        //label.previewGraphicName = @"test.png"; //If you need to display the background image of a tag in the preview
                
        // Text
        WwTextBlock *txtBlock = [[WwTextBlock alloc] init];

        txtBlock.x = 5;
        txtBlock.y = 5;
        txtBlock.maxW = 140;
        txtBlock.maxH = 30;
        txtBlock.needResize = YES;//When needResize is set to YES, the font size will be adjusted adaptively according to the set maxW and maxH, ensuring it is displayed in full
        txtBlock.fontSize = 15;
        txtBlock.oritention = wwOritention0;
        txtBlock.content = @"MakeID is the product brand of Chongqing Pinsheng Technology Co., Ltd. Established in 2006, MakeID focuses on IoT intelligent technologies such as labeling/sensing, and develops and manufactures label printers, labeling and reading products.";
        

        WwTextBlock *txtBlock1 = [[WwTextBlock alloc] init];
        txtBlock1.x = 5;
        txtBlock1.y = 35;
        txtBlock1.content = @"Official website address: www.makeid.com";
        txtBlock1.maxW = 140;
        txtBlock1.maxH = 10;
        txtBlock1.oritention = wwOritention0;
        txtBlock1.fontSize = 15;
        
        //Line
        WwLineBlock *lineBlock = [[WwLineBlock alloc] init];
        lineBlock.x = 2;
        lineBlock.y = 45;
        lineBlock.width = 146;
        lineBlock.height = 0.5;

        //Qrcode
        WwQrcodeBlock *qrcodeBlock = [[WwQrcodeBlock alloc] init];
        qrcodeBlock.x = 5;
        qrcodeBlock.y = 50;
        qrcodeBlock.width = 40;
        qrcodeBlock.needResize = YES;
        qrcodeBlock.content = @"www.makeid.com";
        
        //Barcode
        WwBarcodeBlock *barcodeBlock = [[WwBarcodeBlock alloc] init];
        barcodeBlock.x = 50;
        barcodeBlock.y = 50;
        barcodeBlock.width = 90;
        barcodeBlock.height = 20;
        barcodeBlock.needResize = YES;
        barcodeBlock.content = @"1234567890";

        //Graphic
        WwGraphicBlock *graphicBlock = [[WwGraphicBlock alloc] init];
        graphicBlock.x = 50;
        graphicBlock.y = 72;
        graphicBlock.width = 90;
        graphicBlock.height = 20;
        graphicBlock.graphic = @"makeid.png";
        graphicBlock.oritention = wwOritention0;

        //Rect
        WwRectBlock *rectBlock = [[WwRectBlock alloc] init];
        rectBlock.x = 2;
        rectBlock.y = 2;
        rectBlock.thinkness = 0.5;
        rectBlock.width = 146;
        rectBlock.height = 96;
        rectBlock.radius = 5;
        
        // 追加到lable里面
        NSArray *blocks = @[txtBlock, txtBlock1, lineBlock, qrcodeBlock, barcodeBlock, graphicBlock, rectBlock];
        
        label.blocks = blocks;
        
        [labels addObject:label];
    }
    
    return labels;
}

/**
 * The demo 2 illustrates the creation of common elements for cable labels
 */
+ (NSArray *)initLabel_2 {
    
    NSMutableArray *labels = [[NSMutableArray alloc] init];
    
    WwLabel *label = [[WwLabel alloc] init];
    label.labelWidth = 38; //the label width(mm)
    label.labelHeight = 25; //the label height(mm)
    label.oritention = wwOritention90;
    label.previewGraphicName = @"VQS-02F.png";
    
    // Text
    WwTextBlock *txtBlock = [[WwTextBlock alloc] init];

    txtBlock.x = 2;
    txtBlock.y = 2;
    txtBlock.maxW = 24;
    txtBlock.maxH = 10;
    txtBlock.needResize = YES;//When needResize is set to YES, the font size will be adjusted adaptively according to the set maxW and maxH, ensuring it is displayed in full
    txtBlock.fontSize = 7;
    txtBlock.oritention = wwOritention0;
    txtBlock.content = @"FR:Low-voltage box router-00001 \nTO:Room 101, 11th Floor";
    
    WwQrcodeBlock *qrcodeBlock = [[WwQrcodeBlock alloc] init];
    qrcodeBlock.x = 27;
    qrcodeBlock.y = 2;
    qrcodeBlock.width = 9;
    qrcodeBlock.needResize = YES;
    qrcodeBlock.content = @"www.makeid.com";
    
    
    WwTextBlock *txtBlock2 = [[WwTextBlock alloc] init];

    txtBlock2.x = 12;
    txtBlock2.y = 13;
    txtBlock2.maxW = 24;
    txtBlock2.maxH = 10;
    txtBlock2.needResize = YES;//When needResize is set to YES, the font size will be adjusted adaptively according to the set maxW and maxH, ensuring it is displayed in full
    txtBlock2.fontSize = 8;
    txtBlock2.oritention = wwOritention180;
    txtBlock2.content = @"FR:Low-voltage box router-00001 \nTO:Room 101, 11th Floor";
    
    WwQrcodeBlock *qrcodeBlock2 = [[WwQrcodeBlock alloc] init];
    qrcodeBlock2.x = 2;
    qrcodeBlock2.y = 14;
    qrcodeBlock2.width = 9;
    qrcodeBlock2.needResize = YES;
    qrcodeBlock2.oritention = wwOritention180;
    qrcodeBlock2.content = @"www.makeid.com";
    
    NSArray *blocks = @[txtBlock, qrcodeBlock, txtBlock2, qrcodeBlock2];
    
    label.blocks = blocks;
    
    [labels addObject:label];
    
    return labels;
}

@end
