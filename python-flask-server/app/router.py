import sqlite3
import os
import re

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
                other text)" )
    con.close()
    return {"message": ["createSuccess", "create db name is ", dbName]}

def create_new_sql_page():
    # 用GET方式傳回資料, 需要得到資料庫名稱跟新增行的名稱
    lineValue = request.args.get("inputPageValue")
    databasefile = request.args.get("databaseName")
    con = sqlite3.connect(databasefile)  # 在js那邊已經設定後方有 .db
    # 需要把後面的 .db 取下
    fileName = re.search(r'(\w+)\.db', databasefile).group(1)
    cur = con.cursor()
    # 建立一行sql資料
    cur.execute(f"insert into {fileName} (title) values ('{lineValue}')")
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
        print('File Name:', filename)
    else:
        return {"message": ["can not use this"]}
    return {"message": ["uploadSuccess", "filename is", filename]}

def save_page():
    return True