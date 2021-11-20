from flask import Flask
from flask import jsonify
from flask import request

from modzyapi.allmodels import *
app = Flask(__name__)

# GET
@app.route("/api/listmodels")
def listmodels():
    models = all_models()
    return jsonify(models) 

# POST: ?flow=TestName
# JSON will be sent in POST Body
# Save a given workflow json to the filesystem, within "./workflows" directory
@app.route("/api/saveflow")
def saveflow():
    flowname = request.args.get('flow')
    return {"sample": flowname}


# GET - URL Param: ?flow=TestName
# Loads a given workflow json by name from the filesystem, from within "./workflows" directory
@app.route("/api/loadflow")
def loadflow():
    return "<p>Hello, World!</p>"


# POST
# Runs a given workflow
@app.route("/api/runflow")
def runflow():
    return "<p>Hello, World!</p>"
