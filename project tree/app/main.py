# Data Handling
from fastapi import FastAPI
import uvicorn
import pickle
import numpy as np
import pandas as pd
import datetime
from pydantic import BaseModel
from fbprophet import Prophet

# PATH
DATAPATH = '../notebooks/'

# Server
app = FastAPI()

# Read dataset
tf = pd.read_csv('../notebooks/dss_mock_1.csv')
tf['date_conv'] = tf['date'].apply(
    lambda x: datetime.datetime.fromtimestamp(x).strftime("%Y-%m-%d"))
tf.drop(['date', 'is_holiday'], axis=1, inplace=True)
tf['date_conv'] = pd.DatetimeIndex(tf['date_conv'])
tf = tf.sort_values(by='date_conv').reset_index(drop=True)

# list all column on dataset
cols = list(tf.columns.values)
cols.remove('date_conv')


class Data(BaseModel):
    food_1 : int
    food_2 : int
    food_3 : int
    food_4 : int
    date : int


@app.post("/predict")
def predict():
    # getting current date and two days
    today = datetime.datetime.today().strftime("%Y-%m-%d")
    twodays = (datetime.datetime.today() + datetime.timedelta(days=2)).strftime("%Y-%m-%d")

    # Create and return prediction
    results = []
    for col in cols:
        model = pickle.load(open(DATAPATH+'model'+'_'+col+'.pickle', 'rb'))
        f_df = model.make_future_dataframe(periods=7, freq='D')
        result = model.predict(f_df)
        result_tf = result[['ds', 'yhat']].rename(columns={'yhat': col})
        results.append(result_tf)
    prediction = pd.concat(results, axis=1)

    # Cleaning predict table
    prediction = prediction.iloc[:,  ~prediction.columns.duplicated()]
    prediction.drop_duplicates(subset='ds', keep="first", inplace=True)
    prediction = prediction.reset_index(
        drop=True).rename(columns={'ds': 'date'})
    tf_revised = prediction[(prediction['date'] > today) & (prediction['date'] < twodays)
                        ].reset_index(drop=True)

    exp = tf_revised.to_json(orient="records")
    return exp

