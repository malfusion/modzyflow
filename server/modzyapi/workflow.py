import json
from collections import defaultdict

class Workflow:
    def __init__(self, flowjson_str):
        # Init private vars here
        self.edges = []
        self.nodes = []
        self.adj = defaultdict(list) # nodeid -> [nodeids]
        self.nodeid_map = {}
        # Run initialization functions
        if flowjson_str:
            self.parse_flow_json(flowjson_str)
        

    # Parses the list of items sent by ReactFlow into nodes and edges
    def parse_flow_json(self, flowjson_str):
        flowjson = json.loads(flowjson_str)
        self.edges = [item for item in flowjson if "source" in item and "target" in item]
        self.nodes = [item for item in flowjson if not ("source" in item or "target" in item)]
        for node in self.nodes:
            self.nodeid_map[node["id"]] = node
        for edge in self.edges:
            self.adj[edge["source"]].append(edge["target"])
        
        

    # Return "text", "image", "sound or "invalid"
    def get_input_type(self):
        # TODO
        pass
    
    
    def run(self):
        # TODO
        pass

