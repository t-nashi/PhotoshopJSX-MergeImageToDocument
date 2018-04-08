#target photoshop
app.bringToFront();	//アプリケーション(photoshop)を最善面に持ってくる

/* ----------------------------------------------------------------------------------------------
 * PhotoshopJSX-MergeImageToDocument
 * ----------
 * Author: Tsutomu Takanashi
 * Copyright (c) 2018 Tsutomu Takanashi
 * 
 * Project home:
 * 	https://github.com/t-nashi/PhotoshopJSX-MergeImageToDocument
 * 
 * This software is released under the MIT License:
 * 	https://opensource.org/licenses/mit-license.php
 * ---------------------------------------------------------------------------------------------- */

//-------------------------------------------------------------
// GENERAL SETTING
//-------------------------------------------------------------
// 実行スクリプトファイルの情報取得
var _script			= $.fileName;								//スクリプトファイルのフルパス取得
var _root			= File($.fileName).parent + "/";			//スクリプトファイルまでのパス取得
var _scriptName		= File($.fileName).name;					//スクリプトファイル名取得
var _addFolder		= "_resource/";

// 読み込む対象のファイルを選定するための設定
var dir			= new Folder(_root+_addFolder);					//ファイル読み込み元のフォルダパス
// var extention	= ".png";									//拡張子
// var files		= dir.getFiles("*" + extention);			//指定拡張子のファイルを取得
var files		= dir.getFiles("*").sort();						//指定拡張子のファイルを取得
var filecnt		= files.length;									//処理対象ファイル数の取得

// ドキュメント設定
var _docNew;							// 新規で作成するドキュメント定義用

// init処理で利用する値
var setFontSize = 24;					// アートボード名を表記するフォントサイズ
var setFontColor = "#ffffff";			// フォントの色
var posYtop = -40;						// テキストをアートボードレイヤーの上部に位置付かせるためのマイナス値
var addCanvasSizeW = 200;				// canvasサイズ変更時、widthにプラスする値
var addCanvasSizeH = 200;				// canvasサイズ変更時、heightにプラスする値
var setBackgroundColor = "#282828";		// アートボード下に敷く背景レイヤー色

var marginWidth = 100;					// レイヤー間の幅
var targetPosX = 0;						// レイヤーを移動させる先のXポジション
var wholeDocWidth = 0;					// 最終的にサイズ変更するcanvasの幅
var wholeDocHeight = 0;					// 最終的にサイズ変更するcanvasの高さ

var setFontColorR = parseInt(setFontColor.substring(1,3), 16);
var setFontColorG = parseInt(setFontColor.substring(3,5), 16);
var setFontColorB = parseInt(setFontColor.substring(5,7), 16);

var setBackgroundColorR = parseInt(setBackgroundColor.substring(1,3), 16);
var setBackgroundColorG = parseInt(setBackgroundColor.substring(3,5), 16);
var setBackgroundColorB = parseInt(setBackgroundColor.substring(5,7), 16);

//その他
var errorCount = 0;												//エラー回数をカウント

// photoshop設定
preferences.rulerUnits = Units.PIXELS;	// 単位をpxに設定



// 開いてるドキュメントがあれば処理開始
try{
	if(filecnt){
		//※※ 処理実行トリガー ※※※
		run();

		//処理が全て完了したら「finish!!!」と表示
		alert("finish!!!\n" + (filecnt-errorCount) + "/" + filecnt);

	}else{
		throw new Error(errMsg = "読み込む対象のファイルがありません");
	}
}catch(e){
	alert(e && e.message ? e.line+": "+e.message : e.line+": "+errMsg);
}




