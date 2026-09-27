export type NavigationTab =
  | 'home'
  | 'dashboard'
  | 'analysis'
  | 'insights'
  | 'ask'
  | 'quality'
  | 'explorer'
  | 'reports';

export type ColumnRole = 'Identifier' | 'Date' | 'Category' | 'Measure' | 'Boolean';
export type ColumnType = 'numeric' | 'categorical' | 'date' | 'boolean' | 'unknown';

export interface ColumnProfile {
  name: string;
  type: ColumnType;
  role: ColumnRole;
  uniqueCount: number;
  nullCount: number;
  nullPercentage: number;
  sampleValues: any[];
  min?: number;
  max?: number;
  sum?: number;
  mean?: number;
  median?: number;
  stdDev?: number;
  q1?: number;
  q3?: number;
  outlierCount?: number;
  topValues?: { value: string; count: number; percentage: number }[];
  mode?: string;
  minDate?: string;
  maxDate?: string;
}

export interface DataQualityIssue {
  id: string;
  type: 'duplicate_rows' | 'missing_values' | 'inconsistent_categories' | 'outliers' | 'empty_column';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedColumns?: string[];
  count: number;
  autoFixable: boolean;
  fixAction?: 'remove_duplicates' | 'normalize_categories' | 'drop_missing' | 'impute_numeric';
}

export interface DataQualityReport {
  score: number;
  totalRows: number;
  totalColumns: number;
  missingValueCells: number;
  missingPercentage: number;
  duplicateRowsCount: number;
  issues: DataQualityIssue[];
  checks: {
    name: string;
    passed: boolean;
    detail: string;
  }[];
}

export interface KPIItem {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  change?: number;
  changeDirection?: 'up' | 'down' | 'neutral';
  timeframe?: string;
  description: string;
  metricType: 'currency' | 'number' | 'percentage' | 'ratio';
}

export interface ChartDefinition {
  id: string;
  title: string;
  chartType: 'line' | 'bar' | 'pie' | 'scatter' | 'histogram';
  description: string;
  xAxis: string;
  yAxis: string;
  data: Record<string, any>[];
  seriesKeys?: string[];
  meta?: {
    yFormat?: 'currency' | 'number' | 'percentage';
    xFormat?: 'date' | 'category' | 'number';
  };
}

export interface VerifiedInsight {
  id: string;
  type: 'trend' | 'comparison' | 'ranking' | 'contribution' | 'anomaly' | 'relationship';
  title: string;
  fact: string;
  interpretation: string;
  limitation: string;
  evidence: {
    label: string;
    value: string | number;
    detail?: string;
  }[];
  recommendedChartId?: string;
}

export interface DatasetSummary {
  id: string;
  name: string;
  filename: string;
  format?: string;
  rowCount: number;
  columnCount: number;
  qualityScore?: number;
  createdAt: string;
}

export interface DatasetDetail extends DatasetSummary {
  headers: string[];
  sampleRows: Record<string, any>[];
  cleaningHistory: {
    timestamp: string;
    action: string;
    rowsBefore: number;
    rowsAfter: number;
    summary: string;
  }[];
}

export interface CorrelationPair {
  measureA: string;
  measureB: string;
  coefficient: number;
  strength: 'strong_positive' | 'moderate_positive' | 'weak' | 'moderate_negative' | 'strong_negative';
  interpretation: string;
}

export interface CrossTabMatrix {
  rowDimension: string;
  colDimension: string;
  measure: string;
  rowKeys: string[];
  colKeys: string[];
  matrix: Record<string, Record<string, number>>;
  rowTotals: Record<string, number>;
  colTotals: Record<string, number>;
  grandTotal: number;
}

export interface AnalysisBundle {
  datasetId: string;
  name: string;
  rowCount: number;
  columnCount: number;
  correlations: CorrelationPair[];
  distributions: {
    column: string;
    label: string;
    min: number;
    max: number;
    mean: number;
    median: number;
    stdDev: number;
    q1: number;
    q3: number;
    outlierCount: number;
    sampleValues: any[];
  }[];
  categoricalBreakdowns: {
    column: string;
    label: string;
    uniqueCount: number;
    mode?: string;
    topValues: { value: string; count: number; percentage: number }[];
  }[];
  dimensions: string[];
  measures: string[];
  defaultCrossTab: CrossTabMatrix | null;
}

export interface StrategicAction {
  id: string;
  insightId: string;
  title: string;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  recommendation: string;
  factSummary: string;
  limitationNote: string;
}

export interface InsightsBundle {
  datasetId: string;
  name: string;
  insights: VerifiedInsight[];
  insightsByType: Record<string, VerifiedInsight[]>;
  strategicActions: StrategicAction[];
  charts: ChartDefinition[];
  stats: {
    totalInsights: number;
    trendCount: number;
    anomalyCount: number;
    comparisonCount: number;
    rankingCount: number;
  };
}

export interface QuestionRecord {
  id: string;
  datasetId: string;
  question: string;
  intent: string;
  calculationPlan: string;
  calculatedResult: Record<string, any>;
  answer: string;
  fact: string;
  interpretation: string;
  limitation: string;
  chartSuggestion?: ChartDefinition;
  keyFindings?: {
    finding: string;
    evidence: Record<string, any>;
  }[];
  suggestedFollowUps?: string[];
  createdAt: string;
}

export interface ManagementReport {
  title: string;
  datasetName: string;
  generatedAt: string;
  executiveSummary: string;
  keyKpisSummary: string;
  majorTrends: {
    period: string;
    observation: string;
    fact: string;
  }[];
  topPerformers: {
    segment: string;
    metrics: string;
    takeaway: string;
  }[];
  areasRequiringAttention: {
    title: string;
    severity: 'high' | 'medium' | 'low';
    details: string;
    suggestedAction: string;
  }[];
  keyInsights: VerifiedInsight[];
  recommendedInvestigativeAreas: string[];
  dataQualitySummary: {
    score: number;
    notes: string;
  };
}
