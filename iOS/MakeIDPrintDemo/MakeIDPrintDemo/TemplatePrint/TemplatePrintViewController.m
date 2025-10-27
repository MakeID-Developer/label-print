//
//  ViewController.m
//  PrintExtApiDemo
//
//  Created by wewin on 2019/2/18.
//  Copyright © 2025 MakeID. All rights reserved.
//

#import "TemplatePrintViewController.h"
#import <WewinPrintExtApi/WewinPrintExtApi.h>
#import "TemplateUtils.h"

@interface TemplatePrintViewController ()

@end

@implementation TemplatePrintViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [WwPrintUtils getInstance].languageType = WWLanguageEnglish;
}

//Print whit no preview
- (IBAction)noPreviewPrint1:(UIButton *)sender {
    
    WwPrintUtils *printUtils = [WwPrintUtils getInstance];
    
    [printUtils asyncPrint:[TemplateUtils initLabel_1] IPrintLabelCallback:^(WwPrintResult result) {
        NSLog(@"Print callback：%d", (int)result);
    }];
}

//Print with preview
- (IBAction)previewPrint1:(UIButton *)sender {
    
    WwPrintUtils *printUtils = [WwPrintUtils getInstance];
    
    [printUtils previewPrint:[TemplateUtils initLabel_1] IPrintLabelCallback:^(WwPrintResult result) {
        NSLog(@"Print callback：%d", (int)result);
    }];
}

- (IBAction)previewPrint2:(UIButton *)sender {
    
    WwPrintUtils *printUtils = [WwPrintUtils getInstance];
    
    [printUtils previewPrint:[TemplateUtils initLabel_2] IPrintLabelCallback:^(WwPrintResult result) {
        NSLog(@"Print callback：%d", (int)result);
    }];
}

- (IBAction)noPreviewPrint2:(UIButton *)sender {
    
    WwPrintUtils *printUtils = [WwPrintUtils getInstance];
    
    [printUtils asyncPrint:[TemplateUtils initLabel_2] IPrintLabelCallback:^(WwPrintResult result) {
        NSLog(@"Print callback：%d", (int)result);
    }];
}

- (IBAction)closeConnection:(UIButton *)sender {
    
    [[WwPrintUtils getInstance] closeConnection];
}

@end
