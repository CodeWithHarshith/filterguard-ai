import { 
  Equipment, 
  SensorData, 
  ThresholdSettings, 
  MLPrediction, 
  Alert, 
  MaintenanceRecommendation, 
  WorkOrder, 
  MaintenanceCycleData, 
  ForecastPoint 
} from '../types';

export const INITIAL_EQUIPMENT_LIST: Equipment[] = [
  {
    id: 'FLT-001',
    name: 'Industrial Air Filtration Unit A-1',
    location: 'Production Line A | Main Intake',
    installationDate: '12 Aug 2026',
    lastMaintenanceDate: '22 Sep 2026',
    operatingHours: 4832,
    status: 'ONLINE',
    filterModel: 'AeroMax Pro-HEPA 9000-X',
    ratedFlow: 1500,
    maxDifferentialPressure: 75,
  },
  {
    id: 'FLT-002',
    name: 'Cleanroom Secondary Filter B-2',
    location: 'Production Line B | Cleanroom HVAC',
    installationDate: '01 Jun 2026',
    lastMaintenanceDate: '15 Aug 2026',
    operatingHours: 3120,
    status: 'ONLINE',
    filterModel: 'UltraPure ULPA-Grade 400',
    ratedFlow: 1200,
    maxDifferentialPressure: 80,
  },
  {
    id: 'FLT-003',
    name: 'Heavy Dust Scrubber Unit C-3',
    location: 'Line C | Foundry Exhaust',
    installationDate: '18 Mar 2026',
    lastMaintenanceDate: '02 Sep 2026',
    operatingHours: 5640,
    status: 'MAINTENANCE',
    filterModel: 'DuraMesh Ceramic Cyclone 800',
    ratedFlow: 2000,
    maxDifferentialPressure: 95,
  }
];

export const DEFAULT_THRESHOLDS: ThresholdSettings = {
  differentialPressure: { warning: 50.0, critical: 70.0 },
  flowRate: { warning: 1050, critical: 900 },
  temperature: { warning: 75.0, critical: 90.0 },
  vibration: { warning: 5.0, critical: 8.0 },
  particleConcentration: { warning: 35.0, critical: 55.0, unit: 'µg/m³' },
  operatingHours: { serviceInterval: 6000 },
  debounceSeconds: 5,
  particleSensorConnected: true,
};

// Generate realistic historical points for sparklines and trends
const now = Date.now();
const generateHistory = (baseVal: number, variance: number, trend: number, count = 30) => {
  const points = [];
  for (let i = count - 1; i >= 0; i--) {
    const time = now - i * 60 * 1000; // 1 min intervals
    const noise = (Math.sin(i * 0.4) + Math.cos(i * 0.7)) * variance;
    const progress = (count - i) / count;
    const val = Number((baseVal + noise + progress * trend).toFixed(1));
    points.push({ timestamp: time, value: Math.max(0, val) });
  }
  return points;
};

