from flask import Flask, send_from_directory
import os
from pathlib import Path

def create_app():
    app = Flask(
        __name__,
        static_folder="../frontend",
        static_url_path=""
    )

    @app.route("/")
    def index():
        return send_from_directory(app.static_folder, "index.html")

    

    @app.route("/debug-files")
    def debug_files():
        files = list(Path(app.static_folder).glob("*"))
        return {"files": [f.name for f in files]}

    return app