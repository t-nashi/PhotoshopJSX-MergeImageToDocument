#target photoshop
app.bringToFront();	//�A�v���P�[�V����(photoshop)���őP�ʂɎ����Ă���

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
// ���s�X�N���v�g�t�@�C���̏��擾
var _script			= $.fileName;								//�X�N���v�g�t�@�C���̃t���p�X�擾
var _root			= File($.fileName).parent + "/";			//�X�N���v�g�t�@�C���܂ł̃p�X�擾
var _scriptName		= File($.fileName).name;					//�X�N���v�g�t�@�C�����擾
var _addFolder		= "_resource/";

// �ǂݍ��ޑΏۂ̃t�@�C����I�肷�邽�߂̐ݒ�
var dir			= new Folder(_root+_addFolder);					//�t�@�C���ǂݍ��݌��̃t�H���_�p�X
// var extention	= ".png";									//�g���q
// var files		= dir.getFiles("*" + extention);			//�w��g���q�̃t�@�C�����擾
var files		= dir.getFiles("*").sort();						//�w��g���q�̃t�@�C�����擾
var filecnt		= files.length;									//�����Ώۃt�@�C�����̎擾

// �h�L�������g�ݒ�
var _docNew;							// �V�K�ō쐬����h�L�������g��`�p

// init�����ŗ��p����l
var setFontSize = 24;					// �A�[�g�{�[�h����\�L����t�H���g�T�C�Y
var setFontColor = "#ffffff";			// �t�H���g�̐F
var posYtop = -40;						// �e�L�X�g���A�[�g�{�[�h���C���[�̏㕔�Ɉʒu�t�����邽�߂̃}�C�i�X�l
var addCanvasSizeW = 200;				// canvas�T�C�Y�ύX���Awidth�Ƀv���X����l
var addCanvasSizeH = 200;				// canvas�T�C�Y�ύX���Aheight�Ƀv���X����l
var setBackgroundColor = "#282828";		// �A�[�g�{�[�h���ɕ~���w�i���C���[�F

var marginWidth = 100;					// ���C���[�Ԃ̕�
var targetPosX = 0;						// ���C���[���ړ���������X�|�W�V����
var wholeDocWidth = 0;					// �ŏI�I�ɃT�C�Y�ύX����canvas�̕�
var wholeDocHeight = 0;					// �ŏI�I�ɃT�C�Y�ύX����canvas�̍���

var setFontColorR = parseInt(setFontColor.substring(1,3), 16);
var setFontColorG = parseInt(setFontColor.substring(3,5), 16);
var setFontColorB = parseInt(setFontColor.substring(5,7), 16);

var setBackgroundColorR = parseInt(setBackgroundColor.substring(1,3), 16);
var setBackgroundColorG = parseInt(setBackgroundColor.substring(3,5), 16);
var setBackgroundColorB = parseInt(setBackgroundColor.substring(5,7), 16);

//���̑�
var errorCount = 0;												//�G���[�񐔂��J�E���g

// photoshop�ݒ�
preferences.rulerUnits = Units.PIXELS;	// �P�ʂ�px�ɐݒ�



// �J���Ă�h�L�������g������Ώ����J�n
try{
	if(filecnt){
		//���� �������s�g���K�[ ������
		run();

		//�������S�Ċ���������ufinish!!!�v�ƕ\��
		alert("finish!!!\n" + (filecnt-errorCount) + "/" + filecnt);

	}else{
		throw new Error(errMsg = "�ǂݍ��ޑΏۂ̃t�@�C��������܂���");
	}
}catch(e){
	alert(e && e.message ? e.line+": "+e.message : e.line+": "+errMsg);
}




