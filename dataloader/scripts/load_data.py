import os
import time
import pandas as pd
import re
import mysql.connector

CSV_PATH = "odef_v3.csv"
DB_HOST = os.getenv("DB_HOST", "database")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "pwd")
DB_NAME = os.getenv("DB_NAME", "template_db")
DB_TABLE = os.getenv("DB_TABLE", "facilities")

BATCH_SIZE = int(os.getenv("BATCH_SIZE", "1000"))

# These are the columns you need from the CSV
USE_COLUMNS = [
    "facility_name",
    "geometry",
    "ISCED010", "ISCED020", "ISCED1", "ISCED2", "ISCED3", "ISCED4Plus",
    "province_code"
]

def wait_for_db():
    """Try connecting until MariaDB and the facilities table are ready."""
    while True:
        try:
            conn = mysql.connector.connect(
                host=DB_HOST,
                user=DB_USER,
                password=DB_PASSWORD,
                database=DB_NAME
            )
            cursor = conn.cursor()
            cursor.execute(f"SHOW TABLES LIKE '{DB_TABLE}'")
            result = cursor.fetchone()
            cursor.close()
            conn.close()

            if result:
                print(f"MariaDB and table '{DB_TABLE}' are ready.")
                return
            else:
                print(f"MariaDB is up, waiting for table '{DB_TABLE}' to be created...")
        except Exception as e:
            print(f"Waiting for MariaDB... ({e})")
        time.sleep(2)


def parse_point(point_str):
    """
    Takes a geometry string like 'POINT(-79.3832 43.6532)'
    Returns (longitude, latitude)
    """
    if not isinstance(point_str, str):
        return None, None

    # Extract numbers between parentheses
    match = re.search(r"POINT\s*\(([-0-9\.]+)\s+([-0-9\.]+)\)", point_str)
    if not match:
        return None, None
    
    lon = float(match.group(1))
    lat = float(match.group(2))
    return lat, lon


def combine_types(row):
    """
    Find type of institution from multiple columns
    """
    type_cols = ["ISCED010", "ISCED020", "ISCED1", "ISCED2", "ISCED3", "ISCED4Plus"]

    if row[type_cols[5]] == 1:
        return "Post Secondary"
    elif row[type_cols[4]] == 1 or row[type_cols[3]] == 1:
        return "Secondary"
    elif row[type_cols[2]] == 1:
        return "Elementary"
    else:
        return "Early Childhood Education"


def load_csv(filepath):
    # Read only chosen columns
    df = pd.read_csv(filepath, usecols=USE_COLUMNS)

    # Parse geometry → latitude + longitude
    df["latitude"], df["longitude"] = zip(*df["geometry"].map(parse_point))
    df = df.drop(columns=["geometry"])
        
    df = df.dropna(subset=["latitude", "longitude"])

    # Combine boolean facility types into one column
    df["type"] = df.apply(combine_types, axis=1)

    df["region"] = df["province_code"]

    # Keep only the final columns you want to insert into DB
    df = df[[
        "facility_name",
        "latitude",
        "longitude",
        "type",
        "region"
    ]]

    df = df.rename(columns={
        "facility_name": "name"
    })

    return df.to_dict(orient="records")

def batch_upsert(conn, records):
    """Insert or update rows in batches using ON DUPLICATE KEY UPDATE."""
    if not records:
        return

    columns = list(records[0].keys())
    col_str = ", ".join(columns)
    placeholders = ", ".join(["%s"] * len(columns))

    # update all but the primary key
    update_str = ", ".join(
        f"{col}=VALUES({col})"
        for col in columns
    )

    sql = f"""
        INSERT INTO {DB_TABLE} ({col_str})
        VALUES ({placeholders})
        ON DUPLICATE KEY UPDATE {update_str}
    """

    cursor = conn.cursor()
    values = [tuple(row[col] for col in columns) for row in records]

    for i in range(0, len(values), BATCH_SIZE):
        batch = values[i:i + BATCH_SIZE]
        cursor.executemany(sql, batch)
        conn.commit()

    cursor.close()


def main():
    print(f"Loading CSV from: {CSV_PATH}")
    records = load_csv(CSV_PATH)
    print(f"Loaded {len(records)} records.")

    wait_for_db()

    conn = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )

    batch_upsert(conn, records)
    conn.close()

    print("Data load complete. Exiting.")


if __name__ == "__main__":
    main()