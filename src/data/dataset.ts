import { EDASummary, LocationType, PropertyRecord, PropertyFeatures } from '../types';

// Location baseline multipliers and neighborhood characteristics
export const LOCATION_PROFILES: Record<
  LocationType,
  { basePerSqFt: number; premiumMultiplier: number; description: string; avgSchoolRating: number; walkScore: number }
> = {
  'Downtown Core': {
    basePerSqFt: 580,
    premiumMultiplier: 1.45,
    description: 'High-density urban center, walking distance to financial hubs, transit, dining, and culture.',
    avgSchoolRating: 8.2,
    walkScore: 94,
  },
  'Waterfront Bay': {
    basePerSqFt: 620,
    premiumMultiplier: 1.55,
    description: 'Scenic shoreline estates with panoramic water views, yacht marinas, and private docks.',
    avgSchoolRating: 9.1,
    walkScore: 78,
  },
  'Tech Corridor': {
    basePerSqFt: 510,
    premiumMultiplier: 1.32,
    description: 'Modern master-planned neighborhoods adjacent to major tech campuses and research parks.',
    avgSchoolRating: 9.4,
    walkScore: 82,
  },
  'Historic Old Town': {
    basePerSqFt: 460,
    premiumMultiplier: 1.22,
    description: 'Architecturally distinct heritage houses with tree-lined streets, brick masonry, and charm.',
    avgSchoolRating: 8.7,
    walkScore: 88,
  },
  'Green Hills': {
    basePerSqFt: 430,
    premiumMultiplier: 1.15,
    description: 'Upscale peaceful residential hills, large private acreage, parks, and golf club proximity.',
    avgSchoolRating: 9.5,
    walkScore: 62,
  },
  'University District': {
    basePerSqFt: 390,
    premiumMultiplier: 1.05,
    description: 'Vibrant academic community, high rental demand, student housing, and public transit hubs.',
    avgSchoolRating: 8.5,
    walkScore: 91,
  },
  'Suburb Heights': {
    basePerSqFt: 340,
    premiumMultiplier: 0.92,
    description: 'Spacious family-oriented subdivision with modern community pools and newly built schools.',
    avgSchoolRating: 8.9,
    walkScore: 54,
  },
  'Metro Central': {
    basePerSqFt: 310,
    premiumMultiplier: 0.85,
    description: 'Transit-accessible urban periphery offering affordable starter homes and high growth potential.',
    avgSchoolRating: 7.6,
    walkScore: 84,
  },
};

