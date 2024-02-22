from flask import Flask
from app.router import create_new_sql_database, create_new_sql_page, get_exist_sql_data,  \
                save_page, delete_exist_sql_pageline, return_sql_page_data



def create_app():
    app = Flask(__name__)
    app.add_url_rule('/create_new_sql_database', 'create_new_sql_database', create_new_sql_database)
    app.add_url_rule('/create_new_sql_page', 'create_new_sql_page', create_new_sql_page)
    app.add_url_rule('/upload_exist_database', 'upload_exist_database', get_exist_sql_data, methods=['POST'])
    app.add_url_rule('/save_page', 'save_page', save_page, methods=['POST'])
    app.add_url_rule('/delete_exist_sql_pageline', 'delete_exist_sql_pageline', delete_exist_sql_pageline)
    app.add_url_rule('/return_sql_page_data', 'return_sql_page_data', return_sql_page_data)

    @app.route("/test")
    def test():
        return {"message": ["LinkTest", "CheckNextOne"]}

    @app.route("/message")
    def index():
        return {"message": ["LinkSuccess", "StartNextOne"]}


    return app