//-------------------------------------------------------------
// RUN (INITIALIZE | CONSTRUCT)
//-------------------------------------------------------------
function run(){

	// 01. 対象ファイルをPhotoshop内へ読み込む
	//-----------------------------------------------------
	//指定形式のファイルを順に開き処理を行う
	for(var i=0; i<filecnt; i++){

		//ファイル名までのフルパス取得
		var nameOfFile = String(files[i].fullName);

		//ファイルオブジェクト定義
		var openObj = new File(nameOfFile);

		//ファイルオープン
		try{

			//最初とそれ以降の処理を分けるための分岐作り
			if(i==0){
				//【対象の複数ファイルの一番最初のファイルに対する処理）】

				//ベースとなるファイルを開く（ファイル名ソートで最初に来るファイル）
				(function(){app.open(openObj);})();
				//ベースとなるファイルを扱いやすいように変数に定義
				var _doc = app.activeDocument;
				//ドキュメントサイズを求める
				preferences.rulerUnits = Units.PIXELS;
				var docW = _doc.width.value;
				var docH = _doc.height.value;
				//新規ドキュメントを作成（ベースファイルと同じ width/height/dpi で作成）
				var res = _doc.resolution;

				//新規ドキュメントを作成
				documents.add(docW,docH,res);
				//新規ドキュメントを扱いやすいように変数に定義
				_docNew = app.activeDocument;

				//ベースファイルを保存せずに閉じる
				_doc.close(SaveOptions.DONOTSAVECHANGES);

				//新規ドキュメントにベースファイルを配置（スマートオブジェクトファイルとして）
				try{
					placeFile(openObj);
				}catch(e){
					continue;
				}
				//レイヤー名をファイル名と同じにする
				_docNew.activeLayer.name = files[i].name;

				//新規ドキュメント内の「背景」レイヤーを削除
				_docNew.layers[1].remove();
			}else{

				//【対象の複数ファイルの2番目以降のファイルの処理 （スマートオブジェクト化してアクティブドキュメントに配置）】
				try{
					app.open(openObj);
					var _doc = app.activeDocument;
					// selectFullLayers();
					mergeVisLayers();
					smartSet();
					// _doc.activeLayer.name = _doc.name;					//レイヤー名の変更
					_doc.activeLayer.duplicate(_docNew,ElementPlacement.PLACEATBEGINNING);	//ドキュメントの先頭に複製
					_doc.close(SaveOptions.DONOTSAVECHANGES);
				}catch(e){
					continue;
				}

				//レイヤー名の変更
				_docNew.activeLayer.name = files[i].name;

			}

		}catch(e){
			errorCount++;
		}

	}//for


	// 02. ドキュメント内のレイヤーを横並びにしてcanvasサイズを広げる
	//-----------------------------------------------------
	var ChildLyaers = _docNew.layers;				// レイヤー定義
	var layerCount = ChildLyaers.length;			// レイヤー数カウント

	// ドキュメント内のレイヤー数分処理する
	for(var i=0; i<layerCount; i++){
		var targetLayerNum = (layerCount)-1-i;

		// レイヤー2つ目以降からの処理
		if(0<i){
			wholeDocWidth += marginWidth;
			ChildLyaers[targetLayerNum].translate(wholeDocWidth, 0);
		}
		// 特定レイヤーの大きさ取得
		calcDocumentSize(ChildLyaers[targetLayerNum]);
	}
	// canvasサイズの変更
	app.activeDocument.resizeCanvas(wholeDocWidth, wholeDocHeight, AnchorPosition.TOPLEFT);


	// 03. 各レイヤーの名前のテキストレイヤーを作成、ドキュメント全体用の背景レイヤーを作成
	//-----------------------------------------------------
	var setLayerNumber = 0;						// 処理対象のレイヤー番号をセットするための入れ物
	var addNumVal = 0;							// レイヤー指定のための調整値

	// レイヤー名を取得してテキストレイヤーに起こしていく
	for(var i=0; i<layerCount; i++){

		// 初めは処理しない
		if(i!==0) setLayerNumber=i+addNumVal;

		// テキストレイヤー追加
		_docNew.suspendHistory("Add TextLayer", "addTextLayer(setLayerNumber)");

		addNumVal++;
	}

	var maxLayerCount = layerCount*2-1;			// この時点でのレイヤーの合計数

	// レイヤー名を所定の位置へ移動
	for(var i=0; i<layerCount; i++){
		translateLayerAbsolutePosition(i, getLayerPositionX(maxLayerCount), getLayerPositionY(maxLayerCount)+posYtop);
		maxLayerCount--;
	}

	// canvasサイズの変更
	_docNew.resizeCanvas(_docNew.width+addCanvasSizeW, _docNew.height+addCanvasSizeH, AnchorPosition.MIDDLECENTER);

	// レイヤー追加
	_docNew.artLayers.add();
	_docNew.activeLayer.name = "Background";

	// レイヤー塗りつぶし
	var myColor = new SolidColor();
	myColor.rgb.red = myColor.rgb.green = myColor.rgb.blue = 0;
	myColor.rgb.red = setBackgroundColorR;
	myColor.rgb.green = setBackgroundColorG;
	myColor.rgb.blue = setBackgroundColorB;
	app.activeDocument.selection.selectAll();			// 全てを選択する
	app.activeDocument.selection.fill(myColor, ColorBlendMode.NORMAL, 100, false);			// 塗りつぶし
	app.activeDocument.selection.deselect();			// 選択範囲の解除

	// レイヤーを最背面へ移動
	sendToBackEnd();


	// 04. psd保存とpng書き出し（YYYYMMDDddd_HHMMmm.psd）
	//-----------------------------------------------------

	//ファイル名設定
	var saveFileName = getTimeStamp();
	var fileObj = new File(_root + saveFileName + ".psd");
	//ファイルを別名保存
	saveAsFile(fileObj, _docNew);

	// jpg書き出し
	// jpgExport_fullPath(_root, saveFileName, 100);

	// png書き出し
	png24Export_fullPath(_root, saveFileName);

	// ドキュメントを保存せずに閉じる
	_docNew.close(SaveOptions.DONOTSAVECHANGES);

}//run


