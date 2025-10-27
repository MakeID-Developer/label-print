

(function (global, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();
    }
    global.WewinPrintService = factory();
}(window, function () {

    var WewinPrintService = function () {

        function WewinPrintService() {
            this.initParams();
        }

        WewinPrintService.prototype = {
            /**
             * 初始化原始参数
             */
            initParams: function () {
                this.printername = ""; //打印机名称
                this.Isp30 = -1;
                this.fontname = "黑体"; //打印默认字体
                this.data = []; //打印数据
                this.dots = 0; //打印机分辨率点数
                this.measureDiv = null; //测量字符长度div
                this.measureCanvas = null; //测量字符长度canvas
                this.DEFAULT_VERSION = 8.0; //动态二维码生成方式IE版本判断
                this.xmlWrong = 0; //打印数据是否符合规范参数
                this.minPrintNum = 1; //每张打印份数最小值
                this.maxPrintNum = 99; //每张打印份数最大值
                this.checkAll = false; //是否全选标签
                this.tagTemp = 0; //动态二维码生成等待标签生成参数
                this.noTag = true; //无该类型的标签模板
                this.temp = ""; //预览方式判断
                this.startIndex = 0; //预览循环起始坐标
                this.dataLen = 0; //预览循环标签个数
                this.scaleRatio = 1; //预览标签缩小比例
                this.pluginDownloadPath = "https://makeid.com/support"
                this.xmlDataTagName = "Print"; //打印数据XML单张总节点名称
                this.printTempData = []; //调试模式打印数据缓存
                this.sdkVersion = "v2.0.9";
                this.handleType = 1;

                //用户配置参数
                this.imgPath = "./labelimage"; //预览及打印图片路径
                this.debug = false; //调试模式
                this.qrcode = "table"; //动态二维码生成方式参数
                this.modal = false; //IE模态框预览方式参数
                this.printNum = -1; //每张打印份数参数
                this.previewNum = 5; //单次预览的张数
                this.tagUnit = "mm"; //全局标签长度单位
                this.checkboxAll = false; //默认全选
                this.isToCDATA = false; //是否转cdata格式
                this.alert = false; //是否弹窗
                this.CDATA_Arr = ["Text", "Code"];

                //打印相关参数
                this.labelsArr = []; //打印数据json数组
                this.resultArr = []; //打印元素json数据
                this.labelWidth = 0; //全局标签宽度
                this.labelHeight = 0; //全局标签高度
                this.previewHtml = ""; //全局预览标签内容
                this.rfid = ""; //全局rfid

                //提示内容
                this.noViewTip = "没有找到对应打印机"; //无预览监测打印机型号提示
                this.noServiceTip = "请安装插件或启动服务"; //监测插件情况提示
                this.printNumTip = "每张打印份数请输入" + this.minPrintNum + "-" + this.maxPrintNum + "的整数数字"; //每张打印份数提示

                //函数
                this.PageViewPrint = null;
                this.PageDoLabelPrint = null;
                this.PrintCallBack = null;

                //旋转方向枚举(顺时针旋转)
                this.rotate = {
                    rotate0: 0,
                    rotate90: 1,
                    rotate180: 2,
                    rotate270: 3
                }

                //横向对齐枚举(0：靠左打印；1：居中打印；2：靠右打印)
                this.horizontal = {
                    left: 0,
                    center: 1,
                    right: 2
                }

                //竖向对齐枚举(0：靠上打印；1：居中打印；2：靠下打印)
                this.vertical = {
                    top: 0,
                    center: 1,
                    bottom: 2
                }

                this.rfidType = {
                    EPC: "EPC",
                    USER: "USER"
                }

                this.rfidWay = {
                    Single: "1",
                    Double: "2"
                }
            },
            /**
             * 初始化点击事件
             */
            initClickEvent: function () {
                $(".view").click(function () {
                    $(this).remove();
                });
                $(".view .main").click(function () {
                    window.event.stopPropagation();
                });
            }
        }

        /**
         * Label对象
         */
        WewinPrintService.prototype.Label = function () {
            this.labelWidth = 0; //标签宽度
            this.labelHeight = 0; //标签高度
            this.rotate = 0;  //标签旋转角度\
            this.rfidData = "";
            this.rfidType = "EPC"; //
            this.rfidWay = "2";
        }

        /**
         * 文本模块
         */
        WewinPrintService.prototype.TextBlock = function () {
            this.type = 0;  //block类型
            this.str = [];  //字符串数组
            this.x = 0;  //x坐标
            this.y = 0; //y坐标
            this.fontWeight = 500;
            this.fontHeight = 0; //字体大小
            this.printWidth = 0; //打印宽度
            this.rotate = 0;  //旋转角度
            this.xoffset = 0; //单个Text内部换行间距
            this.loffset = 0; //每个Text节点之间间距
            this.maxH = 0;  //打印高度
            this.horizontal = 0; //水平居中方式
            this.vertical = 0; //垂直居中方式
            this.leftOffset = "no";  //标题对齐{auto:true}
        }

        /**
         * 二维码模块
         */
        WewinPrintService.prototype.QrcodeBlock = function () {
            this.type = 2;  //block类型
            this.str = "";  //二维码内容
            this.x = 0;  //x坐标
            this.y = 0;  //y坐标
            this.width = 0;  //二维码大小
            this.rotate = 0;  //旋转角度
            this.level = 4;  //二维码等级
            this.logo = "";  //二维码logo路径
            this.logosize = 0;  //二维码logo大小
        }

        /**
         * 条形码模块
         */
        WewinPrintService.prototype.BarcodeBlock = function () {
            this.type = 1;  //block类型
            this.codeType = 5;
            this.str = "";  //条码内容
            this.x = 0;  //x坐标
            this.y = 0;  //y坐标
            this.width = 0;  //条码宽度
            this.height = 0;  //条码高度
            this.rotate = 0;  //旋转角度
        }

        /**
         * 线条模块
         */
        WewinPrintService.prototype.LineBlock = function () {
            this.type = 4;  //block类型
            this.x = 0;  //线条起始x坐标
            this.y = 0;  //线条起始y坐标
            this.ex = 0;  //线条终点ex坐标
            this.ey = 0;  //线条终点ex坐标
            this.thickness = 0;  //线条粗细
        }

        /**
        * 线框模块
        */
        WewinPrintService.prototype.RectBlock = function () {
            this.type = 5;  //block类型
            this.x = 0;  //x坐标
            this.y = 0;  //y坐标
            this.width = 0;  //宽度
            this.height = 0;  //高度
            this.thickness = 0;  //线条粗细
            this.radius = 0; //圆角半径
            this.rotate = 0;
        }

        /**
         * 图片模块
         */
        WewinPrintService.prototype.GraphicBlock = function () {
            this.type = 3;  //block类型
            this.path = "";  //图片路径
            this.x = 0;  //x坐标
            this.y = 0;  //y坐标
            this.width = 0;  //图片宽度
            this.height = 0;  //图片高度
            this.rotate = 0;  //旋转角度
        }

        /**
         * 测量字符串长度
         * @param {String} str 需要测量的字符串(单字符或字符串)
         * @param {Number} size 字体大小
         * @returns {Number} 返回字符串像素长度
         */
        WewinPrintService.prototype.getLen = function (str, size) {
            var webType = this.isIE();
            var length = 0;
            var texts = [];
            if (str.length != 1) {
                texts = str.split("");
            } else {
                texts[0] = str;
            }
            if (webType) {
                //IE浏览器
                var dom = this.measureDiv;
                for (var i = 0; i < texts.length; i++) {
                    if (this.isChinese(texts[i]) || this.isBig(texts[i])) {
                        length += size;
                    } else if (this.isWordOrNum(texts[i]) || this.isSmall(texts[i])) {
                        length += size / 2;
                    } else if (texts[i].indexOf(" ") > -1) {
                        length += size / 2;
                    } else {
                        dom.style.fontSize = size + "px";
                        dom.innerHTML = texts[i];
                        if (dom.clientWidth == 0) {
                            length += dom.scrollWidth;
                        } else {
                            length += dom.clientWidth;
                        }
                    }
                }
                return length;
            } else {
                //非IE浏览器
                for (var i = 0; i < texts.length; i++) {
                    if (this.isChinese(texts[i]) || this.isBig(texts[i])) {
                        length += size;
                    } else if (this.isWordOrNum(texts[i]) || this.isSmall(texts[i])) {
                        length += size / 2;
                    } else {
                        this.measureCanvas.font = size + "px " + this.fontname;
                        length += this.measureCanvas.measureText(texts[i]).width;
                    }
                }
                return length;
            }
        }

        /**
         * 预览窗口加载
         */
        WewinPrintService.prototype.Load = function () {
            var css = this.CreateCss();
            this.AddCss(css);
            this.CreateView();
            var _this = this;
            this.getPrinterList(function(data) {

                _this.AddPrinter(data);

            }, function(error) {

                if (_this.alert) {
                    alert(_this.noServiceTip);
                }
            });

            var isIE = navigator.userAgent.toLowerCase().indexOf("msie");
            if (isIE > -1) {
                var css = "";
                css += "    .wewinmain {";
                css += "        height: 600px;";
                css += "        margin-left: -375px;";
                css += "        margin-top: -300px;";
                css += "        overflow-y: auto;";
                css += "        border: 1px solid #000;";
                css += "        transform:none;";
                css += "        animation:none;";
                css += "        border-radius:0px;";
                css += "    }";
                css += "    .wewin-debug {";
                css += "        height: 600px;";
                css += "        margin-left: -300px;";
                css += "        margin-top: -300px;";
                css += "        overflow-y: auto;";
                css += "        border: 1px solid #000;";
                css += "        transform:none;";
                css += "        animation:none;";
                css += "        border-radius:0px;";
                css += "    }";
                css += "    .wewindown {";
                css += "        position: relative;";
                css += "        left: 0;";
                css += "    }";
                css += "    .wewinview {";
                css += "        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#7fdddddd, endColorstr=#7fdddddd);";
                css += "    }";
                css += "    .wewinview2 {";
                css += "        position: fixed;";
                css += "        top: 0;";
                css += "        right: 0;";
                css += "        left: 0;";
                css += "        bottom: 0;";
                css += "        background-color:#000000;";
                css += "        opacity:0.4;";
                css += "        filter:alpha(opacity=50);";
                css += "        z-index: 1000;";
                css += "    }";
                css += "    .wewinmain .wewin-cha,.wewin-debug .wewin-cha{";
                css += "        right: 25px;";
                css += "    }";
                this.AddCss(css);
                var newHeight = $(window).height() * 0.9;
                $(".wewinmain").css({ "height": newHeight, "margin-top": -newHeight / 2 });
            }
        }

        WewinPrintService.prototype.isWindows = function () {
            var version = navigator.userAgent;
            console.log(version)
            if (version.toLowerCase().indexOf("windows") > -1) {
                return true;
            } else {
                return false;
            }
        }
        /**
         * 设置预览相关信息
         * @param {String} title 预览页面标题
         * @param {String} version 版本号
         */
        WewinPrintService.prototype.SetViewInfo = function (obj) {
            //预览页面标题(修改为：重庆品胜 - 新疆移动 - 打印预览)
            document.getElementById("btitle").innerHTML = obj.title;
            //修改版本号
            document.getElementById("versionnum").innerHTML = obj.version;
        }

        /**
         * 设置打印相关信息
         * @param {String} printers 支持的打印机型号
         */
        WewinPrintService.prototype.SetPrintInfo = function (printers) {
            //支持的打印机型号
            if (typeof printers == "string") {
                document.getElementById("printtype").innerHTML = printers;
            } else if (typeof printers == "object") {
                document.getElementById("printtype").innerHTML = printers.join(" ");
            }
            //打印张数
            // $("#printtype2").html("打印张数: <span style='font-weight:bold;color:red'>1张</span>");
            //当前模板
            var labelname = document.getElementById("labelname");
            var index = labelname.selectedIndex; // 选中索引
            var content = labelname.options[index].text; // 选中文本
            document.getElementById("printtype3").innerHTML = "当前模板: <span style='font-weight:bold;color:red'>" + content + "</span>";

            //每张打印份数
            if (this.printNum != -1 && document.getElementById('printNum') != null) {
                document.getElementById('printNum').value = this.printNum;
            }
        }

        /**
         * 创建预览css
         */
        WewinPrintService.prototype.CreateCss = function () {
            var css = "";
            css += ".wewinview,.wewin-debug-mask {";
            css += "    position: fixed;";
            css += "    top: 0;";
            css += "    right: 0;";
            css += "    left: 0;";
            css += "    bottom: 0;";
            css += "    background: rgba(0, 0, 0, 0.3);";
            css += "    z-index: 1000;";
            css += "}";
            css += ".wewinmain,.wewin-debug {";
            css += "    position: absolute;";
            css += "    opacity: 1;";
            css += "    top: 50%;";
            css += "    left: 50%;";
            css += "    -webkit-transform: translate(-50%, -50%) scale(1);";
            css += "    transform: translate(-50%, -50%) scale(1);";
            css += "    background: #fff;";
            css += "    width: 1200px;";
            css += "    height: 95%;";
            css += "    -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);";
            css += "    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);";
            css += "    -webkit-animation: into 0.2s forwards;";
            css += "    animation: into 0.2s forwards;";
            css += "    z-index: 1200;";
            css += "    border-radius: 10px;";
            // css += "    padding: 7px 0px 7px 0px;";
            css += "    -webkit-box-sizing: border-box;";
            css += "    box-sizing: border-box;";
            css += "    background: #eee;";
            css += "}";
            css += ".wewinmain .wewin-choose .wewin-line {";
            css += "    overflow: hidden;";
            css += "    font-size: 0;";
            css += "    width: 50%;";
            css += "    margin: 0 auto;";
            css += "    margin-bottom: 10px;";
            css += "    height: 30px;";
            css += "}";
            css += ".wewinmain .wewin-choose .wewin-line .wewin-left {";
            css += "    float: left;";
            css += "    text-align: right;";
            css += "    width: 30%;";
            css += "    font-size: 16px;";
            css += "    line-height: 30px;";
            css += "}";
            css += ".wewinmain .wewin-choose .wewin-line .wewin-right {";
            css += "    overflow: hidden;";
            css += "    text-align: left;";
            css += "    height: 30px;";
            css += "}";
            css += ".wewinmain .wewin-choose .wewin-line .wewin-right select {";
            css += "    width: 100%;";
            css += "    height: 100%;";
            css += "    border-radius: 5px;";
            css += "    outline: none;";
            css += "}";
            css += ".wewinbtns {";
            css += "    \/* width: 70%; *\/";
            css += "    text-align: center;";
            css += "    margin: 0 auto;";
            css += "}";
            css += ".wewinbtn {";
            css += "    background: #5C8FFB;";
            css += "    color: #fff;";
            css += "    border: none;";
            css += "    padding: 5px 15px 5px 15px;";
            css += "    border-radius: 50px;";
            css += "    margin-left: 5px;";
            css += "    margin-right: 5px;";
            css += "    cursor: pointer;";
            css += "    outline: none;";
            css += "}";
            css += ".wewinbtn:active {";
            css += "    background: #7EA7FC;";
            css += "}";
            css += ".wewinmain .wewininfo {";
            css += "    display: inline-block;";
            css += "    background: #FFEBEA;";
            css += "    padding: 3px 10px 3px 10px;";
            css += "    color: #FF3B30;";
            css += "    border: 1px solid #E9453D;";
            css += "    border-radius: 5px;";
            css += "    margin: 0 auto;";
            css += "    margin-bottom: 10px;";
            css += "    width: 50%;";
            css += "    -webkit-box-sizing: border-box;";
            css += "    box-sizing: border-box;";
            css += "    font-weight: bold;";
            css += "}";
            css += ".wewinmain .wewinsplit {";
            css += "    width: 100%;";
            css += "    height: 1px;";
            css += "    background: #ddd;";
            css += "    margin-top: 10px;";
            css += "    margin-bottom: 10px;";
            css += "}";
            css += ".wewinmain .wewinsplit2 {";
            css += "    width: 100%;";
            css += "    height: 1px;";
            css += "    background: #ddd;";
            css += "    margin-top: 10px;";
            css += "}";
            css += ".wewinmain .wewin-bigtitle {";
            css += "    text-align: center;";
            css += "    padding-top: 7px;";
            css += "    margin-bottom: 10px;";
            css += "    font-weight: bold;";
            css += "}";
            css += ".wewindown {";
            css += "    font-size: 14px;";
            css += "    width: 750px;";
            css += "    overflow: hidden;";
            css += "    margin-top: 10px;";
            css += "    padding-top: 5px;";
            css += "    padding-bottom: 5px;";
            css += "    background: #eee;";
            css += "    border-bottom: 1px solid #ddd;";
            css += "    border-top: 1px solid #ddd;";
            css += "}";
            css += ".wewindown a:hover {";
            css += "    text-decoration: underline;";
            css += "}";
            css += ".wewinmain .wewin-tags {";
            css += "    height: calc(100% - 221px);";
            css += "    overflow-y: auto;";
            css += "    overflow-x: hidden;";
            css += "    padding: 10px;";
            css += "    -webkit-box-sizing: border-box;";
            css += "    box-sizing: border-box;";
            css += "}";
            css += "::-webkit-scrollbar {";
            css += "    width: 10px;";
            css += "    \/*滚动条宽度*\/";
            css += "    height: 10px;";
            css += "    \/*滚动条高度*\/";
            css += "}";
            css += "::-webkit-scrollbar-track {";
            css += "    border-radius: 10px;";
            css += "    background-color: #fff;";
            css += "}";
            css += "\/*定义滑块 内阴影+圆角*\/";
            css += "::-webkit-scrollbar-thumb {";
            css += "    border-radius: 10px;";
            css += "    background-color: rgb(124, 124, 124);";
            css += "}";
            css += ".noselect {";
            css += "    -moz-user-select: none;";
            css += "    -webkit-user-select: none;";
            css += "    -ms-user-select: none;";
            css += "    user-select: none;";
            css += "}";
            css += ".wewinmain .wewin-cha,.wewin-debug .wewin-cha {";
            css += "    position: absolute;";
            css += "    top: 5px;";
            css += "    right: 4px;";
            css += "    -webkit-transform: translate(-50%, 0);";
            css += "    transform: translate(-50%, 0);";
            css += "    z-index: 1300;";
            css += "    font-size: 20px;";
            css += "    cursor: pointer;";
            css += "}";
            css += ".wewin-debug-img {";
            css += "    border: 1px solid #ddd;";
            css += "}";
            css += ".wewin-rotate {";
            // css += "    filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2)​;";
            // css += "    -ms-filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2)​;";
            css += "    -webkit-transform: rotate(180deg);";
            css += "    -moz-transform: rotate(180deg);";
            css += "    -o-transform: rotate(180deg);";
            css += "    transform: rotate(180deg);";
            css += "    -webkit-transform-origin: left top;";
            css += "    -moz-transform-origin: left top;";
            css += "    -o-transform-origin: left top;";
            css += "    transform-origin: left top;";
            css += "}";
            //-------------------------------------------
            css += ".wewin-debug-mask {";
            css += "    z-index: 2000;";
            css += "}";
            css += ".wewin-debug {";
            css += "    width: 600px;";
            css += "    height: 70%;";
            css += "    z-index: 2200;";
            css += "}";
            css += ".wewin-debug .wewin-cha {";
            css += "    z-index: 2300;";
            css += "}";
            css += ".wewin-debug .wewin-title {";
            css += "    padding-top:7px;";
            css += "    text-align:center;";
            css += "    font-weight:bold;";
            css += "}";
            css += ".wewin-debug .wewin-tags {";
            css += "    height: calc(100% - 30px);";
            css += "    width: 500px;";
            css += "    position: absolute;";
            css += "    top: 30px;";
            css += "    left: 50%;";
            css += "    margin-left: -250px;";
            css += "    text-align: center;";
            css += "    overflow-y: auto;";
            css += "    padding: 5px;";
            css += "    box-sizing: border-box;";
            css += "}";
            css += ".wewin-debug .wewin-tags .wewin-tag {";
            css += "    padding: 5px;";
            css += "    box-sizing: border-box;";
            css += "}";
            css += ".wewin-debug .wewin-tags .wewin-tag img{";
            css += "    border:1px solid #777;";
            css += "}";
            //-------------------------------------------
            css += "\/* IE兼容 678 *\/";
            css += "@media \\0screen\\,screen\\9 {";
            css += "    .wewinmain {";
            css += "        height: 600px;";
            css += "        margin-left: -375px;";
            css += "        margin-top: -300px;";
            css += "        overflow-y: auto;";
            css += "        border: 1px solid #000;";
            css += "    }";
            css += "    .wewin-debug {";
            css += "        height: 600px;";
            css += "        margin-left: -300px;";
            css += "        margin-top: -300px;";
            css += "        overflow-y: auto;";
            css += "        border: 1px solid #000;";
            css += "    }";
            css += "    .wewindown {";
            css += "        position: relative;";
            css += "        left: 0;";
            css += "    }";
            css += "    .wewinview {";
            css += "        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#7fdddddd, endColorstr=#7fdddddd);";
            css += "    }";
            css += "    .wewinview2 {";
            css += "        position: fixed;";
            css += "        top: 0;";
            css += "        right: 0;";
            css += "        left: 0;";
            css += "        bottom: 0;";
            css += "        background-color:#000000;";
            css += "        opacity:0.4;";
            css += "        filter:alpha(opacity=50);";
            css += "        z-index: 1000;";
            css += "    }";
            css += "    .wewinmain .wewin-cha,.wewin-debug .wewin-cha{";
            css += "        right: 25px;";
            css += "    }";
            css += "}";
            css += "@-webkit-keyframes into {";
            css += "    0% {";
            css += "        opacity: 0;";
            css += "        -webkit-transform: translate(-50%, -50%) scale(0.8);";
            css += "        transform: translate(-50%, -50%) scale(0.8);";
            css += "    }";
            css += "    100% {";
            css += "        opacity: 1;";
            css += "        -webkit-transform: translate(-50%, -50%) scale(1);";
            css += "        transform: translate(-50%, -50%) scale(1);";
            css += "    }";
            css += "}";
            css += "@keyframes into {";
            css += "    0% {";
            css += "        opacity: 0;";
            css += "        -webkit-transform: translate(-50%, -50%) scale(0.8);";
            css += "        transform: translate(-50%, -50%) scale(0.8);";
            css += "    }";
            css += "    100% {";
            css += "        opacity: 1;";
            css += "        -webkit-transform: translate(-50%, -50%) scale(1);";
            css += "        transform: translate(-50%, -50%) scale(1);";
            css += "    }";
            css += "}";
            return css;
        }

        /**
         * 动态添加预览css样式
         */
        WewinPrintService.prototype.AddCss = function (cssText) {
            var style = document.createElement('style'), //创建一个style元素
                head = document.head || document.getElementsByTagName('head')[0]; //获取head元素
            style.type = 'text/css'; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
            if (style.styleSheet) { //IE
                var func = function () {
                    try { //防止IE中stylesheet数量超过限制而发生错误
                        style.styleSheet.cssText = cssText;
                    } catch (e) {

                    }
                }
                //如果当前styleSheet还不能用，则放到异步中则行
                if (style.styleSheet.disabled) {
                    setTimeout(func, 10);
                } else {
                    func();
                }
            } else { //w3c
                //w3c浏览器中只要创建文本节点插入到style元素中就行了
                var textNode = document.createTextNode(cssText);
                style.appendChild(textNode);
            }
            head.appendChild(style); //把创建的style元素插入到head中    
        }

        /**
         * 创建预览窗口
         */
        WewinPrintService.prototype.CreateView = function () {

            var html = "";
            html += "<div class=\"wewinview2 noselect\"><\/div>";
            html += "<div class=\"wewinview noselect\">";
            html += "    <div class=\"wewinmain\">";
            html += "        <div class=\"wewin-fixtop\">";
            html += "           <div class=\"wewin-bigtitle\" id=\"btitle\">";
            html += "               重庆品胜 - 资管打印 - 打印预览";
            html += "           <\/div>";
            html += "           <div class=\"wewinsplit\"><\/div>";
            html += "           <div style=\"text-align: center;\" class=\"wewin-choose\">";
            html += "               <div class=\"wewin-title\" id=\"printnamediv\">";
            html += "                   <div class=\"wewin-line\">";
            html += "                       <div class=\"wewin-left\">选择打印机：<\/div>";
            html += "                       <div class=\"wewin-right\">";
            html += "                           <select style=\"width: 100%;height: 100%;border-radius: 5px;outline: none;font-size: 14px;\" id=\"printername\" onchange=\"\"><\/select>";
            html += "                       <\/div>";
            html += "                   <\/div>";
            html += "                   <div class=\"wewin-line\">";
            html += "                       <div class=\"wewin-left\">标签型号：<\/div>";
            html += "                       <div class=\"wewin-right\">";
            html += "                           <select style=\"width: 100%;height: 100%;border-radius: 5px;outline: none;font-size: 14px;\" id=\"labelname\" onchange=\"wps.changetype()\"><\/select>";
            html += "                        <\/div>";
            html += "                   <\/div>";
            html += "               <\/div>";
            html += "               <div style=\"margin-bottom:5px;\" class=\"wewininfo\">";
            html += "                   该标签支持的打印机型号：";
            html += "                   <span id=\"printtype\"><\/span>";
            html += "               <\/div>";
            html += "               <div style=\"margin-bottom:10px;\" class=\"wewininfo2\">";
            html += "                   <span style=\"display:inline-block;margin-right:10px;\" id=\"printtype2\">打印张数: <span style='font-weight:bold;color:red'>1张</span><\/span>";
            html += "                   <span style=\"display:inline-block;margin-left:10px;\" id=\"printtype3\"><\/span>";
            html += "               <\/div>";
            html += "           <\/div>";
            html += "           <div class=\"wewinbtns\">";
            html += "               <button style=\"color: #fff;border: none;padding: 5px 15px 5px 15px;border-radius: 50px;margin-left: 5px;margin-right: 5px;cursor: pointer;outline: none;font-size: 16px;\" class=\"wewinbtn\" type=\"button\" id=\"print\" name=\"print\" onclick=\"wps.PagePrint()\">";
            html += "                    打印";
            html += "               <\/button>";
            html += "               <button style=\"color: #fff;border: none;padding: 5px 15px 5px 15px;border-radius: 50px;margin-left: 5px;margin-right: 5px;cursor: pointer;outline: none;font-size: 16px;\" class=\"wewinbtn\" type=\"button\" name=\"print\" onclick=\"wps.lookXml()\">";
            html += "                   查看报文";
            html += "               <\/button>";
            html += "               <button style=\"color: #fff;border: none;padding: 5px 15px 5px 15px;border-radius: 50px;margin-left: 5px;margin-right: 5px;cursor: pointer;outline: none;font-size: 16px;\" class=\"wewinbtn\" type=\"button\" name=\"print\" onclick=\"wps.lookHelp()\">";
            html += "                   自助排障";
            html += "               <\/button>";
            if (!this.modal) {
                html += "            <button style=\"color: #fff;border: none;padding: 5px 15px 5px 15px;border-radius: 50px;margin-left: 5px;margin-right: 5px;cursor: pointer;outline: none;font-size: 16px;\" class=\"wewinbtn\" type=\"button\" name=\"close\" onclick=\"$('.wewinview').remove();$('.wewinview2').remove();\">";
                html += "                关闭";
                html += "            <\/button>";
            }
            html += "        <\/div>";
            if (this.printNum != -1) {
                html += "        <div class=\"wewinbtns\">";
                html += "           <span style='color: #FF3B30;font-weight:bold;'>每张打印份数：<\/span><input id='printNum' type='number' max='" + this.maxPrintNum + "' min='" + this.minPrintNum + "' style='ime-mode:disabled;width:55px;border-radius: 5px;outline: none;font-size: 14px;padding: 2px;padding-left:5px;box-sizing: border-box;margin-top:7px;' onKeyPress=\"if(event.keyCode < 48 || event.keyCode > 57) event.returnValue = false;\" onKeyUp=\"this.value=this.value.replace(/\\D/g,'')\" /> (" + this.minPrintNum + "-" + this.maxPrintNum + ") 份";
                html += "        <\/div>";
            }
            html += "        <div class=\"wewindown\">";
            html += "            <div style=\"float: left;padding-left: 20px;\" class=\"left version\">版本号：";
            html += "                <span id=\"versionnum\"><\/span>";
            html += "            <\/div>";
            html += "            <div style=\"float: right;padding-right: 20px;\" class=\"right\">";
            html += "                <a style=\"color: red;font-size: 14px;text-decoration: none;\" href=\"" + this.pluginDownloadPath + "\" target=\"_blank\">插件下载<\/a>";
            html += "                <a style=\"color: black;font-size: 14px;text-decoration: none;\" > | <\/a>";
            html += "                <a style=\"color: blue;font-size: 14px;text-decoration: none;\" href=\"https://www.makeid.com/support\" target=\"_blank\">驱动下载<\/a>";
            html += "            <\/div>";
            html += "        <\/div>";
            html += "        <\/div>";
            // html += "        <div class=\"wewinsplit2\"><\/div>";
            if (this.printNum != -1) {
                html += "        <div class=\"wewin-tags\" style='height: calc(100% - 290px);position:relative'>";
            } else {
                html += "        <div class=\"wewin-tags\" style='height: calc(100% - 260px);position:relative'>";
            }
            html += "            <div style=\"margin-bottom: 50px;text-align:center;position: relative;\" id=\"preview\"><div id=\"previewtag\"><\/div><div onclick=\"wps.LoadMore()\" id=\"loadmore\" style=\"    font-size: 16px;width:110px;display: inline-block; margin-top: 20px; color: #3962ff; font-weight: bold;border-bottom: 1px solid #3962ff; cursor: pointer;\">显示更多标签<\/div><\/div>";
            html += "        <\/div>";
            if (!this.modal) {
                html += "        <div class=\"wewin-cha\" onclick=\"$('.wewinview').remove();$('.wewinview2').remove();\">&#10006<\/div>";
            }
            html += "    <\/div>";
            html += "    <canvas id=\"wewincanvas\" style=\"display: none\"><\/canvas>";
            html += "<\/div>";
            $(document.body).append(html);

            var webType = this.isIE();
            if (webType) {
                //测量div
                var div = document.createElement("div");
                div.id = "divgetlen";
                div.style.position = "absolute";
                div.style.marginLeft = "-10000px";
                div.style.fontFamily = this.fontname;
                document.body.appendChild(div);
                this.measureDiv = document.getElementById('divgetlen');
            } else {
                //测量canvas
                var canvas = document.getElementById('wewincanvas');
                this.measureCanvas = canvas.getContext("2d");
            }
            // this.initClickEvent();
        }

        /**
         * 获取打印机列表，并添加到下拉选择框
         */
        WewinPrintService.prototype.getPrinterList = function (successCallback, errorCallback) {
            var _this = this;
            //查询打印机数据
            var rawData = {"handleType": "0"}
            var sendData = this.resolveData(rawData);
            console.log('请求打印机列表，参数:' + sendData);
            if (!_this.modal) {
                sendData = encodeURI(sendData);
            }
           
            var url = this.getTrueUrl();
            
            this.Ajax('post', url, sendData, function (data) {
                console.log('POST获取打印机success：' + data);
                
                if(successCallback) {
                    successCallback(data);
                }
            }, function (error) {

                console.log("获取打印机列表失败：" + error);

                if (error == 0) {
                    var backInfo = { "errCode": "SERVICE_NOT_START", "status": "17", "result": "Print fail", "error": "Please install print plugin or start service" };
                    _this.GoCallBackInfo(backInfo);
                    
                    if(errorCallback) {
                        errorCallback(backInfo);
                    }
                    return;
                }
                console.log('POST获取打印机fail,转JSONP请求' + error);

                if (_this.modal) {
                    sendData = encodeURI(sendData);
                }
                $.ajax({
                    url: url,
                    type: 'POST', 
                    data: sendData,
                    dataType: "jsonp",
                    jsonpCallback: "wwprint",
                    success: function (data) {
                        console.log("jsonp-查询-success：", data);
                        // _this.AddPrinter(JSON.stringify(data));
                        if(successCallback) {
                            successCallback(data);
                        }
                    },
                    error: function (error) {
                        var backInfo = { "errCode": "SERVICE_NOT_START", "status": "17", "result": "Print fail", "error": "Please install print plugin or start service" };
                        _this.GoCallBackInfo(backInfo);
                        
                        console.log("jsonp-查询-error：", error);
                        if(errorCallback) {
                            errorCallback(backInfo);
                        }
                    }
                });
            });
        }

        /**
         * 封装jsonp请求
         * @param {Object} obj ajax参数
         */
        WewinPrintService.prototype.AjaxJsonp = function (obj) {
            var script = document.createElement('script');
            var rnum = Math.floor(Math.random() * 100000000 + 500);

            // eval(obj.jsonpCallback + " = obj.success; ");
            $(function () {
                window.wwprint = obj.success;
            })

            var url = obj.url + "/?callback=" + obj.jsonpCallback + "&name=" + obj.data + "&_=" + rnum;
            console.log(url)
            script.setAttribute('src', url);
            document.getElementsByTagName('head')[0].appendChild(script);
        }

        /**
         * 添加查询的打印机
         * @param {String} data 查询打印机获取的数据
         */
        WewinPrintService.prototype.AddPrinter = function (data) {
            var printers = [];
            var jsonData = JSON.parse(data);
            var storagePrinter = "";
            var existStoragePrinter = false;
            printers = jsonData.content;
            var pelement = document.getElementById("printername");
            if (pelement != null) {
                pelement.innerHTML = "";
            }
            if (this.getItem("printer") != null) {
                storagePrinter = this.getItem("printer");
            }
            var temp = true;
           
            for (var i = 0; i < printers.length; i++) {
                var pname = printers[i];
                if (pname.printer == storagePrinter.split("&&")[0]) {
                    existStoragePrinter = true;
                }
                if (pname.printer.toLowerCase().indexOf("wewin") != -1 || 
                    pname.printer.toLowerCase().indexOf("hiti") != -1 || 
                    pname.printer.toLowerCase().indexOf("magicard") != -1 || 
                    pname.printer.toLowerCase().indexOf("makeid") != -1 ||
                    pname.printer.toLowerCase().indexOf("label") != -1) {
                    temp = false;
                }
            }

            if (temp) {
                pelement.options.add(new Option("No MakeID Printer", "-1"));
            }

            if (existStoragePrinter) {
                pelement.options.add(new Option(storagePrinter.split("&&")[0], storagePrinter));
            }

            for (var i = 0; i < printers.length; i++) {
                var pname = printers[i];
                if (storagePrinter.indexOf(pname.printer) > -1) {
                    continue;
                } else {
                    if (pname.printer.toLowerCase().indexOf("wewin") != -1 ||
                        pname.printer.toLowerCase().indexOf("hiti") != -1 || 
                        pname.printer.toLowerCase().indexOf("magicard") != -1 || 
                        pname.printer.toLowerCase().indexOf("makeid") != -1 ||
                        pname.printer.toLowerCase().indexOf("label") != -1) {
                            
                        pelement.options.add(new Option(pname.printer, pname.printer + "&&" + pname.dots + "&&" + pname.hasDrive + "&&" + pname.USBID));
                    }
                }
            }
        }

        /**
         * 打印预览函数
         * @param {Function} viewPrintFunc 
         */
        WewinPrintService.prototype.ViewPrint = function (viewPrintFunc, temp) {
            var data = this.GetPreviewData(this.data);
            var startIndex, dataLen;
            var preview = $("#previewtag")[0];
            if (temp == "more") {
                startIndex = $(".previewTags").length;
                if (startIndex == data.length) {
                    alert("无更多预览标签");
                }
            } else if (temp == "change" || temp == "load") {
                startIndex = 0;
                preview.innerHTML = "";
                this.checkAll = false;
                $("#printtype2").html("打印张数: <span style='font-weight:bold;color:red'>1张</span>");
            }

            if (this.previewNum < data.length) {
                dataLen = startIndex + this.previewNum;
                if (dataLen >= data.length) {
                    dataLen = data.length;
                }
            } else {
                dataLen = data.length;
            }
            if (data.length == 1) {
                $("#loadmore").css("display", "none");
            } else {
                $("#loadmore").css("display", "inline-block");
            }

            this.temp = temp;
            this.startIndex = startIndex;
            this.dataLen = dataLen;

            viewPrintFunc();
        }

        /**
         * 查看报文
         */
        WewinPrintService.prototype.lookXml = function () {
            var copyData = JSON.stringify(this.data);

            //复制打印数据
            try {
                if (this.isIE()) {
                    window.clipboardData.setData("Text", copyData);
                } else {
                    var oInput = document.createElement('input');
                    oInput.value = copyData;
                    document.body.appendChild(oInput);
                    oInput.select();
                    document.execCommand("Copy");
                    oInput.id = 'oInput';
                    oInput.style.display = 'none';
                    $("#oInput").remove();
                }
            } catch (error) {
                console.log(error);
            }

            alert(copyData);
        }

        /**
         * 查看帮助
         */
        WewinPrintService.prototype.lookHelp = function () {
            window.open("http://help.makeid.com/#/");
        }

        /**
         * 设置选中的打印机
         */
        WewinPrintService.prototype.GetPrinter = function (func) {
            this.printername = document.getElementById("printername").value;
            this.setItem("printer", this.printername);
            if (this.printername == "-1") {
                alert("当前无WEWIN打印机，请接入");
            } else {
                func();
            }
        }

        /**
         * 无预览打印
         * @param {String} 打印数据
         * @param {String} 打印机名称
         * @param {Function} 回调函数
         */
        WewinPrintService.prototype.SetPrinter = function (tagData, printer, func) {
            var css = this.CreateCss();
            this.AddCss(css);
            this.data = tagData;
            this.printername = "";
            this.noview = "1";
            var _this = this;
            var html = "<canvas id=\"wewincanvas\" style=\"display: none\"><\/canvas>";
            $(document.body).append(html);

            var webType = this.isIE();
            if (webType) {
                //测量div
                var div = document.createElement("div");
                div.id = "divgetlen";
                div.style.position = "absolute";
                div.style.marginLeft = "-10000px";
                div.style.fontFamily = this.fontname;
                document.body.appendChild(div);
                this.measureDiv = document.getElementById('divgetlen');
            } else {
                //测量canvas
                var canvas = document.getElementById('wewincanvas');
                this.measureCanvas = canvas.getContext("2d");
            }

            if (printer.trim() == "") {
                this.printername = "";
                if (this.printername != "") {
                    func();
                } else {
                    alert(_this.noViewTip);
                }
                return;
            }

            //查询打印机数据
            var rawData = {
                "handleType": "0",
                "printer": "",
                "hasDrive": "0",
                "copyNum": "1",
                "labels": [{
                    "labelWidth": "0",
                    "labelHeight": "0",
                    "rfid": "",
                    "ddfLength": "0",
                    "blocks": []
                }]
            }
            var sendData = "";
            sendData = this.resolveData(rawData);
            if (!_this.modal) {
                sendData = encodeURI(sendData);
            }
            var url = this.getTrueUrl();

            var _this = this;
            this.Ajax('post', url, sendData, function (data) {
                console.log('非jsonp-查询-success：' + data);
                var jsonData = JSON.parse(data);
                var printers = jsonData.content;
                _this.GetRightPrinter(printer, printers);
                if (_this.printername != "") {
                    func();
                } else {
                    alert(_this.noViewTip);
                }
            }, function (error) {
                if (error == 0) {
                    var backInfo = { "errCode": "SERVICE_NOT_START", "status": "17", "result": "打印失败", "error": "请安装插件或启动服务" };
                    _this.GoCallBackInfo(backInfo);
                    if (_this.alert) {
                        alert(_this.noServiceTip);
                    }
                    return;
                }
                console.log('非jsonp-查询-error：' + error);
                if (_this.modal) {
                    sendData = encodeURI(sendData);
                }
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: sendData,
                    dataType: "jsonp",
                    jsonpCallback: "wwprint",
                    success: function (data) {
                        console.log("jsonp-查询-success：", JSON.stringify(data));
                        var jsonData = data;
                        var printers = jsonData.content;
                        _this.GetRightPrinter(printer, printers);
                        if (_this.printername != "") {
                            func();
                        } else {
                            alert(_this.noViewTip);
                        }
                    },
                    error: function (error) {
                        var backInfo = { "errCode": "SERVICE_NOT_START", "status": "17", "result": "打印失败", "error": "请安装插件或启动服务" };
                        _this.GoCallBackInfo(backInfo);
                        if (_this.alert) {
                            alert(_this.noServiceTip);
                        }
                        console.log("jsonp-查询-error：", error);
                    }
                });

            });
        }

        /**
         * 获取无预览传入的打印机(先完整匹配，后模糊匹配)
         */
        WewinPrintService.prototype.GetRightPrinter = function (printer, printers) {
            var temp = true;
            for (var i = 0; i < printers.length; i++) {
                if (printers[i].printer.toLowerCase() == printer.toLowerCase()) {
                    this.printername = printers[i].printer + "&&" + printers[i].dots + "&&" + printers[i].hasDrive + "&&" + printers[i].USBID;
                    temp = false;
                    break;
                }
            }
            if (temp) {
                for (var i = 0; i < printers.length; i++) {
                    if (printers[i].printer.toLowerCase().indexOf(printer.toLowerCase()) != -1) {
                        this.printername = printers[i].printer + "&&" + printers[i].dots + "&&" + printers[i].hasDrive + "&&" + printers[i].USBID;
                        break;
                    }
                }
            }
        }

        /**
         * 获取无预览传入的打印机(先完整匹配，后模糊匹配)
         */
        WewinPrintService.prototype.GetRightPrinter2 = function (printer, printers) {
            var temp = true;
            for (var i = 0; i < printers.length; i++) {
                if (printers[i].printer.toLowerCase() == printer.toLowerCase()) {
                    temp = false;
                    break;
                }
            }
            if (temp) {
                for (var i = 0; i < printers.length; i++) {
                    if (printers[i].printer.toLowerCase().indexOf(printer.toLowerCase()) != -1) {
                        temp = false;
                        break;
                    }
                }
            }
            return !temp;
        }

        /**
         * 获取打印机列表，并添加到下拉选择框
         */
        WewinPrintService.prototype.IsExistPrinter = function (printer, func) {
            var _this = this;
            //查询打印机数据
            var rawData = {
                "handleType": "0",
                "printer": "",
                "hasDrive": "0",
                "copyNum": "1",
                "labels": [{
                    "labelWidth": "0",
                    "labelHeight": "0",
                    "rfid": "",
                    "ddfLength": "0",
                    "blocks": []
                }]
            }
            var sendData = "";
            sendData = this.resolveData(rawData);
            if (!_this.modal) {
                sendData = encodeURI(sendData);
            }
            var url = this.getTrueUrl();

            var _this = this;
            this.Ajax('post', url, sendData, function (data) {
                console.log('非jsonp-查询-success：' + data);
                var jsonData = JSON.parse(data);
                var printers = jsonData.content;
                var temp = _this.GetRightPrinter2(printer, printers);
                func(temp);
            }, function (error) {
                if (error == 0) {
                    var backInfo = { "errCode": "SERVICE_NOT_START", "status": "17", "result": "打印失败", "error": "请安装插件或启动服务" };
                    _this.GoCallBackInfo(backInfo);
                    if (_this.alert) {
                        alert(_this.noServiceTip);
                    }
                    return;
                }
                console.log('非jsonp-查询-error：' + error);
                if (_this.modal) {
                    sendData = encodeURI(sendData);
                }
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: sendData,
                    dataType: "jsonp",
                    jsonpCallback: "wwprint",
                    success: function (data) {
                        console.log("jsonp-查询-success：", JSON.stringify(data));
                        var jsonData = data;
                        var printers = jsonData.content;
                        var temp = _this.GetRightPrinter2(printer, printers);
                        func(temp);
                    },
                    error: function (error) {
                        var backInfo = { "errCode": "SERVICE_NOT_START", "status": "17", "result": "打印失败", "error": "请安装插件或启动服务" };
                        _this.GoCallBackInfo(backInfo);
                        if (_this.alert) {
                            alert(_this.noServiceTip);
                        }
                        console.log("jsonp-查询-error：", error);
                    }
                });
            });
        }

        /**
         * 打印函数
         * @param {Function} doLabelPrintFunc 
         */
        WewinPrintService.prototype.DoLabelPrint = function (doLabelPrintFunc) {
            if (this.noview != "1") {
                var supportPrinter = document.getElementById("printtype").innerHTML;
                var supportPrinterArr = supportPrinter.split(" ");
                var temp = true;
                if (supportPrinter.toLowerCase().indexOf("wewin") > -1 ||
                    supportPrinter.toLowerCase().indexOf("makeid") > -1 ||
                    supportPrinter.toLowerCase().indexOf("label") != -1) {

                    temp = false;
                } else {
                    for (var i = 0; i < supportPrinterArr.length; i++) {
                        if (supportPrinterArr[i] == "ME2000") {
                            supportPrinterArr[i] = "CS-200";
                        }
                        if (supportPrinterArr[i] == "ME1000") {
                            supportPrinterArr[i] = "Magicard Enduro";
                        }
                        if (this.printername.toLowerCase().indexOf(supportPrinterArr[i].toLowerCase()) != -1) {
                            temp = false;
                            break;
                        }
                    }
                }
                if (temp) {
                    alert("不支持该打印机型号");
                    return;
                }
            }
            doLabelPrintFunc();
        }

        /**
         * 多个标签全选
         */
        WewinPrintService.prototype.chooseAllCheckbox = function () {
            var allchebox = document.getElementById("allcb");
            var data = this.data;

            if (typeof (data) == "string") {
                var xmldoc = this.loadXML(this.data);
                data = xmldoc.getElementsByTagName(this.xmlDataTagName);
            }

            if (allchebox.checked) {
                for (var i = 0; i < data.length; i++) {
                    if (document.getElementById("cb" + i)) {
                        document.getElementById("cb" + i).checked = true;
                    }
                }
                this.checkAll = true;
                //打印张数
                $("#printtype2").html("打印张数: <span style='font-weight:bold;color:red'>" + data.length + "张</span>");
            } else {
                for (var i = 0; i < data.length; i++) {
                    if (document.getElementById("cb" + i)) {
                        document.getElementById("cb" + i).checked = false;
                    }
                }
                this.checkAll = false;
                //打印张数
                $("#printtype2").html("打印张数: <span style='font-weight:bold;color:red'>0张</span>");
            }
        }

        /**
         * 选中单个标签
         */
        WewinPrintService.prototype.chooseOneCheckbox = function () {
            var data = this.data;

            if (typeof (data) == "string") {
                var xmldoc = this.loadXML(this.data);
                data = xmldoc.getElementsByTagName(this.xmlDataTagName);
            }
            if (this.checkAll) {
                var num = data.length;
                for (var i = 0; i < data.length; i++) {
                    if (document.getElementById("cb" + i)) {
                        if (document.getElementById("cb" + i).checked == false) {
                            num--;
                        }
                    }
                }

                //打印张数
                $("#printtype2").html("打印张数: <span style='font-weight:bold;color:red'>" + num + "张</span>");
                if (num < data.length) {
                    document.getElementById("allcb").checked = false;
                }
                if (num == data.length) {
                    document.getElementById("allcb").checked = true;
                }
            } else {
                var num = 0;
                for (var i = 0; i < data.length; i++) {
                    if (document.getElementById("cb" + i)) {
                        if (document.getElementById("cb" + i).checked == true) {
                            num++;
                        }
                    }
                }
                if (num == data.length) {
                    document.getElementById("allcb").checked = true;
                } else {
                    document.getElementById("allcb").checked = false;
                }

                //打印张数
                $("#printtype2").html("打印张数: <span style='font-weight:bold;color:red'>" + num + "张</span>");
            }
        }

        /**
         * 编码转换
         * @param {String} str 需要转换的字符串
         * @returns {String} 转换后的字符串
         */
        WewinPrintService.prototype.utf16to8 = function (str) {
            var out, i, len, c;
            out = "";
            str = this.isWrong(str);
            len = str.length;
            for (i = 0; i < len; i++) {
                c = str.charCodeAt(i);
                if ((c >= 0x0001) && (c <= 0x007F)) {
                    out += str.charAt(i);
                } else if (c > 0x07FF) {
                    out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                    out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                } else {
                    out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                }
            }
            return out;
        }

        /**
         * 每一张标签打多次处理
         */
        WewinPrintService.prototype.MulPrint = function (obj) {
            var printNumObj = document.getElementById('printNum');
            if (printNumObj != null) {
                this.printNum = document.getElementById('printNum').value;
                this.printNum = parseInt(this.printNum);
                if (typeof (this.printNum) != 'number' || this.printNum < this.minPrintNum || this.printNum > this.maxPrintNum || isNaN(this.printNum)) {
                    return false;
                }
            }
            if (this.printNum == -1) {
                this.printNum = 1;
            }
            var newArr = [];
            for (var i = 0; i < obj.labels.length; i++) {
                var ar = [];
                for (var j = 0; j < this.printNum; j++) {
                    ar.push(obj.labels[i]);
                }
                newArr.push(ar);
            }
            obj.labels = [];
            for (var i = 0; i < newArr.length; i++) {
                var cArr = newArr[i];
                for (var j = 0; j < cArr.length; j++) {
                    obj.labels.push(cArr[j]);
                }
            }
            return obj;
        }

        /**
         * 调试打印，预览打印效果
         */
        WewinPrintService.prototype.DebugPrint = function (labelsArr) {
            var _this = this;
            if (_this.printername != -1) {
                var html = "";
                html += "<div class=\"wewin-debug-mask\">";
                html += "    <div class=\"wewin-debug\">";
                html += "        <div class=\"wewin-title\"> Preview <button onclick='wps.Print(wps.printTempData)'>Print</button><\/div>";
                html += "        <div class=\"wewin-tags\"><div class=\"loading\" style=\"width:100%;text-align:center;font-weight:bold;font-size:20px;margin-top:30px;\">Loading...<\/div><\/div>";
                html += "        <div class=\"wewin-cha\" onclick=\"$(\'.wewin-debug-mask\').remove();\">&#10006<\/div>";
                html += "    <\/div><\/div>";
                $(document.body).append(html);

                var isIE = navigator.userAgent.toLowerCase().indexOf("msie");
                if (isIE > -1) {
                    var newHeight = $(window).height() * 0.9;
                    $(".wewin-debug").css({ "height": newHeight, "margin-top": -newHeight / 2 });
                }

                _this.StartDebugPrint(labelsArr);
            } else {
                return "-1";
            }
        }

        /**
         * 递归调试打印
         */
        WewinPrintService.prototype.StartDebugPrint = function (labelsArr) {
            var _this = this;
            var element = labelsArr[0];
            if (element == undefined || element == undefined) {
                $(".wewin-debug .wewin-tags .loading").remove();
                return;
            }
            var elements = [];
            elements.push(element);
            var rawData = {
                "handleType": "1",
                "printer": "",
                "hasDrive": "",
                "copyNum": "1",
                "labels": elements
            }
            rawData.handleType = "2";
            var parr = _this.printername.split("&&");
            var pname = parr[0];
            var dots = parr[1];
            var hasDrive = parr[2];
            rawData.printer = pname;
            rawData.hasDrive = hasDrive;
            rawData = _this.MulPrint(rawData);
            if (rawData == false) {
                alert(_this.printNumTip);
                return;
            }
            var sendData = "";
            sendData = _this.resolveData(rawData);

            console.log("打印前的数据(string)：", sendData);
            var url = _this.getTrueUrl();

            if (!_this.modal) {
                sendData = encodeURI(sendData);
            }

            _this.Ajax('post', url, sendData, function (data) {
                console.log('非jsonp-打印-success');
                data = data.replace(/\r\n/g, "");
                var jsonData = JSON.parse(data);
                var img = new Image();
                $(".wewin-debug .wewin-tags .loading").remove();
                img.onload = function () {
                    var tag = "";
                    tag += "    <div class=\"wewin-tag\">";
                    if (img.width >= 500) {
                        tag += "        <img style=\"background:#fff;width:100%;\" src='" + jsonData.content + "'/>";
                    } else {
                        tag += "        <img style=\"background:#fff;\" src='" + jsonData.content + "'/>";
                    }
                    tag += "    <\/div>";
                    tag += "    <div class=\"loading\" style=\"width:100%;text-align:center;font-weight:bold;font-size:20px;margin-top:10px;\">Loading...<\/div>";
                    $(".wewin-debug .wewin-tags").append(tag);
                    labelsArr.shift();
                    _this.GoCallBackInfo(jsonData);
                    _this.StartDebugPrint(labelsArr);
                }
                img.src = jsonData.content;
            }, function (error) {
                console.log('非jsonp-打印-error：' + error);
                if (_this.modal) {
                    sendData = encodeURI(sendData);
                }
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: sendData,
                    dataType: "jsonp",
                    jsonpCallback: "wwprint",
                    success: function (data) {
                        console.log('jsonp-打印-success');
                        data = data.replace(/\r\n/g, "");
                        var jsonData = JSON.parse(data);
                        var img = new Image();
                        $(".wewin-debug .wewin-tags .loading").remove();
                        img.onload = function () {
                            var tag = "";
                            tag += "    <div class=\"wewin-tag\">";
                            if (img.width >= 500) {
                                tag += "        <img style=\"background:#fff;width:100%;\" src='" + jsonData.content + "'/>";
                            } else {
                                tag += "        <img style=\"background:#fff;\" src='" + jsonData.content + "'/>";
                            }
                            tag += "    <\/div>";
                            tag += "    <div class=\"loading\" style=\"width:100%;text-align:center;font-weight:bold;font-size:20px;margin-top:10px;\">Loading...<\/div>";
                            $(".wewin-debug .wewin-tags").append(tag);
                            labelsArr.shift();
                            _this.GoCallBackInfo(jsonData);
                            _this.StartDebugPrint(labelsArr);
                        }
                        img.src = jsonData.content;
                    },
                    error: function (error) {
                        console.log("jsonp-打印-error：", error);
                    }
                });
            });
        }

        /**
         * 打印方法
         * @param {Object} rawData 打印数据
         * @returns {String} 对象转字符串的打印数据
         */
        WewinPrintService.prototype.Print = function (labelsArr) {
            var _this = this;
            if (_this.noview != "1") {
                document.getElementById('print').setAttribute("disabled", true);
                document.getElementById("print").innerHTML = "打印中";
                document.getElementById("print").style.backgroundColor = '#555555'
                var element = labelsArr[0];
                if (element == undefined || element == undefined) {
                    document.getElementById('print').removeAttribute("disabled");
                    document.getElementById("print").innerHTML = "打印";
                    document.getElementById("print").style.backgroundColor = '#5C8FFB'
                    return;
                }
            } else {
                var element = labelsArr[0];
                if (element == undefined || element == undefined) {
                    return;
                }
            }
            var elements = [];
            elements = labelsArr.slice(0, 20);
            var rawData = {
                "handleType": this.handleType,
                "printer": "",
                "hasDrive": "",
                "copyNum": "1",
                "labels": elements,
            }
            if (_this.printername != -1) {
                var parr = _this.printername.split("&&");
                var pname = parr[0];
                var dots = parr[1];
                var hasDrive = parr[2];
                rawData.printer = pname;
                rawData.hasDrive = hasDrive;
                rawData = _this.MulPrint(rawData);
                if (rawData == false) {
                    alert(_this.printNumTip);
                    return;
                }
                var sendData = "";
                sendData = _this.resolveData(rawData);
                console.log("打印前的数据(json)：", JSON.parse(sendData));
                console.log("打印前的数据(string)：", sendData);
                var url = _this.getTrueUrl();

                if (!_this.modal) {
                    sendData = encodeURI(sendData);
                }

                _this.Ajax('post', url, sendData, function (data) {
                    console.log('非jsonp-打印-success：' + data);
                    if (data.indexOf("\"handleType\":2") == -1) {
                        var jsonData = JSON.parse(data);
                        if (jsonData.errCode == "PRINTER_ERROR_TASKFULL") {
                            _this.handleType = 3;
                            _this.GoCallBackInfo(jsonData);
                            var printTime = setTimeout(function () {
                                clearTimeout(printTime);
                                _this.Print(labelsArr);
                            }, 1000);
                        } else {
                            _this.handleType = 1;
                            _this.GoCallBackInfo(jsonData);
                            var printTime = setTimeout(function () {
                                clearTimeout(printTime);
                                labelsArr.splice(0, 20);
                                _this.Print(labelsArr);
                            }, 1000);
                        }

                    }
                }, function (error) {
                    console.log('非jsonp-打印-error：' + error);
                    if (_this.modal) {
                        sendData = encodeURI(sendData);
                    }
                    $.ajax({
                        url: url,
                        type: 'POST',
                        data: sendData,
                        dataType: "jsonp",
                        jsonpCallback: "wwprint",
                        success: function (data) {
                            console.log('jsonp-打印-success' + data);
                            if (data.handleType == 1) {
                                var jsonData = JSON.parse(data);
                                if (jsonData.errCode == "PRINTER_ERROR_TASKFULL") {
                                    _this.handleType = 3;
                                    _this.GoCallBackInfo(jsonData);
                                    var printTime = setTimeout(function () {
                                        clearTimeout(printTime);
                                        _this.Print(labelsArr);
                                    }, 1000);
                                } else {
                                    _this.handleType = 1;
                                    _this.GoCallBackInfo(jsonData);
                                    var printTime = setTimeout(function () {
                                        clearTimeout(printTime);
                                        labelsArr.splice(0, 20);
                                        _this.Print(labelsArr);
                                    }, 1000);
                                }
                            }
                        },
                        error: function (error) {
                            console.log("jsonp-打印-error：", error);
                        }
                    });
                });

                return sendData;
            } else {
                return "-1";
            }
        }

        /**
         * 解析原始数据为打印数据
         * @param {Object} rawData 原始数据对象
         * @returns {String} 转为字符串的数据
         */
        WewinPrintService.prototype.resolveData = function (rawData) {
            var sendData = "";
            sendData = JSON.parse(JSON.stringify(rawData), function (key, value) {
                if (typeof (value) == "number") {
                    return value.toString();
                } else {
                    return value;
                }
            });
            sendData = JSON.stringify(sendData);
            return sendData;
        }

        /**
         * Ajax请求封装
         * @param {String} type 请求类型
         * @param {String} url 请求地址
         * @param {String} data 请求参数
         * @param {Function} success 成功回调函数
         * @param {Function} failed 失败回调函数
         */
        WewinPrintService.prototype.Ajax = function (type, url, data, success, failed) {
            // 创建ajax对象
            var xhr = null;
            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else {
                xhr = new ActiveXObject('Microsoft.XMLHTTP')
            }

            var type = type.toUpperCase();
            // 用于清除缓存
            var random = Math.random();

            if (typeof data == 'object') {
                var str = '';
                for (var key in data) {
                    str += key + '=' + data[key] + '&';
                }
                data = str.replace(/&$/, '');
            }
            if (type == 'GET') {
                try {
                    if (data) {
                        xhr.open('GET', url + '?' + data, true);
                    } else {
                        xhr.open('GET', url + '?t=' + random, true);
                    }
                    xhr.send();
                } catch (error) {
                    failed("error");
                }
            } else if (type == 'POST') {
                try {
                    xhr.open('POST', url, true);
                    // 如果需要像 html 表单那样 POST 数据，请使用 setRequestHeader() 来添加 http 头。
                    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhr.send(data);
                } catch (error) {
                    failed("error");
                }
            }

            // 处理返回数据
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        success(xhr.responseText);
                    } else {
                        if (failed) {
                            failed(xhr.status);
                        }
                    }
                }
            }
        }

        /**
         * 拼接数组
         * @param {Array} arr1 数组1
         * @param {Array} arr2 数组2
         * @returns {Array} 拼接数组1和数组2
         */
        WewinPrintService.prototype.addArr = function (arr1, arr2) {
            for (var i = 0; i < arr2.length; i++) {
                arr1.push(arr2[i]);
            }
            return arr1;
        }

        /**
         * 解析xml
         * @param {String} xmlString xml数据
         */
        WewinPrintService.prototype.loadXML = function (xmlString) {
            var xmlDoc = null;
            if (!window.DOMParser && window.ActiveXObject) {
                var xmlDomVersions = ['MSXML.2.DOMDocument.6.0',
                    'MSXML.2.DOMDocument.3.0', 'Microsoft.XMLDOM'
                ];
                for (var i = 0; i < xmlDomVersions.length; i++) {
                    try {
                        xmlDoc = new ActiveXObject(xmlDomVersions[i]);
                        xmlDoc.async = false;
                        xmlDoc.loadXML(xmlString);
                        break;
                    } catch (e) { }
                }
            } else if (window.DOMParser && document.implementation &&
                document.implementation.createDocument) {
                try {
                    domParser = new DOMParser();
                    xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
                } catch (e) { }
            } else {
                return null;
            }
            return xmlDoc;
        }

        /**
         * 判断浏览器是否为IE浏览器
         * @returns {Boolean} true:是 false:否
         */
        WewinPrintService.prototype.isIE = function () {
            if (!!window.ActiveXObject || "ActiveXObject" in window) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * 获取当前协议对应的请求服务地址
         * @returns 服务插件请求地址
         */
        WewinPrintService.prototype.getTrueUrl = function () {
            var url = "http://127.0.0.1:18188";
            var protocol = window.location.protocol.replace(":", "");
            var webType = this.isIE();

            // if (webType) {
            if (protocol == "https") {
                url = "https://127.0.0.1:18189";
            }
            if (this.getOs() == "Firefox") {
                url = "http://127.0.0.1:18188";
            }
            // }

            console.log("请求服务地址：" + url);

            return url;
        }

        /**
         * 判断浏览器
         */
        WewinPrintService.prototype.getOs = function () {
            var OsObject = "";
            if (navigator.userAgent.indexOf("MSIE") > 0) {
                return "MSIE";
            }
            if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) {
                return "Firefox";
            }
            if (isSafari = navigator.userAgent.indexOf("Safari") > 0) {
                return "Safari";
            }
            if (isCamino = navigator.userAgent.indexOf("Camino") > 0) {
                return "Camino";
            }
            if (isMozilla = navigator.userAgent.indexOf("Gecko/") > 0) {
                return "Gecko";
            }
        }

        /**
         * 开始打印，获取配置参数
         * @param {Object} obj 配置参数
         * @param {Function} callback 回调函数
         */
        WewinPrintService.prototype.StartPrint = function (obj, callback, modalDialog) {

            this.xmlWrong = 0;

            if (obj == undefined) {
                obj = {};
            }
            //qrcode
            if (obj.qrcode != undefined && obj.qrcode != null) {
                this.qrcode = obj.qrcode.trim();
            } else {
                this.qrcode = "table";
            }
            //modal
            if (obj.modal == undefined) {
                obj.modal = false;
                this.modal = false;
            } else if (this.isIE()) {
                this.modal = obj.modal;
            }
            if (modalDialog == "modal") {
                this.modal = true;
            }
            //printNum
            if (obj.printNum != undefined && obj.printNum != null) {
                if (typeof (obj.printNum) != "number" || obj.printNum < this.minPrintNum || obj.printNum > this.maxPrintNum || isNaN(obj.printNum)) {
                    alert(this.printNumTip);
                    this.printNum = -1;
                } else {
                    this.printNum = obj.printNum;
                }
            } else {
                this.printNum = -1;
            }
            //imgPath
            if (obj.imgPath != undefined && obj.imgPath.trim() != "") {
                this.imgPath = obj.imgPath;
            } else {
                this.imgPath = "labelimage";
            }
            //previewNum
            if (obj.previewNum != undefined && obj.previewNum != null) {
                this.previewNum = obj.previewNum;
            } else {
                this.previewNum = 5;
            }
            //tagUnit
            if (obj.tagUnit != undefined && obj.tagUnit != null) {
                this.tagUnit = obj.tagUnit;
            } else {
                this.tagUnit = "mm";
            }
            //debug
            if (obj.debug != undefined && obj.debug != null) {
                this.debug = obj.debug;
            } else {
                this.debug = false;
            }
            //checkboxAll
            if (obj.checkboxAll != undefined && obj.checkboxAll != null) {
                this.checkboxAll = obj.checkboxAll;
            } else {
                this.checkboxAll = false;
            }
            //isToCDATA
            if (obj.isToCDATA != undefined && obj.isToCDATA != null) {
                this.isToCDATA = obj.isToCDATA;
            } else {
                this.isToCDATA = false;
            }
            //CDATA_Arr
            if (obj.CDATA_Arr != undefined && obj.CDATA_Arr != null) {
                this.CDATA_Arr = obj.CDATA_Arr;
            } else {
                this.CDATA_Arr = ["Text", "Code"];
            }
           
            if (obj.alert != undefined && obj.alert != null) {
                this.alert = obj.alert;
            } else {
                this.alert = false;
            }
            callback(obj.noView, obj.modal);
        }

        /**
         * 动态二维码部分，获取当前浏览器的IE版本，非IE浏览器默认为10，小于等于8使用图片方式
         */
        WewinPrintService.prototype.getIeVersion = function () {
            var ua = navigator.userAgent.toLowerCase();
            var isIE = ua.indexOf("msie") > -1;
            var safariVersion = 10;
            if (isIE) {
                safariVersion = ua.match(/msie ([\d.]+)/)[1];
            }
            return safariVersion;
        }

        /**
         * 获取动态二维码生成方式
         */
        WewinPrintService.prototype.qrcodeRender = function () {
            var render = "",
                qrcodeTemp = true;
            if (this.isIE()) {
                if (this.qrcode == "table") {
                    render = "table";
                    qrcodeTemp = true;
                } else if (this.qrcode == "image") {
                    if (this.getIeVersion() <= this.DEFAULT_VERSION) {
                        render = "table";
                        qrcodeTemp = false;
                    } else {
                        render = "canvas";
                        qrcodeTemp = true;
                    }
                } else {
                    render = "table";
                    qrcodeTemp = true;
                }
            } else {
                render = "canvas";
            }

            return {
                render: render,
                qrcodeTemp: qrcodeTemp
            }
        }

        /**
         * 动态生成二维码
         * @param {String} qrcodeName 类名
         * @param {Object} qrcodeRender 动态二维码生成方式
         * @param {String} str 二维码内容
         * @param {Number} width 二维码宽度
         * @param {Number} height 二维码高度
         */
        WewinPrintService.prototype.GenerateQrcode = function (obj) {
            var _this = this;
            if (this.tagUnit == "mm") {
                obj.width = obj.width * 8;
                obj.height = obj.height * 8;
            }
            var width = obj.width / this.scaleRatio;
            var height = obj.height / this.scaleRatio;
            var qrcodeRender = _this.qrcodeRender();
            var qrcodeTemp = (obj.qrcodeRender && obj.qrcodeRender.qrcodeTemp) || qrcodeRender.qrcodeTemp;
            var render = (obj.qrcodeRender && obj.qrcodeRender.render) || qrcodeRender.render;
            if (qrcodeTemp) {
                obj.str = obj.str ? obj.str : "";
                if (obj.str != null && obj.str != undefined) {
                    $(obj.qrcodeName).qrcode({
                        render: render,
                        width: width,
                        height: height,
                        text: this.utf16to8(obj.str)
                    });
                    if ($(obj.qrcodeName + " canvas")[0] != undefined && $(obj.qrcodeName + " canvas")[0] != null) {
                        var dom = $(obj.qrcodeName + " canvas")[0].toDataURL('image/png');
                        $(obj.qrcodeName).text("");
                        $(obj.qrcodeName).append("<img width='" + width + "' height='" + height + "' src='" + dom + "'/>");
                    }
                }
            } else {
                $(obj.qrcodeName).text("");
                $(obj.qrcodeName).append("<img width='" + width + "' height='" + height + "' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAFgUlEQVR4Xu2d25LbMAxDk///6HTczqaTWHJwYtK57OkzLFMAQdF0vD2fTqfL6Y3/XS7j8M7n8ypqgqVb7lybxkLwC0sKHDCmwAFJz0AIsQRLY+lcm8ZC8Do4ZEuBQ6IojBBLsJ1x0LU78To4ZLczecIQnoJNBZ5t6Km7BBeNuuLlMhIHXWOGH4VLBSZxB/Q8hMz2osAPqfsHUOCQqBmMum+0Dl1DB+8UjVxOxVHgWwYs0YOM0MF3pBBCttw7Os+og6tiSatMxRlcFTPhDzVZrwiQEpsKRnE0DiJCRSwlJVqB11KQyvMK/nRwaB8dHBI1e6YkTljWqHJDGrYCp0xNhgYKnBNIzvePLdE5HdztZMxIErOq6ijwzsc7BSb2GWBJBhKy6Rh0hif31MEKfGXAEh0mAy0glFgdTBm+w1ui9xFI+PvYLpq4kjiSUu8ZHJZdQhQddCjwThFo1pMSQydIo1gUWIFpjj7sjEkS05uTtT2DKbvhEIWIQEMgayswZfebBd7JxebltMkaLUY66+V6cr4T7NbaXRyWvPDvCm6rKyYNkgKvFUIlWoEHBA4+Y9XBg0yxRO+zjyU6fBScHRdfdwbvy6e6qwmxBNvdZNUxsG+lX/11IUkIgt0nSe3VChz2Awpcm3jX1QixBGuJbhKMLktEI1gFpko04YloBPtrBL6QUVGTiM8sS6ZWVPhRPB9K0+mswFl6KXDGUxlKB2dU6uCMJ/THYMIlD4EpcEizJTokqgpmic6YfImDK8QZbY++kaqIg9yTYJf9Efz0bdIruugKYhX4lgEFDmfOs8JHn6XJD+M617ZEZ0cZ+v3WbEpGSq4lGjiSOoRMsohoBNsuMDknQxNcYZ/4yFElTkXyoDVmTZYCZ03MK6qDAtOSEuB1cEDSD8QSfUtWaxWwRGeZqYMznv6idPAbOLhiUgQ0R2O52SNEZ+JUOLgzvhnXaNBBN6nAmVMJTxSrwCFjNLlHeB08IJt0mJ0EKnDohOlZAb/SO9ohCqzANwwcnYC4ySIB0uwmuUDWpuPVivJP7kmPkIq1p02WAmcdcIUI9Nhqm0WTjK8aaOjgrN5NtSGjSgVek62DswSconRwRqAObnrG/ioHz3KJdodkzp3l7zaqMz56bJEGqaL5Ql20Aq8ZUODQgqTUhUteYTp4wBghvJNAKmZFCSRHiA4OFSIJFS6pg5fPX17x6QoViDiKOPhTk4rwp8CELYB9l2NLgYFoBKrAhK2mJtASvVOEzsuJOBWdLt2LDqaM3eEVOCPwY/9WZba9bVRnkpDvg1snhMvv0CvI6lqjotTNYlPgLtXAugoMyBo1ozo4I5A2apbojNfW75gs0aEInTBL9D52P/a/1an41SfpXonbl3UrEpPcc3qEzM7gigBJ7pHfXi3rKvAtuwoMsu1tGqTJ5zyjrSiwAmeWBzwhqCV6TdfhZzC54Za6pASSXqAiSVBWboAr9kj3MwoHddEKnMuvwHdclWRrwTfGuYTbSAVW4CsDFWPQ6QsV8hxsic79rYN1sA6mIz96jlN87t+aSRt5grBEDxhQ4LCMksyeubKCbLoGxZN9VszKdXCYgJ1d6rQ0Dh7ZXhKHXfRaohLnKPAtsRXlkq5B8ZbokIGKZ8TwVpswIjDBLjetmBnQkv71s2gqOhGNYBX4sv4pNiWQijnMbjC7pvHp4J0dsAJnDHzV68Jsy/9RxJUEa4m2REe5eHiTFUX1JIg6hJyps5C6nnfp/Sr2XjKLflK76LKKTdLGRoEjaWpACtw0USOjyhopx6sosAI/zC9L9Joiv/AfpE3FKJW8Lpw2SJ1fNjy0y0GAikaIEqjAB4m73EaBM7Lxt0nZsv0oBc44VuABT6RzJ9jZqJImK2kaFfiXCvwHOwH0vJTNZuYAAAAASUVORK5CYII='/>");
            }
        }

        /**
         * 判断字符串是否不符合规范
         */
        WewinPrintService.prototype.isWrong = function (arr) {
            if (typeof arr == "object") {
                for (var i = 0, j = arr.length; i < j; i++) {
                    var str = arr[i];
                    if (str == undefined || str == null || str == "") {
                        arr[i] = "";
                    }
                }
                return arr;
            } else {
                if (arr == undefined || arr == null || arr == "") {
                    return "";
                }
                return arr;
            }
        }

        /**
         * 判断打印数据是否符合规范
         * @param {Object} obj 打印数据对应数量关系
         * @param {Number} type 是否弹窗(0:不弹窗 1:弹窗)
         */
        WewinPrintService.prototype.SetRightData = function (obj) {
            if (this.xmlWrong == 0) {
                var data = obj.data;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].elem.length < data[i].num) {
                        if (obj.on) {
                            var html = "xml或json节点数有误\n\n正确节点数：\n";
                            html += "----------------\n";
                            for (var j = 0; j < obj.name.length; j++) {
                                html += obj.name[j] + ": " + data[j].num + "个\n";
                            }
                            html += "----------------";
                            alert(html);
                            console.log(html);
                        } else {
                            console.log("xml或json节点数有误");
                        }
                        this.xmlWrong = 1;
                        break;
                    }
                }
            }
        }

        /**
         * 打开浏览器模态框预览(IE：modal, 非IE：open)
         */
        WewinPrintService.prototype.OpenModalDialog = function (dialogData) {
            var openUrl = dialogData.path;
            var sendData = [];
            sendData.push(dialogData.data);
            if (dialogData.obj == undefined || dialogData.obj == null) {
                dialogData.obj = {};
            }
            sendData.push(dialogData.obj);
            if (this.PrintCallBack == undefined || this.PrintCallBack == null) {
                sendData.push(this.PrintCallBack);
            } else {
                sendData.push(escape(this.PrintCallBack));
            }
            if (this.isIE()) {
                var targetWindowStyle = "dialogHeight: " + dialogData.height + "px; dialogWidth: " + dialogData.width + "px; center: Yes; help: No; resizable: yes; status: yes; scroll:yes;";
                showModalDialog(openUrl, sendData, targetWindowStyle);
            } else {
                var iTop = (window.screen.availHeight - 30 - dialogData.height) / 2;
                var iLeft = (window.screen.availWidth - 10 - dialogData.width) / 2;
                openUrl = openUrl + "?data=" + escape(JSON.stringify(sendData));
                var targetWindowStyle = "height=" + dialogData.height + ", width=" + dialogData.width + ",top=" + iTop + ",left=" + iLeft + ", toolbar=no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no";
                window.open(openUrl, "预览", targetWindowStyle);
            }
        }

        /**
         * 动态加载js模块(兼容所有主流浏览器)
         * @param {String} str - 需要加载的js路径
         * @param {Function} func - 回调函数
         */
        WewinPrintService.prototype.LoadScript = function (src, func) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = src;
            if (this.getIeVersion() <= this.DEFAULT_VERSION) {
                if (typeof func === "function") {
                    script.onreadystatechange = function () {
                        var r = script.readyState;
                        if (r === 'loaded' || r === 'complete') {
                            script.onreadystatechange = null;
                            func();
                        }
                    };
                }
                document.write(script.outerHTML);
            } else {
                try {
                    script.appendChild(document.createTextNode("//code"));
                } catch (ex) {
                    script.text = "//code";
                }
                document.body.appendChild(script);
                script.onload = function () { func() };
            }
        }

        /**
         * 追加元素
         */
        WewinPrintService.prototype.AppendPreviewDiv = function (childText) {
            var appendDiv = document.createElement("div");
            appendDiv.innerHTML = childText;
            $("#previewtag")[0].appendChild(appendDiv);
        }

        //-----------------------------调用打印--------------------------------
        //test.html页面传递json
        WewinPrintService.prototype.LabelPrint = function (data, obj, printCallBack, modalDialog) {
            if (data == undefined || data == null || data == "") {
                alert("数据不能为空")
                return;
            }
            try {
                var _this = this;
                _this.PrintCallBack = printCallBack ? printCallBack : null;
                _this.StartPrint(obj, function (noView, modal) {
                    data = _this.ChangeDataToCDATA(data);
                    if (modal) {
                        //打开模态框
                        _this.OpenModalDialog({
                            data: data,
                            obj: obj,
                            path: './PS_LabelPrint.html',
                            height: window.screen.height - 200,
                            width: 1000
                        });
                    } else {
                        if (noView != undefined) {
                            //无预览打印
                            _this.NoViewLabelPrint(data, noView.trim());
                        } else {
                            //有预览打印
                            // _this.LabelPrint(data);
                            _this.data = data;
                            _this.PageLoad();
                        }
                    }
                }, modalDialog);
            } catch (error) {
                alert("error: " + error);
                console.log("error: " + error);
            }
        }

        /**
         * 将原始数据转换为CDATA格式
         */
        WewinPrintService.prototype.ChangeDataToCDATA = function (data) {
            if (this.isToCDATA) {
                var expx = null;
                var arr = this.CDATA_Arr;
                if (typeof (data) == "string" && data.indexOf("<![CDATA[") == -1) {
                    for (var i = 0; i < arr.length; i++) {
                        expx = new RegExp("<" + arr[i] + ">", "g");
                        data = data.replace(expx, "<" + arr[i] + "><![CDATA[");
                        expx = new RegExp("<\/" + arr[i] + ">", "g");
                        data = data.replace(expx, "]]></" + arr[i] + ">");
                    }
                }
            }
            return data;
        }

        //加载预览页面
        WewinPrintService.prototype.PageLoad = function () {
            var _this = this;
            _this.Load();
            setTimeout(function () {
                _this.ViewPrint(_this.PageViewPrint, "load");
            }, 100);
        }

        //标签尺寸下拉框变化时，刷新预览界面
        WewinPrintService.prototype.changetype = function () {
            this.ViewPrint(this.PageViewPrint, "change");
        }

        //在预览中点击打印按钮时打印标签
        WewinPrintService.prototype.PagePrint = function () {
            var _this = this;
            _this.GetPrinter(function () {
                _this.DoLabelPrint(_this.PageDoLabelPrint);
            });
        }

        //直接点击打印按钮时打印标签
        WewinPrintService.prototype.NoViewLabelPrint = function (data, printer) {
            var _this = this;
            _this.SetPrinter(data, printer, function () {
                _this.DoLabelPrint(_this.PageDoLabelPrint);
            });
        }

        //显示更多标签
        WewinPrintService.prototype.LoadMore = function () {
            this.ViewPrint(this.PageViewPrint, "more");
        }

        //获取预览数据
        WewinPrintService.prototype.GetPreviewData = function (data) {
            var xmldoc, PrintElements;

            if (typeof (data) == "string") {
                xmldoc = this.loadXML(data);
                PrintElements = xmldoc.getElementsByTagName(this.xmlDataTagName);
                data = PrintElements;
            }

            return data;
        }

        /**
         * 解析打印节点
         * @param {Number} i - 标签索引
         * @param {String} typeName - 标签节点名称
         * @returns {Array} - 解析后的打印数据
         */
        WewinPrintService.prototype.ParseElement = function (i, typeName) {
            var item;
            var _this = this;
            var data = _this.GetPreviewData(_this.data);
            if (typeof (_this.data) == "string") {
                var LabelTypeElement = data[i].getElementsByTagName(typeName);
                item = _this.parseXmlElement(LabelTypeElement);
            } else if (typeof (_this.data) == "object") {
                item = _this.parseJsonElement(data[i][typeName]);
            }
            return item;
        }

        /**
         * 获取xml节点的属性值
         * @param {Number} i 标签索引
         * @param {String} attrName 属性名称
         * @param {String} typeName 节点名称
         * @param {Number} ei 节点索引
         */
        WewinPrintService.prototype.GetXmlElementName = function (i, attrName, typeName, ei) {
            var data = this.GetPreviewData(this.data);
            if (data[i].getElementsByTagName) {
                var ele = data[i].getElementsByTagName(typeName);
                var xmlAttrName = ele[ei] ? ele[ei].getAttribute(attrName) : "";
                return xmlAttrName;
            } else {
                return "";
            }
        }

        WewinPrintService.prototype.FitTagAreaHeight = function () {
            var fixtopHeight = $(".wewin-fixtop").height() + 5;
            $(".wewin-tags").css({ "height": "calc(100% - " + fixtopHeight + "px)" });
        }

        /**
         * 开始构建预览界面
         * @param {Object} infoData - 设置预览信息
         * {
         *  {String} title - 预览页面标题
         *  {String} version - 修改版本号
         * }
         * @param {Function} previewFunc - 预览标签构建方法
         * @param {Function} qrcodeFunc - 预览生成动态二维码方法
         */
        WewinPrintService.prototype.StartPreviewTag = function (infoData, previewFunc, qrcodeFunc) {
            var _this = this;

            //设置预览信息
            _this.SetViewInfo(infoData);

            _this.noTag = true;
            var data = _this.GetPreviewData(_this.data);
            _this.tagTemp = _this.startIndex;
            setTimeout(function () {
                for (var i = _this.startIndex; i < _this.dataLen; i++) {
                    (function (i) {
                        if (data[i] == undefined) {
                            return true;
                        }
                        var previewTime = setTimeout(function () {
                            clearTimeout(previewTime);
                            _this.previewHtml = "";
                            previewFunc(i);
                            _this.previewHtml += "<\/div>";
                            _this.AppendPreviewDiv(_this.previewHtml);
                            _this.tagTemp++;

                            _this.FitTagAreaHeight();

                            if ((_this.temp == "load" || _this.temp == "change") && _this.checkboxAll) {
                                var cb = document.getElementById("cb" + i);
                                if (cb) {
                                    cb.checked = true;
                                }
                                if (i != 0) {
                                    document.getElementById("allcb").checked = true;
                                }
                            }

                        }, 10);
                    })(i);
                }

                if ((_this.temp == "load" || _this.temp == "change") && _this.checkboxAll) {
                    $("#printtype2").html("打印张数: <span style='font-weight:bold;color:red'>" + _this.GetPreviewData(_this.data).length + "张</span>");
                    _this.checkAll = true;
                }

            }, 0);
            var qrcodeInterval = setInterval(function () {
                if (_this.tagTemp == _this.dataLen) {
                    clearInterval(qrcodeInterval);
                    var labelname = $("#labelname")[0];
                    if (_this.noTag) {
                        if (_this.temp == "load") {
                            labelname.innerHTML = "";
                            labelname.options.add(new Option("无该类型的标签模板", "-1"));
                        }
                    } else {
                        if (qrcodeFunc != undefined && qrcodeFunc != null) {
                            //动态二维码
                            for (var i = _this.startIndex; i < _this.dataLen; i++) {
                                (function (i) {
                                    var qrcodeTime = setTimeout(function () {
                                        clearTimeout(qrcodeTime);
                                        qrcodeFunc(i);
                                    }, 10);
                                })(i);
                            }
                        }
                        var data = _this.GetPreviewData(_this.data);
                        if ($(".previewTags").length == data.length) {
                            $("#loadmore").css("display", "none");
                        }
                    }
                }
            }, 200);
        }

        /**
         * 添加下拉框标签型号
         * @param {Object} obj - 下拉框名称及对应值
         * @returns {Number} - 获取下拉框的选中值
         */
        WewinPrintService.prototype.SetLabelName = function (obj) {
            var _this = this;
            _this.noTag = false;
            var labelValue = "";
            var labelname = $("#labelname")[0];
            if (_this.temp == "load") {
                labelname.innerHTML = "";
                if (_this.getItem("labelValue") != null) {
                    labelValue = _this.getItem("labelValue");
                    for (var i in obj) {
                        if (labelValue == obj[i]) {
                            labelname.options.add(new Option(i, obj[i]));
                        } else {
                            continue;
                        }
                    }
                }
                for (var i in obj) {
                    if (labelValue == obj[i]) {
                        continue;
                    } else {
                        labelname.options.add(new Option(i, obj[i]));
                    }
                }
            }
        }

        /**
         * 开始调用标签打印函数
         * @param {Function} startPrintFunc - 调用标签打印
         */
        WewinPrintService.prototype.StartPrintTag = function (startPrintFunc) {
            var _this = this;
            var data = _this.GetPreviewData(_this.data);

            _this.labelsArr = [];
            _this.resultArr = [];
            _this.labelWidth = 0; //全局标签宽度
            _this.labelHeight = 0; //全局标签高度

            var printArr = [];
            if (_this.noview == "1") {
                for (var i = 0; i < data.length; i++) {
                    printArr.push(i);
                }
            } else {
                if (data.length == 1) {
                    printArr.push(0);
                } else {
                    if (document.getElementById("allcb") && document.getElementById("allcb").checked) {
                        for (var i = 0; i < data.length; i++) {
                            printArr.push(i);
                        }
                    } else {
                        if (this.checkAll) {
                            for (var i = 0; i < data.length; i++) {
                                printArr.push(i);
                                if (document.getElementById("cb" + i) && document.getElementById("cb" + i).checked == false) {
                                    printArr.pop(i);
                                }
                            }
                        } else {
                            for (var i = 0; i < data.length; i++) {
                                if (document.getElementById("cb" + i) && document.getElementById("cb" + i).checked) {
                                    printArr.push(i);
                                }
                            }
                        }
                    }
                }
            }
            for (var i = 0; i < printArr.length; i++) {
                startPrintFunc(printArr[i]);
            }

            var data = {
                "handleType": "1",
                "printer": "",
                "hasDrive": "",
                "copyNum": "1",
                "labels": _this.labelsArr,
            }

            _this.printTempData = JSON.parse(JSON.stringify(data)).labels;
            if (_this.debug) {
                _this.DebugPrint(_this.labelsArr);
            } else {
                _this.Print(_this.labelsArr);
            }
        }

        WewinPrintService.prototype.SetPrintFunc = function (i, printFunc, printArr) {
            var _this = this;
            var data = _this.GetPreviewData(_this.data);
            if (data.length == 1) {
                printFunc.apply(null, printArr);
            } else {
                if (_this.noview == "1") {
                    printFunc.apply(null, printArr);
                } else {
                    if (_this.checkAll) {
                        printFunc.apply(null, printArr);
                    } else {
                        if (document.getElementById("cb" + i)) {
                            if (document.getElementById("cb" + i).checked) {
                                printFunc.apply(null, printArr);
                            }
                        }
                    }
                }
            }
        }

        WewinPrintService.prototype.GetLabelName = function () {
            var selValue = 0;
            if (this.noview == "1") {
                selValue = 0;
            } else {
                var labelname = $("#labelname")[0];
                selValue = labelname.value;
                this.setItem("labelValue", selValue);
            }
            return selValue;
        }

        WewinPrintService.prototype.StartTag = function (obj) {
            var dots = this.GetDots();
            this.resultArr = [];
            this.rfid = "";
            this.labelRotate = obj.rotate;
            if (obj.rotate == 0 || obj.rotate == 2) {
                if (this.tagUnit == "mm") {
                    this.labelWidth = obj.labelWidth * dots;
                    this.labelHeight = obj.labelHeight * dots;
                } else if (this.tagUnit == "px") {
                    this.labelWidth = obj.labelWidth / 8 * dots;
                    this.labelHeight = obj.labelHeight / 8 * dots;
                }
            }
            if (obj.rotate == 1 || obj.rotate == 3) {
                if (this.tagUnit == "mm") {
                    this.labelWidth = obj.labelHeight * dots;
                    this.labelHeight = obj.labelWidth * dots;
                } else if (this.tagUnit == "px") {
                    this.labelWidth = obj.labelHeight / 8 * dots;
                    this.labelHeight = obj.labelWidth / 8 * dots;
                }
            }
            var rfidType = obj.rfidType;
            var rfidWay = obj.rfidWay;
            var rfidData = obj.rfidData;
            var rfidResult = {
                "EPC": "01",
                "USER": "03"
            }
            if (rfidData != "") {
                this.rfid = rfidResult[rfidType] + rfidWay + rfidData;
            }
        }

        WewinPrintService.prototype.EndTag = function () {
            var obj = {
                "labelWidth": this.labelWidth,
                "labelHeight": this.labelHeight,
                "rfid": this.rfid,
                "ddfLength": "0",
                "blocks": this.resultArr
            }
            this.labelsArr.push(obj);
        }

        WewinPrintService.prototype.GoCallBackInfo = function (info) {
            if (this.PrintCallBack != null && this.PrintCallBack != undefined) {
                this.PrintCallBack(this.FormatCallBackInfo(info));
            }
        }

        WewinPrintService.prototype.FormatCallBackInfo = function (info) {
            var errCode = info.errCode;
            var backInfo = {};
            var parr = this.printername.split("&&");
            let printerName = parr[0];
            let USBID = parr[3];
            if (USBID != undefined && USBID != "" && USBID != "undefined") {
                if (USBID.toLowerCase().indexOf("p51x") > -1) {
                    backInfo.model = "P52";
                } else {
                    backInfo.model = USBID.substr(0, 3);
                }
                backInfo.sn = USBID;
            } else {
                backInfo.model = printerName.split(" ")[1];
                backInfo.sn = "";
            }
            backInfo.brand = "MakeID";

            switch (errCode) {
                case "PRINTER_BASE64":
                    backInfo.errCode = 0;
                    backInfo.errMsg = "Preview success";
                    break;
                case "PRINTER_ERROR_SUCCESS":
                    backInfo.errCode = 1;
                    backInfo.errMsg = "Print success";
                    break;
                case "PRINTER_ERROR_UNEXIST":
                    backInfo.errCode = 2;
                    backInfo.errMsg = "打印失败-标签不存在";
                    break;
                case "PRINTER_ERROR_NO_JSON":
                    backInfo.errCode = 3;
                    backInfo.errMsg = "打印失败-无打印数据";
                    break;
                case "PRINTER_ERROR_JSON_WRONG":
                    backInfo.errCode = 4;
                    backInfo.errMsg = "打印失败-打印数据错误";
                    break;
                case "PRINTER_ERROR_HASDRIVE_LOST":
                    backInfo.errCode = 5;
                    backInfo.errMsg = "打印失败-打印数据HASDRIVE丢失";
                    break;
                case "PRINTER_ERROR_PRINTER_LOST":
                    backInfo.errCode = 6;
                    backInfo.errMsg = "打印失败-打印数据PRINTER丢失";
                    break;
                case "PRINTER_ERROR_COPYNUM_LOST":
                    backInfo.errCode = 7;
                    backInfo.errMsg = "打印失败-打印数据COPYNUM丢失";
                    break;
                case "PRINTER_ERROR_HANDLETYPE_LOST":
                    backInfo.errCode = 8;
                    backInfo.errMsg = "打印失败打印数据HANDLETYPE丢失";
                    break;
                case "PRINTER_ERROR_COPYNUM_INVAID":
                    backInfo.errCode = 9;
                    backInfo.errMsg = "打印失败-打印数据COPYNUM为空";
                    break;
                case "PRINTER_ERROR_OPEN_PORT_FAIL":
                    backInfo.errCode = 10;
                    backInfo.errMsg = "打印失败-初始化打印机失败";
                    break;
                case "PRINTER_ERROR_LABELS_LOST":
                    backInfo.errCode = 11;
                    backInfo.errMsg = "打印失败-打印数据LABELS丢失";
                    break;
                case "PRINTER_ERROR_WAIT_FOR_JSON":
                    backInfo.errCode = 12;
                    backInfo.errMsg = "打印失败-等待打印数据超时";
                    break;
                case "PRINTER_ERROR_LABELS_IS_0":
                    backInfo.errCode = 13;
                    backInfo.errMsg = "打印失败-打印数据LABELS为空";
                    break;
                case "PRINTER_ERROR_labelWidth_LOST":
                    backInfo.errCode = 14;
                    backInfo.errMsg = "打印失败-打印数据labelWidth丢失";
                    break;
                case "PRINTER_ERROR_labelHeight_LOST":
                    backInfo.errCode = 15;
                    backInfo.errMsg = "打印失败-打印数据labelHeight丢失";
                    break;
                case "PRINTER_ERROR_RFID":
                    backInfo.errCode = 16;
                    backInfo.errMsg = "打印失败-初始化RFID错误";
                    break;
                case "SERVICE_NOT_START":
                    backInfo.errCode = 17;
                    backInfo.errMsg = "Print failed - Please install the print plugin or start the service";
                    break;
            }
            return backInfo;
        }

        //-------------------------------添加预览------------------------------
        /**
         * 预览背景图片
         * @param {Object} obj 绘制预览文本参数
         * {
         *      {Number} index      - 标签索引
         *      {String} imgName    - 图片名称
         *      {Number} width      - 图片宽度(px)
         *      {Number} height     - 图片高度(px)
         *      {Object} scale      - 图片过大，调整缩放(仅限非IE浏览器)
         *      {
         *          {Number} tagScale       - 标签缩放比例(非IE浏览器)
         *          {Number} checkScale     - 复选框缩放比例(非IE浏览器)
         *          {Number} tagOffset      - 标签左侧偏移值
         *          {Number} firstTagTop    - 第一张标签向上偏移值
         *          {Number} otherTagTop    - 其他标签向上偏移值
         *          {Number} ratio          - 缩小比例(全浏览器)
         *      }
         * }
         */
        WewinPrintService.prototype.AddPreviewBackground = function (obj) {
            this.scaleRatio = 1;

            var data = this.GetPreviewData(this.data);
            var text = "";

            if (this.tagUnit == "mm") {
                obj.width = obj.width * 8;
                obj.height = obj.height * 8;
                obj.scale.tagOffset = obj.scale.tagOffset * 8;
                obj.scale.firstTagTop = obj.scale.firstTagTop * 8;
                obj.scale.otherTagTop = obj.scale.otherTagTop * 8;
            }

            var scale = obj.scale ? obj.scale : {};
            var i = obj.index;
            var imgName = obj.imgName;
            if (scale.on) {
                this.scaleRatio = scale.ratio ? scale.ratio : 1;
                var width = obj.width / this.scaleRatio;
                var height = obj.height / this.scaleRatio;
            } else {
                var width = obj.width;
                var height = obj.height;
            }

            if (i == 0 && data.length > 1) {
                text += "<div style=\"width:60px;height:17px;overflow:hidden;margin: 0 auto;margin-bottom:10px\"><div style=\"height:17px;float:left;line-height:17px;font-size:15px;\">全选</div><input onclick=\"wps.chooseAllCheckbox()\" id=\"allcb\" type=\"checkbox\" style=\"width:17px;height:17px;margin:0;padding:0;float:right\"><\/div>";
            }

            if (scale != undefined && scale != null && scale.on) {
                if (i == 0) {
                    text += "<div class=\"previewTags\" style=\"text-align: left;position: relative;font-family:'" + this.fontname + "';width: " + width + "px;height: " + height + "px;display:block;margin:0 auto;padding:0;transform: scale(" + scale.tagScale + ");-webkit-transform: scale(" + scale.tagScale + ");margin-left:" + scale.tagOffset + "px;margin-top:" + scale.firstTagTop + "px\">";
                } else {
                    text += "<div class=\"previewTags\" style=\"text-align: left;position: relative;font-family:'" + this.fontname + "';width: " + width + "px;height: " + height + "px;display:block;margin:0 auto;padding:0;margin-top: 15px;transform: scale(" + scale.tagScale + ");-webkit-transform: scale(" + scale.tagScale + ");margin-left:" + scale.tagOffset + "px;margin-top:" + scale.otherTagTop + "px\">";
                }

                if (data.length > 1) {
                    if (i == 0 || this.checkAll) {
                        text += "<input onclick=\"wps.chooseOneCheckbox()\" id=\"cb" + i + "\" type=\"checkbox\" checked=\"checked\" style=\"position: absolute;top:10px;left:-40px;width:17px;height:17px;transform:scale(" + scale.checkScale + ");-webkit-transform: scale(" + scale.checkScale + ");\">";
                    } else {
                        text += "<input onclick=\"wps.chooseOneCheckbox()\" id=\"cb" + i + "\" type=\"checkbox\" style=\"position: absolute;top:10px;left:-40px;width:17px;height:17px;transform:scale(" + scale.checkScale + ");-webkit-transform: scale(" + scale.checkScale + ");\">";
                    }
                }

                if (!imgName) {
                    text += "<div style=\"width:" + width + "px;height:" + height + "px;background:#fff;\"></div>";
                } else {
                    text += "<img style=\"width:" + width + "px\" src=\"" + this.imgPath + "\/" + imgName + "\">";
                }
            } else {
                if (i == 0) {
                    text += "<div class=\"previewTags\" style=\"text-align: left;position: relative;font-family:'" + this.fontname + "';background-color:#fff;background-image:url(\'" + this.imgPath + "\/" + imgName + "\');background-repeat:no-repeat;width: " + width + "px;height: " + height + "px;display:block;margin:0 auto;padding:0;\">";
                } else {
                    text += "<div class=\"previewTags\" style=\"text-align: left;position: relative;font-family:'" + this.fontname + "';background-color:#fff;background-image:url(\'" + this.imgPath + "\/" + imgName + "\');background-repeat:no-repeat;width: " + width + "px;height: " + height + "px;display:block;margin:0 auto;padding:0;margin-top: 15px\">";
                }

                if (data.length > 1) {
                    if (i == 0 || this.checkAll) {
                        text += "<input onclick=\"wps.chooseOneCheckbox()\" id=\"cb" + i + "\" type=\"checkbox\" checked=\"checked\" style=\"position: absolute;top:10px;left:-30px;width:17px;height:17px;\">";
                    } else {
                        text += "<input onclick=\"wps.chooseOneCheckbox()\" id=\"cb" + i + "\" type=\"checkbox\" style=\"position: absolute;top:10px;left:-30px;width:17px;height:17px;\">";
                    }
                }
            }

            this.previewHtml += text;
        }

        /**
         * 添加预览div头部
         * @param {Object} obj 绘制预览文本参数
         * {
         *      {Array} str         - 文本内容
         *      {Number} fontHeight - 字体大小(px)
         *      {Number} printWidth - 换行宽度(px)
         *      {Number} x          - x坐标(px)
         *      {Number} y          - y坐标(px)
         *      {Number} maxH       - 最大高度(px)
         *      {Number} xoffset    - Text内部行间距(px)
         *      {Number} loffset    - Text外部行间距(px)
         *      {String} horizontal      - 文本对齐方式(wps.horizontal.left:靠左对齐; wps.horizontal.right:靠右对齐; wps.horizontal.center:居中对齐;)
         *      {Number} width      - 文本块宽度(px)
         *      {Boolean} rotate    - 文本180度翻转
         *      {Object} rotateLowIE    - 当旋转开启(rotate:true)时低版本IE浏览器的坐标(覆盖上方xy)
         *      {Object} leftOffset    - 标题下方左侧留白
         *      {Boolean} titleBold    - 标题加粗
         *      {Boolean} debug     - 调试模式：打开文本边框
         * }
         */
        WewinPrintService.prototype.AddPreviewText = function (obj) {
            var _this = this;
            var text = "", horizontal = "left";

            this.leftOffset = "no";
            this.titleBold = "no";
            var leftOffset = obj.leftOffset;
            leftOffset ? this.leftOffset = leftOffset : "";
            var titleBold = obj.titleBold;
            titleBold ? this.titleBold = titleBold : "";
            var singleLine = obj.singleLine;

            switch (obj.horizontal) {
                case 0:
                    horizontal = "left";
                    break;
                case 1:
                    horizontal = "center";
                    break;
                case 2:
                    horizontal = "right";
                    break;
            }

            if (this.tagUnit == "mm") {
                obj.fontHeight = obj.fontHeight * 8;
                obj.printWidth = obj.printWidth * 8;
                obj.x = obj.x * 8;
                obj.y = obj.y * 8;
                obj.maxH = obj.maxH * 8;
                obj.xoffset = obj.xoffset * 8;
                obj.loffset = obj.loffset * 8;
                obj.width = obj.width * 8;
                obj.rotateLowIE.x = obj.rotateLowIE.x * 8;
                obj.rotateLowIE.y = obj.rotateLowIE.y * 8;
            }

            var fontHeight = obj.fontHeight / this.scaleRatio;
            var printWidth = obj.printWidth / this.scaleRatio;

            if (singleLine) {
                var tempFontHeight = obj.fontHeight;
                var tempPrintWidth = obj.printWidth;
                var content = obj.str;
                for (var i = 0; i < content.length; i++) {
                    while (this.getLen(content[i], tempFontHeight) >= tempPrintWidth) {
                        tempFontHeight--;
                    }
                }
                fontHeight = tempFontHeight;
                fontHeight = fontHeight / this.scaleRatio;
            }

            if (this.getIeVersion() <= this.DEFAULT_VERSION && obj.rotate) {
                var x = obj.rotateLowIE.x / this.scaleRatio;
                var y = obj.rotateLowIE.y / this.scaleRatio;
            } else {
                var x = obj.x / this.scaleRatio;
                var y = obj.y / this.scaleRatio;
            }
            var xoffset = obj.xoffset / this.scaleRatio;
            var loffset = obj.loffset / this.scaleRatio;
            var maxH = obj.maxH / this.scaleRatio;
            var width = obj.width / this.scaleRatio;

            //计算预览自适应
            var fh = _this.AutoPrintTextView({
                str: obj.str,
                fontHeight: fontHeight,
                printWidth: printWidth,
                y: y,
                xoffset: xoffset,
                loffset: loffset,
                maxH: maxH / 8
            });
            var lh = parseInt(fh) + 4;
            var numOfRow = 0;
            for (var i = 0; i < obj.str.length; i++) {
                numOfRow += this.autoSplit(fh, obj.str[i], printWidth).length;
            }
            var height = lh * numOfRow + (obj.str.length - 1) * loffset;
            if (obj.vertical == 1) {
                if (this.getIeVersion() >= this.DEFAULT_VERSION && obj.rotate) {
                    y = y - (maxH - height) / 2;
                } else {
                    y = y + (maxH - height) / 2;
                }
            }
            if (obj.vertical == 2) {
                if (this.getIeVersion() >= this.DEFAULT_VERSION && obj.rotate) {
                    y = y - (maxH - height);
                } else {
                    y = y + (maxH - height);
                }
            }
            var rotateClass = obj.rotate ? "wewin-rotate" : "";
            if (obj.reverseColor) {
                // Create a background div that covers the entire maxH area
                text += "	<div class=\"" + rotateClass + "\" style=\"";
                text += " position: absolute;";
                text += " top: " + (y - (obj.vertical == 1 ? (maxH - height) / 2 : (obj.vertical == 2 ? maxH - height : 0))) + "px;";
                text += " left: " + x + "px;";
                text += " width: " + width + "px;";
                text += " height: " + maxH + "px;";
                text += " background-color: #000;"; 
                text += "\"></div>";
            }

            text += "	<div id=\"" + (obj.id ? obj.id : '') + "\" class=\"" + rotateClass + "\" style=\"";
            if (obj.debug) {
                text += " border: 1px solid #000;";
            }
            text += " position: absolute;";
            text += " top: " + y + "px;";
            text += " left: " + x + "px;";
            text += " width: " + width + "px;";
            text += " text-align: " + horizontal + ";";
            text += " line-height: " + lh + "px;";
            text += " font-size: " + fh + "px;";
            if (obj.reverseColor) {
                text += " color: #fff;";
            }
            text += " \">";

            for (var i = 0; i < obj.str.length; i++) {
                var element = obj.str[i];
                if (i != 0) {
                    text += "       <div style=\"margin-top:" + loffset + "px;\">";
                } else {
                    text += "       <div>";
                }
                text += _this.PrintTextView({ str: element, fontHeight: fh, printWidth: printWidth }, 0);
                text += "       <\/div>";
                // text += "	<textarea style=\"resize: none;outline:none;border:1px solid #000;font-size:16px;width:160px;\" type=\"text\">" + _this.PrintTextView({ str: element, fontHeight: fh, printWidth: printWidth }, 0).replace(/<br\/>/g, "") + "</textarea>";
            }

            text += "   <\/div>";

            this.previewHtml += text;
        }

        /**
         * 添加预览二维码
         * @param {Object} obj 绘制预览二维码参数
         * {
         *      {String} qrcodeName - 二维码名称
         *      {Number} x          - x坐标
         *      {Number} y          - y坐标
         * }
         */
        WewinPrintService.prototype.AddPreviewQrcode = function (obj) {

            if (this.tagUnit == "mm") {
                obj.x = obj.x * 8;
                obj.y = obj.y * 8;
                obj.rotateLowIE.x = obj.rotateLowIE.x * 8;
                obj.rotateLowIE.y = obj.rotateLowIE.y * 8;
            }

            if (this.getIeVersion() <= this.DEFAULT_VERSION && obj.rotate) {
                var x = obj.rotateLowIE.x / this.scaleRatio;
                var y = obj.rotateLowIE.y / this.scaleRatio;
            } else {
                var x = obj.x / this.scaleRatio;
                var y = obj.y / this.scaleRatio;
            }
            var text = "";

            var rotateClass = obj.rotate ? "wewin-rotate" : "";
            text += "	<div class=\"" + obj.qrcodeName + " " + rotateClass + "\" style=\"";
            text += "		position: absolute;";
            text += "		top:  " + y + "px;";
            text += "		left:  " + x + "px;";
            text += "		font-size:0px;";
            text += "	\">"
            text += "   <\/div>";

            this.previewHtml += text;
        }

        WewinPrintService.prototype.AddPreviewBarcode = function (obj) {

                if (this.tagUnit == "mm") {
                    obj.x = obj.x * 8;
                    obj.y = obj.y * 8;
                    obj.width = obj.width * 8;
                    obj.height = obj.height * 8;
                    obj.rotateLowIE.x = obj.rotateLowIE.x * 8;
                    obj.rotateLowIE.y = obj.rotateLowIE.y * 8;
                }
    
                if (this.getIeVersion() <= this.DEFAULT_VERSION && obj.rotate) {
                    var x = obj.rotateLowIE.x / this.scaleRatio;
                    var y = obj.rotateLowIE.y / this.scaleRatio;
    
                } else {
                    var x = obj.x / this.scaleRatio;
                    var y = obj.y / this.scaleRatio;
                    var width = obj.width / this.scaleRatio;
                    var height = obj.height / this.scaleRatio;
                }
                var text = "<div style='position: absolute;";
                text += " left:" + x + "px;";
                text += " top:" + y + "px;";
                text += " width:" + width + "px;";
                text += " height:" + height + "px;"; 
                if (obj.debug) {
                    text += " border: 1px solid #000;";
                }
                text += "'>";
                text += "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAAyCAYAAAD1JPH3AAAAAXNSR0IArs4c6QAAAzZJREFUeF7tncFygzAMRMP/f3Q6AZOxVYsnQ46vl046qUOEtN5dCdher9f71f2838fLbdv23+fr8y3n3/v/uXpfXO/8v1+tG48jHnc83vi5q98rvp++X/XzaV2KV3Yc2XnKjmv1vNP5pPhk54+OO1v3k7UmdFfAVKiUePEEm9AjQGYFUAUWAiwTukWyuvOY0LHkj9fZDiJCh3hRoKQcY0JlhVndOaQcLVKUeLT1VhEyC/gqcq5yt7uFQ9+7uq4ceq7tYnylHFKOgTKI0CL0HgFyDUgM0Q4jQovQl4km5Ths2YxbUwHF+D2lnLoczS+vclBCyCqHJyStiq943LQuJZg+9BFBObQcWg49Q5enW04VIXU5GhK1Ti7tCBk1IM5PO4KUIzkBVe6UbclSjiMCUg4px1AL1R2CuC4hZjZLQusSYprQJrQJ3UXg7lBaJrZp5uLukBitqyhUFCoKFYX/x2tJZGVIVtUAUg4bK4cvCWJ0VZQS15VDjy6M03YBssgOrCIcIaSi8N6FHXLoFgHaQquBMqG17focUBQqChWFikJFYcwBooa/0jLadorCIfdIpDkPDZyYArjqMjjLMboI5KpkSEo2Y1XjVLWOCF0sFEWholBROBEB2nbadlNuttp4kHKM1ZWJHqIADic1KuaNZuactNqIIY1Q5Y4EBCa0re89R6oJJeWQckg5LgbrCblnXn5fgKvjnFIOKceQUyK0CC1Ci9DfHLBTGG5DUEVIGys2Vj4RyCiWw0kNY6oFRW4Ede68pnBsBGWNMepwmtBJ53HVBzeh53JWyiHlmGaGjZXxFmXZjidCi9B7BMhOdNouSRSaW6XOV9apUxQqChWF3eZ+934QmXipIl5WoNV1CQBsrNhYsbEyKXQph5RjjwANzIvQ8/tRa9slz09ctdNWA1mlBvrQI8cnSrZ6Hkib2VhpEbWx4izHUFxPjfVqQuly6HLocuhyfCNAFEBRqChUFPok2fxRulEkEJW5K9ZWxcjdz6leMUOiVh/aS7AukdOE9rFu0wTJ/FWyVwhxquveRU4T2oQ2obsqqBaslGOkCtRgIreL4q4PrQ+9R2D1otxVrVMt7KcJ/QehVkLTUUzCUwAAAABJRU5ErkJggg=='";
                text += " style='position: absolute;";
                text += " left:" + 0 + "px;";
                text += " top:" + 0 + "px;";
                text += " width:" + width + "px;";
                text += " height:" + height + "px;";
                text += "'/>";
                text += "</div>";
    
                this.previewHtml += text;
        }

        WewinPrintService.prototype.AddPreviewHLine = function(obj) {

            if (this.tagUnit == "mm") {
                obj.x = obj.x * 8;
                obj.y = obj.y * 8;
                obj.rotateLowIE.x = obj.rotateLowIE.x * 8;
                obj.rotateLowIE.y = obj.rotateLowIE.y * 8;
                obj.ex = obj.ex * 8;
                obj.thickness = obj.thickness * 8;
            }

            if (this.getIeVersion() <= this.DEFAULT_VERSION && obj.rotate) {
                var x = obj.rotateLowIE.x / this.scaleRatio;
                var y = obj.rotateLowIE.y / this.scaleRatio;
                var ex = obj.rotateLowIE.ex / this.scaleRatio;
                 
            } else {
                var x = obj.x / this.scaleRatio;
                var y = obj.y / this.scaleRatio;
                var ex = obj.ex / this.scaleRatio;
                var thickness = obj.thickness / this.scaleRatio;
            }

            var width = ex - x;
            var text = "";

            text += "<div style=\"position: absolute; background-color: black;"
            text += "height: " + thickness + "px;"  
            text += "top:" + y +"px; "
            text += "left:" + x +"px; "
            text += "width:" + width + "px;"
            text += "\">"
            text += "</div>";

            this.previewHtml += text;
        }

        WewinPrintService.prototype.AddPreviewVLine = function(obj) {

            if (this.tagUnit == "mm") {
                obj.x = obj.x * 8;
                obj.y = obj.y * 8;
                obj.rotateLowIE.x = obj.rotateLowIE.x * 8;
                obj.rotateLowIE.y = obj.rotateLowIE.y * 8;
                obj.ey = obj.ey * 8;
                obj.thickness = obj.thickness * 8;
            }

            if (this.getIeVersion() <= this.DEFAULT_VERSION && obj.rotate) {
                var x = obj.rotateLowIE.x / this.scaleRatio;
                var y = obj.rotateLowIE.y / this.scaleRatio;
                var ex = obj.rotateLowIE.ex / this.scaleRatio;
                var ey = obj.rotateLowIE.ey / this.scaleRatio;
                 
            } else {
                var x = obj.x / this.scaleRatio;
                var y = obj.y / this.scaleRatio;
                var ey = obj.ey / this.scaleRatio;
                var thickness = obj.thickness / this.scaleRatio;
            }

            var height = ey - y;
            var text = "";

            text += "<div style=\"position: absolute; background-color: black;"
            text += "width: " + thickness + "px;"  
            text += "top:" + y +"px; "
            text += "left:" + x +"px; "
            text += "height:" + height + "px;"
            text += "\">"
            text += "</div>";

            this.previewHtml += text;
        }


        WewinPrintService.prototype.AddPreviewLogo = function(obj) {

            if (this.tagUnit == "mm") {
                obj.x = obj.x * 8;
                obj.y = obj.y * 8;
                obj.width = obj.width * 8;
                obj.height = obj.height * 8;
                obj.rotateLowIE.x = obj.rotateLowIE.x * 8;
                obj.rotateLowIE.y = obj.rotateLowIE.y * 8;
            }

            if (this.getIeVersion() <= this.DEFAULT_VERSION && obj.rotate) {
                var x = obj.rotateLowIE.x / this.scaleRatio;
                var y = obj.rotateLowIE.y / this.scaleRatio;

            } else {
                var x = obj.x / this.scaleRatio;
                var y = obj.y / this.scaleRatio;
                var width = obj.width / this.scaleRatio;
                var height = obj.height / this.scaleRatio;
            }

            
            var text = "";
            text += "<div style=\"";
            text += "position: absolute;";
            text += "top: " + y + "px;";
            text += "left: " + x + "px;";
            text += "width:" + width + "px;";
            text += "height:" + height + "px;";
            text += "z-index: 9999;";
            text += "\">";
            text += "<img style=\"width:" + width + "px;height:" + height + "px;display:block;\" src='" + obj.path + "' \/>";
            text += "<\/div>";

            this.previewHtml += text;
        }

        //-------------------------------打印方法------------------------------
        /**
         * 打印预览
         * @param {String} str - 需要打印的字符串
         * @param {Number} fontHeight - 字体高度
         * @param {Number} printWidth - 换行宽度
         * @param {Number} type - 分隔符选择
         * @return {Array}
         */
        WewinPrintService.prototype.PrintTextView = function (obj, type) {
            var str = obj.str;
            str = this.isWrong(str);
            var fontHeight = obj.fontHeight;
            var printWidth = obj.printWidth;
            var backstr = [];
            var strLen = 0;
            var temp = 0;
            var strs = str.split("");
            var tLen = 0;
            var strTemp = this.getRightSign(str).strTemp;
            var lenTemp = this.getLen(strTemp, fontHeight);
            var leftLen = 0;
            for (var i = 0; i < strs.length; i++) {
                var pTemp;
                if (this.leftOffset != undefined && this.leftOffset != null && this.leftOffset != "no") {
                    if (this.leftOffset.auto) {
                        if (backstr.length == 0) {
                            pTemp = printWidth;
                        } else {
                            pTemp = printWidth - lenTemp;
                            leftLen = lenTemp;
                        }
                    } else {
                        if (this.leftOffset.offsetLen) {
                            if (backstr.length == 0) {
                                pTemp = printWidth;
                            } else {
                                pTemp = printWidth - this.leftOffset.offsetLen * fontHeight;
                                leftLen = this.leftOffset.offsetLen * fontHeight;
                            }
                        } else {
                            pTemp = printWidth;
                        }
                    }
                } else {
                    pTemp = printWidth;
                }
                if (this.titleBold != undefined && this.titleBold != null && this.titleBold != "no") {
                    if (backstr.length == 1 && backstr[0].indexOf("font-weight:bold") == -1 && (backstr[0].indexOf(":") != -1 || backstr[0].indexOf("：") != -1)) {
                        var sign = this.getRightSign(backstr[0]).rightSign;
                        var one = backstr[0].slice(0, backstr[0].indexOf(sign)) + sign;
                        var two = backstr[0].slice(backstr[0].indexOf(sign) + 1);
                        one = "<span style='font-weight:bold'>" + one + "</span>";
                        backstr[0] = one + two;
                    }
                }
                tLen = this.getLen(strs[i], fontHeight);
                strLen += tLen;
                if ((strLen - pTemp) > 0) {
                    if (leftLen == 0) {
                        backstr.push(str.substring(temp, i));
                    } else {
                        backstr.push("<span style='margin-left:" + leftLen + "px;'>" + str.substring(temp, i) + "</span>");
                    }
                    temp = i;
                    strLen = 0;
                    i--;
                    tArr = [];
                    letter = [];
                }
                if (i == str.length - 1) {
                    if (leftLen == 0) {
                        backstr.push(str.substring(temp, i + 1));
                    } else {
                        backstr.push("<span style='margin-left:" + leftLen + "px;'>" + str.substring(temp, i + 1) + "</span>");
                    }
                }
            }
            if (type == 1) {
                backstr = backstr.join("\n");
            } else if (type == 0) {
                backstr = backstr.join("<br/>");
            }
            backstr = backstr.replace(/  /g, "&nbsp;");
            return backstr;
        }

        /**
         * 打印预览自适应
         * @param {Array} str - 需要打印的字符串数组
         * @param {Number} fontHeight - 字体高度
         * @param {Number} printWidth - 换行宽度
         * @param {Number} y - y坐标
         * @param {Number} rotate - 旋转
         * @param {Number} xoffset - Text内部行间距
         * @param {Number} loffset - Text外部行间距
         * @param {Number} maxH - 换行间距
         * @return {Number} - 返回字体高度
         */
        WewinPrintService.prototype.AutoPrintTextView = function (obj) {
            var str = obj.str;
            str = this.isWrong(str);
            var fontHeight = obj.fontHeight;
            var printWidth = obj.printWidth;
            var y = obj.y;
            var xoffset = obj.xoffset;
            var loffset = obj.loffset;
            var backstr = [];
            var flag = true;

            var maxY = y + obj.maxH * 8;
            var newY = y;

            flag = true;
            newY = y;

            while (flag) {
                for (var i = 0; i < str.length; i++) {
                    backstr = this.autoSplit(fontHeight, str[i], printWidth);
                    for (var j = 0; j < backstr.length; j++) {
                        newY += fontHeight + xoffset;
                    }
                    newY += loffset;
                }
                if (newY > maxY) {
                    newY = y;
                    fontHeight--;
                } else {
                    flag = false;
                }
            }
            return fontHeight;
        }

        /**
         * 文本打印函数
         * @param {Array} str - 需要打印的字符串数组
         * @param {Number} fontHeight - 字体高度
         * @param {Number} fontWeight - 字体黑度
         * @param {Number} printWidth - 换行宽度
         * @param {Number} x - x坐标
         * @param {Number} y - y坐标
         * @param {Number} rotate - 旋转
         * @param {Number} xoffset - Text内部行间距
         * @param {Number} loffset - Text外部行间距
         * @param {Number} maxH - 换行间距
         * @param {Number} horizontal - 打印方式（0：靠左打印；1：居中打印；2：靠右打印）
         * @param {Number} startPos - 垂直居中打印的起始坐标
         * @param {Number} height - 标签高度
         * @param {Object} leftOffset - 标题下方左侧留白
         * @param {Boolean} titleBold - 标题加粗
         * @returns {Array} 返回当前打印文本的json数组
         */
        WewinPrintService.prototype.PrintText = function (obj) {
            this.leftOffset = "no";
            var str = obj.str;
            str = this.isWrong(str);

            this.TextBlockRotateConvert(obj);
            var fontHeight = obj.fontHeight;
            var fontWidth = fontHeight / 2;
            var fontWeight = obj.fontWeight;
            var printWidth = obj.printWidth;
            var x = obj.x;
            var y = obj.y;
            
            var rotate = obj.rotate;
            if (rotate == 1) {
                rotate = 3;
            } else if (rotate == 3) {
                rotate = 1;
            }
            var xoffset = obj.xoffset;
            var loffset = obj.loffset;
            var horizontal = obj.horizontal;
            var vertical = obj.vertical;

            var backstr = [];
            var flag = true;

            var height = obj.maxH;
            var leftOffset = obj.leftOffset;
            leftOffset ? this.leftOffset = leftOffset : "";
            var titleBold = obj.titleBold;
            var singleLine = obj.singleLine;

            var resultArr = [];

            //获取打印机分辨率(8 | 12)
            var dots = this.GetDots();
            if (this.tagUnit == "px") {
                x = x / 8 * dots;
                y = y / 8 * dots;
                fontHeight = fontHeight / 8 * dots;
                fontWidth = fontHeight / 2;
                printWidth = printWidth / 8 * dots;
                xoffset = xoffset / 8 * dots;
                loffset = loffset / 8 * dots;
            } else if (this.tagUnit == "mm") {
                x = x * dots;
                y = y * dots;
                fontHeight = fontHeight * dots;
                fontWidth = fontHeight / 2;
                printWidth = printWidth * dots;
                xoffset = xoffset * dots;
                loffset = loffset * dots;
            }

            if (singleLine) {
                var tempFontHeight = obj.fontHeight * this.GetDots();
                var tempPrintWidth = obj.printWidth * this.GetDots();
                var content = obj.str;
                for (var i = 0; i < content.length; i++) {
                    while (this.getLen(content[i], tempFontHeight) >= tempPrintWidth) {
                        tempFontHeight--;
                    }
                }
                fontHeight = tempFontHeight;
            }

            if (rotate == 0) {
                var startPos = obj.y;
                //正竖向打印(y递增)
                var maxY = y + obj.maxH * dots;
                var newY = y;
                flag = true;
                newY = y;
                while (flag) {
                    for (var i = 0; i < str.length; i++) {
                        backstr = this.autoSplit(fontHeight, str[i], printWidth);
                        for (var j = 0; j < backstr.length; j++) {
                            newY += fontHeight + xoffset;
                        }
                        newY += loffset;
                    }
                    if (newY > maxY) {
                        newY = y;
                        fontHeight--;
                    } else {
                        flag = false;
                    }
                }
                fontWidth = fontHeight / 2;
                var tempH = y;

                if (vertical == 0) {    

                    height *= dots;

                } else if (vertical == 1) {
                    startPos *= dots;
                    height *= dots;
                    for (var i = 0; i < str.length; i++) {
                        backstr = this.autoSplit(fontHeight, str[i], printWidth);
                        for (var j = 0; j < backstr.length; j++) {
                            y += fontHeight + xoffset;
                        }
                        y += loffset;
                    }
                    y = startPos + (height / 2 - Math.abs(y - loffset - tempH) / 2);
                } else if (vertical == 2) {
                    startPos *= dots;
                    height *= dots;
                    for (var i = 0; i < str.length; i++) {
                        backstr = this.autoSplit(fontHeight, str[i], printWidth);
                        for (var j = 0; j < backstr.length; j++) {
                            y += fontHeight + xoffset;
                        }
                        y += loffset;
                    }
                    y = startPos + height - Math.abs(y - loffset - tempH);
                }
                for (var i = 0; i < str.length; i++) {
                    var strTemp = this.getRightSign(str[i]).strTemp;
                    var lenTemp = this.getLen(strTemp, fontHeight);
                    backstr = this.autoSplit(fontHeight, str[i], printWidth);
                    backstr = this.checkTitleBold(titleBold, backstr);
                    for (var j = 0; j < backstr.length; j++) {
                        var tempX;
                        if (leftOffset) {
                            if (leftOffset.auto) {
                                tempX = j != 0 ? (x + lenTemp) : x;
                            } else {
                                if (leftOffset.offsetLen) {
                                    tempX = j != 0 ? (x + this.leftOffset.offsetLen * fontHeight) : x;
                                } else {
                                    tempX = (j == 1 && titleBold) ? (x + lenTemp) : x;
                                }
                            }
                        } else {
                            tempX = (j == 1 && titleBold) ? (x + lenTemp) : x;
                        }
                        tempX = this.returnHorizontal(backstr[j], horizontal, tempX, fontHeight, printWidth, "+");
                        var textElement = {};
                        textElement.type = 0;
                        textElement.x = tempX;
                        textElement.y = y;
                        textElement.fullWidth = printWidth;
                        textElement.fullHeight = height;   
                        textElement.horizontal = obj.horizontal;
                        textElement.vertical = obj.vertical;
                        textElement.fontWidth = fontWidth;
                        textElement.fontHeight = fontHeight;
                        textElement.fontWeight = (j == 0 && titleBold && (backstr[j].indexOf(":") != -1 || backstr[j].indexOf("：") != -1)) ? 1500 : fontWeight;
                        textElement.fontName = this.fontname;
                        textElement.content = backstr[j];
                        textElement.oritention = rotate;
                        textElement.reverseColor = obj.reverseColor;
                        resultArr.push(textElement);
                        this.resultArr.push(textElement);
                        if (titleBold && (backstr[j].indexOf(":") != -1 || backstr[j].indexOf("：") != -1)) {
                            if (j != 0) {
                                y += fontHeight + xoffset;
                            }
                        } else {
                            y += fontHeight + xoffset;
                        }
                    }
                    y += loffset;
                }
            } else if (rotate == 1) {
                var startPos = obj.x;
                //右横向打印(x递增)
                var maxX = x + obj.maxH * dots;
                var newX = x;
                flag = true;
                newX = x;
                while (flag) {
                    for (var i = 0; i < str.length; i++) {
                        backstr = this.autoSplit(fontHeight, str[i], printWidth);
                        for (var j = 0; j < backstr.length; j++) {
                            newX += fontHeight + xoffset;
                        }
                        newX += loffset;
                    }
                    if (newX > maxX) {
                        newX = x;
                        fontHeight--;
                    } else {
                        flag = false;
                    }
                }
                fontWidth = fontHeight / 2;
                var tempH = x;
                if (vertical == 0) {

                    height *= dots;

                } else if (vertical == 1) {
                    startPos *= dots;
                    height *= dots;
                    for (var i = 0; i < str.length; i++) {
                        backstr = this.autoSplit(fontHeight, str[i], printWidth);
                        for (var j = 0; j < backstr.length; j++) {
                            x += fontHeight + xoffset;
                        }
                        x += loffset;
                    }
                    x = startPos + (height / 2 - Math.abs(x - loffset - tempH) / 2);
                } else if (vertical == 2) {
                    startPos *= dots;
                    height *= dots;
                    for (var i = 0; i < str.length; i++) {
                        backstr = this.autoSplit(fontHeight, str[i], printWidth);
                        for (var j = 0; j < backstr.length; j++) {
                            x += fontHeight + xoffset;
                        }
                        x += loffset;
                    }
                    x = startPos + height - Math.abs(x - loffset - tempH);
                }
                for (var i = 0; i < str.length; i++) {
                    var strTemp = this.getRightSign(str[i]).strTemp;
                    var lenTemp = this.getLen(strTemp, fontHeight);
                    backstr = this.autoSplit(fontHeight, str[i], printWidth);
                    backstr = this.checkTitleBold(titleBold, backstr);
                    for (var j = 0; j < backstr.length; j++) {
                        var tempY;
                        if (leftOffset) {
                            if (leftOffset.auto) {
                                tempY = j != 0 ? (y - lenTemp) : y;
                            } else {
                                if (leftOffset.offsetLen) {
                                    tempY = j != 0 ? (y - this.leftOffset.offsetLen * fontHeight) : y;
                                } else {
                                    tempY = (j == 1 && titleBold) ? (y - lenTemp) : y;
                                }
                            }
                        } else {
                            tempY = (j == 1 && titleBold) ? (y - lenTemp) : y;
                        }
                        tempY = this.returnHorizontal(backstr[j], horizontal, tempY, fontHeight, printWidth, "-");
                        var textElement = {};
                        textElement.type = 0;
                        textElement.x = x;
                        textElement.y = tempY;
                        textElement.fullWidth = printWidth;
                        textElement.fullHeight = height;
                        textElement.horizontal = obj.horizontal;
                        textElement.vertical = obj.vertical;
                        textElement.fontWidth = fontWidth;
                        textElement.fontHeight = fontHeight;
                        textElement.fontWeight = (j == 0 && titleBold && (backstr[j].indexOf(":") != -1 || backstr[j].indexOf("：") != -1)) ? 1500 : fontWeight;
                        textElement.fontName = this.fontname;
                        textElement.content = backstr[j];
                        textElement.oritention = rotate;
                        textElement.reverseColor = obj.reverseColor;
                        resultArr.push(textElement);
                        this.resultArr.push(textElement);
                        if (titleBold && (backstr[j].indexOf(":") != -1 || backstr[j].indexOf("：") != -1)) {
                            if (j != 0) {
                                x += fontHeight + xoffset;
                            }
                        } else {
                            x += fontHeight + xoffset;
                        }
                    }
                    x += loffset;
                }
            } else if (rotate == 2) {
                var startPos = obj.y - height;
                //反竖向打印(y递减)
                var minY = y - obj.maxH * dots;
                var newY = y;
                flag = true;
                newY = y;
                while (flag) {
                    for (var i = 0; i < str.length; i++) {
                        backstr = this.autoSplit(fontHeight, str[i], printWidth);
                        for (var j = 0; j < backstr.length; j++) {
                            newY -= fontHeight + xoffset;
                        }
                        newY -= loffset;
                    }
                    if (newY < minY) {
                        newY = y;
                        fontHeight--;
                    } else {
                        flag = false;
                    }
                }
                fontWidth = fontHeight / 2;
                var tempH = y;
                if (vertical == 0) {

                    height *= dots;

                } else if (vertical == 1) {
                    startPos *= dots;
                    height *= dots;
                    for (var i = 0; i < str.length; i++) {
                        backstr = this.autoSplit(fontHeight, str[i], printWidth);
                        for (var j = 0; j < backstr.length; j++) {
                            y -= fontHeight + xoffset;
                        }
                        y -= loffset;
                    }
                    y = startPos + (height / 2 - Math.abs(y + loffset - tempH) / 2) + Math.abs(y + loffset - tempH);
                } else if (vertical == 2) {
                    startPos *= dots;
                    height *= dots;
                    for (var i = 0; i < str.length; i++) {
                        backstr = this.autoSplit(fontHeight, str[i], printWidth);
                        for (var j = 0; j < backstr.length; j++) {
                            y -= fontHeight + xoffset;
                        }
                        y -= loffset;
                    }
                    y = startPos + Math.abs(tempH + loffset - y);
                }
                for (var i = 0; i < str.length; i++) {
                    var strTemp = this.getRightSign(str[i]).strTemp;
                    var lenTemp = this.getLen(strTemp, fontHeight);
                    backstr = this.autoSplit(fontHeight, str[i], printWidth);
                    backstr = this.checkTitleBold(titleBold, backstr);
                    for (var j = 0; j < backstr.length; j++) {
                        var tempX;
                        if (leftOffset) {
                            if (leftOffset.auto) {
                                tempX = j != 0 ? (x - lenTemp) : x;
                            } else {
                                if (leftOffset.offsetLen) {
                                    tempX = j != 0 ? (x - this.leftOffset.offsetLen * fontHeight) : x;
                                } else {
                                    tempX = (j == 1 && titleBold) ? (x - lenTemp) : x;
                                }
                            }
                        } else {
                            tempX = (j == 1 && titleBold) ? (x - lenTemp) : x;
                        }
                        tempX = this.returnHorizontal(backstr[j], horizontal, tempX, fontHeight, printWidth, "-");
                        var textElement = {};
                        textElement.type = 0;
                        textElement.x = tempX;
                        textElement.y = y;
                        textElement.fullWidth = printWidth;
                        textElement.fullHeight = height;
                        textElement.horizontal = obj.horizontal;
                        textElement.vertical = obj.vertical;
                        textElement.fontWidth = fontWidth;
                        textElement.fontHeight = fontHeight;
                        textElement.fontWeight = (j == 0 && titleBold && (backstr[j].indexOf(":") != -1 || backstr[j].indexOf("：") != -1)) ? 1500 : fontWeight;
                        textElement.fontName = this.fontname;
                        textElement.content = backstr[j];
                        textElement.oritention = rotate;
                        textElement.reverseColor = obj.reverseColor;
                        resultArr.push(textElement);
                        this.resultArr.push(textElement);
                        if (titleBold && (backstr[j].indexOf(":") != -1 || backstr[j].indexOf("：") != -1)) {
                            if (j != 0) {
                                y -= fontHeight + xoffset;
                            }
                        } else {
                            y -= fontHeight + xoffset;
                        }
                    }
                    y -= loffset;
                }
            } else if (rotate == 3) {
                var startPos = obj.x - height;
                //左横向打印(x递减)
                var minX = x - obj.maxH * dots;
                var newX = x;
                flag = true;
                newX = x;
                while (flag) {
                    for (var i = 0; i < str.length; i++) {
                        backstr = this.autoSplit(fontHeight, str[i], printWidth);
                        for (var j = 0; j < backstr.length; j++) {
                            newX -= fontHeight + xoffset;
                        }
                        newX -= loffset;
                    }
                    if (newX < minX) {
                        newX = x;
                        fontHeight--;
                    } else {
                        flag = false;
                    }
                }
                fontWidth = fontHeight / 2;
                var tempH = x;
                if (vertical == 0) {

                    height *= dots;

                } else if (vertical == 1) {
                    startPos *= dots;
                    height *= dots;
                    for (var i = 0; i < str.length; i++) {
                        backstr = this.autoSplit(fontHeight, str[i], printWidth);
                        for (var j = 0; j < backstr.length; j++) {
                            x -= fontHeight + xoffset;
                        }
                        x -= loffset;
                    }
                    x = startPos + (height / 2 - Math.abs(x + loffset - tempH) / 2) + Math.abs(x + loffset - tempH);
                } else if (vertical == 2) {
                    startPos *= dots;
                    height *= dots;
                    for (var i = 0; i < str.length; i++) {
                        backstr = this.autoSplit(fontHeight, str[i], printWidth);
                        for (var j = 0; j < backstr.length; j++) {
                            x -= fontHeight + xoffset;
                        }
                        x -= loffset;
                    }
                    x = startPos + Math.abs(x + loffset - tempH);
                }
                for (var i = 0; i < str.length; i++) {
                    var strTemp = this.getRightSign(str[i]).strTemp;
                    var lenTemp = this.getLen(strTemp, fontHeight);
                    backstr = this.autoSplit(fontHeight, str[i], printWidth);
                    backstr = this.checkTitleBold(titleBold, backstr);
                    for (var j = 0; j < backstr.length; j++) {
                        var tempY;
                        if (leftOffset) {
                            if (leftOffset.auto) {
                                tempY = j != 0 ? (y + lenTemp) : y;
                            } else {
                                if (leftOffset.offsetLen) {
                                    tempY = j != 0 ? (y + this.leftOffset.offsetLen * fontHeight) : y;
                                } else {
                                    tempY = (j == 1 && titleBold) ? y + lenTemp : y;
                                }
                            }
                        } else {
                            tempY = (j == 1 && titleBold) ? y + lenTemp : y;
                        }
                        tempY = this.returnHorizontal(backstr[j], horizontal, tempY, fontHeight, printWidth, "+");
                        var textElement = {};
                        textElement.type = 0;
                        textElement.x = x;
                        textElement.y = tempY;
                        textElement.fullWidth = printWidth;
                        textElement.fullHeight = height;
                        textElement.horizontal = obj.horizontal;
                        textElement.vertical = obj.vertical;

                        textElement.fontWidth = fontWidth;
                        textElement.fontHeight = fontHeight;
                        textElement.fontWeight = (j == 0 && titleBold && (backstr[j].indexOf(":") != -1 || backstr[j].indexOf("：") != -1)) ? 1500 : fontWeight;
                        textElement.fontName = this.fontname;
                        textElement.content = backstr[j];
                        textElement.oritention = rotate;
                        textElement.reverseColor = obj.reverseColor;
                        resultArr.push(textElement);
                        this.resultArr.push(textElement);
                        if (titleBold && (backstr[j].indexOf(":") != -1 || backstr[j].indexOf("：") != -1)) {
                            if (j != 0) {
                                x -= fontHeight + xoffset;
                            }
                        } else {
                            x -= fontHeight + xoffset;
                        }
                    }
                    x -= loffset;
                }
            }
            return resultArr;
        }

        WewinPrintService.prototype.TextBlockRotateConvert = function (obj) {
            var dots = this.GetDots();
            var labelWidth = this.labelWidth / dots;
            var labelHeight = this.labelHeight / dots;
            var printWidth0 = obj.printWidth;
            var height0 = obj.maxH;
            var x0 = obj.x;
            var y0 = obj.y;
            var initRorate = obj.rotate;
            if (this.labelRotate == 0) {
                if (initRorate == 0) {
                    obj.x = x0;
                    obj.y = y0;
                    obj.rotate = 0;
                }
                if (initRorate == 1) {
                    obj.x = x0 + printWidth0;
                    obj.y = y0;
                    obj.printWidth = height0;
                    obj.maxH = printWidth0;
                    obj.rotate = 1;
                }
                if (initRorate == 2) {
                    obj.x = printWidth0 + x0;
                    obj.y = height0 + y0;
                    obj.rotate = 2;
                }
                if (initRorate == 3) {
                    obj.x = x0;
                    obj.y = y0 + height0;
                    obj.printWidth = height0;
                    obj.maxH = printWidth0;
                    obj.rotate = 3;
                }
            }
            if (this.labelRotate == 1) {
                if (initRorate == 0) {
                    obj.x = labelWidth - y0;
                    obj.y = x0;
                    obj.rotate = 1;
                }
                if (initRorate == 1) {
                    obj.x = labelWidth - y0;
                    obj.y = x0 + printWidth0;
                    obj.printWidth = height0;
                    obj.maxH = printWidth0;
                    obj.rotate = 2;
                }
                if (initRorate == 2) {
                    obj.x = labelWidth - height0 - y0;
                    obj.y = printWidth0 + x0;
                    obj.rotate = 3;
                }
                if (initRorate == 3) {
                    obj.x = labelWidth - y0 - height0;
                    obj.y = x0;
                    obj.printWidth = height0;
                    obj.maxH = printWidth0;
                    obj.rotate = 0;
                }
            }
            if (this.labelRotate == 2) {
                if (initRorate == 0) {
                    obj.x = labelWidth - x0;
                    obj.y = labelHeight - y0;
                    obj.rotate = 2;
                }
                if (initRorate == 1) {
                    obj.x = labelWidth - x0 - printWidth0;
                    obj.y = labelHeight - y0;
                    obj.printWidth = height0;
                    obj.maxH = printWidth0;
                    obj.rotate = 3;
                }
                if (initRorate == 2) {
                    obj.x = labelWidth - printWidth0 - x0;
                    obj.y = labelHeight - height0 - y0;
                    obj.rotate = 0;
                }
                if (initRorate == 3) {
                    obj.x = labelWidth - x0;
                    obj.y = labelHeight - y0 - height0;
                    obj.printWidth = height0;
                    obj.maxH = printWidth0;
                    obj.rotate = 1;
                }
            }
            if (this.labelRotate == 3) {
                if (initRorate == 0) {
                    obj.x = y0;
                    obj.y = labelHeight - x0;
                    obj.rotate = 3;
                }
                if (initRorate == 1) {
                    obj.x = y0;
                    obj.y = labelHeight - x0 - printWidth0;
                    obj.printWidth = height0;
                    obj.maxH = printWidth0;
                    obj.rotate = 0;
                }
                if (initRorate == 2) {
                    obj.x = y0 + height0;
                    obj.y = labelHeight - x0 - printWidth0;
                    obj.rotate = 1;
                }
                if (initRorate == 3) {
                    obj.x = y0 + height0;
                    obj.y = labelHeight - x0;
                    obj.printWidth = height0;
                    obj.maxH = printWidth0;
                    obj.rotate = 2;
                }
            }
        }

        /**
         * 二维码打印函数
         * @param {String} str - 需要生成二维码的字符串
         * @param {Number} x - x坐标
         * @param {Number} y - y坐标
         * @param {Number} width - 二维码宽度
         * @param {Number} rotate - 旋转
         * @returns {Array} 返回当前打印二维码的json数组
         */
        WewinPrintService.prototype.PrintQrcode = function (obj) {
            this.QrcodeBlockRotateConvert(obj);
            var codeType = 0;
            var x = obj.x;
            var y = obj.y;
            var width = obj.width;
            var str = obj.str;
            str = this.isWrong(str);
            var rotate = obj.rotate;
            var level = -1;
            if (obj.codeType != undefined) {
                codeType = obj.codeType;
            }
            if (obj.level != undefined) {
                level = obj.level;
            }
            var logo = obj.logo;
            logo = this.isWrong(logo);
            var logosize = -1;
            if (obj.logosize != undefined) {
                logosize = obj.logosize;
            }

            //获取打印机分辨率(8 | 12)
            var dots = this.GetDots();
            if (this.tagUnit == "px") {
                x = x / 8 * dots;
                y = y / 8 * dots;
                width = width / 8 * dots;
                if (logosize != -1) {
                    logosize = logosize / 8 * dots;
                }
            } else if (this.tagUnit == "mm") {
                x = x * dots;
                y = y * dots;
                width = width * dots;
                if (logosize != -1) {
                    logosize = logosize * dots;
                }
            }

            var CodesArr = [{
                "type": "2",
                "codeType": codeType,
                "x": x,
                "y": y,
                "width": width,
                "content": str,
                "oritention": rotate,
                "level": level,
                "logo": logo,
                "logosize": logosize
            }];

            this.resultArr.push(CodesArr[0]);

            return CodesArr;
        }

        WewinPrintService.prototype.QrcodeBlockRotateConvert = function (obj) {
            var dots = this.GetDots();
            var labelWidth = this.labelWidth / dots;
            var labelHeight = this.labelHeight / dots;
            var width0 = obj.width;
            var x0 = obj.x;
            var y0 = obj.y;
            var initRorate = obj.rotate;
            if (this.labelRotate == 0) {
                if (initRorate == 0) {
                    obj.x = x0;
                    obj.y = y0;
                    obj.rotate = 0;
                }
                if (initRorate == 2) {
                    obj.x = x0;
                    obj.y = y0;
                    obj.rotate = 2;
                }

            }
            if (this.labelRotate == 1) {
                if (initRorate == 0) {
                    obj.x = labelWidth - width0 - y0;
                    obj.y = x0;
                    obj.rotate = 1;
                }
                if (initRorate == 2) {
                    obj.x = labelWidth - width0 - y0;
                    obj.y = x0;
                    obj.rotate = 3;
                }
            }
            if (this.labelRotate == 2) {
                if (initRorate == 0) {
                    obj.x = labelWidth - width0 - x0;
                    obj.y = labelHeight - width0 - y0;
                    obj.rotate = 2;
                }
                if (initRorate == 2) {
                    obj.x = labelWidth - width0 - x0;
                    obj.y = labelHeight - width0 - y0;
                    obj.rotate = 0;
                }
            }
            if (this.labelRotate == 3) {
                if (initRorate == 0) {
                    obj.x = y0;
                    obj.y = labelHeight - width0 - x0;
                    obj.rotate = 3;
                }
                if (initRorate == 2) {
                    obj.x = y0;
                    obj.y = labelHeight - width0 - x0;
                    obj.rotate = 1;
                }

            }
        }

        /**
         * 条形码打印函数
         * @param {String} str - 需要生成条形码的字符串
         * @param {Number} x - x坐标
         * @param {Number} y - y坐标
         * @param {Number} rotate - 旋转
         * @param {Number} height - 条码高度
         * @param {Number} pwidth - 条码单元宽度
         * @returns {Array} 返回当前打印条形码的json数组
         */
        WewinPrintService.prototype.PrintBarcode = function (obj) {
            this.BarcodeBlockRotateConvert(obj);
            var codeType = obj.codeType;
            var x = obj.x;
            var y = obj.y;
            var pwidth = 1;
            var height = obj.height;
            var width = -1;
            if (obj.pwidth != undefined) {
                pwidth = obj.pwidth;
            }
            if (obj.width != undefined) {
                width = obj.width;
            }
            var str = obj.str;
            str = this.isWrong(str);
            var rotate = obj.rotate;

            //获取打印机分辨率(8 | 12)
            var dots = this.GetDots();
            if (this.tagUnit == "px") {
                x = x / 8 * dots;
                y = y / 8 * dots;
                height = height / 8 * dots;
                if (width != -1) {
                    width = width / 8 * dots;
                }
            } else if (this.tagUnit == "mm") {
                x = x * dots;
                y = y * dots;
                height = height * dots;
                if (width != -1) {
                    width = width * dots;
                }
            }

            var BarcodesArr = [{
                "type": "1",
                "codeType": codeType,
                "x": x,
                "y": y,
                "pwidth": pwidth,
                "height": height,
                "content": str,
                "oritention": rotate,
                "width": width
            }];

            this.resultArr.push(BarcodesArr[0]);

            return BarcodesArr;
        }

        WewinPrintService.prototype.BarcodeBlockRotateConvert = function (obj) {
            var dots = this.GetDots();
            var labelWidth = this.labelWidth / dots;
            var labelHeight = this.labelHeight / dots;
            var height0 = obj.height;
            var width0 = obj.width;
            var x0 = obj.x;
            var y0 = obj.y;
            if (this.labelRotate == 0) {
                obj.x = x0;
                obj.y = y0;
            }
            if (this.labelRotate == 1) {
                obj.x = labelWidth - height0 - y0;
                obj.y = x0;
                obj.rotate = 1;
            }
            if (this.labelRotate == 2) {
                obj.x = labelWidth - width0 - x0;
                obj.y = labelHeight - height0 - y0;
                obj.rotate = 2;
            }
            if (this.labelRotate == 3) {
                obj.x = y0;
                obj.y = labelHeight - x0 - width0;
                obj.rotate = 3;
            }
        }

        /**
         * 线条打印函数
         * @param {Number} x - x坐标
         * @param {Number} y - y坐标
         * @param {Number} ex - 旋转
         * @param {Number} ey - 条码高度
         * @param {Number} thickness - 线条厚度
         * @returns {Array} 返回当前打印线条的json数组
         */
        WewinPrintService.prototype.PrintLine = function (obj) {
            this.LineBlockRotateConvert(obj);
            var x = obj.x;
            var y = obj.y;
            var thickness = obj.thickness;
            var ex = obj.ex;
            var ey = obj.ey;

            //获取打印机分辨率(8 | 12)
            var dots = this.GetDots();
            if (this.tagUnit == "px") {
                x = x / 8 * dots;
                y = y / 8 * dots;
                ex = ex / 8 * dots;
                ey = ey / 8 * dots;
            } else if (this.tagUnit == "mm") {
                x = x * dots;
                y = y * dots;
                ex = ex * dots;
                ey = ey * dots;
            }

            var LinesArr = [{
                "type": "4",
                "x": x,
                "y": y,
                "thickness": thickness,
                "ex": ex,
                "ey": ey
            }];

            this.resultArr.push(LinesArr[0]);

            return LinesArr;
        }

        WewinPrintService.prototype.LineBlockRotateConvert = function (obj) {
            var dots = this.GetDots();
            var labelWidth = this.labelWidth / dots;
            var labelHeight = this.labelHeight / dots;
            var x0 = obj.x;
            var y0 = obj.y;
            var ex0 = obj.ex;
            var ey0 = obj.ey;
            if (this.labelRotate == 0) {
                obj.x = x0;
                obj.y = y0;
                obj.ex = ex0;
                obj.ey = ey0;
            }
            if (this.labelRotate == 1) {
                obj.x = labelWidth - y0;
                obj.y = x0;
                obj.ex = labelWidth - ey0;
                obj.ey = ex0;
            }
            if (this.labelRotate == 2) {
                obj.x = labelWidth - x0;
                obj.y = labelHeight - y0;
                obj.ex = labelWidth - ex0;
                obj.ey = labelHeight - ey0;
            }
            if (this.labelRotate == 3) {
                obj.x = y0;
                obj.y = labelHeight - x0;
                obj.ex = ey0;
                obj.ey = labelHeight - ex0;
            }
        }

        /**
         * @param {Number} x - x坐标
         * @param {Number} y - y坐标
         * @param {Number} width - 宽度
         * @param {Number} height - 高度
         * @param {Number} radius - 圆角半径
         * @param {Number} thickness - 线条厚度
         * @param {*} obj 
         * @returns  @returns {Array} 返回当前打印线框的json数组
         */
        WewinPrintService.prototype.PrintRect = function (obj) {
            this.RectBlockRotateConvert(obj)
            var x = obj.x;
            var y = obj.y;
            var thickness = obj.thickness;
            var width = obj.width;
            var height = obj.height;
            var radius = obj.radius;

            //获取打印机分辨率(8 | 12)
            var dots = this.GetDots();

            if (this.tagUnit == "px") {
                x = x / 8 * dots;
                y = y / 8 * dots;
                width = width / 8 * dots;
                height = height / 8 * dots;
                radius = radius / 8 * dots;
            } else if (this.tagUnit == "mm") {
                x = x * dots;
                y = y * dots;
                width = width * dots;
                height = height * dots;
                radius = radius * dots;
            }

            var RectsArr = [{
                "type": "5",
                "x": x,
                "y": y,
                "thickness": thickness,
                "width": width,
                "height": height,
                "radius": radius
            }];

            this.resultArr.push(RectsArr[0]);

            return RectsArr;
        }

        WewinPrintService.prototype.RectBlockRotateConvert = function (obj) {
            var dots = this.GetDots();
            var labelWidth = this.labelWidth / dots;
            var labelHeight = this.labelHeight / dots;
            var width0 = obj.width;
            var height0 = obj.height;
            var x0 = obj.x;
            var y0 = obj.y;
            var initRorate = obj.rotate;
            if (this.labelRotate == 0) {
                if (initRorate == 0) {
                    obj.x = x0;
                    obj.y = y0;
                    obj.rotate = 0;
                }
                if (initRorate == 2) {
                    obj.x = x0;
                    obj.y = y0;
                    obj.rotate = 2;
                }
            }
            if (this.labelRotate == 1) {
                if (obj.rotate == 0) {
                    obj.x = labelWidth - height0 - y0;
                    obj.y = x0;
                    obj.width = height0;
                    obj.height = width0;
                    obj.rotate = 1;
                }
                if (obj.rotate == 2) {
                    obj.x = labelWidth - height0 - y0;
                    obj.y = x0;
                    obj.width = height0;
                    obj.height = width0;
                    obj.rotate = 3;
                }
            }
            if (this.labelRotate == 2) {
                if (initRorate == 0) {
                    obj.x = labelWidth - width0 - x0;
                    obj.y = labelHeight - height0 - y0;
                    obj.rotate = 2;
                }
                if (initRorate == 2) {
                    obj.x = labelWidth - width0 - x0;
                    obj.y = labelHeight - height0 - y0;
                    obj.rotate = 0;
                }
            }
            if (this.labelRotate == 3) {
                if (obj.rotate == 0) {
                    obj.x = y0;
                    obj.y = labelHeight - x0 - width0;
                    obj.width = height0;
                    obj.height = width0;
                    obj.rotate = 3;
                }
                if (obj.rotate == 2) {
                    obj.x = y0;
                    obj.y = labelHeight - x0 - width0;
                    obj.width = height0;
                    obj.height = width0;
                    obj.rotate = 1;
                }

            }
        }

        /**
         * 图片打印函数
         * @param {Number} x - x坐标
         * @param {Number} y - y坐标
         * @param {Number} width - 图片宽度
         * @param {Number} height - 图片高度
         * @param {String} path - 图片路径
         * @param {Number} rotate - 图片旋转
         * @returns {Array} 返回当前打印图片的json数组
         */
        WewinPrintService.prototype.PrintLogo = function (obj) {
            this.GraphicBlockRotateConvert(obj);
            var x = obj.x;
            var y = obj.y;
            var width = obj.width;
            var height = obj.height;
            var path = obj.path;
            path = this.isWrong(path);
            path = decodeURI(path);
            var rotate = obj.rotate;

            //获取打印机分辨率(8 | 12)
            var dots = this.GetDots();
            if (this.tagUnit == "px") {
                x = x / 8 * dots;
                y = y / 8 * dots;
                width = width / 8 * dots;
                height = height / 8 * dots;
            } else if (this.tagUnit == "mm") {
                x = x * dots;
                y = y * dots;
                width = width * dots;
                height = height * dots;
            }

            var ImagesArr = [{
                "type": "3",
                "x": x,
                "y": y,
                "width": width,
                "height": height,
                "path": path,
                "oritention": rotate
            }];

            this.resultArr.push(ImagesArr[0]);

            return ImagesArr;
        }

        WewinPrintService.prototype.GraphicBlockRotateConvert = function (obj) {
            var dots = this.GetDots();
            var labelWidth = this.labelWidth / dots;
            var labelHeight = this.labelHeight / dots;
            var width0 = obj.width;
            var height0 = obj.height;
            var x0 = obj.x;
            var y0 = obj.y;
            var initRorate = obj.rotate;
            if (this.labelRotate == 0) {
                if (initRorate == 0) {
                    obj.x = x0;
                    obj.y = y0;
                    obj.rotate = 0;
                }
                if (initRorate == 2) {
                    obj.x = x0;
                    obj.y = y0;
                    obj.rotate = 2;
                }
            }
            if (this.labelRotate == 1) {
                if (obj.rotate == 0) {
                    obj.x = labelWidth - height0 - y0;
                    obj.y = x0;
                    obj.width = height0;
                    obj.height = width0;
                    obj.rotate = 1;
                }
                if (obj.rotate == 2) {
                    obj.x = labelWidth - height0 - y0;
                    obj.y = x0;
                    obj.width = height0;
                    obj.height = width0;
                    obj.rotate = 3;
                }
            }
            if (this.labelRotate == 2) {
                if (initRorate == 0) {
                    obj.x = labelWidth - width0 - x0;
                    obj.y = labelHeight - height0 - y0;
                    obj.rotate = 2;
                }
                if (initRorate == 2) {
                    obj.x = labelWidth - width0 - x0;
                    obj.y = labelHeight - height0 - y0;
                    obj.rotate = 0;
                }
            }
            if (this.labelRotate == 3) {
                if (obj.rotate == 0) {
                    obj.x = y0;
                    obj.y = labelHeight - x0 - width0;
                    obj.width = height0;
                    obj.height = width0;
                    obj.rotate = 3;
                }
                if (obj.rotate == 2) {
                    obj.x = y0;
                    obj.y = labelHeight - x0 - width0;
                    obj.width = height0;
                    obj.height = width0;
                    obj.rotate = 1;
                }

            }
        }

        /**
         * 获取打印机分辨率
         * @returns {String} 打印机分辨率
         */
        WewinPrintService.prototype.GetDots = function () {
            var parr = this.printername.split("&&");
            var dots = parr[1];
            return dots;
        }

        /**
         * 返回打印方式的坐标
         * @param {String} str 
         * @param {Number} horizontal 
         * @param {Number} xy 
         * @param {Number} fontHeight 
         * @param {Number} printWidth 
         * @param {String} operator 
         * @return {Number}  
         */
        WewinPrintService.prototype.returnHorizontal = function (str, horizontal, xy, fontHeight, printWidth, operator) {
            var newXY = xy;
            var strLen = this.getLen(str, fontHeight);
            if (horizontal == 0) {
                //靠左打印
                newXY = xy;
            } else if (horizontal == 1) {
                //居中打印
                if (operator == "+") {
                    newXY += printWidth / 2 - strLen / 2;
                } else if (operator == "-") {
                    newXY -= printWidth / 2 - strLen / 2;
                }
            } else if (horizontal == 2) {
                //靠右打印
                if (operator == "+") {
                    newXY += printWidth - strLen;
                } else if (operator == "-") {
                    newXY -= printWidth - strLen;
                }
            }
            return newXY;
        }

        /**
         * 获取左侧留白正确的分隔符(：和:)
         */
        WewinPrintService.prototype.getRightSign = function (str) {
            var ci = str.indexOf("：");
            var ei = str.indexOf(":");
            var rightSign = "";
            if (ci < ei) {
                rightSign = "：";
            } else {
                rightSign = ":";
            }
            if (ci < 0) {
                rightSign = ":";
            }
            if (ei < 0) {
                rightSign = "：";
            }
            if (ci < 0 && ei < 0) {
                rightSign = "";
            }
            var strTemp = rightSign != "" ? str.substring(0, str.indexOf(rightSign) + 1) : rightSign;
            return {
                strTemp: strTemp,
                rightSign: rightSign
            };
        }

        /**
         * 标题加粗
         */
        WewinPrintService.prototype.checkTitleBold = function (titleBold, backstr) {
            if (backstr == "") {
                return backstr;
            }
            if (backstr[0].indexOf(":") != -1 || backstr[0].indexOf("：") != -1) {
                if (titleBold) {
                    var firstArr = [], sign;
                    sign = this.getRightSign(backstr[0]).rightSign;
                    firstArr.push(backstr[0].slice(0, backstr[0].indexOf(sign)));
                    firstArr.push(backstr[0].slice(backstr[0].indexOf(sign) + 1));
                    firstArr[0] += sign;
                    backstr.shift();
                    backstr.unshift(firstArr[1]);
                    backstr.unshift(firstArr[0]);
                }
            }
            return backstr;
        }

        /**
         * 分割字符串
         * @param {Number} fontHeight - 字体高度
         * @param {String} str - 字符串
         * @param {Number} printWidth - 换行宽度
         * @return {Array} 分割字符串的数组
         */
        WewinPrintService.prototype.autoSplit = function (fontHeight, str, printWidth) {
            str = this.isWrong(str);
            var strLen = 0;
            var temp = 0;
            var backstr = [];
            var strs = str.split("");
            var tLen = 0;
            var strTemp = this.getRightSign(str).strTemp;
            var lenTemp = this.getLen(strTemp, fontHeight);
            for (var i = 0; i < strs.length; i++) {
                var pTemp;
                if (this.leftOffset != undefined && this.leftOffset != null && this.leftOffset != "no") {
                    if (this.leftOffset.auto) {
                        if (backstr.length == 0) {
                            pTemp = printWidth;
                        } else {
                            pTemp = printWidth - lenTemp;
                        }
                    } else {
                        if (this.leftOffset.offsetLen) {
                            if (backstr.length == 0) {
                                pTemp = printWidth;
                            } else {
                                pTemp = printWidth - this.leftOffset.offsetLen * fontHeight;
                            }
                        } else {
                            pTemp = printWidth;
                        }
                    }
                } else {
                    pTemp = printWidth;
                }
                tLen = this.getLen(strs[i], fontHeight);
                strLen += tLen;
                if ((strLen - pTemp) > 0) {
                    backstr.push(str.substring(temp, i));
                    temp = i;
                    strLen = 0;
                    i--;
                }
                if (i == str.length - 1) {
                    backstr.push(str.substring(temp, i + 1));
                }
            }
            return backstr;
        }

        /**
         * 是否是中文
         * @param {String} 单字符
         * @returns {Boolean} true:是 false:否
         */
        WewinPrintService.prototype.isChinese = function (temp) {
            var re = /^[\u4E00-\u9FA5]/;
            if (re.test(temp)) return true;
            return false;
        }

        /**
         * 是否是英文字母或数字
         * @param {String} 单字符
         * @returns {Boolean} true:是 false:否
         */
        WewinPrintService.prototype.isWordOrNum = function (temp) {
            var re = /^[A-Za-z0-9]/;
            if (re.test(temp)) return true;
            return false;
        }

        /**
         * 是否是英文符号
         * @param {String} 单字符
         * @returns {Boolean} true:是 false:否
         */
        WewinPrintService.prototype.isSmall = function (temp) {
            var re = new RegExp("[`~!@#$^&*()=|{}':;,\\[\\].<>/?]");
            if (re.test(temp)) return true;
            return false;
        }

        /**
         * 是否是中文符号
         * @param {String} 单字符
         * @returns {Boolean} true:是 false:否
         */
        WewinPrintService.prototype.isBig = function (temp) {
            var re = new RegExp("[《》！（）【】；：。，、？￥……'””“——]");
            if (re.test(temp)) return true;
            return false;
        }

        /**
         * 解析xml数据
         * @param {Object} ele xml数据
         * @returns {Array} 解析xml生成的数组
         */
        WewinPrintService.prototype.parseXmlElement = function (ele) {
            var eles = [];
            for (var j = 0; j < ele.length; j++) {
                if (ele[j] != undefined && ele[j].childNodes[0] != undefined || ele[j].firstChild != null) {
                    eles[j] = ele[j].firstChild.nodeValue;
                } else {
                    eles[j] = "";
                }
            }
            return eles;
        }

        /**
         * 解析json数据
         * @param {Object} ele json数据
         * @returns {Array} 解析json生成的数组
         */
        WewinPrintService.prototype.parseJsonElement = function (ele) {
            if (ele == null) {
                ele = "";
            }
            if (typeof (ele) == "number") {
                ele = "" + ele;
            }
            if (typeof (ele) == "string") {
                var arr = [];
                arr.push(ele);
                return arr;
            } else if (typeof (ele) == "object") {
                return ele;
            }
        }

        /**
         * 缓存打印信息到本地
         * @param {*} key 
         * @param {*} value 
         */
        WewinPrintService.prototype.setItem = function (key, value) {
            if (this.isIE()) {
                var Days = 30;
                var date = new Date();
                date.setDate(date.getDate() + Days * 24 * 60 * 60 * 1000);
                document.cookie = key + "=" + value + ";expires=" + date;
            } else {
                localStorage.setItem(key, value);
            }

        }

        /**
         * 获取本地缓存信息
         * @param {*} key 
         * @returns 
         */
        WewinPrintService.prototype.getItem = function (key) {
            var value = null;
            if (this.isIE()) {
                var arr = document.cookie.split(";");
                for (var i = 0; i < arr.length; i++) {
                    var arr2 = arr[i].split("=");
                    if (arr2[0].trim() == key) {
                        value = arr2[1];
                    }
                }
            } else {
                value = localStorage.getItem(key);
            }
            return value;
        }

        return new WewinPrintService();
    }

    // ======================================================================
    // 处理IE8及以下各种兼容问题
    // ======================================================================
    var wps = new WewinPrintService();
    if (wps.getIeVersion() <= 9.0) {
        /**
         * 兼容IE9以下console报错问题
         */
        window._console = window.console;//将原始console对象缓存
        window.console = (function (orgConsole) {
            return {//构造的新console对象
                log: getConsoleFn("log"),
                debug: getConsoleFn("debug"),
                info: getConsoleFn("info"),
                warn: getConsoleFn("warn"),
                exception: getConsoleFn("exception"),
                assert: getConsoleFn("assert"),
                dir: getConsoleFn("dir"),
                dirxml: getConsoleFn("dirxml"),
                trace: getConsoleFn("trace"),
                group: getConsoleFn("group"),
                groupCollapsed: getConsoleFn("groupCollapsed"),
                groupEnd: getConsoleFn("groupEnd"),
                profile: getConsoleFn("profile"),
                profileEnd: getConsoleFn("profileEnd"),
                count: getConsoleFn("count"),
                clear: getConsoleFn("clear"),
                time: getConsoleFn("time"),
                timeEnd: getConsoleFn("timeEnd"),
                timeStamp: getConsoleFn("timeStamp"),
                table: getConsoleFn("table"),
                error: getConsoleFn("error"),
                memory: getConsoleFn("memory"),
                markTimeline: getConsoleFn("markTimeline"),
                timeline: getConsoleFn("timeline"),
                timelineEnd: getConsoleFn("timelineEnd")
            };
            function getConsoleFn(name) {
                return function actionConsole() {
                    if (typeof (orgConsole) !== "object") return;
                    if (typeof (orgConsole[name]) !== "function") return;//判断原始console对象中是否含有此方法，若没有则直接返回
                    return orgConsole[name].apply(orgConsole, Array.prototype.slice.call(arguments));//调用原始函数
                };
            }
        }(window._console));

        /**
         * 兼容IE8以下没有getElementsByClassName函数
         */
        if (!document.getElementsByClassName) {
            document.getElementsByClassName = function (className, element) {
                var children = (element || document).getElementsByTagName('*');
                var elements = new Array();
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    var classNames = child.className.split(' ');
                    for (var j = 0; j < classNames.length; j++) {
                        if (classNames[j] == className) {
                            elements.push(child);
                            break;
                        }
                    }
                }
                return elements;
            };
        }

        /**
         * 兼容IE8以下没有trim函数
         */
        String.prototype.trim = function () {
            return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        }

        /**
         * 兼容IE8以下没有apply及call函数
         */
        if (!Function.prototype.apply) {
            Function.prototype.apply = function (obj, args) {
                obj = obj == undefined ? window : Object(obj);//obj可以是js基本类型 
                var i = 0, ary = [], str;
                if (args) {
                    for (len = args.length; i < len; i++) {
                        ary[i] = "args[" + i + "]";
                    }
                }
                obj._apply = this;
                str = 'obj._apply(' + ary.join(',') + ')';
                try {
                    return eval(str);
                } catch (e) {
                } finally {
                    delete obj._apply;
                }
            };
        }
        if (!Function.prototype.call) {
            Function.prototype.call = function (obj) {
                var i = 1, args = [];
                for (len = arguments.length; i < len; i++) {
                    args[i - 1] = arguments[i];
                }
                return this.apply(obj, args);
            };
        }
    }

    return WewinPrintService;

}));
