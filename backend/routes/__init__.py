# routes package 
from flask import Blueprint

review_bp = Blueprint("review", __name__)

from . import review  # this imports all route handlers
