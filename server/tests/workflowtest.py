import sys
sys.path.insert(0, '..')
from modzyapi.workflow import Workflow
from modzyapi.backend import ModzyFlowBackend

# TODO Write the test here
def simple_json_test():
    flowjson = _read_file("flowjson_simple.json")
    workflow = Workflow(flowjson)
    print(workflow.adj)
    print (workflow.source)
    print (workflow.get_input_type())
    workflow.run("I am a Software Engineer. I love to code.")

def test_file_path_job_submit():
    modelID =  "aevbu1h3yw"
    result = ModzyFlowBackend.run_model_with_filepath(modelID, "./Taj.jpeg")
    print (result)

def _read_file(filename):
    res = None
    with open(filename, "r") as f:
        res = f.read()
    return res

if __name__ == "__main__":
    #simple_json_test()
    test_file_path_job_submit()