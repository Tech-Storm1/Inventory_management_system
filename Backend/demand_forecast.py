import pandas as pd
from prophet import Prophet
import sys
import json
import traceback

def forecast_demand(data, periods=30):
    """
    Forecast product demand using Prophet.

    Parameters:
    - data: pandas DataFrame with columns ['ds', 'y']
      'ds' is the date column (datetime)
      'y' is the sales/demand column (numeric)
    - periods: int, number of days to forecast into the future

    Returns:
    - forecast: DataFrame with forecasted values
    """

    # Initialize Prophet model
    model = Prophet()

    # Fit the model
    model.fit(data)

    # Create future dataframe
    future = model.make_future_dataframe(periods=periods)

    # Predict future demand
    forecast = model.predict(future)

    return forecast

if __name__ == "__main__":
    try:
        # Read JSON input from stdin
        input_json = sys.stdin.read()
        input_data = json.loads(input_json)
        sales_data = input_data.get('salesData', [])
        periods = input_data.get('periods', 30)

        # Convert to DataFrame
        data = pd.DataFrame(sales_data)
        data['ds'] = pd.to_datetime(data['ds'])

        forecast = forecast_demand(data, periods=periods)

        # Prepare output JSON with relevant columns
        output = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(periods)
        output['ds'] = output['ds'].dt.strftime('%Y-%m-%d')
        result = output.to_dict(orient='records')

        # Print JSON to stdout
        print(json.dumps(result))
    except Exception as e:
        print("Error in forecasting:", str(e))
        traceback.print_exc()
        sys.exit(1)
