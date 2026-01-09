import pandas as pd
import sqlite3
import os
import ssl
import urllib.request

ssl._create_default_https_context = ssl._create_unverified_context

def seed_tickers():
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "database.db")
    print(f"Targeting database at: {db_path}")

    nasdaq_url = "https://www.nasdaqtrader.com/dynamic/symdir/nasdaqlisted.txt"
    other_url = "https://www.nasdaqtrader.com/dynamic/symdir/otherlisted.txt"
    
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}
    
    try:
        print("Downloading")
        
        req_nasdaq = urllib.request.Request(nasdaq_url, headers=headers)
        with urllib.request.urlopen(req_nasdaq) as response:
            nasdaq = pd.read_csv(response, sep="|")[:-1]
        
        req_other = urllib.request.Request(other_url, headers=headers)
        with urllib.request.urlopen(req_other) as response:
            other = pd.read_csv(response, sep="|")[:-1]

        df_nasdaq = nasdaq[['Symbol', 'Security Name']].rename(
            columns={'Security Name': 'name', 'Symbol': 'symbol'}
        )
        
        other_symbol_col = 'NASDAQ Symbol' if 'NASDAQ Symbol' in other.columns else 'ACT Symbol'
        df_other = other[[other_symbol_col, 'Security Name']].rename(
            columns={'Security Name': 'name', other_symbol_col: 'symbol'}
        )

        all_tickers = pd.concat([df_nasdaq, df_other]).drop_duplicates(subset='symbol')
        
        conn = sqlite3.connect(db_path)
        all_tickers.to_sql("stock_metadata", conn, if_exists="replace", index=False)
        
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM stock_metadata")
        count = cursor.fetchone()[0]
        
        conn.commit()
        conn.close()
        
        print(f"Success, {count} symbols.")

    except Exception as e:
        print(e)

if __name__ == "__main__":
    seed_tickers()