//-------------------------------------------------------------
// 特定レイヤーの大きさ取得
//-------------------------------------------------------------
function calcDocumentSize(_layer){
	var _bounds = _layer.bounds;
	var x = _bounds[0].value;
	var y = _bounds[1].value;
	var width = _bounds[2].value - x;
	var height = _bounds[3].value - y;

	wholeDocWidth += width;
	if(wholeDocHeight<height){
		wholeDocHeight = height;
	}
}

//-------------------------------------------------------------
// 日時を取得（YYYYMMDDddd_HHMMmm）
//-------------------------------------------------------------
function getTimeStamp(){
	//日時設定
	var days = ["sun","mon","tue","wed","thu","fri","sat"];
	var dObj = new Date();
	var y = dObj.getFullYear();
	var m = dObj.getMonth()+1;
	var d = dObj.getDate();
	var yb = dObj.getDay();
	var h = dObj.getHours();
	var mi = dObj.getMinutes();
	var s = dObj.getSeconds();
	var ms = dObj.getMilliseconds();
	//0付き二桁対応
	if(String(m).length==1) m="0"+m;
	if(String(d).length==1) d="0"+d;
	if(String(h).length==1) h="0"+h;
	if(String(mi).length==1) mi="0"+mi;
	if(String(s).length==1) s="0"+s;

	return y+""+m+""+d+""+days[yb]+"_"+h+""+mi+""+s;
}//getTimeStamp

//-------------------------------------------------------------
// ファイルの別名保存（保存ファイルパス, ターゲットドキュメント）
//-------------------------------------------------------------
function saveAsFile(saveFile, targetDoc){
	var fileObj = new File(saveFile);
	//psdファイル保存の設定
	var psdOpt = new PhotoshopSaveOptions();
	psdOpt.alphaChannels = true;
	psdOpt.annotations = true;
	psdOpt.embedColorProfile = false;
	psdOpt.layers = true;
	psdOpt.spotColors = false;
	targetDoc.saveAs(fileObj, psdOpt, true, Extension.LOWERCASE);
}//saveAsFile

//-------------------------------------------------------------
// アクティブドキュメントにファイルを配置（file-->place... / Placing Files in Photoshop）
//-------------------------------------------------------------
function placeFile(filePath) {
	var desc18 = new ActionDescriptor();
	desc18.putPath( charIDToTypeID('null'), new File( filePath) );
	desc18.putEnumerated( charIDToTypeID('FTcs'), charIDToTypeID('QCSt'), charIDToTypeID('Qcsa') );
		var desc19 = new ActionDescriptor();
		desc19.putUnitDouble( charIDToTypeID('Hrzn'), charIDToTypeID('#Pxl'), 0.000000 );
		desc19.putUnitDouble( charIDToTypeID('Vrtc'), charIDToTypeID('#Pxl'), 0.000000 );
	desc18.putObject( charIDToTypeID('Ofst'), charIDToTypeID('Ofst'), desc19 );
	executeAction( charIDToTypeID('Plc '), desc18, DialogModes.NO );
}

//-------------------------------------------------------------
// 全てのレイヤーを選択
//-------------------------------------------------------------
function selectFullLayers(){
	var idselectAllLayers = stringIDToTypeID( "selectAllLayers" );
		var desc7 = new ActionDescriptor();
		var idnull = charIDToTypeID( "null" );
			var ref4 = new ActionReference();
			var idLyr = charIDToTypeID( "Lyr " );
			var idOrdn = charIDToTypeID( "Ordn" );
			var idTrgt = charIDToTypeID( "Trgt" );
			ref4.putEnumerated( idLyr, idOrdn, idTrgt );
		desc7.putReference( idnull, ref4 );
	executeAction( idselectAllLayers, desc7, DialogModes.NO );
}

//-------------------------------------------------------------
// スマートオブジェクト化
//-------------------------------------------------------------
function smartSet(){
	var idx = stringIDToTypeID( "newPlacedLayer" );
	executeAction( idx, undefined, DialogModes.NO );
}

//-------------------------------------------------------------
// テキストレイヤー追加
//-------------------------------------------------------------
function addTextLayer(n){

	var _doc = app.activeDocument;
	var layerName = _doc.layers[n].name;

	layers = _doc.artLayers;
	var newLayer = layers.add();
	newLayer.kind = LayerKind.TEXT;

	newLayer.textItem.contents = layerName;							// テキストレイヤーの中身をセット
	newLayer.textItem.size = setFontSize;							// フォントサイズ
	// newLayer.textItem.font = "TelopMinPro-E";					// フォントの種類
	newLayer.textItem.justification = Justification.LEFT;			// 左寄せ
	newLayer.textItem.color.rgb.red = setFontColorR;
	newLayer.textItem.color.rgb.green = setFontColorG;
	newLayer.textItem.color.rgb.blue = setFontColorB;
	// newLayer.textItem.horizontalScale = 90;						// 水平比率
}

