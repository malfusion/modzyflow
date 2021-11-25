import sys
sys.path.insert(0, '..')
from modzyapi.workflow import Workflow

# TODO Write the test here
def simple_json_test():
    flowjson = _read_file("flowjson_simple.json")
    workflow = Workflow(flowjson)
    print(workflow.nodeid_map)
    print(workflow.adj)
    workflow.run()



def _read_file(filename):
    res = None
    with open(filename, "r") as f:
        res = f.read()
    return res

if __name__ == "__main__":
    simple_json_test()