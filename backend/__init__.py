from flask import Flask, send_from_directory
from backend.routes import review_bp

def create_app():
    app = Flask(
        __name__,
        static_folder="../frontend/dist",
        static_url_path=""
    )

    app.secret_key = "review-secret"
    app.register_blueprint(review_bp)

    @app.route("/")
    def index():
        return send_from_directory(app.static_folder, "index.html")

    return app
