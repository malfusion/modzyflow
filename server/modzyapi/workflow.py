import json

class Workflow:
    def __init__(self, flowjson_str):
        # Init private vars here
        self.edges = []
        self.nodes = []
        # Run initialization functions
        if flowjson_str:
            self.parse_flow_json(flowjson_str)
        

    # Parses the list of items sent by ReactFlow into nodes and edges
    def parse_flow_json(self, flowjson_str):
        flowjson = json.loads(flowjson_str)
        self.edges = [item for item in flowjson if "source" in item and "target" in item]
        self.nodes = [item for item in flowjson if not ("source" in item or "target" in item)]


    # Return "text", "image", "sound or "invalid"
    def get_input_type(self):
        # TODO
        pass
    
    
    def run(self):
        # TODO
        pass

