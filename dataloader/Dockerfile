FROM python:3.11-slim

WORKDIR /app

# Install MySQL/MariaDB connector + pandas
RUN pip install mysql-connector-python pandas

# Copy script + CSV
COPY scripts/load_data.py .
COPY data/odef_v3.csv .

CMD ["python", "load_data.py"]