//-------------------------------------------------------------
// RUN (INITIALIZE | CONSTRUCT)
//-------------------------------------------------------------
function run(){

	// 01. �Ώۃt�@�C����Photoshop���֓ǂݍ���
	//-----------------------------------------------------
	//�w��`���̃t�@�C�������ɊJ���������s��
	for(var i=0; i<filecnt; i++){

		//�t�@�C�����܂ł̃t���p�X�擾
		var nameOfFile = String(files[i].fullName);

		//�t�@�C���I�u�W�F�N�g��`
		var openObj = new File(nameOfFile);

		//�t�@�C���I�[�v��
		try{

			//�ŏ��Ƃ���ȍ~�̏����𕪂��邽�߂̕�����
			if(i==0){
				//�y�Ώۂ̕����t�@�C���̈�ԍŏ��̃t�@�C���ɑ΂��鏈���j�z

				//�x�[�X�ƂȂ�t�@�C�����J���i�t�@�C�����\�[�g�ōŏ��ɗ���t�@�C���j
				(function(){app.open(openObj);})();
				//�x�[�X�ƂȂ�t�@�C���������₷���悤�ɕϐ��ɒ�`
				var _doc = app.activeDocument;
				//�h�L�������g�T�C�Y�����߂�
				preferences.rulerUnits = Units.PIXELS;
				var docW = _doc.width.value;
				var docH = _doc.height.value;
				//�V�K�h�L�������g���쐬�i�x�[�X�t�@�C���Ɠ��� width/height/dpi �ō쐬�j
				var res = _doc.resolution;

				//�V�K�h�L�������g���쐬
				documents.add(docW,docH,res);
				//�V�K�h�L�������g�������₷���悤�ɕϐ��ɒ�`
				_docNew = app.activeDocument;

				//�x�[�X�t�@�C����ۑ������ɕ���
				_doc.close(SaveOptions.DONOTSAVECHANGES);

				//�V�K�h�L�������g�Ƀx�[�X�t�@�C����z�u�i�X�}�[�g�I�u�W�F�N�g�t�@�C���Ƃ��āj
				try{
					placeFile(openObj);
				}catch(e){
					continue;
				}
				//���C���[�����t�@�C�����Ɠ����ɂ���
				_docNew.activeLayer.name = files[i].name;

				//�V�K�h�L�������g���́u�w�i�v���C���[���폜
				_docNew.layers[1].remove();
			}else{

				//�y�Ώۂ̕����t�@�C����2�Ԗڈȍ~�̃t�@�C���̏��� �i�X�}�[�g�I�u�W�F�N�g�����ăA�N�e�B�u�h�L�������g�ɔz�u�j�z
				try{
					app.open(openObj);
					var _doc = app.activeDocument;
					// selectFullLayers();
					mergeVisLayers();
					smartSet();
					// _doc.activeLayer.name = _doc.name;					//���C���[���̕ύX
					_doc.activeLayer.duplicate(_docNew,ElementPlacement.PLACEATBEGINNING);	//�h�L�������g�̐擪�ɕ���
					_doc.close(SaveOptions.DONOTSAVECHANGES);
				}catch(e){
					continue;
				}

				//���C���[���̕ύX
				_docNew.activeLayer.name = files[i].name;

			}

		}catch(e){
			errorCount++;
		}

	}//for


	// 02. �h�L�������g���̃��C���[�������тɂ���canvas�T�C�Y���L����
	//-----------------------------------------------------
	var ChildLyaers = _docNew.layers;				// ���C���[��`
	var layerCount = ChildLyaers.length;			// ���C���[���J�E���g

	// �h�L�������g���̃��C���[������������
	for(var i=0; i<layerCount; i++){
		var targetLayerNum = (layerCount)-1-i;

		// ���C���[2�ڈȍ~����̏���
		if(0<i){
			wholeDocWidth += marginWidth;
			ChildLyaers[targetLayerNum].translate(wholeDocWidth, 0);
		}
		// ���背�C���[�̑傫���擾
		calcDocumentSize(ChildLyaers[targetLayerNum]);
	}
	// canvas�T�C�Y�̕ύX
	app.activeDocument.resizeCanvas(wholeDocWidth, wholeDocHeight, AnchorPosition.TOPLEFT);


	// 03. �e���C���[�̖��O�̃e�L�X�g���C���[���쐬�A�h�L�������g�S�̗p�̔w�i���C���[���쐬
	//-----------------------------------------------------
	var setLayerNumber = 0;						// �����Ώۂ̃��C���[�ԍ����Z�b�g���邽�߂̓��ꕨ
	var addNumVal = 0;							// ���C���[�w��̂��߂̒����l

	// ���C���[�����擾���ăe�L�X�g���C���[�ɋN�����Ă���
	for(var i=0; i<layerCount; i++){

		// ���߂͏������Ȃ�
		if(i!==0) setLayerNumber=i+addNumVal;

		// �e�L�X�g���C���[�ǉ�
		_docNew.suspendHistory("Add TextLayer", "addTextLayer(setLayerNumber)");

		addNumVal++;
	}

	var maxLayerCount = layerCount*2-1;			// ���̎��_�ł̃��C���[�̍��v��

	// ���C���[��������̈ʒu�ֈړ�
	for(var i=0; i<layerCount; i++){
		translateLayerAbsolutePosition(i, getLayerPositionX(maxLayerCount), getLayerPositionY(maxLayerCount)+posYtop);
		maxLayerCount--;
	}

	// canvas�T�C�Y�̕ύX
	_docNew.resizeCanvas(_docNew.width+addCanvasSizeW, _docNew.height+addCanvasSizeH, AnchorPosition.MIDDLECENTER);

	// ���C���[�ǉ�
	_docNew.artLayers.add();
	_docNew.activeLayer.name = "Background";

	// ���C���[�h��Ԃ�
	var myColor = new SolidColor();
	myColor.rgb.red = myColor.rgb.green = myColor.rgb.blue = 0;
	myColor.rgb.red = setBackgroundColorR;
	myColor.rgb.green = setBackgroundColorG;
	myColor.rgb.blue = setBackgroundColorB;
	app.activeDocument.selection.selectAll();			// �S�Ă�I������
	app.activeDocument.selection.fill(myColor, ColorBlendMode.NORMAL, 100, false);			// �h��Ԃ�
	app.activeDocument.selection.deselect();			// �I��͈͂̉���

	// ���C���[���Ŕw�ʂֈړ�
	sendToBackEnd();


	// 04. psd�ۑ���png�����o���iYYYYMMDDddd_HHMMmm.psd�j
	//-----------------------------------------------------

	//�t�@�C�����ݒ�
	var saveFileName = getTimeStamp();
	var fileObj = new File(_root + saveFileName + ".psd");
	//�t�@�C����ʖ��ۑ�
	saveAsFile(fileObj, _docNew);

	// jpg�����o��
	// jpgExport_fullPath(_root, saveFileName, 100);

	// png�����o��
	png24Export_fullPath(_root, saveFileName);

	// �h�L�������g��ۑ������ɕ���
	_docNew.close(SaveOptions.DONOTSAVECHANGES);

}//run


