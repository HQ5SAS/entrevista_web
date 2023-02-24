import sys
import json
import requests

comando = sys.stdin.readline()
json_input = json.loads(comando)
id_user = json_input["id"]
#id_user= '3960020000016631899'id pruebas

def zoho_api():
    # Obtener acces token
    tk_param = {
        'refresh_token': '1000.6ae69ca138d2f6c5adba08e52b52b4f6.4d09d4c6009923c6d7d36e535f9f37b7',
        'client_id': '1000.BXCXYLGQX0TPGT0B4KPR5NKV2RXK2U',
        'client_secret': '10e319c31847a45291d7b79b5344ea3b8329738a17',
        'grant_type': 'refresh_token'}

    tk_js = requests.post('https://accounts.zoho.com/oauth/v2/token', params=tk_param)
    tk_js = json.loads(tk_js.text)

    acces_tk = tk_js["access_token"]
    # print(acces_tk)
    if (acces_tk):
        # Realizar consulta de reportes
        a_tk = {
            'Authorization': 'Zoho-oauthtoken ' + acces_tk
        }
        # Editar registro

        data_ = '{"data":{"entrevista_virtual":"true", "Estado_Postulacion":"Entrevista virtual realizada"}}'
        e_js = requests.patch(
            'https://creator.zoho.com/api/v2/hq5colombia/hq5/report/Vista_General11/' + id_user, headers=a_tk,
            data=data_)
        e_js = json.loads(e_js.text)
        e_code = e_js['code']
        if (e_code == 3000):
            print('Actualizado con éxito')
        else:
            print('ERROR_send:'+id_user+"  ", e_js['message'])

zoho_api()