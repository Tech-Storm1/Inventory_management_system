import os
import pandas as pd

import concurrent.futures
import glob
import pandas as pd

def process_file(file):
    try:
        # Read only required columns to optimize memory usage
        df = pd.read_csv(file, usecols=['name', 'main_category', 'sub_category', 'no_of_ratings'])
        # Clean and convert no_of_ratings to numeric (remove commas)
        df['no_of_ratings'] = df['no_of_ratings'].astype(str).str.replace(',', '').replace('nan', '0')
        df['no_of_ratings'] = pd.to_numeric(df['no_of_ratings'], errors='coerce').fillna(0)

        # Aggregate sales by product name, category, subcategory
        grouped = df.groupby(['name', 'main_category', 'sub_category'], as_index=False)['no_of_ratings'].sum()
        return grouped
    except Exception as e:
        print(f"Error processing file {file}: {e}")
        return pd.DataFrame(columns=['name', 'main_category', 'sub_category', 'no_of_ratings'])

def load_and_aggregate_sales(dataset_dir='../dataset'):
    print("Starting to load and aggregate sales")
    all_files = glob.glob(f"{dataset_dir}/*.csv")
    print(f"Found {len(all_files)} CSV files")

    product_sales = []
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = executor.map(process_file, all_files)
        for result in results:
            if not result.empty:
                product_sales.append(result)

    if not product_sales:
        print("No product sales data found")
        return pd.DataFrame(columns=['name', 'main_category', 'sub_category', 'no_of_ratings'])

    all_sales = pd.concat(product_sales, ignore_index=True)
    # Aggregate again in case of duplicates across files
    all_sales = all_sales.groupby(['name', 'main_category', 'sub_category'], as_index=False)['no_of_ratings'].sum()

    # Sort by sales descending and take top 50
    top_products = all_sales.sort_values(by='no_of_ratings', ascending=False).head(50)
    print("Aggregation complete, returning top products")
    return top_products

import json

if __name__ == "__main__":
    top_products = load_and_aggregate_sales()
    # Convert to JSON and print
    print(top_products.to_json(orient='records'))
