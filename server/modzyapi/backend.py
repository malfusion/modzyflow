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


class ModzyFlowBackend:

    def all_models_with_names():
        import requests
        url = BASE_URL + "/models/all/versions/all?search=text"
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


    