export const INITIAL_SENSORS: SensorData[] = [
  {
    id: 'sensor-dp-01',
    type: 'differential_pressure',
    name: 'Differential Pressure',
    value: 42.6,
    unit: 'kPa',
    status: 'NORMAL',
    normalRange: [20.0, 48.0],
    warningThreshold: 50.0,
    criticalThreshold: 70.0,
    rateOfChange: 0.35, // +0.35 kPa/hr
    history: generateHistory(39.5, 0.8, 3.1, 40),
    isAvailable: true,
    sensorLocation: 'Across Filter Media (Inlet vs Outlet)',
  },
  {
    id: 'sensor-fl-01',
    type: 'flow_rate',
    name: 'Flow Rate',
    value: 1240,
    unit: 'L/min',
    status: 'NORMAL',
    normalRange: [1100, 1500],
    warningThreshold: 1050,
    criticalThreshold: 900,
    rateOfChange: -12.0, // -12 L/min / hr
    history: generateHistory(1310, 15, -70, 40),
    isAvailable: true,
    sensorLocation: 'Main Discharge Duct Venturi',
  },
  {
    id: 'sensor-temp-01',
    type: 'temperature',
    name: 'Operating Temperature',
    value: 68.4,
    unit: '°C',
    status: 'NORMAL',
    normalRange: [45.0, 72.0],
    warningThreshold: 75.0,
    criticalThreshold: 90.0,
    rateOfChange: 0.12,
    history: generateHistory(66.2, 0.9, 2.2, 40),
    isAvailable: true,
    sensorLocation: 'Pre-Filter Plenum Chamber',
  },
  {
    id: 'sensor-vib-01',
    type: 'vibration',
    name: 'Housing Vibration',
    value: 3.2,
    unit: 'mm/s',
    status: 'NORMAL',
    normalRange: [0.5, 4.5],
    warningThreshold: 5.0,
    criticalThreshold: 8.0,
    rateOfChange: 0.05,
    history: generateHistory(2.9, 0.25, 0.3, 40),
    isAvailable: true,
    sensorLocation: 'Fan Drive Bearing & Filter Frame',
  },
  {
    id: 'sensor-hrs-01',
    type: 'operating_hours',
    name: 'Operating Hours',
    value: 4832,
    unit: 'h',
    status: 'NORMAL',
    normalRange: [0, 6000],
    warningThreshold: 5500,
    criticalThreshold: 6000,
    rateOfChange: 1.0,
    history: generateHistory(4792, 0, 40, 40),
    isAvailable: true,
    sensorLocation: 'SCADA PLC Master Runtime Meter',
  },
  {
    id: 'sensor-part-01',
    type: 'particle_concentration',
    name: 'Particle Concentration',
    value: 18.4,
    unit: 'µg/m³',
    status: 'NORMAL',
    normalRange: [5.0, 25.0],
    warningThreshold: 35.0,
    criticalThreshold: 55.0,
    rateOfChange: 0.45,
    history: generateHistory(14.8, 1.2, 3.6, 40),
    isAvailable: true,
    unavailableReason: 'Particle concentration sensor: Not available',
    sensorLocation: 'Downstream Clean Air Chamber',
  }
];

export const INITIAL_PREDICTION: MLPrediction = {
  failureProbability: 18.4,
  risk7Day: 4.8,
  risk30Day: 18.4,
  predictedFailureWindow: '18–25 Nov 2026',
  modelConfidence: 91.7,
  rulDays: 26,
  rulHours: 624,
  rulConfidenceInterval: [21, 32],
  recommendedMaintenanceWindow: '04–10 Nov 2026',
  insights: [
    'Differential pressure shows a gradual upward trend (+3.1 kPa over last 40 hours) indicating normal particulate loading.',
    'Flow rate is inversely correlated with differential pressure, currently down 5.3% from nominal benchmark (1,310 L/min).',
    'Housing vibration remains stable at 3.2 mm/s, ruling out mechanical imbalance or bypass seal flutter.',
    'Operating hours (4,832 h) have reached 80.5% of the 6,000 h recommended service interval.',
    'Particle concentration downstream is within clean parameters (18.4 µg/m³), confirming filter integrity is uncompromised.'
  ],
  featureImportance: [
    { name: 'Differential Pressure (Delta-P)', score: 38 },
    { name: 'Flow Rate Reduction', score: 24 },
    { name: 'Cumulative Operating Hours', score: 18 },
    { name: 'Rate of Pressure Rise (dDP/dt)', score: 11 },
    { name: 'Temperature & Media Viscosity', score: 5 },
    { name: 'Particle Concentration Downstream', score: 4 }
  ]
};

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'ALT-1092',
    filterId: 'FLT-001',
    severity: 'WARNING',
    sensor: 'Flow Rate',
    sensorType: 'flow_rate',
    value: '1,240 L/min',
    threshold: '1,250 L/min baseline',
    timestamp: 'Today, 10:42 AM',
    message: 'Flow rate decreasing continuously over 6h observation window (-5.3% degradation).',
    recommendedAction: 'Verify intake damper positioning and inspect pre-filter mesh for debris buildup.',
    status: 'NEW'
  },
  {
    id: 'ALT-1088',
    filterId: 'FLT-001',
    severity: 'INFORMATION',
    sensor: 'Operating Hours',
    sensorType: 'operating_hours',
    value: '4,832 h',
    threshold: '5,000 h warning milestone',
    timestamp: 'Yesterday, 14:15 PM',
    message: 'Operating hours approaching 80% of manufacturer service interval (6,000 h limit).',
    recommendedAction: 'Confirm replacement cartridge AeroMax Pro-HEPA is stocked in warehouse inventory.',
    status: 'ACKNOWLEDGED',
    acknowledgedBy: 'David Miller (Lead Maintenance)',
    acknowledgedAt: 'Yesterday, 15:30 PM'
  },
  {
    id: 'ALT-1076',
    filterId: 'FLT-001',
    severity: 'CRITICAL',
    sensor: 'Differential Pressure',
    sensorType: 'differential_pressure',
    value: '51.2 kPa (transient spike)',
    threshold: '50.0 kPa warning',
    timestamp: '24 Sep 2026, 08:19 AM',
    message: 'Transient differential pressure spike detected during line speed increase.',
    recommendedAction: 'Automated pressure relief damper opened momentarily. Filter media stabilized.',
    status: 'RESOLVED',
    acknowledgedBy: 'Sarah Lin (Process Engineer)',
    resolvedAt: '24 Sep 2026, 09:05 AM'
  }
];

