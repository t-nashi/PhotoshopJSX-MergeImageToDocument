# PhotoshopJSX-MergeImageToDocument

このプログラムは [Adobe Photoshop](http://www.adobe.com/jp/products/photoshop.html) で動作する JavaScript(JSX) です。
実行するとJSXファイルと同階層の「`_resource`」フォルダ内にあるPhotoshopで読み込み可能なファイルを一つの psd ドキュメント内にまとめて、各レイヤー毎の名前を付与して psd と png を出力します。

▽動作確認済み
* Adobe Photoshop CC 2018 （Windows10、macOS High Sierra(v10.13.3)）

## 解説サイト

...準備中...


## 注意 （cautionn）

* 本プログラムご使用は自己責任でお願いいたします


## インストール （Installation）

1. このページの `Clone or download` ボタンよりリポジトリのクローンもしくはZIPダウンロードをします。
2. ZIPダウンロードの場合は解凍をします。
3. 解凍して出来たフォルダの中に「`MergeImageToDocument.jsx`」があれば完了です。


## 使用法 （Usage）

* 「`MergeImageToDocument.jsx`」をダブルクリックか Photoshop 内へドラッグ＆ドロップして実行

すでに「_resource」フォルダ内にサンプルのpng・jpgファイルを用意しているので、JSXファイルを実行することで効果を確認できます。
JSXファイルと同階層に実行時の日時の psd ファイルと png ファイルが出力されれば成功です。


## 仕様 (specification)

* `MergeImageToDocument.jsx` がメインの実行ファイル
* `_resource` フォルダ内の `png・jpg・その他Photoshopで読み込み可能ファイル` を Photoshop 内へ読み込む （サンプルpng・jpg用意済）
* png・jpgファイルの読み込みの順番はファイル名の昇順
* 読み込まれた順番で左から右へ整列する
* 各レイヤー上部へ作成されるテキストの色・サイズ、最下部に配置する背景レイヤーの色等はスクリプト内で調整可能
* psdファイルは一番最初に読み込んだファイルのドキュメントサイズ・解像度を踏襲している
* 処理が成功するとJSXファイルと同階層に実行日時名の psd と png(24bit) ファイルが出力される


## コピーライト （Copyright）
Copyright © 2018+ Tsutomu Takanashi. See LICENSE for details.
