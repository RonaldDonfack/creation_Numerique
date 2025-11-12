import requests
response = requests.delete('http://127.0.0.1:8000/menu/1/delete/')
print(response.status_code, response.json())