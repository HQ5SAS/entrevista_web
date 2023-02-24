import sys
import json
import requests

comando = sys.stdin.readline()
json_input = json.loads(comando)
#print(json_input)
requi_ = json_input["requi"]
listaPreguntas=[]

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
        # 'ID==3960020000012096751'
        c_param = {
            'criteria': 'id_requisicion=='+requi_+'"'
        }
        # ,params = param
        c_js = requests.get('https://creator.zoho.com/api/v2/hq5colombia/hq5/report/requisiciones_entrevista', headers=a_tk,
                            params=c_param)
        c_js = json.loads(c_js.text)
        # print(c_js)
        c_code = c_js['code']
        if (c_code == 3330):
            print('err. ERROR:', c_js['message'])
            return('err. ERROR:', c_js['message'])
        elif (c_code == 3100):
            print('err. Reporte no existente')
            return('err. Reporte no existente')
        elif (c_code == 3000):
            c_data = c_js['data']
            #i=len(c_data['Preguntas_entrevista'])
            x=-1
            for pregunta in c_data[0]['Preguntas_entrevista']:
                listaPreguntas.append(pregunta['display_value'])
            print(listaPreguntas)
            return(listaPreguntas)
        else:
            print('err. ERROR:',c_js['message'])
zoho_api()