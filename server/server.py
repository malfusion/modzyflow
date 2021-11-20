from flask import Flask
from flask import jsonify
from flask import request

app = Flask(__name__)



# GET
@app.route("/listmodels")
def listmodels():
    return jsonify([{
        "name": "somename",
        "id": "someid" 
    }])


# POST: ?flow=TestName
# JSON will be sent in POST Body
# Save a given workflow json to the filesystem, within "./workflows" directory
@app.route("/saveflow")
def saveflow():
    flowname = request.args.get('flow')
    return {"sample": flowname}


# GET - URL Param: ?flow=TestName
# Loads a given workflow json by name from the filesystem, from within "./workflows" directory
@app.route("/loadflow")
def loadflow():
    return "<p>Hello, World!</p>"


# POST
# Runs a given workflow
@app.route("/runflow")
def runflow():
    return "<p>Hello, World!</p>"
