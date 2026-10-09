import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import {
  SensorData,
  SensorType,
  SensorStatus,
  OverallStatus,
  FilterCondition,
  HealthFactor,
  MLPrediction,
  Alert,
  AlertSeverity,
  AlertStatus,
  MaintenanceRecommendation,
  WorkOrder,
  Equipment,
  DemoScenario,
  UserRole,
  ThresholdSettings,
  MaintenanceCycleData,
  ForecastPoint,
  SystemConnectionMode,
  ESP32DeviceState,
  JudgeDemoStep,
  AnomalyType
} from '../types';
import {
  INITIAL_EQUIPMENT_LIST,
  DEFAULT_THRESHOLDS,
  INITIAL_SENSORS,
  INITIAL_PREDICTION,
  INITIAL_ALERTS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_WORK_ORDERS,
  MAINTENANCE_CYCLES,
  FORECAST_DATA
} from '../data/mockData';
import { JUDGE_DEMO_STEPS } from '../data/judgeDemoSteps';
import { SupabaseService, SupabaseSyncStatus } from '../services/supabaseService';
import { SUPABASE_PROJECT_ID, SUPABASE_URL } from '../lib/supabase';

interface WhatIfSimulationResult {
  healthScore: number;
  failureProbability: number;
  rulHours: number;
  rulDays: number;
  condition: FilterCondition;
  riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  isAnomaly: boolean;
  anomalyMessage?: string;
}

interface FilterContextType {
  // Equipment
  equipmentList: Equipment[];
  selectedEquipmentId: string;
  selectedEquipment: Equipment;
  setSelectedEquipmentId: (id: string) => void;

  // System Connection Mode & ESP32 Hardware Status
  connectionMode: SystemConnectionMode;
  setConnectionMode: (mode: SystemConnectionMode) => void;
  esp32State: ESP32DeviceState;
  updateEsp32State: (updates: Partial<ESP32DeviceState>) => void;

  // Sensors & Health
  sensors: SensorData[];
  getSensor: (type: SensorType) => SensorData | undefined;
  healthScore: number;
  filterCondition: FilterCondition;
  overallStatus: OverallStatus;
  healthFactors: HealthFactor[];
  sensorAnomalyActive: boolean;
  toggleSensorAnomaly: () => void;
  anomalyStatusMessage: string | null;

  // Real-time Simulation
  isLive: boolean;
  setIsLive: (live: boolean) => void;
  lastUpdateSecondsAgo: number;
  currentScenario: DemoScenario;
  setScenario: (scenario: DemoScenario) => void;

  // Controlled Judge Demo Sequence (14 Steps)
  judgeDemoStepIndex: number;
  isJudgeDemoRunning: boolean;
  currentJudgeDemoStep: JudgeDemoStep;
  setJudgeDemoStep: (index: number) => void;
  nextJudgeDemoStep: () => void;
  prevJudgeDemoStep: () => void;
  resetJudgeDemo: () => void;
  startJudgeDemo: () => void;
  stopJudgeDemo: () => void;

  // What-If Simulator
  simulateWhatIf: (overrides: {
    dp?: number;
    flow?: number;
    temp?: number;
    vib?: number;
    hours?: number;
  }) => WhatIfSimulationResult;

  // ML Predictions
  prediction: MLPrediction;
  forecastData: ForecastPoint[];

  // Alerts
  alerts: Alert[];
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  activeAlertsCount: number;

  // Maintenance & Work Orders
  recommendations: MaintenanceRecommendation[];
  workOrders: WorkOrder[];
  createWorkOrder: (recId: string, order: Omit<WorkOrder, 'id' | 'createdDate'>) => void;

  // Cycles & Comparison
  maintenanceCycles: MaintenanceCycleData[];

  // Settings & Configuration
  thresholds: ThresholdSettings;
  updateThresholds: (newThresholds: Partial<ThresholdSettings>) => void;
  toggleParticleSensor: () => void;

  // Role & Permissions
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  // Export
  exportSensorCSV: () => void;

  // Supabase Cloud Integration
  supabaseSyncStatus: SupabaseSyncStatus;
  testSupabaseConnection: () => Promise<void>;
  syncToSupabaseNow: () => Promise<{ success: boolean; error?: string }>;
  autoSyncEnabled: boolean;
  setAutoSyncEnabled: (enabled: boolean) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [equipmentList] = useState<Equipment[]>(INITIAL_EQUIPMENT_LIST);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>('FLT-001');

  const selectedEquipment = useMemo(() => {
    return equipmentList.find(e => e.id === selectedEquipmentId) || equipmentList[0];
  }, [equipmentList, selectedEquipmentId]);

  // Connection Mode: Explicitly DEMO by default unless user simulates or connects LIVE
  const [connectionMode, setConnectionMode] = useState<SystemConnectionMode>('DEMO');

