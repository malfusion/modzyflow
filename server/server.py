import json
from flask import Flask
from flask import jsonify
from flask import request
import os
from modzyapi.workflow import Workflow
from modzyapi.backend import ModzyFlowBackend
app = Flask(__name__)

workflows_dir = "./workflows"
# GET
@app.route("/api/listmodels")
def listmodels():
    models = ModzyFlowBackend.all_models_with_names()
    print(len(models))
    return jsonify(models) 

# POST: ?flow=TestName
# JSON will be sent in POST Body
# Save a given workflow json to the filesystem, within "./workflows" directory
@app.route("/api/saveflow", methods=['POST'])
def saveflow():
    flowname = request.args.get('flow')
    flow = request.get_json()
    json_object = json.dumps(flow)
    print("Flowname " , flowname)
    print ("Flow ", json_object)
    if not os.path.isdir("./workflows"):
        os.mkdir(workflows_dir)
    with open(os.path.join(workflows_dir, flowname), "w") as outfile:
        outfile.write(json_object)
    return {"sample": flowname}


# GET - URL Param: ?flow=TestName
# Loads a given workflow json by name from the filesystem, from within "./workflows" directory
@app.route("/api/loadflow")
def loadflow():
    flowname = request.args.get('flow')
    flowfile = open(workflows_dir + "/" + flowname)
    flow = json.load(flowfile)
    return jsonify(flow)

# POST
# Runs a given workflow
@app.route("/api/runflow", methods=['POST'])
def runflow():
    body = request.get_json()
    flow = json.dumps(body["flow"])
    input = body["input"]
    workflow = Workflow(flow)
    workflow.run(input)
    return workflow.get_result()

@app.route("/api/getinputype", methods=['POST'])
def getinputype():
    flow = json.dumps(request.get_json())
    workflow = Workflow(flow)
    return workflow.get_input_type()