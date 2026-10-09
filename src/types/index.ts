export type SensorType = 
  | 'differential_pressure'
  | 'flow_rate'
  | 'temperature'
  | 'vibration'
  | 'operating_hours'
  | 'particle_concentration';

export type SensorStatus = 
  | 'NORMAL' 
  | 'WARNING' 
  | 'CRITICAL' 
  | 'SENSOR_OFFLINE' 
  | 'DATA_UNAVAILABLE';

export type FilterCondition = 
  | 'EXCELLENT' 
  | 'GOOD' 
  | 'DEGRADED' 
  | 'CRITICAL' 
  | 'FAILED';

export type OverallStatus = 
  | 'HEALTHY' 
  | 'MONITOR'
  | 'DEGRADING' 
  | 'DEGRADED'
  | 'ELEVATED_RISK' 
  | 'CRITICAL'
  | 'FAILURE_PREDICTED'
  | 'WARNING';

export type SystemConnectionMode = 
  | 'LIVE'
  | 'DEMO'
  | 'OFFLINE'
  | 'DEVICE_NOT_CONNECTED'
  | 'BACKEND_OFFLINE'
  | 'PREDICTION_SERVICE_UNAVAILABLE';

export type AnomalyType = 
  | 'FILTER_DEGRADATION'
  | 'SENSOR_FAILURE'
  | 'NONE';

export interface ESP32DeviceState {
  deviceId: string;
  filterId: string;
  isOnline: boolean;
  ipAddress: string;
  wifiSsid: string;
  signalDbm: number; // e.g. -62 dBm
  lastHeartbeat: string;
  samplingFrequencyHz: number;
  packetsReceived: number;
  packetLossPercent: number;
  payloadValidationStatus: 'VALID' | 'ANOMALY_DETECTED' | 'PAYLOAD_CORRUPT';
}

export interface SensorPoint {
  timestamp: number;
  value: number;
}

export interface SensorData {
  id: string;
  type: SensorType;
  name: string;
  value: number;
  unit: string;
  status: SensorStatus;
  normalRange: [number, number];
  warningThreshold: number;
  criticalThreshold: number;
  rateOfChange: number; // e.g. +0.35 kPa/h
  history: SensorPoint[];
  isAvailable: boolean;
  unavailableReason?: string;
  sensorLocation?: string;
}

export interface HealthFactor {
  id: string;
  name: string;
  weightPercent: number;
  contributionScore: number; // 0 - 100
  impact: 'low' | 'medium' | 'high';
  sensorKey: SensorType | 'historical';
}

export interface MLPrediction {
  failureProbability: number; // e.g. 31%
  risk7Day: number; // e.g. 8.4%
  risk30Day: number; // e.g. 31.0%
  riskLevel?: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  predictedFailureWindow: string; // e.g. '18 to 25 Nov 2026'
  modelConfidence: number; // e.g. 91.0%
  rulHours: number; // e.g. 432
  rulDays: number; // e.g. 18
  rulConfidenceInterval: [number, number]; // e.g. [380, 490]
  recommendedMaintenanceWindow?: string; // e.g. '04 to 10 Nov 2026'
  insights: string[];
  featureImportance: { name: string; score: number; impact?: 'High' | 'Moderate' | 'Low' | string }[];
  modelVersion?: string;
  lastPredictionTimestamp?: string;
}

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFORMATION';
export type AlertStatus = 'NEW' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface Alert {
  id: string;
  filterId: string;
  severity: AlertSeverity;
  sensor: string;
  sensorType: SensorType;
  value: number | string;
  threshold: number | string;
  timestamp: string;
  message: string;
  recommendedAction: string;
  status: AlertStatus;
  anomalyClassification?: AnomalyType;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export type MaintenancePriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type MaintenanceStatus = 'PENDING' | 'SCHEDULED' | 'COMPLETED';

export interface MaintenanceRecommendation {
  id: string;
  filterId: string;
  title: string;
  priority: MaintenancePriority;
  reason: string;
  action: string;
  recommendedWindow: string;
  status: MaintenanceStatus;
  workOrderId?: string;
}

export interface WorkOrder {
  id: string;
  title: string;
  equipmentId: string;
  priority: MaintenancePriority;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
  assignedTo: string;
  scheduledDate: string;
  notes: string;
  createdDate: string;
}

export interface Equipment {
  id: string;
  name: string;
  location: string;
  installationDate: string;
  lastMaintenanceDate: string;
  operatingHours: number;
  status: 'ONLINE' | 'MAINTENANCE' | 'OFFLINE';
  filterModel: string;
  ratedFlow: number; // L/min
  maxDifferentialPressure: number; // kPa
  deviceId?: string;
}

export type DemoScenario = 
  | 'HEALTHY' 
  | 'LOADING' 
  | 'DEGRADING' 
  | 'ELEVATED_RISK' 
  | 'CRITICAL' 
  | 'NORMAL' 
  | 'WARNING';

export type UserRole = 'OPERATOR' | 'MAINTENANCE_ENGINEER' | 'ADMINISTRATOR';

export interface ThresholdSettings {
  differentialPressure: { warning: number; critical: number };
  flowRate: { warning: number; critical: number }; // min threshold
  temperature: { warning: number; critical: number };
  vibration: { warning: number; critical: number };
  particleConcentration: { warning: number; critical: number; unit: 'ug/m3' | 'particles/L' | 'µg/m³' };
  operatingHours: { serviceInterval: number };
  debounceSeconds: number;
  particleSensorConnected: boolean;
}

export interface MaintenanceCycleData {
  cycleId: string;
  name?: string;
  period?: string;
  durationHours?: number;
  initialPressure?: number;
  finalPressure?: number;
  flowDegradationPercent?: number;
  filterSerial?: string;
  installDate?: string;
  lifespanDays?: number;
  totalOperatingHours?: number;
  finalDP?: number;
  finalFlow?: number;
  failureMode?: string;
  points?: {
    hours: number;
    pressure: number;
    flow: number;
    health: number;
    vibration: number;
  }[];
}

export interface ForecastPoint {
  day: number;
  date: string;
  actualPressure?: number;
  predictedPressure: number;
  confidenceLower: number;
  confidenceUpper: number;
  warningThreshold: number;
  criticalThreshold: number;
}

export interface JudgeDemoStep {
  step: number;
  title: string;
  phase: string;
  dp: number;
  flow: number;
  temp: number;
  vib: number;
  health: number;
  risk: number;
  rulHours: number;
  status: OverallStatus;
  anomalyType: AnomalyType;
  description: string;
}

export type NavSectionKey = 
  | 'command_center'
  | 'health'
  | 'sensors'
  | 'degradation'
  | 'forecast'
  | 'rul'
  | 'xai'
  | 'copilot'
  | 'alerts'
  | 'lifecycle'
  | 'history'
  | 'simulator'
  | 'model_intelligence'
  | 'device_health'
  | 'reports'
  | 'settings';