  // ESP32 Hardware Telemetry State
  const [esp32State, setEsp32State] = useState<ESP32DeviceState>({
    deviceId: 'ESP32-FILTER-001',
    filterId: 'FLT-001',
    isOnline: true,
    ipAddress: '192.168.1.144',
    wifiSsid: 'Plant-Net-Mesh-5G',
    signalDbm: -64,
    lastHeartbeat: new Date().toISOString(),
    samplingFrequencyHz: 10,
    packetsReceived: 38412,
    packetLossPercent: 0.08,
    payloadValidationStatus: 'VALID'
  });

  const updateEsp32State = (updates: Partial<ESP32DeviceState>) => {
    setEsp32State(prev => ({ ...prev, ...updates }));
  };

  const [thresholds, setThresholds] = useState<ThresholdSettings>(DEFAULT_THRESHOLDS);
  const [sensors, setSensors] = useState<SensorData[]>(INITIAL_SENSORS);
  const [currentScenario, setCurrentScenario] = useState<DemoScenario>('DEGRADING');
  const [isLive, setIsLive] = useState<boolean>(true);
  const [lastUpdateSecondsAgo, setLastUpdateSecondsAgo] = useState<number>(2);

  // Sensor Anomaly vs Filter Degradation differentiator (Section 25)
  const [sensorAnomalyActive, setSensorAnomalyActive] = useState<boolean>(false);
  const [anomalyStatusMessage, setAnomalyStatusMessage] = useState<string | null>(null);

  // Controlled Judge Demo Sequence
  const [judgeDemoStepIndex, setJudgeDemoStepIndex] = useState<number>(0);
  const [isJudgeDemoRunning, setIsJudgeDemoRunning] = useState<boolean>(false);

  const currentJudgeDemoStep = useMemo(() => {
    return JUDGE_DEMO_STEPS[judgeDemoStepIndex] || JUDGE_DEMO_STEPS[0];
  }, [judgeDemoStepIndex]);

  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [recommendations, setRecommendations] = useState<MaintenanceRecommendation[]>(INITIAL_RECOMMENDATIONS);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [maintenanceCycles] = useState<MaintenanceCycleData[]>(MAINTENANCE_CYCLES);
  const [forecastData, setForecastData] = useState<ForecastPoint[]>(FORECAST_DATA);

  const [userRole, setUserRole] = useState<UserRole>('MAINTENANCE_ENGINEER');

  // Supabase Sync State
  const [supabaseSyncStatus, setSupabaseSyncStatus] = useState<SupabaseSyncStatus>({
    isConnected: true,
    projectUrl: SUPABASE_URL,
    projectId: SUPABASE_PROJECT_ID,
    lastSyncTime: null,
    syncedRecordsCount: 0,
    tablesStatus: {
      sensor_readings: null,
      filter_health: null,
      predictions: null,
      alerts: null,
      work_orders: null,
    },
    errorMessage: null,
  });
  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(true);

  // Debounce counter for sensor conditions
  const warningDebounceRef = useRef<{ [key: string]: number }>({});

  const getSensor = (type: SensorType) => sensors.find(s => s.type === type);

  // Compute status for a sensor based on thresholds
  const computeSensorStatus = (type: SensorType, val: number, isAvail: boolean): SensorStatus => {
    if (!isAvail) return 'DATA_UNAVAILABLE';
    
    switch (type) {
      case 'differential_pressure':
        if (val >= thresholds.differentialPressure.critical) return 'CRITICAL';
        if (val >= thresholds.differentialPressure.warning) return 'WARNING';
        return 'NORMAL';
      case 'flow_rate':
        if (val <= thresholds.flowRate.critical) return 'CRITICAL';
        if (val <= thresholds.flowRate.warning) return 'WARNING';
        return 'NORMAL';
      case 'temperature':
        if (val >= thresholds.temperature.critical) return 'CRITICAL';
        if (val >= thresholds.temperature.warning) return 'WARNING';
        return 'NORMAL';
      case 'vibration':
        if (val >= thresholds.vibration.critical) return 'CRITICAL';
        if (val >= thresholds.vibration.warning) return 'WARNING';
        return 'NORMAL';
      case 'operating_hours':
        if (val >= thresholds.operatingHours.serviceInterval) return 'CRITICAL';
        if (val >= thresholds.operatingHours.serviceInterval * 0.85) return 'WARNING';
        return 'NORMAL';
      case 'particle_concentration':
        if (val >= thresholds.particleConcentration.critical) return 'CRITICAL';
        if (val >= thresholds.particleConcentration.warning) return 'WARNING';
        return 'NORMAL';
      default:
        return 'NORMAL';
    }
  };