//-------------------------------------------------------------
// レイヤー移動
//-------------------------------------------------------------
function translateLayerAbsolutePosition(layerName, moveX, moveY){
	var targetLayer = activeDocument.layers[layerName];
	targetLayerBounds = targetLayer.bounds;
	resetX = parseInt(targetLayerBounds[0]) * -1;
	resetY = parseInt(targetLayerBounds[1]) * -1;
	targetLayer.translate(resetX , resetY);
	targetLayer.translate(moveX, moveY);
}

//-------------------------------------------------------------
// 選択中のレイヤーのX値を返す
//-------------------------------------------------------------
function getLayerPositionX(layerName){
	var targetLayer = activeDocument.layers[layerName];
	targetLayerBounds = targetLayer.bounds;
	resetX = parseInt(targetLayerBounds[0]);
	resetY = parseInt(targetLayerBounds[1]);
	return resetX;
}

//-------------------------------------------------------------
// 選択中のレイヤーのY値を返す
//-------------------------------------------------------------
function getLayerPositionY(layerName){
	var targetLayer = activeDocument.layers[layerName];
	targetLayerBounds = targetLayer.bounds;
	resetX = parseInt(targetLayerBounds[0]);
	resetY = parseInt(targetLayerBounds[1]);
	return resetY;
}

//-------------------------------------------------------------
// アクティブレイヤーを最背面へ移動する
//-------------------------------------------------------------
function sendToBackEnd(){
	var id192 = charIDToTypeID( "move" );
		var desc46 = new ActionDescriptor();
		var id193 = charIDToTypeID( "null" );
			var ref27 = new ActionReference();
			var id194 = charIDToTypeID( "Lyr " );
			var id195 = charIDToTypeID( "Ordn" );
			var id196 = charIDToTypeID( "Trgt" );
			ref27.putEnumerated( id194, id195, id196 );
		desc46.putReference( id193, ref27 );
		var id197 = charIDToTypeID( "T   " );
			var ref28 = new ActionReference();
			var id198 = charIDToTypeID( "Lyr " );
			var id199 = charIDToTypeID( "Ordn" );
			var id200 = charIDToTypeID( "Back" );
			ref28.putEnumerated( id198, id199, id200 );
		desc46.putReference( id197, ref28 );
	executeAction( id192, desc46, DialogModes.NO );
}

//-------------------------------------------------------------
// Web用に保存する（JPEG）--- Exif情報を含まない状態で書き出す	※fullPath
//-------------------------------------------------------------
function jpgExport_fullPath(fullPath, fileName, qualityVal){
	var doc = app.activeDocument;														//アクティブドキュメントの定義
	doc.changeMode(ChangeMode.RGB);													//イメージのモードをRGBへ変更

	//doc.bitsPerChannel = BitsPerChannelType.EIGHT;								//カラーチャンネルを8bitにする。JPEGのmaxは24bit。8bit*RGBの3チャンネルで24bit

	var options = new ExportOptionsSaveForWeb();									//Web用に保存用の設定をする
	options.quality = qualityVal;													//画質（0～100 デフォルトは60 大きいほど高品質）
	options.format = SaveDocumentType.JPEG;											//画像の形式 -> COMPUSERVEGIF, JPEG, PNG-8, PNG-24, BMP の指定が可能
	options.optimized = false;														//最適化するか
	options.interlaced = false;														//インターレースにするか（プログレッシブJPGにするか）

	var ext = '.jpg'
	var saveName = new File(fullPath + fileName + ext);		//フォルダパスを含めたファイル名をセット

	doc.exportDocument(saveName, ExportType.SAVEFORWEB, options);
}//jpgExport_fullPath

//-------------------------------------------------------------
// Web用に保存する（png24）	※fullPath
//-------------------------------------------------------------
function png24Export_fullPath(fullPath, fileName){
	var doc = app.activeDocument;														//アクティブドキュメントの定義
	pngOpt = new PNGSaveOptions();
	pngOpt.interlaced = false;
	var ext = '.png'
	var saveName = new File(fullPath + fileName + ext);		//フォルダパスを含めたファイル名をセット

	doc.saveAs(saveName, pngOpt, true, Extension.LOWERCASE);
}

//-------------------------------------------------------------
// 表示レイヤーの統合（レイヤーが一つだとアラート出るのでその対処を盛り込んだ）
//-------------------------------------------------------------
function mergeVisLayers(){
	if(activeDocument.artLayers.length>1){
		activeDocument.mergeVisibleLayers();
	}
}