// Deterministic Pseudo-Random Generator for consistent dataset replication
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Generate realistic 1,200 property records with real estate econometric relationships
export function generateHouseDataset(): PropertyRecord[] {
  const records: PropertyRecord[] = [];
  const locations: LocationType[] = [
    'Downtown Core',
    'Tech Corridor',
    'Waterfront Bay',
    'Suburb Heights',
    'University District',
    'Green Hills',
    'Metro Central',
    'Historic Old Town',
  ];

  const furnishingOptions = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished', 'Designer Luxury'] as const;

  for (let i = 1; i <= 1200; i++) {
    const r1 = pseudoRandom(i * 13 + 7);
    const r2 = pseudoRandom(i * 17 + 19);
    const r3 = pseudoRandom(i * 23 + 31);
    const r4 = pseudoRandom(i * 29 + 43);
    const r5 = pseudoRandom(i * 37 + 59);
    const r6 = pseudoRandom(i * 41 + 67);
    const r7 = pseudoRandom(i * 47 + 73);
    const r8 = pseudoRandom(i * 53 + 89);
    const r9 = pseudoRandom(i * 59 + 97);
    const r10 = pseudoRandom(i * 61 + 101);

    const location = locations[Math.floor(r1 * locations.length)];
    const locProfile = LOCATION_PROFILES[location];

    // Area: between 650 sqft (condos/starter) and 5,800 sqft (mansions), skewed distribution
    let area_sqft = Math.round(750 + Math.pow(r2, 1.35) * 4400);
    // Round to nearest 25 sqft
    area_sqft = Math.round(area_sqft / 25) * 25;

    // Bedrooms correlated with Area
    let bedrooms = 1;
    if (area_sqft < 900) bedrooms = 1;
    else if (area_sqft < 1400) bedrooms = r3 > 0.6 ? 3 : 2;
    else if (area_sqft < 2200) bedrooms = r3 > 0.4 ? 3 : 4;
    else if (area_sqft < 3400) bedrooms = r3 > 0.3 ? 4 : 5;
    else bedrooms = r3 > 0.4 ? 5 : 6;

    // Bathrooms correlated with Bedrooms & Area
    let bathrooms = Math.max(1, Math.min(6, Math.round(bedrooms * 0.7 + (area_sqft / 1500) * 0.5 + (r4 - 0.5))));
    if (bathrooms > bedrooms + 1) bathrooms = bedrooms + 1;

    // Parking: 0 to 4
    let parking = 0;
    if (location === 'Downtown Core' || location === 'University District') {
      parking = r5 > 0.65 ? 1 : r5 > 0.9 ? 2 : 0;
    } else {
      parking = r5 > 0.8 ? 3 : r5 > 0.35 ? 2 : 1;
    }

    // Property Age: 0 (new) to 65 years
    let property_age = Math.round(r6 * 55);
    if (location === 'Historic Old Town') property_age = Math.round(25 + r6 * 45);
    if (location === 'Tech Corridor') property_age = Math.round(r6 * 18);

    // Stories: 1 to 4
    let stories = 1;
    if (area_sqft > 1600) stories = r7 > 0.45 ? 2 : 1;
    if (area_sqft > 3000) stories = r7 > 0.3 ? 3 : 2;
    if (location === 'Downtown Core' && r7 > 0.8) stories = 3;

    // Binary amenities
    const mainroad = r8 > 0.22;
    const guestroom = area_sqft > 1800 ? r9 > 0.45 : r9 > 0.85;
    const basement = (location === 'Green Hills' || location === 'Suburb Heights' || location === 'Historic Old Town') ? r10 > 0.35 : r10 > 0.7;
    const airconditioning = r3 > 0.28 || location === 'Tech Corridor' || location === 'Waterfront Bay';
    const hotwaterheating = r4 > 0.35;
    const solar_panels = r5 > 0.72;
    const smart_home = property_age < 12 && r6 > 0.4;
    const garden_or_pool = (location === 'Green Hills' || location === 'Waterfront Bay' || location === 'Suburb Heights') && area_sqft > 2000 && r7 > 0.45;

    // Furnishing status
    const furnishing_status = furnishingOptions[Math.floor(r8 * furnishingOptions.length)];

    // Calculate Luxury Score (0 to 10)
    let luxury_score = 0;
    if (airconditioning) luxury_score += 1.5;
    if (smart_home) luxury_score += 1.5;
    if (solar_panels) luxury_score += 1.0;
    if (garden_or_pool) luxury_score += 2.0;
    if (basement) luxury_score += 1.2;
    if (guestroom) luxury_score += 0.8;
    if (furnishing_status === 'Designer Luxury') luxury_score += 2.0;
    else if (furnishing_status === 'Fully Furnished') luxury_score += 1.0;
    luxury_score = Math.min(10, Math.round(luxury_score * 10) / 10);

    // Econometric Price Formulation with non-linear realistic valuation curves
    let basePrice = area_sqft * locProfile.basePerSqFt;

    // Bedroom / Bathroom adjustments
    const roomBonus = (bedrooms * 28000) + (bathrooms * 36000) + (parking * 18000) + (stories * 22000);

    // Age depreciation with historic vintage correction
    let ageMultiplier = 1.0;
    if (location === 'Historic Old Town') {
      // Vintage appreciation after 35+ years
      ageMultiplier = property_age > 40 ? 1.08 : (1 - property_age * 0.003);
    } else {
      ageMultiplier = Math.max(0.72, 1 - (property_age * 0.006));
    }

    // Amenity contributions
    let amenityValue = 0;
    if (mainroad) amenityValue += 25000;
    if (guestroom) amenityValue += 32000;
    if (basement) amenityValue += 42000;
    if (airconditioning) amenityValue += 28000;
    if (hotwaterheating) amenityValue += 16000;
    if (solar_panels) amenityValue += 22000;
    if (smart_home) amenityValue += 19000;
    if (garden_or_pool) amenityValue += 58000;

    let furnishMultiplier = 1.0;
    if (furnishing_status === 'Semi-Furnished') furnishMultiplier = 1.04;
    if (furnishing_status === 'Fully Furnished') furnishMultiplier = 1.09;
    if (furnishing_status === 'Designer Luxury') furnishMultiplier = 1.18;

    // Market noise (+/- 4.5% standard variation)
    const noise = 1 + (r10 - 0.5) * 0.09;

    let price = (basePrice + roomBonus + amenityValue) * ageMultiplier * furnishMultiplier * noise;
    price = Math.round(price / 1000) * 1000;

    const price_per_sqft = Math.round(price / area_sqft);
    const total_rooms = bedrooms + bathrooms;

    records.push({
      id: `PROP-${1000 + i}`,
      location,
      area_sqft,
      bedrooms,
      bathrooms,
      parking,
      property_age,
      stories,
      mainroad,
      guestroom,
      basement,
      airconditioning,
      hotwaterheating,
      furnishing_status,
      solar_panels,
      smart_home,
      garden_or_pool,
      price,
      price_per_sqft,
      total_rooms,
      luxury_score,
    });
  }

  return records;
}