  // Toggle Sensor Anomaly vs Filter Degradation simulation
  const toggleSensorAnomaly = () => {
    setSensorAnomalyActive(prev => {
      const next = !prev;
      if (next) {
        // Spike vibration or DP impossibly while flow remains high
        setSensors(curr => curr.map(s => {
          if (s.type === 'vibration') {
            return {
              ...s,
              value: 12.8,
              status: 'CRITICAL',
              rateOfChange: +8.5
            };
          }
          return s;
        }));
        setAnomalyStatusMessage('Possible sensor anomaly detected: Housing vibration spiked to 12.8 mm/s with no hydraulic correlation. Filter degradation cannot be confirmed.');
        
        // Add sensor anomaly alert
        const sensorAlert: Alert = {
          id: `ALT-SEN-${Math.floor(1000 + Math.random() * 9000)}`,
          filterId: selectedEquipmentId,
          severity: 'WARNING',
          sensor: 'Housing Vibration',
          sensorType: 'vibration',
          value: '12.8 mm/s',
          threshold: '4.5 mm/s limit',
          timestamp: 'Just now',
          message: 'Possible sensor anomaly detected. Sensor output discontinuous with hydraulic operating envelope.',
          recommendedAction: 'Inspect piezoresistive sensor wiring, grounding, and calibration prior to declaring filter failure.',
          status: 'NEW',
          anomalyClassification: 'SENSOR_FAILURE'
        };
        setAlerts(a => [sensorAlert, ...a]);
      } else {
        // Restore vibration
        setSensors(curr => curr.map(s => {
          if (s.type === 'vibration') {
            return {
              ...s,
              value: 2.4,
              status: 'NORMAL',
              rateOfChange: +0.02
            };
          }
          return s;
        }));
        setAnomalyStatusMessage(null);
      }
      return next;
    });
  };

  // Calculate dynamic Health Score (0 - 100)
  const healthFactors = useMemo<HealthFactor[]>(() => {
    const dp = getSensor('differential_pressure');
    const fl = getSensor('flow_rate');
    const temp = getSensor('temperature');
    const vib = getSensor('vibration');
    const hrs = getSensor('operating_hours');
    const part = getSensor('particle_concentration');

    // Health penalties
    const dpVal = dp?.value ?? 42.6;
    const dpScore = Math.max(0, Math.min(100, Math.round(100 - Math.max(0, (dpVal - 22) / (70 - 22)) * 100)));

    const flVal = fl?.value ?? 1240;
    const flScore = Math.max(0, Math.min(100, Math.round(((flVal - 900) / (1500 - 900)) * 100)));

    const tempVal = temp?.value ?? 68.4;
    const tempScore = Math.max(0, Math.min(100, Math.round(100 - Math.max(0, (tempVal - 50) / (90 - 50)) * 60)));

    const vibVal = vib?.value ?? 3.2;
    // If sensor anomaly is active, do not unfairly penalize filter core health
    const vibScore = sensorAnomalyActive ? 80 : Math.max(0, Math.min(100, Math.round(100 - Math.max(0, (vibVal - 2) / (8 - 2)) * 70)));

    const hrsVal = hrs?.value ?? 4832;
    const hrsScore = Math.max(0, Math.min(100, Math.round(100 - (hrsVal / thresholds.operatingHours.serviceInterval) * 80)));

    const isPartAvail = part?.isAvailable ?? false;
    const partVal = part?.value ?? 18.4;
    const partScore = isPartAvail 
      ? Math.max(0, Math.min(100, Math.round(100 - Math.max(0, (partVal - 10) / (55 - 10)) * 80)))
      : 100;

    if (isPartAvail) {
      return [
        { id: 'f-dp', name: 'Differential Pressure', weightPercent: 30, contributionScore: dpScore, impact: dpScore < 70 ? 'high' : 'medium', sensorKey: 'differential_pressure' },
        { id: 'f-fl', name: 'Flow Degradation', weightPercent: 20, contributionScore: flScore, impact: flScore < 70 ? 'high' : 'medium', sensorKey: 'flow_rate' },
        { id: 'f-temp', name: 'Operating Temperature', weightPercent: 10, contributionScore: tempScore, impact: 'low', sensorKey: 'temperature' },
        { id: 'f-vib', name: 'Housing Vibration', weightPercent: 10, contributionScore: vibScore, impact: 'low', sensorKey: 'vibration' },
        { id: 'f-hrs', name: 'Operating Hours Accrual', weightPercent: 15, contributionScore: hrsScore, impact: 'medium', sensorKey: 'operating_hours' },
        { id: 'f-part', name: 'Particle Concentration', weightPercent: 5, contributionScore: partScore, impact: 'low', sensorKey: 'particle_concentration' },
        { id: 'f-hist', name: 'Historical Degradation Trend', weightPercent: 10, contributionScore: 84, impact: 'low', sensorKey: 'historical' },
      ];
    } else {
      return [
        { id: 'f-dp', name: 'Differential Pressure', weightPercent: 33, contributionScore: dpScore, impact: dpScore < 70 ? 'high' : 'medium', sensorKey: 'differential_pressure' },
        { id: 'f-fl', name: 'Flow Degradation', weightPercent: 22, contributionScore: flScore, impact: flScore < 70 ? 'high' : 'medium', sensorKey: 'flow_rate' },
        { id: 'f-temp', name: 'Operating Temperature', weightPercent: 10, contributionScore: tempScore, impact: 'low', sensorKey: 'temperature' },
        { id: 'f-vib', name: 'Housing Vibration', weightPercent: 10, contributionScore: vibScore, impact: 'low', sensorKey: 'vibration' },
        { id: 'f-hrs', name: 'Operating Hours Accrual', weightPercent: 15, contributionScore: hrsScore, impact: 'medium', sensorKey: 'operating_hours' },
        { id: 'f-hist', name: 'Historical Degradation Trend', weightPercent: 10, contributionScore: 84, impact: 'low', sensorKey: 'historical' },
      ];
    }
  }, [sensors, thresholds, sensorAnomalyActive]);

