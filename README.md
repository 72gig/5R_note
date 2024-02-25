# 5R_note

## 基本介紹

透過 python 與 reactjs 做出的康乃爾筆記法程式，通過 reactjs 完成的前端使用時不需要再另外安裝，資料保存在資料庫，開啟方式請參照下方的開啟指南，或是在Release下載執行檔

## 開啟指南

### 不使用執行檔

使用環境 python3.9

需要安裝模組flask，可在終端機輸入

`python install flask`

直接使用可先在資料夾目錄通過終端輸入

`cd python-flask-server`

再執行python程式

`python main.py`

## 使用執行檔

### 自行建立執行檔

使用環境 python3.9

需要安裝模組flask，可在終端機輸入

`python install flask`

需要另外安裝pyinstaller，可在終端機輸入，版本太新可能有異常，可設定安裝5.0版本

`python install pyinstaller==5.0`

輸入下列指令

`pyinstaller --noconsole -w -F --add-data="templates;templates" --add-data="app;app" main.py`

執行檔會保存在dict資料夾內

### 使用已有的執行檔

在Release下載執行檔，下載的執行檔可直接開啟

## 使用方式

程式執行時將會自動開啟網頁

![image](https://github.com/72gig/5R_note/blob/main/images/All_page.png)

左上方可以建立用於輸入資料的資料庫，可視為筆記的主題命名

![image](https://github.com/72gig/5R_note/blob/main/images/Create_database.png)

左側可以建立頁面，可視為筆記的標題

![image](https://github.com/72gig/5R_note/blob/main/images/Create_page.png)

剩下欄位可用於記錄筆記內容，記得要輸入完以後需要保存筆記

![image](https://github.com/72gig/5R_note/blob/main/images/Note_test.png)

關閉程式請按右邊的關閉程式按鈕，按下確定即完成關閉，直接關閉瀏覽器程式會在後台繼續執行

![image](https://github.com/72gig/5R_note/blob/main/images/Close_program.png)









