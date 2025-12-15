# backend/Dockerfile
FROM python:3.11-slim

# 작업 디렉토리 설정
WORKDIR /app

ENV PYTHONPATH=/app

# 시스템 패키지 설치 (PostgreSQL 클라이언트 포함)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성 복사 및 설치
COPY backend/requirements.txt .
 
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 백엔드 코드 복사
COPY backend/ ./
COPY tools/ ./tools/

# 포트 노출
EXPOSE 8000

# FastAPI 실행 (uvicorn)
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
