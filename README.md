# 🏠 HousePriceAI

**HousePriceAI** is an end-to-end Machine Learning application that predicts residential property prices based on features such as location, area, number of bedrooms, bathrooms, parking, property age, and other property attributes.

The project covers the complete ML workflow, from **data preprocessing and exploratory data analysis to model training, evaluation, and real-time price prediction**.

---

## 🚀 Features

* 📊 **Data Cleaning & Preprocessing**
* 🔍 **Exploratory Data Analysis (EDA)**
* ⚙️ **Feature Engineering**
* 🤖 **Multiple Regression Models**
* 📈 **Model Performance Evaluation**
* 🏆 **Best Model Selection**
* 💾 **Trained Model Serialization**
* 🌐 **Interactive Prediction Interface**
* 🔌 **Prediction API**
* 📱 **Responsive User Interface**
* ✅ **Input Validation & Error Handling**

---

## 🧠 Machine Learning Workflow

```text
Dataset
   ↓
Data Cleaning
   ↓
Exploratory Data Analysis
   ↓
Feature Engineering
   ↓
Feature Selection
   ↓
Train/Test Split
   ↓
Regression Models
   ↓
Model Evaluation
   ↓
Best Model Selection
   ↓
Model Saving
   ↓
Prediction API
   ↓
Web Interface
   ↓
Predicted House Price
```

---

## 🛠️ Tech Stack

### Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn
* XGBoost

### Data Visualization

* Matplotlib
* Seaborn

### Backend

* Flask / FastAPI
* REST API

### Frontend

* HTML
* CSS
* JavaScript / React.js

### Model Deployment

* Joblib
* REST API

---

## 📂 Project Structure

```text
HousePriceAI/
│
├── data/
│   └── house_prices.csv
│
├── notebooks/
│   └── house_price_analysis.ipynb
│
├── src/
│   ├── preprocessing.py
│   ├── feature_engineering.py
│   ├── train.py
│   ├── evaluate.py
│   └── predict.py
│
├── models/
│   └── house_price_model.pkl
│
├── api/
│   └── app.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── requirements.txt
├── README.md
└── .gitignore
```

---

## 📊 Dataset

The model uses residential property data containing features such as:

| Feature      | Description              |
| ------------ | ------------------------ |
| Location     | Property location        |
| Area         | Property area            |
| Bedrooms     | Number of bedrooms       |
| Bathrooms    | Number of bathrooms      |
| Parking      | Available parking spaces |
| Property Age | Age of the property      |
| Price        | Target house price       |

The dataset is cleaned and transformed before being provided to the machine learning models.

---

## 🔎 Exploratory Data Analysis

EDA is performed to understand the relationship between property characteristics and house prices.

Key analysis includes:

* Price distribution
* Area vs. price analysis
* Bedrooms vs. price
* Bathrooms vs. price
* Location-based price analysis
* Outlier detection
* Feature correlation
* Feature importance

Example visualizations:

```text
📊 Price Distribution
📈 Area vs Price
📦 Outlier Analysis
🔥 Correlation Heatmap
📍 Location-wise Price Analysis
```

---

## ⚙️ Feature Engineering

The project creates and selects meaningful features to improve prediction performance.

Examples include:

* Property age
* Price per square foot
* Total rooms
* Location encoding
* Numerical feature scaling
* Categorical feature encoding

Features with little predictive value or excessive correlation can be removed during preprocessing.

---

## 🤖 Machine Learning Models

Multiple regression algorithms are evaluated:

1. **Linear Regression**
2. **Decision Tree Regression**
3. **Random Forest Regression**
4. **Gradient Boosting Regression**
5. **XGBoost Regression**

The models are compared using multiple evaluation metrics, and the best-performing model is selected for deployment.

---

## 📈 Model Evaluation

The following metrics are used:

### MAE

Measures the average absolute difference between actual and predicted prices.

### MSE

Measures the average squared prediction error.

### RMSE

Measures the square root of the average squared error.

### R² Score

Measures how well the model explains the variation in house prices.

Example evaluation table:

| Model             | MAE | RMSE | R² Score |
| ----------------- | --: | ---: | -------: |
| Linear Regression |   - |    - |        - |
| Decision Tree     |   - |    - |        - |
| Random Forest     |   - |    - |        - |
| Gradient Boosting |   - |    - |        - |
| XGBoost           |   - |    - |        - |

> Replace the values above with the actual results obtained after training the models.

---

## 🌐 Prediction Interface

Users can enter property details through the web interface.

### Input

```text
Location
Area
Bedrooms
Bathrooms
Parking
Property Age
Other Property Attributes
```

### Output

```text
Estimated House Price
```

The interface validates user inputs and sends the data to the backend prediction API.

---

## 🔌 API

The backend exposes an endpoint for house price prediction.

### Example Request

```http
POST /predict
```

```json
{
  "location": "Hyderabad",
  "area": 1500,
  "bedrooms": 3,
  "bathrooms": 2,
  "parking": 1,
  "property_age": 5
}
```

### Example Response

```json
{
  "predicted_price": 8500000
}
```

---

## 💻 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/HousePriceAI.git
```

### 2. Navigate to the Project

```bash
cd HousePriceAI
```

### 3. Create a Virtual Environment

```bash
python -m venv venv
```

### 4. Activate the Environment

**Windows:**

```bash
venv\Scripts\activate
```

**Linux/macOS:**

```bash
source venv/bin/activate
```

### 5. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## ▶️ Running the Project

### Train the Model

```bash
python src/train.py
```

### Run the Backend

```bash
python api/app.py
```

The application will be available at:

```text
http://localhost:5000
```

Open the frontend and enter the property details to receive a predicted house price.

---

## 📌 Example Prediction

```text
Location       : Hyderabad
Area           : 1500 sq.ft
Bedrooms       : 3
Bathrooms      : 2
Parking        : 1
Property Age   : 5 years

Predicted Price: ₹85,00,000
```

*Example value only. Actual predictions depend on the trained dataset and model.*

---

## 🎯 Project Objectives

* Build a practical machine learning regression system.
* Understand the factors influencing residential property prices.
* Compare different regression algorithms.
* Improve prediction performance through feature engineering.
* Deploy a trained ML model through an API.
* Provide an easy-to-use interface for real-time predictions.

---

## 🔮 Future Enhancements

* 🗺️ Interactive location-based price prediction
* 📍 Map integration
* 📊 Advanced property market analytics
* 🤖 Automated hyperparameter tuning
* 💡 Explainable AI for prediction reasoning
* 📈 Historical price trend analysis
* ☁️ Cloud deployment
* 📱 Mobile-friendly application
* 🔄 Automatic model retraining with new data

---

## 👨‍💻 Author

**Mohammad Shoheb**

Computer Science & Engineering Student
Nalla Malla Reddy Engineering College

---

## ⭐ Support

If you find this project useful, consider giving the repository a **⭐ Star** and sharing it with others interested in Machine Learning and Data Science.

---

## 📄 License

This project is licensed under the **MIT License**.

