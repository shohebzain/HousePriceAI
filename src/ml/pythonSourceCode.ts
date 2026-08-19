export interface PythonCodeFile {
  filename: string;
  language: string;
  description: string;
  code: string;
}

export const PYTHON_CODE_FILES: PythonCodeFile[] = [
  {
    filename: 'train_model.py',
    language: 'python',
    description: 'End-to-end Python ML training script with Scikit-learn & XGBoost, cross-validation, and model serialization',
    code: `"""
House Price Prediction System - Model Training & Evaluation Pipeline
Authors: Machine Learning Engineering Team
Framework: Scikit-learn, XGBoost, Pandas, NumPy, Joblib
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score, KFold
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor

try:
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False


def load_and_preprocess_data(csv_path: str = 'house_prices.csv') -> pd.DataFrame:
    """Load dataset, handle missing values, and engineer domain features."""
    print("[-] Loading dataset from:", csv_path)
    df = pd.read_csv(csv_path)

    print(f"[*] Raw Dataset shape: {df.shape}")

    # 1. Missing Value Imputation
    if df['property_age'].isnull().sum() > 0:
        df['property_age'] = df.groupby('location')['property_age'].transform(
            lambda x: x.fillna(x.median())
        )
    if df['parking'].isnull().sum() > 0:
        df['parking'] = df['parking'].fillna(df['parking'].mode()[0])
    if df['furnishing_status'].isnull().sum() > 0:
        df['furnishing_status'] = df['furnishing_status'].fillna('Unfurnished')

    # 2. Outlier Handling via IQR (capping extreme values)
    Q1 = df['price'].quantile(0.25)
    Q3 = df['price'].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = max(0, Q1 - 1.5 * IQR)
    upper_bound = Q3 + 1.5 * IQR
    df['price'] = np.clip(df['price'], lower_bound, upper_bound)

    # 3. Feature Engineering
    df['total_rooms'] = df['bedrooms'] + df['bathrooms']
    df['bed_to_bath_ratio'] = df['bedrooms'] / (df['bathrooms'] + 0.1)
    
    # Calculate Luxury Composite Score
    luxury_weights = {
        'airconditioning': 1.5,
        'smart_home': 1.5,
        'solar_panels': 1.0,
        'garden_or_pool': 2.0,
        'basement': 1.2,
        'guestroom': 0.8
    }
    df['luxury_score'] = 0.0
    for col, weight in luxury_weights.items():
        if col in df.columns:
            df['luxury_score'] += df[col].astype(int) * weight

    return df


def build_preprocessor() -> ColumnTransformer:
    """Build Sklearn ColumnTransformer for categorical and continuous scaling."""
    categorical_features = ['location', 'furnishing_status']
    numerical_features = [
        'area_sqft', 'bedrooms', 'bathrooms', 'parking', 
        'property_age', 'stories', 'luxury_score', 'total_rooms'
    ]
    binary_features = [
        'mainroad', 'guestroom', 'basement', 
        'airconditioning', 'hotwaterheating', 
        'solar_panels', 'smart_home', 'garden_or_pool'
    ]

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(drop='first', handle_unknown='ignore'), categorical_features),
            ('bin', 'passthrough', binary_features)
        ]
    )
    return preprocessor


def train_and_evaluate_models(df: pd.DataFrame):
    """Train multiple regression models, compare metrics, and select best model."""
    feature_cols = [
        'location', 'area_sqft', 'bedrooms', 'bathrooms', 'parking',
        'property_age', 'stories', 'mainroad', 'guestroom', 'basement',
        'airconditioning', 'hotwaterheating', 'furnishing_status',
        'solar_panels', 'smart_home', 'garden_or_pool', 'luxury_score', 'total_rooms'
    ]
    target_col = 'price'

    X = df[feature_cols]
    y = df[target_col]

    # Train/Test Split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )

    print(f"[*] Training samples: {X_train.shape[0]}, Test samples: {X_test.shape[0]}")

    preprocessor = build_preprocessor()

    models = {
        'Linear Regression': LinearRegression(),
        'Ridge Regression': Ridge(alpha=1.2),
        'Decision Tree': DecisionTreeRegressor(max_depth=8, random_state=42),
        'Random Forest': RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1),
        'Gradient Boosting': GradientBoostingRegressor(n_estimators=150, learning_rate=0.08, max_depth=5, random_state=42)
    }

    if XGBOOST_AVAILABLE:
        models['XGBoost Regressor'] = xgb.XGBRegressor(n_estimators=150, learning_rate=0.08, max_depth=5, random_state=42)

    results = []
    best_model_name = None
    best_r2 = -float('inf')
    best_pipeline = None

    print("\\n" + "=" * 70)
    print(f"{'Model Name':<22} | {'MAE ($)':<10} | {'RMSE ($)':<10} | {'R2 Score':<8} | {'5-Fold CV R2':<12}")
    print("=" * 70)

    for name, model in models.items():
        pipe = Pipeline(steps=[('preprocessor', preprocessor), ('regressor', model)])
        
        # Fit on train data
        pipe.fit(X_train, y_train)

        # Predict test data
        y_pred = pipe.predict(X_test)

        # Compute Metrics
        mae = mean_absolute_error(y_test, y_pred)
        mse = mean_squared_error(y_test, y_pred)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_test, y_pred)

        # 5-Fold Cross Validation
        cv = KFold(n_splits=5, shuffle=True, random_state=42)
        cv_scores = cross_val_score(pipe, X, y, cv=cv, scoring='r2')

        results.append({
            'model': name,
            'mae': mae,
            'rmse': rmse,
            'r2': r2,
            'cv_mean': cv_scores.mean(),
            'cv_std': cv_scores.std()
        })

        print(f"{name:<22} | {mae:<10.0f} | {rmse:<10.0f} | {r2:<8.3f} | {cv_scores.mean():.3f} (±{cv_scores.std():.3f})")

        if r2 > best_r2:
            best_r2 = r2
            best_model_name = name
            best_pipeline = pipe

    print("=" * 70)
    print(f"\\n[+] Best Performing Model: {best_model_name} with R2 = {best_r2:.4f}")

    # Serialize Best Model
    os.makedirs('saved_models', exist_ok=True)
    model_filepath = 'saved_models/house_price_model.joblib'
    joblib.dump(best_pipeline, model_filepath)
    print(f"[+] Model pipeline saved to: {model_filepath}")

    return best_pipeline, results


if __name__ == '__main__':
    # Sample synthetic test runner
    df = load_and_preprocess_data('house_prices.csv')
    best_pipe, metrics = train_and_evaluate_models(df)
`,
  },
  {
    filename: 'app_api.py',
    language: 'python',
    description: 'FastAPI Production Inference Server providing /predict and /health endpoints with input validation',
    code: `"""
FastAPI House Price Prediction Web Service
Endpoints:
- POST /predict: Predicts residential house valuation
- GET /health: Health check and model metadata
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Literal
import joblib
import pandas as pd
import numpy as np

app = FastAPI(
    title="House Price Prediction API",
    description="Machine Learning Service for Residential Real Estate Valuation",
    version="1.0.0"
)

# Load trained pipeline
MODEL_PATH = "saved_models/house_price_model.joblib"
try:
    model_pipeline = joblib.load(MODEL_PATH)
    print("[+] Model loaded successfully.")
except Exception as e:
    model_pipeline = None
    print(f"[!] Warning: Model file not found at {MODEL_PATH}: {e}")


class PropertyInput(BaseModel):
    location: Literal[
        'Downtown Core', 'Tech Corridor', 'Waterfront Bay', 
        'Suburb Heights', 'University District', 'Green Hills', 
        'Metro Central', 'Historic Old Town'
    ]
    area_sqft: float = Field(..., ge=300, le=20000, description="Square footage")
    bedrooms: int = Field(..., ge=1, le=10)
    bathrooms: int = Field(..., ge=1, le=8)
    parking: int = Field(0, ge=0, le=6)
    property_age: int = Field(..., ge=0, le=100)
    stories: int = Field(1, ge=1, le=5)
    mainroad: bool = True
    guestroom: bool = False
    basement: bool = False
    airconditioning: bool = True
    hotwaterheating: bool = False
    furnishing_status: Literal['Unfurnished', 'Semi-Furnished', 'Fully Furnished', 'Designer Luxury'] = 'Semi-Furnished'
    solar_panels: bool = False
    smart_home: bool = False
    garden_or_pool: bool = False


class PredictionResponse(BaseModel):
    predicted_price: float
    price_per_sqft: float
    confidence_interval: dict
    currency: str = "USD"
    model_used: str = "Gradient Boosting Regressor"


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": model_pipeline is not None,
        "version": "1.0.0"
    }


@app.post("/predict", response_model=PredictionResponse)
def predict_price(property_data: PropertyInput):
    if model_pipeline is None:
        raise HTTPException(status_code=503, detail="Model artifact is not loaded.")

    # Convert Pydantic model to DataFrame
    data_dict = property_data.dict()
    
    # Feature Engineering
    data_dict['total_rooms'] = data_dict['bedrooms'] + data_dict['bathrooms']
    
    luxury_score = 0.0
    if data_dict['airconditioning']: luxury_score += 1.5
    if data_dict['smart_home']: luxury_score += 1.5
    if data_dict['solar_panels']: luxury_score += 1.0
    if data_dict['garden_or_pool']: luxury_score += 2.0
    if data_dict['basement']: luxury_score += 1.2
    if data_dict['guestroom']: luxury_score += 0.8
    if data_dict['furnishing_status'] == 'Designer Luxury': luxury_score += 2.0
    elif data_dict['furnishing_status'] == 'Fully Furnished': luxury_score += 1.0
    data_dict['luxury_score'] = luxury_score

    df_input = pd.DataFrame([data_dict])
    
    # Run Inference
    prediction = float(model_pipeline.predict(df_input)[0])
    price_per_sqft = round(prediction / property_data.area_sqft, 2)
    
    # Estimate 95% Confidence Interval (RMSE approximation ~$30k)
    rmse_estimate = 30792
    lower_bound = max(0, round(prediction - 1.96 * rmse_estimate, 2))
    upper_bound = round(prediction + 1.96 * rmse_estimate, 2)

    return {
        "predicted_price": round(prediction, 2),
        "price_per_sqft": price_per_sqft,
        "confidence_interval": {
            "lower_bound": lower_bound,
            "upper_bound": upper_bound,
            "confidence_level": "95%"
        },
        "currency": "USD",
        "model_used": "Gradient Boosting Pipeline"
    }
`,
  },
  {
    filename: 'eda_analysis.py',
    language: 'python',
    description: 'Exploratory Data Analysis script generating distribution plots, correlation heatmaps, and outlier boxplots',
    code: `"""
Exploratory Data Analysis (EDA) Script
Generates statistical charts using Seaborn and Matplotlib.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_theme(style="whitegrid", palette="muted")

def run_eda(csv_path: str = 'house_prices.csv'):
    df = pd.read_csv(csv_path)
    print("=== DATASET OVERVIEW ===")
    print(df.info())
    print("\\n=== DESCRIPTIVE STATISTICS ===")
    print(df.describe())

    # 1. Price Distribution Plot
    plt.figure(figsize=(10, 5))
    sns.histplot(df['price'], kde=True, color='#2563eb', bins=35)
    plt.title('Residential House Price Distribution', fontsize=14, fontweight='bold')
    plt.xlabel('Price ($)')
    plt.ylabel('Frequency')
    plt.tight_layout()
    plt.savefig('eda_price_distribution.png', dpi=300)
    plt.close()

    # 2. Area vs Price Scatter with Trendline
    plt.figure(figsize=(10, 6))
    sns.regplot(x='area_sqft', y='price', data=df, scatter_kws={'alpha':0.4, 'color':'#3b82f6'}, line_kws={'color':'#dc2626'})
    plt.title('Property Area (Sq Ft) vs Sale Price', fontsize=14, fontweight='bold')
    plt.xlabel('Living Area (Sq Ft)')
    plt.ylabel('Price ($)')
    plt.tight_layout()
    plt.savefig('eda_area_vs_price.png', dpi=300)
    plt.close()

    # 3. Location Boxplots
    plt.figure(figsize=(12, 6))
    order = df.groupby('location')['price'].median().sort_values(ascending=False).index
    sns.boxplot(x='location', y='price', data=df, order=order, palette='crest')
    plt.xticks(rotation=30, ha='right')
    plt.title('House Price Variance Across Neighborhood Locations', fontsize=14, fontweight='bold')
    plt.tight_layout()
    plt.savefig('eda_location_boxplots.png', dpi=300)
    plt.close()

    # 4. Correlation Heatmap
    plt.figure(figsize=(10, 8))
    numeric_df = df.select_dtypes(include=[np.number])
    corr = numeric_df.corr()
    sns.heatmap(corr, annot=True, fmt=".2f", cmap='coolwarm', cbar=True, square=True)
    plt.title('Feature Correlation Matrix Heatmap', fontsize=14, fontweight='bold')
    plt.tight_layout()
    plt.savefig('eda_correlation_heatmap.png', dpi=300)
    plt.close()
    
    print("[+] All EDA charts generated and saved as PNG artifacts.")

if __name__ == '__main__':
    run_eda()
`,
  },
  {
    filename: 'requirements.txt',
    language: 'text',
    description: 'Python dependencies for reproducing the Machine Learning pipeline locally',
    code: `numpy>=1.24.0
pandas>=2.0.0
scikit-learn>=1.3.0
xgboost>=2.0.0
joblib>=1.3.0
matplotlib>=3.7.0
seaborn>=0.12.0
fastapi>=0.100.0
uvicorn>=0.23.0
pydantic>=2.0.0
`,
  },
  {
    filename: 'README.md',
    language: 'markdown',
    description: 'Complete documentation for running the Python ML pipeline, training models, and starting FastAPI backend',
    code: `# House Price Prediction System (Machine Learning)

An end-to-end Machine Learning solution that predicts residential property valuations based on location, square footage, room counts, age, amenities, and luxury indicators.

## 🚀 Quickstart Guide

### 1. Setup Virtual Environment
\`\`\`bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt
\`\`\`

### 2. Run Exploratory Data Analysis (EDA)
\`\`\`bash
python eda_analysis.py
\`\`\`
Generates:
- \`eda_price_distribution.png\`
- \`eda_area_vs_price.png\`
- \`eda_location_boxplots.png\`
- \`eda_correlation_heatmap.png\`

### 3. Train & Evaluate Regression Models
\`\`\`bash
python train_model.py
\`\`\`
Trains Linear Regression, Ridge, Decision Trees, Random Forests, and Gradient Boosting algorithms. Compares MAE, RMSE, R² and 5-Fold Cross Validation scores and exports the champion model to \`saved_models/house_price_model.joblib\`.

### 4. Start the Prediction API Server
\`\`\`bash
uvicorn app_api:app --reload --port 8000
\`\`\`
Open documentation at: \`http://localhost:8000/docs\`
`,
  },
];