  // Weighted health score calculation (target 82 on baseline)
  const healthScore = useMemo(() => {
    let totalScore = 0;
    let totalWeight = 0;
    healthFactors.forEach(f => {
      totalScore += (f.contributionScore * f.weightPercent);
      totalWeight += f.weightPercent;
    });
    const calculated = Math.round(totalScore / totalWeight);
    return Math.max(12, Math.min(99, calculated));
  }, [healthFactors]);

  const filterCondition = useMemo<FilterCondition>(() => {
    if (healthScore >= 90) return 'EXCELLENT';
    if (healthScore >= 75) return 'GOOD';
    if (healthScore >= 50) return 'DEGRADED';
    if (healthScore >= 30) return 'CRITICAL';
    return 'FAILED';
  }, [healthScore]);

  const overallStatus = useMemo<OverallStatus>(() => {
    if (healthScore >= 85) return 'HEALTHY';
    if (healthScore >= 70) return 'DEGRADING';
    if (healthScore >= 50) return 'ELEVATED_RISK';
    return 'CRITICAL';
  }, [healthScore]);

  // Dynamic ML Prediction and RUL estimation
  const prediction = useMemo<MLPrediction>(() => {
    const dp = getSensor('differential_pressure')?.value ?? 42.6;
    const dpNorm = Math.min(1, Math.max(0, (dp - 25) / (70 - 25)));
    const failProb = Math.min(99, Math.max(1, Math.round((dpNorm * 0.75 + (100 - healthScore) / 100 * 0.25) * 100)));
    const risk7 = Math.round(failProb * 0.28);
    const risk30 = Math.round(failProb * 0.72);

    const rulDays = Math.max(1, Math.round(45 * (healthScore / 100) * (1 - dpNorm * 0.6)));
    const rulHours = rulDays * 24;
    const lowerBound = Math.max(1, Math.round(rulDays * 0.85));
    const upperBound = Math.round(rulDays * 1.15);

    let riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (failProb >= 75) riskLevel = 'CRITICAL';
    else if (failProb >= 50) riskLevel = 'HIGH';
    else if (failProb >= 30) riskLevel = 'ELEVATED';
    else if (failProb >= 15) riskLevel = 'MODERATE';

    return {
      failureProbability: failProb,
      risk7Day: risk7,
      risk30Day: risk30,
      riskLevel,
      predictedFailureWindow: failProb > 40 ? '14 to 21 Nov 2026' : '02 to 12 Dec 2026',
      modelConfidence: 91.7,
      rulDays,
      rulHours,
      rulConfidenceInterval: [lowerBound, upperBound],
      recommendedMaintenanceWindow: `${Math.max(1, rulDays - 7)} to ${rulDays} Days`,
      insights: [
        'Differential pressure slope (+0.35 kPa/h) exceeds baseline by 22%.',
        'Particulate accumulation model projects critical loading in 26 days.',
        'Flow attenuation rate corresponds with historical particulate batch #104.'
      ],
      featureImportance: [
        { name: 'Differential Pressure (dP)', score: 0.42, impact: 'High' },
        { name: 'Flow Attenuation Slope', score: 0.28, impact: 'High' },
        { name: 'Operating Hours Accrual', score: 0.16, impact: 'Moderate' },
        { name: 'Plenum Temperature Stability', score: 0.08, impact: 'Low' },
        { name: 'Housing Vibration Peak', score: 0.06, impact: 'Low' },
      ],
      modelVersion: 'v2.4-LSTM-QuantileReg',
      lastPredictionTimestamp: new Date().toISOString()
    };
  }, [sensors, healthScore]);

