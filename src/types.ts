export type LocationType =
  | 'Downtown Core'
  | 'Tech Corridor'
  | 'Waterfront Bay'
  | 'Suburb Heights'
  | 'University District'
  | 'Green Hills'
  | 'Metro Central'
  | 'Historic Old Town';

export type FurnishingStatus = 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished' | 'Designer Luxury';

export interface PropertyFeatures {
  location: LocationType;
  area_sqft: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  property_age: number;
  stories: number;
  mainroad: boolean;
  guestroom: boolean;
  basement: boolean;
  airconditioning: boolean;
  hotwaterheating: boolean;
  furnishing_status: FurnishingStatus;
  solar_panels: boolean;
  smart_home: boolean;
  garden_or_pool: boolean;
}

export type ModelAlgorithm =
  | 'gradient_boosting'
  | 'random_forest'
  | 'decision_tree'
  | 'ridge_regression'
  | 'linear_regression'
  | 'ensemble';

export interface ModelMetric {
  id: ModelAlgorithm;
  name: string;
  category: 'Linear' | 'Regularized' | 'Tree' | 'Ensemble Bagging' | 'Ensemble Boosting';
  mae: number;
  mse: number;
  rmse: number;
  r2: number;
  mape: number;
  cv_score_mean: number;
  cv_score_std: number;
  training_time_ms: number;
  isBest?: boolean;
  description: string;
}

export interface FeatureContribution {
  feature: string;
  name: string;
  value: string | number | boolean;
  impact: number; // in dollars (+/-)
  percentage: number;
  direction: 'positive' | 'negative' | 'neutral';
  explanation: string;
}

export interface PredictionOutput {
  predictedPrice: number;
  pricePerSqFt: number;
  confidenceLower: number;
  confidenceUpper: number;
  confidenceMarginPercent: number;
  confidenceLowerCI: number;
  confidenceUpperCI: number;
  confidenceLowerEnsemble: number;
  confidenceUpperEnsemble: number;
  ensembleStdDev: number;
  ensembleMean: number;
  selectedModel: ModelAlgorithm;
  modelPredictions: Record<ModelAlgorithm, number>;
  featureContributions: FeatureContribution[];
  basePrice: number;
  marketPercentile: number;
  estimatedRentMonthly: number;
  rentalYieldPercent: number;
  luxuryScore: number;
  rangeExplanation: {
    title: string;
    rationale: string;
    buyerContext: string;
    sellerContext: string;
  };
}

export interface PropertyRecord extends PropertyFeatures {
  id: string;
  price: number;
  price_per_sqft: number;
  total_rooms: number;
  luxury_score: number;
  predicted_price_gb?: number;
  residual?: number;
}

export interface CorrelationItem {
  feature1: string;
  feature2: string;
  correlation: number;
}

export interface EDASummary {
  totalRecords: number;
  priceStats: {
    mean: number;
    median: number;
    std: number;
    min: number;
    max: number;
    skewness: number;
    kurtosis: number;
    q25: number;
    q75: number;
  };
  areaStats: {
    mean: number;
    median: number;
    min: number;
    max: number;
  };
  missingValuesReport: {
    feature: string;
    missingCount: number;
    percentage: number;
    imputationStrategy: string;
  }[];
  outlierReport: {
    feature: string;
    outlierCount: number;
    lowerBound: number;
    upperBound: number;
    method: string;
  }[];
  locationAverages: {
    location: LocationType;
    avgPrice: number;
    avgSqFtPrice: number;
    count: number;
  }[];
  bedroomAverages: {
    bedrooms: number;
    avgPrice: number;
    count: number;
  }[];
  correlationMatrix: {
    features: string[];
    matrix: number[][];
  };
}

export interface AIAppraisalReport {
  executiveSummary: string;
  fairMarketValuation: string;
  valuationRange: string;
  keyDrivers: string[];
  comparableInsight: string;
  renovationUpside: {
    recommendation: string;
    estimatedCost: string;
    projectedValueAdd: string;
    roi: string;
  }[];
  marketTrendOutlook: string;
  riskAssessment: string;
}
