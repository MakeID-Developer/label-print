//
//  CustomPrintViewController.m
//  WewinPrintExtApiDemo
//
//  Created by 凉皮 on 2025/10/22.
//  Copyright © 2025 wewin. All rights reserved.
//

#import "CustomPrintViewController.h"
#import <WewinPrintLib/WewinPrintLib.h>
#import "UIAlertController+Blocks.h"

@interface CustomPrintViewController ()
@property (weak, nonatomic) IBOutlet UILabel *statusLabel;
@property (weak, nonatomic) IBOutlet UIButton *printButton;
@property (weak, nonatomic) IBOutlet UILabel *printStateLabel;
@property (weak, nonatomic) IBOutlet UISegmentedControl *statusSwitch;

@end

@implementation CustomPrintViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    [[PrintDispatcher sharePrintDispatcher] addObserver:self forKeyPath:@"isConnected" options:NSKeyValueObservingOptionNew context:nil];
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        NSString *identifier = [[NSUserDefaults standardUserDefaults] valueForKey:@"ConnectedBluetoothIdentfier"];
        
        if (identifier) {
            
            [[WwBleConnect shareWwBleConnect] retrieveConnect:identifier];
        }
    });
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSKeyValueChangeKey,id> *)change context:(void *)context {
    
    if ([PrintDispatcher sharePrintDispatcher].isConnected) {
        
        self.statusLabel.text = [NSString stringWithFormat:@"Connected-%@", [PrintDispatcher sharePrintDispatcher].baseConnect.connectedName];
        
        self.printButton.enabled = YES;
        
    } else {
        
        self.statusLabel.text = @"Disconnected";
        self.printButton.enabled = NO;
    }
}

- (IBAction)clickDisconnectButtonAction:(UIButton *)sender {
    
    [[WwBleConnect shareWwBleConnect] dispose];
}

- (IBAction)clickPrintButtonAction:(UIButton *)sender {
    PrintDispatcher *dispatcher = [PrintDispatcher sharePrintDispatcher];
        
    self.statusSwitch.selectedSegmentIndex = 0;

    if (!dispatcher.isConnected) {
        
        self.printStateLabel.text = @"Printer not connected";
        
        return;
    }
    
    dispatcher.log = YES;

    [dispatcher checkPrinterStatus:^(PrintState state, NSDictionary * _Nonnull result) {

        if (state == PrintStateStatusNormal) {

            [self print];

        } else {

            self.printStateLabel.text = result[PrinterStatusKey];
        }
    }];
}

- (void)print {

    PrintDispatcher *dispatcher = [PrintDispatcher sharePrintDispatcher];

    dispatcher.log = YES;
    //Obtain the number of points per millimeter
    CGFloat dots = dispatcher.deviceInfo.hDeviceDpi / 25.4;

    UIImage *originImage = [UIImage imageNamed:@"品胜科技.png.png"];
        
    NSMutableArray *array = [[NSMutableArray alloc] initWithCapacity:0];
    
    PrintModel *printModel = [[PrintModel alloc] init];

    printModel.x = 0;
    printModel.y = 0;
    printModel.modelType = ModelTypeGraphic;
    printModel.image =  originImage;
    printModel.labelWidth = roundf(38 * dots); // 38 represents the width of the label, measured in millimeters
    printModel.labelHeight = roundf(60 * dots); //60 represents the height of the label, measured in millimeters

    [array addObject:@[printModel]];
    
    int copies = 5;
    
    PrintSettingModel *setting = dispatcher.defaultPrintSetting;
    
    setting.count               = copies; //Number of copies
    setting.cutOption           = CutOptionDefault;
//    setting.rfidStorageArea     = RFIDStorageAreaUSER;
//    setting.rfidStorageDataType = RFIDStorageDataTypeASCII;
    setting.gapType             = GapTypeDefault;
    setting.darkNess            = 12;
    
    dispatcher.log              = YES;
    
    self.printStateLabel.text = [NSString stringWithFormat:@"1/%d", copies];

    [dispatcher printLabelsWithArray:array callBack:^(PrintState state, NSDictionary * _Nonnull result) {
                
        if (state == PrintStateSuccess) {
            
            dispatch_async(dispatch_get_main_queue(), ^{

                self.printStateLabel.text = result[PrinterStatusKey];
            });
            
        } else if (state == PrintStatePieceSuccess) {
            
            int pieceNum = [result[PrintingPieceNumKey] intValue];
            int totalNum = [result[PrintingTotalNumKey] intValue];
            
            dispatch_async(dispatch_get_main_queue(), ^{
                self.printStateLabel.text = [NSString stringWithFormat:@"%d/%d", pieceNum, totalNum];
            });
            
        } else if (state == PrintStatePieceFinish) {
            
            
        } else if (state == PrintStatePause) {
            
            dispatch_async(dispatch_get_main_queue(), ^{
                self.printStateLabel.text = result[PrinterStatusKey];
                NSLog(@"AAA%@", result[PrinterStatusKey]);
            });
            
        } else if (state == PrintStateResume) {
            
            int pieceNum = [result[PrintingPieceNumKey] intValue];
            int totalNum = [result[PrintingTotalNumKey] intValue];
            
            dispatch_async(dispatch_get_main_queue(), ^{
                self.printStateLabel.text = [NSString stringWithFormat:@"%d/%d", pieceNum, totalNum];
            });
            
        } else if (state == PrintStateCancel) {
            
            dispatch_async(dispatch_get_main_queue(), ^{
                self.printStateLabel.text = result[PrinterStatusKey];
            });
            
        } else if (state == SendHandShakeSuccess) {
            
            
        } else if (state == PrintStateDataEvent) {
            
            dispatch_async(dispatch_get_main_queue(), ^{
                self.printStateLabel.text = result[PrinterStatusKey];
            });
            
        }  else {
            
            dispatch_async(dispatch_get_main_queue(), ^{
                
                self.printStateLabel.text = result[PrinterStatusKey];
                
                NSLog(@"BBB%@", result[PrinterStatusKey]);
            });
        }
    }];
}

- (IBAction)clickSegmentAction:(UISegmentedControl *)sender {
    switch (sender.selectedSegmentIndex) {
        case 1: {
            [[PrintDispatcher sharePrintDispatcher] changePrintTaskStatus:PrintTaskStatusPause];
        }
            break;
        case 2: {
            [[PrintDispatcher sharePrintDispatcher] changePrintTaskStatus:PrintTaskStatusResume];
        }
            break;
        case 3: {
            [[PrintDispatcher sharePrintDispatcher] changePrintTaskStatus:PrintTaskStatusCancel];
        }
            break;
        default:
            break;
    }
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
