# Docker 배포 가이드

## 🐳 Docker Compose 구조

```
┌─────────────────────────────────────┐
│   docker-compose.yml                │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  postgres (PostgreSQL 15)    │  │
│  │  - Port: 5432                │  │
│  │  - Volume: postgres_data     │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  backend (FastAPI)           │  │
│  │  - Port: 8000                │  │
│  │  - Volume: ./backend         │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## 🚀 사용 방법

### 1. 환경변수 설정

**backend/.env.aws** 파일 수정:
```bash
# 필수 설정
OPENAI_API_KEY=your_openai_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SECRET_KEY=your_secret_key_here

# 데이터베이스는 자동 설정됨 (수정 불필요)
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/virtual_assistant
```

---

### 2. Docker 빌드 및 실행

```bash
# 모든 컨테이너 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f backend

# 특정 서비스만 재시작
docker-compose restart backend

# 모든 컨테이너 중지
docker-compose down

# 볼륨까지 삭제 (데이터 초기화)
docker-compose down -v
```

---

### 3. 데이터베이스 마이그레이션

```bash
# 컨테이너 내부 접속
docker-compose exec backend bash

# Alembic 마이그레이션 실행
alembic upgrade head

# 또는 외부에서 직접 실행
docker-compose exec backend alembic upgrade head
```

---

### 4. 접속 확인

```bash
# API Health Check
curl http://localhost:8000/health

# API Docs
open http://localhost:8000/docs
```

---

## 🔧 개발 모드

### 코드 수정 시 자동 재시작

docker-compose.yml에 볼륨 마운트가 설정되어 있어,
로컬에서 코드 수정 시 자동으로 반영됩니다.

```yaml
volumes:
  - ./backend:/app  # 코드 변경 시 자동 반영
```

---

## 📊 데이터베이스 접속

```bash
# PostgreSQL 컨테이너 접속
docker-compose exec postgres psql -U postgres -d virtual_assistant

# 외부에서 접속 (DBeaver, DataGrip 등)
Host: localhost
Port: 5432
Database: virtual_assistant
User: postgres
Password: postgres
```

---

## 🐛 트러블슈팅

### 1. 포트 충돌

```bash
# 기존 프로세스 확인
lsof -i :8000
lsof -i :5432

# 프로세스 종료
kill -9 <PID>
```

### 2. 볼륨 권한 문제

```bash
# 로그 디렉토리 생성 및 권한 설정
mkdir -p backend/logs
chmod -R 777 backend/logs
```

### 3. 컨테이너 재빌드

```bash
# 이미지 재빌드 (requirements.txt 변경 시)
docker-compose build --no-cache backend

# 컨테이너 재시작
docker-compose up -d
```

---

## 📦 프로덕션 배포

### EC2에서 실행

```bash
# 1. Docker 및 Docker Compose 설치 (EC2)
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# 2. 프로젝트 클론
git clone https://github.com/magui-dev/Virtual-Assistant-personal.git
cd Virtual-Assistant-personal

# 3. 환경변수 설정
nano backend/.env.aws

# 4. Docker Compose 실행
docker-compose up -d

# 5. 로그 확인
docker-compose logs -f
```

---

## 🔒 보안 설정

### 프로덕션 환경에서:

1. **SECRET_KEY 변경**
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

2. **PostgreSQL 비밀번호 변경**
   ```yaml
   environment:
     POSTGRES_PASSWORD: <strong_password>
   ```

3. **포트 노출 최소화**
   ```yaml
   ports:
     - "127.0.0.1:5432:5432"  # 로컬에서만 접근
   ```

---

## 📝 유용한 명령어

```bash
# 전체 상태 확인
docker-compose ps

# 리소스 사용량 확인
docker stats

# 컨테이너 로그 실시간 확인
docker-compose logs -f

# 특정 명령어 실행
docker-compose exec backend python -c "print('Hello')"

# 데이터베이스 백업
docker-compose exec postgres pg_dump -U postgres virtual_assistant > backup.sql

# 데이터베이스 복원
docker-compose exec -T postgres psql -U postgres virtual_assistant < backup.sql
```
