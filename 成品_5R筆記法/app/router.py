import sqlite3
import os
import re
import json
import sys

from flask import request,jsonify

def create_new_sql_database():
    value = request.args.get("inputValue")
    dbName = value + ".db"
    if os.path.exists(dbName):
        return {"message": ["createFail", "this name is exits"]}
    con = sqlite3.connect(dbName)
    # 建立欄位, id(唯一), 名稱(唯一), 筆記欄, 關係字, 整理欄, 其它
    cur = con.cursor()
    cur.execute(f"create table {value}(  \
                id integer primary key autoincrement,  \
                title text unique,  \
                draft text,  \
                keyWord text,  \
                summary text,  \
                other text);" )
    con.close()
    return {"message": ["createSuccess", "create db name is ", dbName]}

def create_new_sql_page():
    # 用GET方式傳回資料, 需要得到資料庫名稱跟新增行的名稱
    lineValue = str(request.args.get("inputPageValue"))
    databasefile = str(request.args.get("databaseName"))
    con = sqlite3.connect(databasefile)  # 在js那邊已經設定後方有 .db
    # 需要把後面的 .db 取下
    fileName = re.search(r'(\w+)\.db', databasefile).group(1)
    cur = con.cursor()
    # 建立一行sql資料
    # print(fileName)
    # print(lineValue)
    cur.execute(f"insert into {fileName} (title) values (\"{lineValue}\");")
    con.commit()
    con.close()
    return {"message": ["createSuccessPage",
                        f"{fileName} have a page, title is", lineValue]}


def get_exist_sql_data():
    # value = request.get_data()
    if 'file' not in request.files:
        return {"message": ["can not use this"]}
    file = request.files['file']
    filename = ''
    content = file.headers.get('Content-Disposition', None)
    if content:
        filename = re.search(r'filename="(.+)"', content).group(1)
        # print('File Name:', filename)
    else:
        return {"message": ["can not use this"]}
    # 我需要把已有的庫料庫頁面回傳回去
    unFileExtension = re.search(r'(\w+)\.db', filename).group(1)
    con = sqlite3.connect(filename)
    cur = con.cursor()
    cur.execute(f"select id, title from {unFileExtension};")
    results = cur.fetchall()
    con.close()
    # 為了傳回資料需要把結果改為json的格式
    jsonResults = []
    for i in results:
        jsonDict = {"id": i[0], "title": i[1]}
        jsonResults.append(jsonDict)

    return {"message": ["uploadSuccess", "filename is", filename,
                        "pageName is", jsonResults]}

def save_page():
    data = request.form
    database = str(data.get('database'))
    datapage = str(data.get('datapage'))
    keyWord = str(data.get('keyWord'))
    draftWord = str(data.get('draftWord'))
    summaryWord = str(data.get('summaryWord'))
    unFileExtension = re.search(r'(\w+)\.db', database).group(1)
    con = sqlite3.connect(database)
    cur = con.cursor()
    cur.execute(f"update {unFileExtension} set draft = ?,  keyWord = ?, summary = ?  where title = ?;",
                (draftWord, keyWord, summaryWord, datapage))
    con.commit()
    con.close()
    
    return {'message': []}

def delete_exist_sql_pageline():
    lineValue = str(request.args.get("inputPageValue"))
    databasefile = str(request.args.get("databaseName"))
    unFileExtension = re.search(r'(\w+)\.db', databasefile).group(1)
    con = sqlite3.connect(databasefile)
    cur = con.cursor()
    cur.execute(f"delete from {unFileExtension} where title = \"{lineValue}\";")
    con.commit()
    con.close()

    return {"message": ["delectSuccess", "CheckNextOne"]}

def return_sql_page_data():
    lineValue = str(request.args.get("pageValue"))
    databasefile = str(request.args.get("databaseName"))

    unFileExtension = re.search(r'(\w+)\.db', databasefile).group(1)
    con = sqlite3.connect(databasefile)
    cur = con.cursor()
    # print(unFileExtension)
    cur.execute(f"select * from {unFileExtension} where title = \"{lineValue}\";")
    result = cur.fetchall()
    con.close()
    returnMessage = ''
    for row in result:
        returnMessage = {"message": ["returnSuccess", "willLoadData"], "keyWord": [row[3]], "draftWord": [row[2]], "summary": [row[4]]}
    return returnMessage


def close_program():
    # close_server()
    # 如果前段程式碼沒有完成要求
    os._exit(1)
    return {"message": ["closeSuccess"]}

def close_server():
    func = request.environ.get("werkzeug.server.shutdown")
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
        
    func()