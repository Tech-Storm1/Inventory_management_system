from flask import Flask, jsonify, request
import pandas as pd
from prophet import Prophet
from datetime import datetime, timedelta

app = Flask(__name__)

# Sample historical sales data for demonstration
# In real use, load from database or file
data = pd.DataFrame({
    'ds': pd.date_range(start='2023-01-01', periods=100),
    'y': [20 + i*0.5 + (i%10)*2 for i in range(100)]
})

model = Prophet()
model.fit(data)

@app.route('/forecast', methods=['GET'])
def forecast():
    periods = int(request.args.get('periods', 30))
    future = model.make_future_dataframe(periods=periods)
    forecast = model.predict(future)
    # Return only the forecasted periods
    forecast_data = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(periods)
    # Convert dates to string for JSON serialization
    forecast_data['ds'] = forecast_data['ds'].dt.strftime('%Y-%m-%d')
    result = forecast_data.to_dict(orient='records')
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5000)