export const INITIAL_RECOMMENDATIONS: MaintenanceRecommendation[] = [
  {
    id: 'REC-301',
    filterId: 'FLT-001',
    title: 'Schedule Pre-Filter Visual Inspection',
    priority: 'MEDIUM',
    reason: 'Differential pressure shows a sustained upward trend (+0.35 kPa/h) with 5.3% reduction in flow velocity.',
    action: 'Inspect pre-filter intake coarse mesh for particulate cake buildup and verify pressure tap seals.',
    recommendedWindow: 'Within next 7 days (by 04 Oct 2026)',
    status: 'PENDING'
  },
  {
    id: 'REC-302',
    filterId: 'FLT-001',
    title: 'Prepare HEPA Filter Element Replacement',
    priority: 'HIGH',
    reason: 'ML model estimates Remaining Useful Life at 26 days (predicted failure window: 18–25 Nov 2026).',
    action: 'Requisition 1x AeroMax Pro-HEPA 9000-X filter element and book technician downtime during scheduled Line A changeover.',
    recommendedWindow: '04–10 Nov 2026 (Before critical 70 kPa threshold)',
    status: 'SCHEDULED',
    workOrderId: 'WO-8842'
  }
];

export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'WO-8842',
    title: 'Line A Main Intake HEPA Filter Cartridge Overhaul',
    equipmentId: 'FLT-001',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignedTo: 'Carlos Vance (HVAC Specialist)',
    scheduledDate: '06 Nov 2026, 06:00 AM',
    notes: 'Parts staged in Bay 4. Lockout/tagout protocol LOTO-09 required for intake blower.',
    createdDate: '26 Sep 2026'
  },
  {
    id: 'WO-8790',
    title: 'Pre-filter Cleaning & Differential Pressure Sensor Zero-Cal',
    equipmentId: 'FLT-001',
    priority: 'MEDIUM',
    status: 'COMPLETED',
    assignedTo: 'Sarah Lin',
    scheduledDate: '22 Sep 2026, 14:00 PM',
    notes: 'Cleaned pre-filter mesh. Zero-offset calibrated on Delta-P transmitter DP-01.',
    createdDate: '20 Sep 2026'
  }
];

