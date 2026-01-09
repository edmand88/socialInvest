import pandas as pd
import sqlite3
import os

def seed_tickers():
    db_path = os.path.join(os.getcwd(), "database.db")
    print(f"Targeting database at: {db_path}")

    nasdaq_url = "https://www.nasdaqtrader.com/dynamic/symdir/nasdaqlisted.txt"
    other_url = "https://www.nasdaqtrader.com/dynamic/symdir/otherlisted.txt"
    
    try:
        nasdaq = pd.read_csv(nasdaq_url, sep="|")[:-1]
        other = pd.read_csv(other_url, sep="|")[:-1]
        
        df_nasdaq = nasdaq[['Symbol', 'Security Name']].rename(columns={'Security Name': 'name', 'Symbol': 'symbol'})
        df_other = other[['NASDAQ Symbol', 'Security Name']].rename(columns={'Security Name': 'name', 'NASDAQ Symbol': 'symbol'})
        
        all_tickers = pd.concat([df_nasdaq, df_other]).drop_duplicates(subset='symbol')
        
        conn = sqlite3.connect(db_path)
        all_tickers.to_sql("stock_metadata", conn, if_exists="replace", index=False)
        
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM stock_metadata")
        count = cursor.fetchone()[0]
        
        conn.commit()
        conn.close()
        print(f"Success! {count} tickers.")

    except Exception as e:
        print("Error")

if __name__ == "__main__":
    seed_tickers()