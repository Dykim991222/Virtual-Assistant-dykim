# backend/Dockerfile
FROM python:3.11-slim

# 시스템 패키지 설치 (PostgreSQL 클라이언트 포함)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 작업 디렉토리를 프로젝트 루트로 설정
WORKDIR /app

# PYTHONPATH 설정 - /app를 Python 경로에 추가
ENV PYTHONPATH=/app

# Python 의존성 복사 및 설치
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r ./backend/requirements.txt

# 프로젝트 구조 복사 (로컬과 동일하게)
COPY tools/ ./tools/
COPY backend/ ./backend/

# backend 디렉토리에서 실행 (로컬과 동일)
WORKDIR /app/backend

# 포트 노출
EXPOSE 8000

# FastAPI 실행 (로컬과 동일한 방식)
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
