FROM python:3.10-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# Gerekli sistem paketlerini kur
RUN apk add --no-cache gcc musl-dev libffi-dev

# Python bağımlılıklarını kur
RUN pip install --no-cache-dir \
    PyJWT \
    requests \
    python-socketio \
    psutil \
    websocket-client

# Uygulama dosyalarını kopyala
COPY . .

# Varsayılan komut
CMD ["sh"]
