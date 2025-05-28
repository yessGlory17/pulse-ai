import socketio
import os
import json
import psutil


CONFIG_FILE = os.path.expanduser("~/.my_cli_config.json")

def collect_processes(limit=5, sort_by='cpu', order='desc'):
    """
    Çalışan işlemleri CPU veya bellek kullanımına göre sıralar ve belirtilen sayıda döndürür.

    Parametreler:
    - limit (int): Döndürülecek maksimum işlem sayısı.
    - sort_by (str): 'cpu' veya 'memory' değerlerinden biri.
    - order (str): 'asc' (artan) veya 'desc' (azalan) sıralama yönü.

    Döndürür:
    - List[Tuple[int, str, float, float]]: (PID, İsim, CPU%, Bellek%) şeklinde işlem listesi.
    """
    processes = []
    for proc in psutil.process_iter(attrs=['pid', 'name', 'cpu_percent', 'memory_percent']):
        try:
            info = proc.info
            processes.append((info['pid'], info['name'], info['cpu_percent'], info['memory_percent']))
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue

    reverse = True if order == 'desc' else False

    if sort_by == 'cpu':
        processes.sort(key=lambda x: x[2], reverse=reverse)
    elif sort_by == 'memory':
        processes.sort(key=lambda x: x[3], reverse=reverse)

    return processes[:limit]

def getClientID():
    with open(CONFIG_FILE, "r", encoding="utf-8") as dosya:
        conf = json.load(dosya)
        print("ENDPOINT ID: ", conf["MY_REGISTERED_ID"])
        return conf["MY_REGISTERED_ID"]


ENDPOINT_ID = getClientID()

sio = socketio.Client()


@sio.event
def connect():
    print("Sunucuya bağlandı")
    sio.emit("join-room", ENDPOINT_ID)  # Örnek oda ID'si


@sio.event
def disconnect():
    print("Sunucudan ayrıldı")


@sio.on("message")
def on_message(data):
    print(f"Gelen mesaj: {data}")


# @sio.on("tool-call")
# def on_message(data):
#     print(f"Gelen komut: {data}")


@sio.on('tool_call')
def tool_call(data):
    print(f"Gelen komut: {data}")
    command = data['command']
    

    if command == 'collect_processes':
        limit = data['limit']
        sort_by = data['sort_by']
        order = data['order']

        processes = collect_processes(limit=limit, sort_by=sort_by, order=order)
        return { "processes": processes}
    
    if command == 'find_process':

        return { "process": "" }



sio.connect("http://localhost:3000", socketio_path="/api/socketio")
sio.wait()
