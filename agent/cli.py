import argparse
import jwt
import requests
import socket
import getpass
import os
import json
import sys

CONFIG_FILE = os.path.expanduser("~/.my_cli_config.json")

def decode_jwt(token):
    try:
        # JWT token'ını doğrulama yapmadan çözümle
        payload = jwt.decode(token, options={"verify_signature": False})
        return payload
    except Exception as e:
        print(f"JWT çözümleme hatası: {e}")
        sys.exit(1)

def send_post_request(url, data):
    try:
        response = requests.post(url, json=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"HTTP isteği hatası: {e}")
        sys.exit(1)

def load_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r") as f:
                return json.load(f)
        except json.JSONDecodeError as e:
            print(f"Yapılandırma dosyası okunurken hata oluştu: {e}")
            return {}
    return {}

def save_config(config):
    try:
        with open(CONFIG_FILE, "w") as f:
            json.dump(config, f, indent=4)
        print(f"Yapılandırma dosyası güncellendi: {CONFIG_FILE}")
    except Exception as e:
        print(f"Yapılandırma dosyası yazılırken hata oluştu: {e}")
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="JWT token ile kayıt işlemi.")
    parser.add_argument("--register", metavar="<token>", help="JWT token'ı")

    args = parser.parse_args()

    if args.register:
        token = args.register
        payload = decode_jwt(token)

        # JWT payload'ından target adresini al
        target_url = payload.get("target")
        if not target_url:
            print("JWT token'ında 'target' alanı bulunamadı.")
            sys.exit(1)

        owner = payload.get("owner")
        if not owner:
            print("Owner not found!")
            sys.exit(1)

        # Sistem bilgilerini al
        hostname = socket.gethostname()
        username = getpass.getuser()
        # owner = username  # İsteğe bağlı olarak değiştirilebilir

        data = {
            "owner": owner,
            "hostname": hostname,
            "username": username
        }

        # POST isteği gönder
        response = send_post_request(target_url + "/api/endpoint/register", data)

        # Sunucudan dönen 'id' değerini al
        print("RESPONSE: ", response)
        returned_id = response.get("id")
        if not returned_id:
            print("Sunucu yanıtında 'id' alanı bulunamadı.")
            sys.exit(1)

        # Yapılandırma dosyasını yükle ve güncelle
        config = load_config()
        config["MY_REGISTERED_ID"] = returned_id
        config["TARGET"] = target_url
        save_config(config)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
