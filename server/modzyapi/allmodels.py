import sys
import os
import logging
import dotenv
sys.path.insert(0, '..')
from modzy import ApiClient

dotenv.load_dotenv()

def all_models():
    BASE_URL = 'https://app.modzy.com/api'
    API_KEY = 'UekSgeQNOl22F8LtHCWu.KfnyQp94bIeYmrUEiHDM'

    client = ApiClient(base_url=BASE_URL, api_key=API_KEY)
    params = {'is_active': True}
    models = client.models.get_models(**params)

    return models 