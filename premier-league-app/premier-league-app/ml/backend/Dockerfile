# Use the secure Alpine base image
FROM python:3.13-alpine

# Set working directory
WORKDIR /app

# Install dependencies needed for scientific packages
RUN apk add --no-cache \
    build-base \
    libffi-dev \
    openblas-dev \
    gfortran \
    musl-dev \
    gcc \
    python3-dev \
    py3-pip \
    lapack-dev

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose FastAPI default port
EXPOSE 8080

# Start the FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
