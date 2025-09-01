# Use stable Alpine Python base
FROM python:3.10-alpine

# Set working directory inside container
WORKDIR /app

# Install system packages needed by numpy, pandas, etc.
RUN apk add --no-cache \
    build-base \
    libffi-dev \
    openblas-dev \
    gfortran \
    lapack-dev \
    musl-dev \
    gcc \
    python3-dev \
    py3-pip \
    py3-numpy \
    py3-pandas

# Copy backend source code
COPY backend/ .

# Copy processed data to the expected relative path
COPY processed/ ../processed/

# Install Python dependencies from backend/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose FastAPI port
EXPOSE 8080

# Run FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
