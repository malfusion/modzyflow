import json
from collections import defaultdict
from modzyapi.backend import ModzyFlowBackend

class Workflow:
    def __init__(self, flowjson_str):
        # Init private vars here
        self.edges = []
        self.nodes = []
        self.adj = defaultdict(list) # nodeid -> [nodeids]
        self.nodeid_map = {}
        self.source = None 
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
        self.source = [item for item in self.nodes if item["type"]=="input"]
        assert self.source is not None
        self.source = self.source[0]

        
    # Return "text", "image", "sound or "invalid"
    def get_input_type(self):
        # TODO
        connectedmodels = self.adj[self.source["id"]]
        if connectedmodels:
            model_id = self.nodeid_map[connectedmodels[0]]["data"]["nodeObject"]["modelId"]
            model = ModzyFlowBackend.get_model_with_details(model_id)
            return model["inputs"][0]["acceptedMediaTypes"]
    
    
    def run(self, input):
        visited = set()
        outputs = {}
        self.dfs(self.source, visited, input, outputs)
        print (outputs)
        return outputs
    
    def dfs(self, node, visited, input, outputs):
        visited.add(node["id"])
        if node["type"] == "input":
            output = input
        elif node["type"]=="output":
            outputs[node["id"]] = input
            output = input
        else:
            model_id = node["data"]["nodeObject"]["modelId"]
            output = ModzyFlowBackend.run_model(model_id, input)
        
        for neighborID in self.adj[node["id"]]:
            if neighborID not in visited:
                neighbor = self.nodeid_map[neighborID]
                self.dfs(neighbor, visited, output, outputs)



