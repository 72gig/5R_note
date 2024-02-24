from flask import Flask, send_from_directory
from app.router import create_new_sql_database, create_new_sql_page, get_exist_sql_data,  \
                save_page, delete_exist_sql_pageline, return_sql_page_data, close_program



def create_app():
    app = Flask(__name__)
    app.add_url_rule('/create_new_sql_database', 'create_new_sql_database', create_new_sql_database)
    app.add_url_rule('/create_new_sql_page', 'create_new_sql_page', create_new_sql_page)
    app.add_url_rule('/upload_exist_database', 'upload_exist_database', get_exist_sql_data, methods=['POST'])
    app.add_url_rule('/save_page', 'save_page', save_page, methods=['POST'])
    app.add_url_rule('/delete_exist_sql_pageline', 'delete_exist_sql_pageline', delete_exist_sql_pageline)
    app.add_url_rule('/return_sql_page_data', 'return_sql_page_data', return_sql_page_data)
    app.add_url_rule('/close_program', 'close_program', close_program)


    @app.route("/")
    def index():
        # return {"message": ["LinkSuccess", "StartNextOne"]}
        return send_from_directory('../templates', 'index.html')

    @app.route('/static/<path:path>')
    def send_static(path):
        return send_from_directory('static', path)


    return app