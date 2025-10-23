//
//  WwXMLUtils.h
//  PrintExtApi
//
//  Created by Max on 2019/3/29.
//  Copyright © 2019 wewin. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol WwXMLUtilsDelegate

@optional
/**
 * 准备开始解析
 */
- (void)didStartDocument;
/**
 * 准备解析节点
 */
- (void)didStartElement:(NSString *_Nonnull)elementName namespaceURI:(NSString *_Nonnull)namespaceURI qualifiedName:(NSString *_Nonnull)qName attributes:(NSDictionary *_Nonnull)attributeDict;

/**
 * 获取首尾节点间内容
 */
- (void)foundCharacters:(NSString *_Nonnull)string;

/**
 * 解析完当前节点
 */
- (void)didEndElement:(NSString *_Nonnull)elementName namespaceURI:(NSString *_Nonnull)namespaceURI qualifiedName:(NSString *_Nonnull)qName;

/**
 * 解析结束
 */
- (void)DidEndDocument;



@end

NS_ASSUME_NONNULL_BEGIN

@interface WwXMLUtils : NSObject

@property (nonatomic,assign) id<WwXMLUtilsDelegate> deleaget;

- (void)SetXMLString:(NSString *)xmlString;

@end

NS_ASSUME_NONNULL_END