  // What-If Simulator Engine (Section 27)
  const simulateWhatIf = (overrides: {
    dp?: number;
    flow?: number;
    temp?: number;
    vib?: number;
    hours?: number;
  }): WhatIfSimulationResult => {
    const dp = overrides.dp ?? (getSensor('differential_pressure')?.value ?? 42.6);
    const flow = overrides.flow ?? (getSensor('flow_rate')?.value ?? 1240);
    const temp = overrides.temp ?? (getSensor('temperature')?.value ?? 68.4);
    const vib = overrides.vib ?? (getSensor('vibration')?.value ?? 3.2);
    const hours = overrides.hours ?? (getSensor('operating_hours')?.value ?? 4832);

    // Compute synthetic scores
    const dpScore = Math.max(0, Math.min(100, Math.round(100 - Math.max(0, (dp - 22) / (70 - 22)) * 100)));
    const flScore = Math.max(0, Math.min(100, Math.round(((flow - 900) / (1500 - 900)) * 100)));
    const tempScore = Math.max(0, Math.min(100, Math.round(100 - Math.max(0, (temp - 50) / (90 - 50)) * 60)));
    const vibScore = Math.max(0, Math.min(100, Math.round(100 - Math.max(0, (vib - 2) / (8 - 2)) * 70)));
    const hrsScore = Math.max(0, Math.min(100, Math.round(100 - (hours / thresholds.operatingHours.serviceInterval) * 80)));

    const calculatedScore = Math.round(
      dpScore * 0.35 + flScore * 0.25 + tempScore * 0.10 + vibScore * 0.10 + hrsScore * 0.20
    );
    const finalScore = Math.max(5, Math.min(99, calculatedScore));

    const dpNorm = Math.min(1, Math.max(0, (dp - 25) / (70 - 25)));
    const failProb = Math.min(99, Math.max(1, Math.round((dpNorm * 0.70 + (100 - finalScore) / 100 * 0.30) * 100)));

    const rulDays = Math.max(1, Math.round(45 * (finalScore / 100) * (1 - dpNorm * 0.6)));
    const rulHours = rulDays * 24;

    let condition: FilterCondition = 'GOOD';
    if (finalScore >= 90) condition = 'EXCELLENT';
    else if (finalScore >= 75) condition = 'GOOD';
    else if (finalScore >= 50) condition = 'DEGRADED';
    else if (finalScore >= 30) condition = 'CRITICAL';
    else condition = 'FAILED';

    let riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (failProb >= 75) riskLevel = 'CRITICAL';
    else if (failProb >= 50) riskLevel = 'HIGH';
    else if (failProb >= 30) riskLevel = 'ELEVATED';
    else if (failProb >= 15) riskLevel = 'MODERATE';

    // Sensor anomaly check in what-if
    const isAnomaly = (dp > 80 && flow > 1400) || (vib > 10 && dp < 30);
    const anomalyMessage = isAnomaly 
      ? 'Physical plausibility mismatch: High differential pressure with nominal maximum flow indicates probable sensor fault rather than true filter cake loading.' 
      : undefined;

    return {
      healthScore: finalScore,
      failureProbability: failProb,
      rulHours,
      rulDays,
      condition,
      riskLevel,
      isAnomaly,
      anomalyMessage
    };
  };

  // Controlled Judge Demo Step Setter
  const setJudgeDemoStep = (index: number) => {
    const clamped = Math.max(0, Math.min(JUDGE_DEMO_STEPS.length - 1, index));
    setJudgeDemoStepIndex(clamped);
    const step = JUDGE_DEMO_STEPS[clamped];

    // Apply values to sensors
    setSensors(prev => prev.map(s => {
      let v = s.value;
      if (s.type === 'differential_pressure') v = step.dp;
      if (s.type === 'flow_rate') v = step.flow;
      if (s.type === 'temperature') v = step.temp;
      if (s.type === 'vibration') v = step.vib;
      return {
        ...s,
        value: v,
        status: computeSensorStatus(s.type, v, s.isAvailable),
        rateOfChange: s.type === 'differential_pressure' ? (step.step > 4 ? +0.42 : +0.05) : s.rateOfChange
      };
    }));

    // Update ESP32 status
    setEsp32State(prev => ({
      ...prev,
      lastHeartbeat: new Date().toISOString(),
      packetsReceived: prev.packetsReceived + 10,
      payloadValidationStatus: step.anomalyType === 'SENSOR_FAILURE' ? 'ANOMALY_DETECTED' : 'VALID'
    }));
  };

