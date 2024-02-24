from app import create_app
from threading import Timer

import webbrowser


def open_browser():
      webbrowser.open_new("http://127.0.0.1:5001")


app = create_app()



if __name__== '__main__':
    Timer(1, open_browser).start()
    app.run(port=5001, use_reloader=False, debug=False)  # 如果有debug=true會造成重複開兩次網頁