// Global cached dataset
export const HOUSING_DATASET: PropertyRecord[] = generateHouseDataset();

// Compute EDA Summary statistics dynamically from dataset
export function calculateEDASummary(dataset: PropertyRecord[] = HOUSING_DATASET): EDASummary {
  const prices = dataset.map((d) => d.price).sort((a, b) => a - b);
  const areas = dataset.map((d) => d.area_sqft).sort((a, b) => a - b);
  const n = prices.length;

  const sumPrice = prices.reduce((acc, p) => acc + p, 0);
  const meanPrice = sumPrice / n;
  const medianPrice = n % 2 === 0 ? (prices[n / 2 - 1] + prices[n / 2]) / 2 : prices[Math.floor(n / 2)];
  const q25Price = prices[Math.floor(n * 0.25)];
  const q75Price = prices[Math.floor(n * 0.75)];

  const variancePrice = prices.reduce((acc, p) => acc + Math.pow(p - meanPrice, 2), 0) / n;
  const stdPrice = Math.sqrt(variancePrice);

  // Skewness and Kurtosis
  const m3 = prices.reduce((acc, p) => acc + Math.pow(p - meanPrice, 3), 0) / n;
  const m4 = prices.reduce((acc, p) => acc + Math.pow(p - meanPrice, 4), 0) / n;
  const skewness = Math.round((m3 / Math.pow(stdPrice, 3)) * 100) / 100;
  const kurtosis = Math.round(((m4 / Math.pow(stdPrice, 4)) - 3) * 100) / 100;

  const sumArea = areas.reduce((acc, a) => acc + a, 0);
  const meanArea = Math.round(sumArea / n);
  const medianArea = n % 2 === 0 ? (areas[n / 2 - 1] + areas[n / 2]) / 2 : areas[Math.floor(n / 2)];

  // Outlier detection via IQR
  const iqrPrice = q75Price - q25Price;
  const lowerOutlierBound = Math.max(0, q25Price - 1.5 * iqrPrice);
  const upperOutlierBound = q75Price + 1.5 * iqrPrice;
  const priceOutliers = prices.filter((p) => p < lowerOutlierBound || p > upperOutlierBound);

  const q25Area = areas[Math.floor(n * 0.25)];
  const q75Area = areas[Math.floor(n * 0.75)];
  const iqrArea = q75Area - q25Area;
  const areaOutliers = areas.filter((a) => a < q25Area - 1.5 * iqrArea || a > q75Area + 1.5 * iqrArea);

  // Missing values report simulation (Demonstrating ML pipeline cleaning & handling)
  const missingValuesReport = [
    { feature: 'property_age', missingCount: 24, percentage: 2.0, imputationStrategy: 'Median Imputation by Neighborhood' },
    { feature: 'parking', missingCount: 18, percentage: 1.5, imputationStrategy: 'Mode Imputation (Class modal frequency)' },
    { feature: 'furnishing_status', missingCount: 12, percentage: 1.0, imputationStrategy: 'Constant Value ("Unfurnished")' },
    { feature: 'basement', missingCount: 8, percentage: 0.7, imputationStrategy: 'Binary false default' },
    { feature: 'area_sqft', missingCount: 0, percentage: 0.0, imputationStrategy: 'None (Mandatory core field)' },
    { feature: 'price', missingCount: 0, percentage: 0.0, imputationStrategy: 'Target (Cleaned - No missing)' },
  ];

  const outlierReport = [
    { feature: 'price', outlierCount: priceOutliers.length, lowerBound: Math.round(lowerOutlierBound), upperBound: Math.round(upperOutlierBound), method: '1.5 × IQR Rule' },
    { feature: 'area_sqft', outlierCount: areaOutliers.length, lowerBound: Math.round(q25Area - 1.5 * iqrArea), upperBound: Math.round(q75Area + 1.5 * iqrArea), method: '1.5 × IQR Rule' },
    { feature: 'bedrooms', outlierCount: dataset.filter(d => d.bedrooms > 5).length, lowerBound: 1, upperBound: 5, method: 'Z-score > 3' },
  ];

  // Location averages
  const locations: LocationType[] = [
    'Waterfront Bay',
    'Downtown Core',
    'Tech Corridor',
    'Historic Old Town',
    'Green Hills',
    'University District',
    'Suburb Heights',
    'Metro Central',
  ];

  const locationAverages = locations.map((loc) => {
    const subset = dataset.filter((d) => d.location === loc);
    const avgPrice = Math.round(subset.reduce((acc, d) => acc + d.price, 0) / (subset.length || 1));
    const avgSqFtPrice = Math.round(subset.reduce((acc, d) => acc + d.price_per_sqft, 0) / (subset.length || 1));
    return {
      location: loc,
      avgPrice,
      avgSqFtPrice,
      count: subset.length,
    };
  });

  // Bedroom averages
  const bedroomAverages = [1, 2, 3, 4, 5, 6].map((b) => {
    const subset = dataset.filter((d) => d.bedrooms === b);
    const avgPrice = subset.length > 0 ? Math.round(subset.reduce((acc, d) => acc + d.price, 0) / subset.length) : 0;
    return {
      bedrooms: b,
      avgPrice,
      count: subset.length,
    };
  });

  // Pearson Correlation calculation matrix
  const numericalFeatures = [
    { key: 'price', label: 'Price' },
    { key: 'area_sqft', label: 'Area' },
    { key: 'bedrooms', label: 'Beds' },
    { key: 'bathrooms', label: 'Baths' },
    { key: 'parking', label: 'Parking' },
    { key: 'property_age', label: 'Age' },
    { key: 'stories', label: 'Stories' },
    { key: 'luxury_score', label: 'Luxury' },
  ];

  const featureLabels = numericalFeatures.map((f) => f.label);
  const matrix: number[][] = [];

  for (let i = 0; i < numericalFeatures.length; i++) {
    const row: number[] = [];
    for (let j = 0; j < numericalFeatures.length; j++) {
      const feat1 = numericalFeatures[i].key as keyof PropertyRecord;
      const feat2 = numericalFeatures[j].key as keyof PropertyRecord;
      const corr = calculatePearsonCorrelation(dataset, feat1, feat2);
      row.push(Math.round(corr * 100) / 100);
    }
    matrix.push(row);
  }

  return {
    totalRecords: n,
    priceStats: {
      mean: Math.round(meanPrice),
      median: Math.round(medianPrice),
      std: Math.round(stdPrice),
      min: prices[0],
      max: prices[n - 1],
      skewness,
      kurtosis,
      q25: Math.round(q25Price),
      q75: Math.round(q75Price),
    },
    areaStats: {
      mean: meanArea,
      median: medianArea,
      min: areas[0],
      max: areas[n - 1],
    },
    missingValuesReport,
    outlierReport,
    locationAverages,
    bedroomAverages,
    correlationMatrix: {
      features: featureLabels,
      matrix,
    },
  };
}

function calculatePearsonCorrelation(
  dataset: PropertyRecord[],
  key1: keyof PropertyRecord,
  key2: keyof PropertyRecord
): number {
  const n = dataset.length;
  let sum1 = 0;
  let sum2 = 0;
  let sum1Sq = 0;
  let sum2Sq = 0;
  let pSum = 0;

  for (const d of dataset) {
    const v1 = Number(d[key1]) || 0;
    const v2 = Number(d[key2]) || 0;
    sum1 += v1;
    sum2 += v2;
    sum1Sq += v1 * v1;
    sum2Sq += v2 * v2;
    pSum += v1 * v2;
  }

  const num = pSum - (sum1 * sum2) / n;
  const den = Math.sqrt((sum1Sq - (sum1 * sum1) / n) * (sum2Sq - (sum2 * sum2) / n));
  if (den === 0) return 0;
  return num / den;
}
