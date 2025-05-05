from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import pandas as pd
import os
from sklearn.ensemble import IsolationForest

app = Flask(__name__)
CORS(app)

UPLOAD_DIR = "data"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 1) Health check
@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})

# 2) Upload CSV file
@app.route("/api/upload", methods=["POST"])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filepath = os.path.join(UPLOAD_DIR, "my_table.csv")
    file.save(filepath)
    print(f"✅ File saved to: {filepath}")
    return jsonify({"message": "File uploaded and saved"}), 200

# 3) Load CSV data helper
def load_data(path):
    return pd.read_csv(path)

# 4) Snapshot endpoint
@app.route("/api/snapshot")
def snapshot():
    try:
        df = load_data("data/my_table.csv")
        return jsonify(df.head(10).to_dict(orient="records"))
    except:
        return jsonify([])

# 5) Null-rate monitor
@app.route("/api/null-rates")
def null_rates():
    try:
        df = pd.read_csv("data/my_table.csv")
        nulls = df.isnull().mean()  # Series: {col: null_fraction}
        return jsonify(nulls.to_dict())
    except:
        return jsonify({})

# 6) Anomaly detection
@app.route("/api/anomalies")
def anomalies():
    try:
        df = pd.read_csv("data/my_table.csv")
        numeric_cols = [col for col in df.columns if pd.api.types.is_numeric_dtype(df[col])]
        df_numeric = df[numeric_cols].dropna()

        clf = IsolationForest(random_state=42)
        clf.fit(df_numeric)

        scores = clf.decision_function(df_numeric)
        preds = clf.predict(df_numeric)

        df_anomalous = df_numeric[preds == -1].copy()
        df_anomalous["anomaly_score"] = scores[preds == -1]

        # Highlight columns where value deviates strongly from the mean ± 2 std
        col_highlights = []
        for col in numeric_cols:
            mean = df_numeric[col].mean()
            std = df_numeric[col].std()
            outliers = df_anomalous[col].apply(lambda x: abs(x - mean) > 2 * std)
            col_highlights.append(outliers)

        # Stack boolean masks to get per-row feature importance
        df_anomalous["problem_columns"] = [
            [col for col, is_out in zip(numeric_cols, row) if is_out]
            for row in zip(*col_highlights)
        ]

        # Reattach index and original non-numeric data
        full_df = df.loc[df_anomalous.index]
        full_df["problem_columns"] = df_anomalous["problem_columns"]
        return jsonify(full_df.to_dict(orient="records"))

    except Exception as e:
        return jsonify({"error": str(e)})


# 7) Auto-detect schema
@app.route("/api/detect-schema")
def detect_schema():
    try:
        df = pd.read_csv("data/my_table.csv", nrows=100)
        inferred_schema = {}
        for col in df.columns:
            dtype = df[col].dropna().infer_objects().dtype
            if pd.api.types.is_integer_dtype(dtype):
                inferred_schema[col] = "int"
            elif pd.api.types.is_float_dtype(dtype):
                inferred_schema[col] = "float"
            elif pd.api.types.is_bool_dtype(dtype):
                inferred_schema[col] = "bool"
            else:
                inferred_schema[col] = "str"
        return jsonify(inferred_schema)
    except:
        return jsonify({})

# 8) Validate against user-defined schema
@app.route("/api/schema-check", methods=["POST"])
def schema_check_custom():
    try:
        df = load_data("data/my_table.csv")
        user_schema = request.json.get("user_schema", {})
        result = []

        for col, expected_type in user_schema.items():
            if expected_type == "":
                continue  # skip blank type

            exists = col in df.columns
            type_ok = False
            if exists:
                try:
                    df[col].dropna().astype(eval(expected_type))
                    type_ok = True
                except:
                    type_ok = False

            result.append({
                "column": col,
                "exists": exists,
                "type_ok": type_ok
            })

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)})

# 9) Trigger all checks
@app.route("/api/run-checks", methods=["POST"])
def run_all():
    return jsonify({"message": "Triggered checks"})

# 10) Fill nulls and create downloadable CSV
@app.route("/api/fill-nulls", methods=["POST"])
def fill_nulls():
    try:
        replacements = request.json.get("fill_values", {})
        df = pd.read_csv("data/my_table.csv")

        for col, value in replacements.items():
            if col in df.columns:
                df[col] = df[col].fillna(value)

        output_path = "data/filled_output.csv"
        df.to_csv(output_path, index=False)
        return jsonify({"message": "Filled successfully", "download": "/api/download-filled"})
    except Exception as e:
        return jsonify({"error": str(e)})

# 11) Serve filled CSV
@app.route("/api/download-filled")
def download_filled():
    path = "data/filled_output.csv"
    if os.path.exists(path):
        return send_file(path, as_attachment=True)
    return jsonify({"error": "No filled file found"}), 404

@app.route("/api/anomaly-scores")
def anomaly_scores():
    try:
        df = pd.read_csv("data/my_table.csv")
        numeric_cols = [col for col in df.columns if pd.api.types.is_numeric_dtype(df[col])]
        df_numeric = df[numeric_cols].dropna()

        clf = IsolationForest(random_state=42)
        scores = clf.fit(df_numeric).decision_function(df_numeric)

        results = [
            {"index": int(idx), "score": float(score)}
            for idx, score in zip(df_numeric.index, scores)
        ]

        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)})


# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=5050)
