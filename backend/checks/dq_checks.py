import pandas as pd
import great_expectations as ge
from sklearn.ensemble import IsolationForest

def load_data(path):
    return pd.read_csv(path)

def run_schema(path, suite_name):
    df = load_data(path)
    context = ge.data_context.DataContext()
    validator = context.get_validator(
        batch_request={"datasource_name":"default","path":path,"datasource_batch_identifiers":{"default_identifier":1}},
        expectation_suite_name=suite_name
    )
    res = validator.validate()
    return res.result["statistics"]

def null_rates(path):
    df = load_data(path)
    return df.isnull().mean()

def detect_anomalies(path, cols):
    df = load_data(path)
    iso = IsolationForest(contamination=0.01, random_state=0)
    arr = df[cols].fillna(df[cols].mean())
    df["anomaly"] = iso.fit_predict(arr)==-1
    return df
