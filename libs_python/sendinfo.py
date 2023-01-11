import sys
import json
import requests

comando = sys.stdin.readline()
json_input = json.loads(comando)
id_user = json_input[id]
#id_user= '3960020000016631899'id pruebas

def zoho_api():
    # Obtener acces token
    tk_param = {
        'refresh_token': '1000.4d00fd537749d21e24f7f95032ca5fd4.f75028fb8f8b2124fc391a71ad55180f',
        'client_id': '1000.IIM2A185O6YWU0SVCV5SU8N1WADV5O', 'client_secret': '3fa85b34e476b4acb29ab2d8154fc16876c0e14fe7',
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
        c_param = {
            'criteria': 'ID=="'+id_user+'"'
        }
        # ,params = param
        c_js = requests.get('https://creator.zoho.com/api/v2/hq5colombia/hq5/report/Vista_General11', headers=a_tk,
                            params=c_param)
        c_js = json.loads(c_js.text)
        # print(c_js)
        c_code = c_js['code']
        if (c_code == 3330):
            print('ERROR:', c_code['message'])

        # Editar registro

        data_ = '{"data":{"entrevista_virtual":"true", "Estado_Postulacion":"entrevista virtual realizada"}}'
        e_js = requests.patch(
            'https://creator.zoho.com/api/v2/hq5colombia/hq5/report/Vista_General11/' + id_user, headers=a_tk,
            data=data_)
        e_js = json.loads(e_js.text)
        e_code = e_js['code']
        if (e_code == 3000):
            print('Actualizado con éxito')
        else:
            print('ERROR:', e_js['message'])


zoho_api()