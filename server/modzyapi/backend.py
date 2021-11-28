import sys
import os
import logging
import dotenv

sys.path.insert(0, '..')
from modzy import ApiClient

dotenv.load_dotenv()
BASE_URL = 'https://app.modzy.com/api'
API_KEY = 'UekSgeQNOl22F8LtHCWu.KfnyQp94bIeYmrUEiHDM'
CLIENT = ApiClient(base_url=BASE_URL, api_key=API_KEY)
OUTPUT_LOOKUP = {"rs2qqwbjwb": lambda x: "summary", "aevbu1h3yw": lambda x: x.get("top5_classes", [])[0]}

class ModzyFlowBackend:

    def all_models_with_names():
        import requests
        url = BASE_URL + "/models/all/versions/all?search=image"
        headers = {
            "Accept": "application/json",
            "Authorization": "ApiKey " + API_KEY
        }
        response = requests.request("GET", url, headers=headers)
        return response.json()

    def get_model_with_details(model_id):
        import requests
        url = BASE_URL + "/models/all/versions/all?model.modelId="+model_id
        headers = {
            "Accept": "application/json",
            "Authorization": "ApiKey " + API_KEY
        }
        response = requests.request("GET", url, headers=headers)
        return response.json()[0]

    def all_models():
        params = {'is_active': True}
        models = CLIENT.models.get_models(**params)
        return models 
    
    # TODO getModel
    def get_model(model_id):
        model = CLIENT.models.get(model_id)
        return model

    def run_model(model_id, input):
        model = ModzyFlowBackend.get_model_with_details(model_id)
        inputtype = model["inputs"][0]["acceptedMediaTypes"]
        if "text" in inputtype:
            return ModzyFlowBackend.run_model_with_text(model, model_id, input)
        if "image" in inputtype:
            return ModzyFlowBackend.run_model_with_fileintarray(model, model_id, input)

    def run_model_with_text(model, model_id, input):
        job = CLIENT.jobs.submit_text(model_id, model["version"], {"test1": { model["inputs"][0]["name"]: input } })
        CLIENT.jobs.block_until_complete(job)
        result = CLIENT.results.get(job)
        print (model["outputs"][0]["name"])
        output = result["results"]["test1"][model["outputs"][0]["name"]]
        if model_id in OUTPUT_LOOKUP:
            output = OUTPUT_LOOKUP[model_id](output)
        return output 

    def run_model_with_filepath(model, model_id, file_path):
        job = CLIENT.jobs.submit_file(model_id, model["version"], {"test1": { model["inputs"][0]["name"]: file_path } })
        CLIENT.jobs.block_until_complete(job)
        result = CLIENT.results.get(job)
        print (model["outputs"][0]["name"])
        output = result["results"]["test1"][model["outputs"][0]["name"]]
        if model_id in OUTPUT_LOOKUP:
            output = OUTPUT_LOOKUP[model_id](output)
        return output 
    
    def run_model_with_fileintarray(model, model_id, file_int_array):
        file_bytes = bytearray(file_int_array)
        job = CLIENT.jobs.submit_file(model_id, model["version"], {"test1": { model["inputs"][0]["name"]: file_bytes } })
        CLIENT.jobs.block_until_complete(job)
        result = CLIENT.results.get(job)
        print (model["outputs"][0]["name"])
        output = result["results"]["test1"][model["outputs"][0]["name"]]
        if model_id in OUTPUT_LOOKUP:
            output = OUTPUT_LOOKUP[model_id](output)
        return output 

    