//-------------------------------------------------------------
// ���背�C���[�̑傫���擾
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
// �������擾�iYYYYMMDDddd_HHMMmm�j
//-------------------------------------------------------------
function getTimeStamp(){
	//�����ݒ�
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
	//0�t���񌅑Ή�
	if(String(m).length==1) m="0"+m;
	if(String(d).length==1) d="0"+d;
	if(String(h).length==1) h="0"+h;
	if(String(mi).length==1) mi="0"+mi;
	if(String(s).length==1) s="0"+s;

	return y+""+m+""+d+""+days[yb]+"_"+h+""+mi+""+s;
}//getTimeStamp

//-------------------------------------------------------------
// �t�@�C���̕ʖ��ۑ��i�ۑ��t�@�C���p�X, �^�[�Q�b�g�h�L�������g�j
//-------------------------------------------------------------
function saveAsFile(saveFile, targetDoc){
	var fileObj = new File(saveFile);
	//psd�t�@�C���ۑ��̐ݒ�
	var psdOpt = new PhotoshopSaveOptions();
	psdOpt.alphaChannels = true;
	psdOpt.annotations = true;
	psdOpt.embedColorProfile = false;
	psdOpt.layers = true;
	psdOpt.spotColors = false;
	targetDoc.saveAs(fileObj, psdOpt, true, Extension.LOWERCASE);
}//saveAsFile

//-------------------------------------------------------------
// �A�N�e�B�u�h�L�������g�Ƀt�@�C����z�u�ifile-->place... / Placing Files in Photoshop�j
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
// �S�Ẵ��C���[��I��
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
// �X�}�[�g�I�u�W�F�N�g��
//-------------------------------------------------------------
function smartSet(){
	var idx = stringIDToTypeID( "newPlacedLayer" );
	executeAction( idx, undefined, DialogModes.NO );
}