// Historical cycles data for Cycle 1 vs Cycle 2 comparison
export const MAINTENANCE_CYCLES: MaintenanceCycleData[] = [
  {
    cycleId: 'CYC-01',
    name: 'Maintenance Cycle 1 (Q1-Q2 2026)',
    period: 'Jan 2026 – Jun 2026',
    durationHours: 5200,
    initialPressure: 22.4,
    finalPressure: 68.8,
    flowDegradationPercent: 28.5,
    points: [
      { hours: 0, pressure: 22.4, flow: 1480, health: 98, vibration: 2.1 },
      { hours: 1000, pressure: 26.1, flow: 1440, health: 94, vibration: 2.3 },
      { hours: 2000, pressure: 31.8, flow: 1390, health: 88, vibration: 2.6 },
      { hours: 3000, pressure: 39.2, flow: 1310, health: 79, vibration: 3.0 },
      { hours: 4000, pressure: 49.5, flow: 1200, health: 65, vibration: 3.6 },
      { hours: 4800, pressure: 61.2, flow: 1090, health: 48, vibration: 4.4 },
      { hours: 5200, pressure: 68.8, flow: 990, health: 32, vibration: 5.1 }
    ]
  },
  {
    cycleId: 'CYC-02',
    name: 'Maintenance Cycle 2 (Q3 2026 - Current)',
    period: 'Jul 2026 – Present',
    durationHours: 4832,
    initialPressure: 21.8,
    finalPressure: 42.6,
    flowDegradationPercent: 16.2,
    points: [
      { hours: 0, pressure: 21.8, flow: 1490, health: 99, vibration: 2.0 },
      { hours: 1000, pressure: 25.0, flow: 1450, health: 95, vibration: 2.2 },
      { hours: 2000, pressure: 29.4, flow: 1410, health: 90, vibration: 2.5 },
      { hours: 3000, pressure: 35.1, flow: 1340, health: 84, vibration: 2.8 },
      { hours: 4000, pressure: 40.2, flow: 1270, health: 76, vibration: 3.1 },
      { hours: 4832, pressure: 42.6, flow: 1240, health: 71, vibration: 3.2 }
    ]
  }
];

// Predictive degradation forecast data (Historical + 30 Days Forecast)
export const FORECAST_DATA: ForecastPoint[] = [
  { day: -15, date: '12 Sep', actualPressure: 36.2, predictedPressure: 36.2, confidenceLower: 35.5, confidenceUpper: 36.9, warningThreshold: 50, criticalThreshold: 70 },
  { day: -12, date: '15 Sep', actualPressure: 37.4, predictedPressure: 37.3, confidenceLower: 36.6, confidenceUpper: 38.0, warningThreshold: 50, criticalThreshold: 70 },
  { day: -9,  date: '18 Sep', actualPressure: 38.9, predictedPressure: 38.8, confidenceLower: 38.0, confidenceUpper: 39.6, warningThreshold: 50, criticalThreshold: 70 },
  { day: -6,  date: '21 Sep', actualPressure: 40.1, predictedPressure: 40.2, confidenceLower: 39.3, confidenceUpper: 41.1, warningThreshold: 50, criticalThreshold: 70 },
  { day: -3,  date: '24 Sep', actualPressure: 41.5, predictedPressure: 41.6, confidenceLower: 40.6, confidenceUpper: 42.6, warningThreshold: 50, criticalThreshold: 70 },
  { day: 0,   date: 'Today',  actualPressure: 42.6, predictedPressure: 42.6, confidenceLower: 41.5, confidenceUpper: 43.7, warningThreshold: 50, criticalThreshold: 70 },
  // Future predicted curve with widening uncertainty band
  { day: 5,   date: '+5 Days',  predictedPressure: 45.2, confidenceLower: 43.5, confidenceUpper: 47.0, warningThreshold: 50, criticalThreshold: 70 },
  { day: 10,  date: '+10 Days', predictedPressure: 48.4, confidenceLower: 45.8, confidenceUpper: 51.2, warningThreshold: 50, criticalThreshold: 70 },
  { day: 15,  date: '+15 Days', predictedPressure: 52.8, confidenceLower: 49.0, confidenceUpper: 56.8, warningThreshold: 50, criticalThreshold: 70 },
  { day: 20,  date: '+20 Days', predictedPressure: 58.6, confidenceLower: 53.4, confidenceUpper: 64.0, warningThreshold: 50, criticalThreshold: 70 },
  { day: 26,  date: '+26 Days (RUL)', predictedPressure: 66.5, confidenceLower: 60.1, confidenceUpper: 72.8, warningThreshold: 50, criticalThreshold: 70 },
  { day: 30,  date: '+30 Days', predictedPressure: 72.4, confidenceLower: 64.8, confidenceUpper: 80.2, warningThreshold: 50, criticalThreshold: 70 },
];
