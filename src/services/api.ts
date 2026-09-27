import {
  DatasetSummary,
  DatasetDetail,
  ColumnProfile,
  DataQualityReport,
  KPIItem,
  ChartDefinition,
  VerifiedInsight,
  QuestionRecord,
  ManagementReport,
  AnalysisBundle,
  InsightsBundle,
  CrossTabMatrix,
} from '../types';

export const api = {
  // Fetch all datasets
  async getDatasets(): Promise<DatasetSummary[]> {
    const res = await fetch('/api/datasets');
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch datasets');
    return json.datasets;
  },

  // Get full dataset details and sample rows
  async getDataset(id: string): Promise<DatasetDetail> {
    const res = await fetch(`/api/datasets/${id}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch dataset');
    return json.dataset;
  },

  // Upload File (Supports CSV, XLSX, XLS, JSON, JSONL, TSV, TXT)
  async uploadFile(params: {
    name: string;
    filename: string;
    fileContent: string;
    encoding?: 'text' | 'base64';
  }): Promise<{ datasetId: string; dataset: any }> {
    const res = await fetch('/api/datasets/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Upload failed');
    return json;
  },

  // Upload CSV (Backwards compatibility)
  async uploadCSV(params: { name: string; filename: string; csvContent: string }): Promise<{ datasetId: string; dataset: any }> {
    return this.uploadFile({
      name: params.name,
      filename: params.filename,
      fileContent: params.csvContent,
      encoding: 'text',
    });
  },

  // Load Sample Dataset
  async loadSample(type: 'sales' | 'marketing' | 'hr'): Promise<{ datasetId: string }> {
    const res = await fetch('/api/datasets/sample', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to load sample dataset');
    return json;
  },

  // Get column profiles
  async getProfiles(id: string): Promise<{ profiles: ColumnProfile[]; rowCount: number; columnCount: number }> {
    const res = await fetch(`/api/datasets/${id}/profile`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch profiles');
    return json;
  },

  // Get data quality
  async getQuality(id: string): Promise<{ qualityReport: DataQualityReport; cleaningHistory: any[] }> {
    const res = await fetch(`/api/datasets/${id}/quality`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch quality report');
    return json;
  },

  // Apply data cleaning
  async cleanData(id: string, action: 'remove_duplicates' | 'normalize_categories' | 'drop_missing' | 'all'): Promise<any> {
    const res = await fetch(`/api/datasets/${id}/clean`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Cleaning action failed');
    return json;
  },

  // Get Dashboard payload
  async getDashboard(id: string): Promise<{
    datasetId: string;
    name: string;
    rowCount: number;
    columnCount: number;
    qualityScore: number;
    kpis: KPIItem[];
    charts: ChartDefinition[];
    insights: VerifiedInsight[];
    quickQuestions: string[];
  }> {
    const res = await fetch(`/api/datasets/${id}/dashboard`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to load dashboard');
    return json;
  },

  // Ask question about dataset
  async askQuestion(id: string, question: string): Promise<{
    record?: QuestionRecord;
    isAmbiguous?: boolean;
    clarificationPrompt?: string;
    suggestedFollowUps?: string[];
  }> {
    const res = await fetch(`/api/datasets/${id}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to analyze question');
    return json;
  },

  // Get question history
  async getQuestions(id: string): Promise<QuestionRecord[]> {
    const res = await fetch(`/api/datasets/${id}/questions`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch questions');
    return json.questions;
  },

  // Get executive management report
  async getReport(id: string, fresh: boolean = false): Promise<ManagementReport> {
    const res = await fetch(`/api/datasets/${id}/report${fresh ? '?fresh=true' : ''}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to generate report');
    return json.report;
  },

  // Get deep Statistical Analysis Dashboard data
  async getAnalysis(id: string): Promise<AnalysisBundle> {
    const res = await fetch(`/api/datasets/${id}/analysis`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to load statistical analysis');
    return json;
  },

  // Get custom cross-tabulation pivot
  async getCrossTab(id: string, rowDim: string, colDim: string, measure: string): Promise<CrossTabMatrix> {
    const params = new URLSearchParams({ rowDim, colDim, measure });
    const res = await fetch(`/api/datasets/${id}/crosstab?${params.toString()}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to compute cross-tabulation');
    return json.crossTab;
  },

  // Get dedicated Insights Dashboard bundle
  async getInsightsBundle(id: string): Promise<InsightsBundle> {
    const res = await fetch(`/api/datasets/${id}/insights-bundle`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to load insights dashboard');
    return json;
  },
};