  const nextJudgeDemoStep = () => {
    if (judgeDemoStepIndex < JUDGE_DEMO_STEPS.length - 1) {
      setJudgeDemoStep(judgeDemoStepIndex + 1);
    }
  };

  const prevJudgeDemoStep = () => {
    if (judgeDemoStepIndex > 0) {
      setJudgeDemoStep(judgeDemoStepIndex - 1);
    }
  };

  const resetJudgeDemo = () => {
    setIsJudgeDemoRunning(false);
    setJudgeDemoStep(0);
  };

  const startJudgeDemo = () => {
    setIsJudgeDemoRunning(true);
  };

  const stopJudgeDemo = () => {
    setIsJudgeDemoRunning(false);
  };

  // Auto-advance judge demo if running
  useEffect(() => {
    if (!isJudgeDemoRunning) return;

    const timer = setInterval(() => {
      setJudgeDemoStepIndex(curr => {
        if (curr >= JUDGE_DEMO_STEPS.length - 1) {
          setIsJudgeDemoRunning(false);
          return curr;
        }
        const next = curr + 1;
        setJudgeDemoStep(next);
        return next;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [isJudgeDemoRunning]);

  // Real-time micro-fluctuation simulation ticker
  useEffect(() => {
    if (!isLive || isJudgeDemoRunning) return;

    const interval = setInterval(() => {
      setSensors(prev => {
        return prev.map(s => {
          if (!s.isAvailable) return s;

          let delta = 0;
          let trend = 0;

          if (currentScenario === 'DEGRADING') {
            if (s.type === 'differential_pressure') trend = +0.02;
            if (s.type === 'flow_rate') trend = -0.4;
            if (s.type === 'temperature') trend = +0.01;
            if (s.type === 'vibration') trend = +0.005;
          } else if (currentScenario === 'CRITICAL') {
            if (s.type === 'differential_pressure') trend = +0.05;
            if (s.type === 'flow_rate') trend = -0.8;
          }

          if (s.type === 'differential_pressure') {
            delta = (Math.random() - 0.48) * 0.15 + trend;
          } else if (s.type === 'flow_rate') {
            delta = (Math.random() - 0.52) * 1.5 + trend;
          } else if (s.type === 'temperature') {
            delta = (Math.random() - 0.5) * 0.08 + trend;
          } else if (s.type === 'vibration') {
            delta = (Math.random() - 0.5) * 0.04 + trend;
          } else if (s.type === 'particle_concentration') {
            delta = (Math.random() - 0.49) * 0.12;
          }

          const rawVal = s.value + delta;
          const newVal = Number(Math.max(0, rawVal).toFixed(1));
          const newStatus = computeSensorStatus(s.type, newVal, s.isAvailable);

          const newHistory = [...s.history.slice(1), { timestamp: Date.now(), value: newVal }];

          return {
            ...s,
            value: newVal,
            status: newStatus,
            history: newHistory,
          };
        });
      });

      setLastUpdateSecondsAgo(0);
      setEsp32State(p => ({
        ...p,
        packetsReceived: p.packetsReceived + 1,
        lastHeartbeat: new Date().toISOString()
      }));
    }, 2500);

    return () => clearInterval(interval);
  }, [isLive, currentScenario, thresholds, isJudgeDemoRunning]);

  // Intelligent debounce alert evaluation
  useEffect(() => {
    const dp = getSensor('differential_pressure');
    if (!dp) return;

    if (dp.value >= thresholds.differentialPressure.critical) {
      warningDebounceRef.current['dp_critical'] = (warningDebounceRef.current['dp_critical'] || 0) + 1;
      if (warningDebounceRef.current['dp_critical'] >= 3) {
        const exists = alerts.some(a => a.sensorType === 'differential_pressure' && a.severity === 'CRITICAL' && a.status === 'NEW');
        if (!exists) {
          const newAlert: Alert = {
            id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
            filterId: selectedEquipmentId,
            severity: 'CRITICAL',
            sensor: 'Differential Pressure',
            sensorType: 'differential_pressure',
            value: `${dp.value.toFixed(1)} kPa`,
            threshold: `${thresholds.differentialPressure.critical} kPa critical limit`,
            timestamp: 'Just now',
            message: 'Differential pressure sustained above critical threshold. High risk of filter cake breakthrough.',
            recommendedAction: 'Reduce fan RPM immediately, initiate emergency bypass damper, and schedule filter replacement.',
            status: 'NEW',
            anomalyClassification: 'FILTER_DEGRADATION'
          };
          setAlerts(prev => [newAlert, ...prev]);
        }
      }
    } else {
      warningDebounceRef.current['dp_critical'] = 0;
    }
  }, [sensors, thresholds, selectedEquipmentId]);

  // Demo Scenario switcher
  const setScenario = (scenario: DemoScenario) => {
    setCurrentScenario(scenario);

    if (scenario === 'NORMAL' || scenario === 'HEALTHY') {
      setSensors(prev => prev.map(s => {
        let v = s.value;
        if (s.type === 'differential_pressure') v = 28.4;
        if (s.type === 'flow_rate') v = 1420;
        if (s.type === 'temperature') v = 58.2;
        if (s.type === 'vibration') v = 2.1;
        if (s.type === 'particle_concentration') v = 12.1;
        return {
          ...s,
          value: v,
          status: computeSensorStatus(s.type, v, s.isAvailable)
        };
      }));
    } else if (scenario === 'DEGRADING') {
      setSensors(prev => prev.map(s => {
        let v = s.value;
        if (s.type === 'differential_pressure') v = 42.6;
        if (s.type === 'flow_rate') v = 1240;
        if (s.type === 'temperature') v = 68.4;
        if (s.type === 'vibration') v = 3.2;
        if (s.type === 'particle_concentration') v = 18.4;
        return {
          ...s,
          value: v,
          status: computeSensorStatus(s.type, v, s.isAvailable)
        };
      }));
    } else if (scenario === 'WARNING') {
      setSensors(prev => prev.map(s => {
        let v = s.value;
        if (s.type === 'differential_pressure') v = 54.8;
        if (s.type === 'flow_rate') v = 1010;
        if (s.type === 'temperature') v = 74.2;
        if (s.type === 'vibration') v = 4.8;
        if (s.type === 'particle_concentration') v = 32.5;
        return {
          ...s,
          value: v,
          status: computeSensorStatus(s.type, v, s.isAvailable)
        };
      }));
    } else if (scenario === 'CRITICAL') {
      setSensors(prev => prev.map(s => {
        let v = s.value;
        if (s.type === 'differential_pressure') v = 72.4;
        if (s.type === 'flow_rate') v = 860;
        if (s.type === 'temperature') v = 84.5;
        if (s.type === 'vibration') v = 6.2;
        if (s.type === 'particle_concentration') v = 48.0;
        return {
          ...s,
          value: v,
          status: computeSensorStatus(s.type, v, s.isAvailable)
        };
      }));
    }
  };

  // Toggle particle sensor availability
  const toggleParticleSensor = () => {
    setSensors(prev => prev.map(s => {
      if (s.type === 'particle_concentration') {
        const nextAvail = !s.isAvailable;
        return {
          ...s,
          isAvailable: nextAvail,
          unavailableReason: nextAvail ? undefined : 'Modbus probe disconnected',
          status: nextAvail ? 'NORMAL' : 'DATA_UNAVAILABLE'
        };
      }
      return s;
    }));
  };

  // Alert acknowledgement
  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'ACKNOWLEDGED',
          acknowledgedBy: userRole === 'OPERATOR' ? 'Field Operator #4' : 'Maintenance Engineer (H. Kumar)',
          acknowledgedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return a;
    }));
  };

  // Alert resolution
  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'RESOLVED',
          resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return a;
    }));
  };

  // Create work order from recommendation
  const createWorkOrder = (recId: string, orderData: Omit<WorkOrder, 'id' | 'createdDate'>) => {
    const newId = `WO-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newWo: WorkOrder = {
      ...orderData,
      id: newId,
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    setWorkOrders(prev => [newWo, ...prev]);

    setRecommendations(prev => prev.map(r => {
      if (r.id === recId) {
        return { ...r, status: 'SCHEDULED', workOrderId: newId };
      }
      return r;
    }));
  };

  // Update configurable thresholds
  const updateThresholds = (newThresholds: Partial<ThresholdSettings>) => {
    setThresholds(prev => ({ ...prev, ...newThresholds }));
    setSensors(prev => prev.map(s => ({
      ...s,
      status: computeSensorStatus(s.type, s.value, s.isAvailable)
    })));
  };

  // Test Supabase connectivity and tables verification
  const testSupabaseConnection = async () => {
    try {
      const result = await SupabaseService.testConnection();
      setSupabaseSyncStatus(prev => ({
        ...prev,
        isConnected: result.connected,
        tablesStatus: {
          sensor_readings: result.tables.sensor_readings ?? false,
          filter_health: result.tables.filter_health ?? false,
          predictions: result.tables.predictions ?? false,
          alerts: result.tables.alerts ?? false,
          work_orders: result.tables.work_orders ?? false,
        },
        errorMessage: result.error || null,
        latencyMs: result.latencyMs,
      }));
    } catch (err: any) {
      setSupabaseSyncStatus(prev => ({
        ...prev,
        isConnected: false,
        errorMessage: err.message || 'Connection test failed',
      }));
    }
  };

  // Explicit or automatic sync to Supabase
  const syncToSupabaseNow = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      let count = 0;
      const sRes = await SupabaseService.saveSensorReadings(selectedEquipmentId, sensors);
      if (sRes.success) count += sRes.count || 0;

      const hRes = await SupabaseService.saveFilterHealth(
        selectedEquipmentId,
        healthScore,
        filterCondition,
        overallStatus,
        healthFactors
      );
      if (hRes.success) count += 1;

      const pRes = await SupabaseService.savePrediction(selectedEquipmentId, prediction);
      if (pRes.success) count += 1;

      for (const a of alerts.slice(0, 5)) {
        const alRes = await SupabaseService.syncAlert(selectedEquipmentId, a);
        if (alRes.success) count += 1;
      }

      for (const wo of workOrders.slice(0, 3)) {
        const woRes = await SupabaseService.syncWorkOrder(selectedEquipmentId, wo);
        if (woRes.success) count += 1;
      }

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setSupabaseSyncStatus(prev => ({
        ...prev,
        lastSyncTime: timeStr,
        syncedRecordsCount: prev.syncedRecordsCount + count,
        errorMessage: null,
      }));

      return { success: true };
    } catch (err: any) {
      console.warn('Sync to Supabase encountered issue:', err.message);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  useEffect(() => {
    if (!autoSyncEnabled) return;

    const initialSyncTimer = setTimeout(() => {
      syncToSupabaseNow();
    }, 2000);

    const intervalTimer = setInterval(() => {
      syncToSupabaseNow();
    }, 20000);

    return () => {
      clearTimeout(initialSyncTimer);
      clearInterval(intervalTimer);
    };
  }, [autoSyncEnabled, selectedEquipmentId, sensors, healthScore, filterCondition, overallStatus, prediction]);

  const activeAlertsCount = useMemo(() => {
    return alerts.filter(a => a.status === 'NEW').length;
  }, [alerts]);

  // Export CSV
  const exportSensorCSV = () => {
    const headers = ['Timestamp', 'ISO_Time', 'Differential_Pressure_kPa', 'Flow_Rate_L_min', 'Temperature_C', 'Vibration_mm_s', 'Operating_Hours_h', 'Particle_ug_m3'];
    const dp = getSensor('differential_pressure');
    const fl = getSensor('flow_rate');
    const temp = getSensor('temperature');
    const vib = getSensor('vibration');
    const hrs = getSensor('operating_hours');
    const part = getSensor('particle_concentration');

    const rows: string[] = [headers.join(',')];
    const historyLen = dp?.history.length ?? 0;

    for (let i = 0; i < historyLen; i++) {
      const ts = dp?.history[i]?.timestamp ?? Date.now();
      const timeIso = new Date(ts).toISOString();
      const dpV = dp?.history[i]?.value ?? 0;
      const flV = fl?.history[i]?.value ?? 0;
      const tempV = temp?.history[i]?.value ?? 0;
      const vibV = vib?.history[i]?.value ?? 0;
      const hrsV = hrs?.history[i]?.value ?? 0;
      const partV = (part?.isAvailable && part?.history[i]) ? part.history[i].value : 'NA';

      rows.push([ts, timeIso, dpV, flV, tempV, vibV, hrsV, partV].join(','));
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(rows.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `FilterGuard_${selectedEquipmentId}_Sensors_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <FilterContext.Provider
      value={{
        equipmentList,
        selectedEquipmentId,
        selectedEquipment,
        setSelectedEquipmentId,
        connectionMode,
        setConnectionMode,
        esp32State,
        updateEsp32State,
        sensors,
        getSensor,
        healthScore,
        filterCondition,
        overallStatus,
        healthFactors,
        sensorAnomalyActive,
        toggleSensorAnomaly,
        anomalyStatusMessage,
        isLive,
        setIsLive,
        lastUpdateSecondsAgo,
        currentScenario,
        setScenario,
        judgeDemoStepIndex,
        isJudgeDemoRunning,
        currentJudgeDemoStep,
        setJudgeDemoStep,
        nextJudgeDemoStep,
        prevJudgeDemoStep,
        resetJudgeDemo,
        startJudgeDemo,
        stopJudgeDemo,
        simulateWhatIf,
        prediction,
        forecastData,
        alerts,
        acknowledgeAlert,
        resolveAlert,
        activeAlertsCount,
        recommendations,
        workOrders,
        createWorkOrder,
        maintenanceCycles,
        thresholds,
        updateThresholds,
        toggleParticleSensor,
        userRole,
        setUserRole,
        exportSensorCSV,
        supabaseSyncStatus,
        testSupabaseConnection,
        syncToSupabaseNow,
        autoSyncEnabled,
        setAutoSyncEnabled
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
