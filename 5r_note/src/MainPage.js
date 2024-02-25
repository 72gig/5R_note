import React, { useReact, useState, useEffect } from 'react'
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import styles from './MainPages.module.css'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'


export default function MainPage() {

  const [items, setItems] = useState([]);  // 關係字的資料
  const [showPopup, setShowPopup] = useState(false);  // 新增資料庫顯示框
  const [inputValue, setInputValue] = useState('');  // 新增資料庫輸入值
  const [invisibleHint, setInvisibleHint] = useState(null);  // 提示顯示值
  const [invisibleValue, setInvisibleValue] = useState(null);  // 提示顯示值
  const [showPagePopup, setShowPagePopup] = useState(false);  // 新增頁面顯示值值
  const [inputPageValue, setInputPageValue] = useState('未設定');  // 新增頁面輸入值, 同為指定頁面
  const [databaseName, setDatabaseName] = useState('');  // 指定的資料庫
  const [unexistRecord, setUnexistRecord] = useState(true);  // 提示顯示值
  const [quillDraftValue, setQuillDraftValue] = useState('');  // 用於筆記欄的記錄
  const [quillSummaryValue, setQuillSummaryValue] = useState('');  // 用於整理欄的記錄



  useEffect(() => {
    document.getElementById('targetPagelineName').innerHTML = inputPageValue;
    if (showPagePopup === true){
      if (document.getElementById('settingPageName').value !== ""){
        // 代表是新增頁面
        document.getElementById('settingPageName').value = "";
        sendDataToCreatePage(inputPageValue);
        setShowPagePopup(false);
      }
    }
  }, [inputPageValue]);


  const sendDataToCreatePage = () => {  //建立新的頁面，相當於在sql內加上一行
    fetch(`/create_new_sql_page?inputPageValue=${inputPageValue}&databaseName=${databaseName}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('網路回傳資料異常');
      })
      .then(data => {
        console.log(data); // 輸出返回的資料
        // 我要在資料庫記錄頁面建立一行頁面記錄, 名字是 inputPageValue
        // 需要動態建立
        const pageline = document.createElement('li');
        const pageLineText = document.createElement('p');
        pageLineText.innerHTML = inputPageValue;
        pageline.appendChild(pageLineText);
        pageline.id = inputPageValue + '_' + databaseName;
        pageLineText.addEventListener('click', function() {
          const existList = document.getElementById('pageLine').getElementsByTagName('li');
          //還要加事件
          for (let index = 0; index < existList.length; index++) {
            existList[index].setAttribute('isSelected', false);
            
          }
          this.parentNode.setAttribute('isSelected',true);
          
          // 從資料庫得到資料後傳到關係字頁面、筆記欄頁面, 整理欄頁面
          importPageData(this.innerHTML, databaseName);
        })
        const pagelineDelete = document.createElement('button');
        pagelineDelete.innerHTML = '刪除';
        // 使用閉包來捕獲變量 i 的值
        pagelineDelete.addEventListener('click', function() {
          pagelineDeleteMethod(inputPageValue, databaseName);
        });
        // 加入到列表內
        const targetUl = document.getElementById('pageLine');
        targetUl.appendChild(pageline);
        pageline.appendChild(pagelineDelete);
        // 顯示目前指定這個空頁面, 直接觸發事件
        pageLineText.click()
        //確認已有記錄
        setUnexistRecord(false);
       
      })
      .catch(error => console.error('Error:', error));
  };

  const sendDataToCreateDatabase = () => {
    // 送在這裡設定的名字給python的flask去建立資料庫, 建立完後回傳完成
    fetch(`/create_new_sql_database?inputValue=${inputValue}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('網路回傳資料異常');
      })
      .then(data => {
        console.log('Data from backend:', data);
        if (data['message'][0] === 'createFail') {
          alert("這個名字不可以用在建立新的名字，可能是已經有這個名稱的資料庫了")
        }
        else {
          confirmDatabase(data['message'][2])
          // 新資料庫, 需要清空資料
          document.getElementById('pageLine').innerHTML = '';
          document.getElementById('keyWordList').innerHTML = '';
          document.getElementById('draftWordText').value = '';
          document.getElementById('summaryText').value = '';
        }

      })
      .catch(error => {
        console.error('Error:', error);
        // 在此處處理錯誤
      });
  };

  const handleExistDatabase = async () => {  // 指定已有的資料庫,這裡會建立一個動態的input, 傳資料到後端
    try {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.db';

      fileInput.addEventListener('change', async (event) => {
        const selectedFile = event.target.files[0];
        const formData = new FormData();
        formData.append('file', selectedFile);

        console.log(formData);

        const response = await fetch('/upload_exist_database', {
          method: 'POST',
          body: formData,
        });

        // Handle response from Flask backend
        const data = await response.json();
        // setSelectFile(selectedFile);
        setDatabaseName(data['message'][2]);
        // 把取得的資料顯示在資料庫記錄頁面, 還要先清空已有的頁面
        document.getElementById('pageLine').innerHTML = '';
        if(Object.keys(data['message'][4]).length >= 1)
          setUnexistRecord(false);  // 加入得到的資料, 還要把無記錄的提示改為不顯示
          for (var i = 0; i < Object.keys(data['message'][4]).length; i++){
            console.log(data['message'][4][i]);
            const pageline = document.createElement('li');
            const pageLineText = document.createElement('p');
            pageLineText.innerHTML = data['message'][4][i]['title'];
            pageline.appendChild(pageLineText);
            pageline.id = data['message'][4][i]['title'] + '_' + data['message'][2];
            const pagelineDelete = document.createElement('button');
            pagelineDelete.innerHTML = '刪除';

            // 使用閉包來捕獲變量 i 的值
            (function(index) {
              pagelineDelete.addEventListener('click', function() {
                console.log(databaseName);
                pagelineDeleteMethod(data['message'][4][index]['title'], data['message'][2]);
              });
            })(i); // 傳入 i 的值作為參數
                    
            // 加入到列表內
            const targetUl = document.getElementById('pageLine');
            targetUl.appendChild(pageline);
            pageline.appendChild(pagelineDelete);
          }
        //為所有按鈕加上顯示事件  TODO
        const ReadyExistList = document.getElementById('pageLine').getElementsByTagName('li');
        //還要加事件
        for (let index = 0; index < ReadyExistList.length; index++) {
          ReadyExistList[index].setAttribute('isSelected',false);
          ReadyExistList[index].getElementsByTagName('p')[0].addEventListener('click', function() {
            const existList = document.getElementById('pageLine').getElementsByTagName('li');
            //還要加事件
            for (let secondIndex = 0; secondIndex < existList.length; secondIndex++) {
              existList[secondIndex].setAttribute('isSelected',false);
              
            }
            this.parentNode.setAttribute('isSelected',true); //加在<p>的父節點
            setInputPageValue(this.innerHTML);  //這裡還需要修改
            // 從資料庫得到資料後傳到關係字頁面、筆記欄頁面, 整理欄頁面
            // 要設定按在字上面, 不然按刪除也會顯示
            importPageData(this.innerHTML, data['message'][2]);
          })
        }

        confirmDatabase(data['message'][2])
      });

      fileInput.click();
    } catch (error) {
      console.error('Error selecting file:', error);
    }
  };

  const importPageData = (pageName, database) => {
    fetch(`/return_sql_page_data?pageValue=${pageName}&databaseName=${database}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('網路回傳資料異常');
    })
    .then(data => {
      console.log(data);
      // 設定關𠐫字
      document.getElementById('keyWordList').innerHTML = data['keyWord'][0];
      //document.getElementById('keyWordList').setAttribute('innerHTML', data['keyWord'][0])
      //上行會變成 <ul id=... innerhtml=...
      // 設定筆記欄
      setQuillDraftValue(data['draftWord'][0])
      // 設定整理欄
      setQuillSummaryValue(data['summary'][0]);
      
    })
    .catch(error => {
      console.error('Error:', error);
      // 在此處處理錯誤
    });
  }

  const confirmDatabase = (confirmDatabaseName) => {
    // 顥示已設定資料庫一段時間
    setInvisibleHint(true);
    setTimeout(() => {
      setInvisibleHint(false);
    }, 3000);
    setInvisibleValue(true);
    // 要在前端寫上資料庫名稱, 不然會不知道現的是在用哪個資料庫
    document.getElementById('targetDatabaseName').innerHTML = confirmDatabaseName;
    // 保存目前的資料庫名稱
    setDatabaseName(confirmDatabaseName);
  }

  const pagelineDeleteMethod = (pagelineTitle, returnDatabaseName) => {
    fetch(`/delete_exist_sql_pageline?inputPageValue=${pagelineTitle}&databaseName=${returnDatabaseName}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('網路回傳資料異常');
    })
    .then(data => {
      console.log(data);

      document.getElementById('pageLine').removeChild(document.getElementById(`${pagelineTitle}_${returnDatabaseName}`));
      document.getElementById('keyWordList').innerHTML = '';
      setQuillDraftValue('');
      setQuillSummaryValue('');
    })
    .catch(error => {
      console.error('Error:', error);
      // 在此處處理錯誤
    });
  }

  const handleSaveData = async () => {  //傳送資料到後端
    const formData = new FormData();
    // formData.append('file', selectedFile);
    formData.append('database', databaseName);
    formData.append('datapage', inputPageValue);
    formData.append('keyWord', document.getElementById('keyWordList').innerHTML);
    formData.append('draftWord', quillDraftValue);
    formData.append('summaryWord', quillSummaryValue);

    console.log(formData);

    const response = await fetch('/save_page', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
  }

  const addItem = () => {
    const newItem = { id: Date.now(), text: '' };
    setItems(prevItems => [...prevItems, newItem]);
  };

  const removeItem = id => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleTextChange = (id, newText) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, text: newText } : item
      )
    );
  };

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleConfirm = () => {
    // 在此處處理確認按鈕的邏輯
    console.log('Input value:', inputValue);
    sendDataToCreateDatabase(inputValue);
    setShowPopup(false);
  };

  const handleNewPageClick = () => {
    setShowPagePopup(true);
  }

  const handleNewPageClose = () => {
    setShowPagePopup(false);
  };


  const handleNewPageConfirm = () => {
    // 確認頁面是否有重複
    const existPage = document.getElementById('pageLine').getElementsByTagName('li');
    const newPageValue = document.getElementById('settingPageName').value;
    let haveSameValue = false;
    for (let index = 0; index < existPage.length; index++) {
      if (existPage[index].getElementsByTagName('p')[0].innerHTML === newPageValue){
        haveSameValue = true;
      }
    }
    if (haveSameValue === false){
      setInputPageValue(document.getElementById('settingPageName').value);
    }
    else {
      alert("這是已經使用的頁面名稱");
    }
  };

  const handleCloseProgram = () => {
    // 關閉flask之後自行關閉
    fetch(`/close_program`)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('關閉伺服器失敗：', error);
    });
    // 關閉前端伺服器
    setTimeout(() => {
      window.close();
    }, 1000);
    alert('請按確認關閉......如果是手動輸入網址，請手動關閉頁面')
  }

  return (
    <div>
      <div>
        <div className={styles.topBar}>
          <p className={styles.fontSize24px}>康乃爾 5R 筆記</p><p className={styles.paddingTop5px}>透過網頁程式達成</p>
        </div>
        <div id='statusBar' className={styles.statusBar}>
          <Link className={styles.leftButton} onClick={handleButtonClick}>新增筆記</Link>
          {showPopup && (
            <div className="popup">
              <div className="popup-content">
                <input type="text" value={inputValue} onChange={handleInputChange} />
                <button onClick={handleConfirm}>確認</button>
                <button onClick={handleClosePopup}>取消</button>
              </div>
            </div>
          )}

          <button id='readDatabase' className={`${styles.leftButton} ${styles.statusBotton}`} onClick={handleExistDatabase}>使用已有的筆記</button>
          {invisibleHint && (
            <p className={styles.willInvisibleLine}>已指定筆記</p>
          )}
          <Link className={styles.rightButton} onClick={handleSaveData}>保存筆記</Link>
          {/*
          <Link className={styles.rightButton} to="/setting_page">設定</Link>
          */}
          <p className={styles.redValue}>目前設定筆記:</p>
          <p id='targetDatabaseName' className={styles.redValue}>未設定</p>
          <p className={styles.redValue}>，目前設定頁面:</p>
          <p id='targetPagelineName' className={styles.redValue}>未設定</p>
          <Link style={{position: 'fixed',right: '0'}} className={styles.rightButton} onClick={handleCloseProgram}>關閉程式</Link>
        </div>
        <div className={styles.container}>
          <div className={styles.sideBar}>
              <p>筆記記錄頁面</p>
              <div>
                {invisibleValue ? null : <p style={{display: 'inline-block'}} className={styles.redValue}>目前還未設定筆記</p>}
                {invisibleValue && (
                  <Link className={styles.leftButton} onClick={handleNewPageClick}>新增頁面</Link>
                )}
                {showPagePopup && (
                  <div className="popup">
                    <div className="popup-content">
                      <input id="settingPageName" type="text"/> {/*在用記錄頁面的加入*/}
                      <button onClick={handleNewPageConfirm}>確認</button>
                      <button onClick={handleNewPageClose}>取消</button>
                    </div>
                  </div>
                )}
              </div>
              {invisibleValue && unexistRecord && (
                <p className={styles.redValue}>目前的筆記並沒有存在已有的記錄</p>
              )}
              {/*在這裡設定動態新行 */}
              <div className={styles.pageLine}>
                <ul id='pageLine'>
                </ul>
              </div>
          </div>
          <div className={styles.keyWord}>
              <p>關係字頁面</p>
              <button onClick={addItem}>新增項目</button>
              <ul id='keyWordList'>
              {items.map(item => (
                <li key={item.id}>
                  <textarea
                    type="text"
                    value={item.text}
                    onChange={e => handleTextChange(item.id, e.target.value)}
                  />
                  <button onClick={() => removeItem(item.id)}>刪除</button>
                </li>
              ))}
              </ul>
          </div>
          <div className={styles.draftWord}>
            
              <p style={{display: 'inline-block'}}>筆記欄頁面</p>
               <ReactQuill id='draftWordText' className={styles.draftWordQuill} theme="snow" value={quillDraftValue} onChange={setQuillDraftValue} />
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <div style={{display: 'inline-block'}} className={styles.summaryWordTitle}>
          <p>整理欄頁面</p>
        </div>
           <ReactQuill id='summaryText' style={{display: 'inline-block'}} className={styles.summaryWordQuill} theme="snow" value={quillSummaryValue} onChange={setQuillSummaryValue} />
      </div>
    </div>
  )
}