//-------------------------------------------------------------
// �e�L�X�g���C���[�ǉ�
//-------------------------------------------------------------
function addTextLayer(n){

	var _doc = app.activeDocument;
	var layerName = _doc.layers[n].name;

	layers = _doc.artLayers;
	var newLayer = layers.add();
	newLayer.kind = LayerKind.TEXT;

	newLayer.textItem.contents = layerName;							// �e�L�X�g���C���[�̒��g���Z�b�g
	newLayer.textItem.size = setFontSize;							// �t�H���g�T�C�Y
	// newLayer.textItem.font = "TelopMinPro-E";					// �t�H���g�̎��
	newLayer.textItem.justification = Justification.LEFT;			// ����
	newLayer.textItem.color.rgb.red = setFontColorR;
	newLayer.textItem.color.rgb.green = setFontColorG;
	newLayer.textItem.color.rgb.blue = setFontColorB;
	// newLayer.textItem.horizontalScale = 90;						// �����䗦
}

//-------------------------------------------------------------
// ���C���[�ړ�
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
// �I�𒆂̃��C���[��X�l��Ԃ�
//-------------------------------------------------------------
function getLayerPositionX(layerName){
	var targetLayer = activeDocument.layers[layerName];
	targetLayerBounds = targetLayer.bounds;
	resetX = parseInt(targetLayerBounds[0]);
	resetY = parseInt(targetLayerBounds[1]);
	return resetX;
}

//-------------------------------------------------------------
// �I�𒆂̃��C���[��Y�l��Ԃ�
//-------------------------------------------------------------
function getLayerPositionY(layerName){
	var targetLayer = activeDocument.layers[layerName];
	targetLayerBounds = targetLayer.bounds;
	resetX = parseInt(targetLayerBounds[0]);
	resetY = parseInt(targetLayerBounds[1]);
	return resetY;
}

//-------------------------------------------------------------
// �A�N�e�B�u���C���[���Ŕw�ʂֈړ�����
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
// Web�p�ɕۑ�����iJPEG�j--- Exif�����܂܂Ȃ���Ԃŏ����o��	��fullPath
//-------------------------------------------------------------
function jpgExport_fullPath(fullPath, fileName, qualityVal){
	var doc = app.activeDocument;														//�A�N�e�B�u�h�L�������g�̒�`
	doc.changeMode(ChangeMode.RGB);													//�C���[�W�̃��[�h��RGB�֕ύX

	//doc.bitsPerChannel = BitsPerChannelType.EIGHT;								//�J���[�`�����l����8bit�ɂ���BJPEG��max��24bit�B8bit*RGB��3�`�����l����24bit

	var options = new ExportOptionsSaveForWeb();									//Web�p�ɕۑ��p�̐ݒ������
	options.quality = qualityVal;													//�掿�i0�`100 �f�t�H���g��60 �傫���قǍ��i���j
	options.format = SaveDocumentType.JPEG;											//�摜�̌`�� -> COMPUSERVEGIF, JPEG, PNG-8, PNG-24, BMP �̎w�肪�\
	options.optimized = false;														//�œK�����邩
	options.interlaced = false;														//�C���^�[���[�X�ɂ��邩�i�v���O���b�V�uJPG�ɂ��邩�j

	var ext = '.jpg'
	var saveName = new File(fullPath + fileName + ext);		//�t�H���_�p�X���܂߂��t�@�C�������Z�b�g

	doc.exportDocument(saveName, ExportType.SAVEFORWEB, options);
}//jpgExport_fullPath

//-------------------------------------------------------------
// Web�p�ɕۑ�����ipng24�j	��fullPath
//-------------------------------------------------------------
function png24Export_fullPath(fullPath, fileName){
	var doc = app.activeDocument;														//�A�N�e�B�u�h�L�������g�̒�`
	pngOpt = new PNGSaveOptions();
	pngOpt.interlaced = false;
	var ext = '.png'
	var saveName = new File(fullPath + fileName + ext);		//�t�H���_�p�X���܂߂��t�@�C�������Z�b�g

	doc.saveAs(saveName, pngOpt, true, Extension.LOWERCASE);
}

//-------------------------------------------------------------
// �\�����C���[�̓����i���C���[������ƃA���[�g�o��̂ł��̑Ώ��𐷂荞�񂾁j
//-------------------------------------------------------------
function mergeVisLayers(){
	if(activeDocument.artLayers.length>1){
		activeDocument.mergeVisibleLayers();
	}
}