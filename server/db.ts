import { AnalyticsEngine, ColumnProfile, DataQualityReport, KPIItem, ChartDefinition, VerifiedInsight } from './analyticsEngine.js';
import { SAMPLE_SALES_CSV, SAMPLE_MARKETING_CSV, SAMPLE_HR_CSV } from './sampleData.js';
import { AIService, ManagementReport } from './aiService.js';

export interface DatasetRecord {
  id: string;
  name: string;
  filename: string;
  format: string;
  rowCount: number;
  columnCount: number;
  createdAt: string;
  data: Record<string, any>[];
  headers: string[];
  profiles: ColumnProfile[];
  qualityReport: DataQualityReport;
  kpis: KPIItem[];
  charts: ChartDefinition[];
  insights: VerifiedInsight[];
  cleaningHistory: {
    timestamp: string;
    action: string;
    rowsBefore: number;
    rowsAfter: number;
    summary: string;
  }[];
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
  keyFindings?: any[];
  suggestedFollowUps?: string[];
  createdAt: string;
}

// In-Memory Database store with pre-seeded datasets
class DatabaseStore {
  private datasets: Map<string, DatasetRecord> = new Map();
  private questions: Map<string, QuestionRecord[]> = new Map();
  private reports: Map<string, ManagementReport> = new Map();

  constructor() {
    this.seedDefaultDatasets();
  }

  private seedDefaultDatasets() {
    // Seed Sample 1: Sales & Profit Data
    this.createDatasetFromCsv('Sales & Profit Analytics', 'sales_data.csv', SAMPLE_SALES_CSV, 'sales-default-01');
    // Seed Sample 2: Marketing Campaigns
    this.createDatasetFromCsv('Marketing Campaign Performance', 'marketing_campaigns.csv', SAMPLE_MARKETING_CSV, 'marketing-default-02');
    // Seed Sample 3: HR & Employee Analytics
    this.createDatasetFromCsv('Employee Talent & Compensation', 'employee_analytics.csv', SAMPLE_HR_CSV, 'hr-default-03');
  }

  public createDatasetFromFile(
    name: string,
    filename: string,
    content: string,
    encoding: 'text' | 'base64' = 'text',
    customId?: string
  ): DatasetRecord {
    const id = customId || `ds_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const parsed = AnalyticsEngine.parseFile(content, filename, encoding);
    if (!parsed.data || parsed.data.length === 0) {
      const errMsg = parsed.errors?.length ? parsed.errors.join('; ') : 'No data rows found in file.';
      throw new Error(`Failed to parse ${filename}: ${errMsg}`);
    }

    const profiles = AnalyticsEngine.profileDataset(parsed.data, parsed.headers);
    const qualityReport = AnalyticsEngine.analyzeDataQuality(parsed.data, profiles);
    const kpis = AnalyticsEngine.calculateKPIs(parsed.data, profiles);
    const charts = AnalyticsEngine.generateCharts(parsed.data, profiles);
    const insights = AnalyticsEngine.calculateVerifiedInsights(parsed.data, profiles, charts);

    const record: DatasetRecord = {
      id,
      name,
      filename,
      format: parsed.format,
      rowCount: parsed.data.length,
      columnCount: parsed.headers.length,
      createdAt: new Date().toISOString(),
      data: parsed.data,
      headers: parsed.headers,
      profiles,
      qualityReport,
      kpis,
      charts,
      insights,
      cleaningHistory: [],
    };

    this.datasets.set(id, record);
    return record;
  }

  public createDatasetFromCsv(name: string, filename: string, csvContent: string, customId?: string): DatasetRecord {
    return this.createDatasetFromFile(name, filename, csvContent, 'text', customId);
  }

  public getAllDatasets(): Omit<DatasetRecord, 'data'>[] {
    if (this.datasets.size === 0) {
      this.seedDefaultDatasets();
    }
    return Array.from(this.datasets.values()).map(ds => {
      const { data, ...rest } = ds;
      return rest;
    });
  }

  public getDataset(id: string): DatasetRecord | undefined {
    if (this.datasets.size === 0) {
      this.seedDefaultDatasets();
    }
    if (id && this.datasets.has(id)) {
      return this.datasets.get(id);
    }
    // Safe fallback to default sales dataset or first available so application never fails with Dataset Not Found
    return this.datasets.get('sales-default-01') || this.datasets.values().next().value;
  }

  public deleteDataset(id: string): boolean {
    this.questions.delete(id);
    this.reports.delete(id);
    const deleted = this.datasets.delete(id);
    if (this.datasets.size === 0) {
      this.seedDefaultDatasets();
    }
    return deleted;
  }

  public updateDatasetAfterCleaning(
    id: string,
    cleanedData: Record<string, any>[],
    action: string,
    summary: string
  ): DatasetRecord | null {
    const existing = this.datasets.get(id);
    if (!existing) return null;

    const rowsBefore = existing.data.length;
    const profiles = AnalyticsEngine.profileDataset(cleanedData, existing.headers);
    const qualityReport = AnalyticsEngine.analyzeDataQuality(cleanedData, profiles);
    const kpis = AnalyticsEngine.calculateKPIs(cleanedData, profiles);
    const charts = AnalyticsEngine.generateCharts(cleanedData, profiles);
    const insights = AnalyticsEngine.calculateVerifiedInsights(cleanedData, profiles, charts);

    existing.data = cleanedData;
    existing.rowCount = cleanedData.length;
    existing.profiles = profiles;
    existing.qualityReport = qualityReport;
    existing.kpis = kpis;
    existing.charts = charts;
    existing.insights = insights;

    existing.cleaningHistory.unshift({
      timestamp: new Date().toISOString(),
      action,
      rowsBefore,
      rowsAfter: cleanedData.length,
      summary,
    });

    this.datasets.set(id, existing);
    return existing;
  }

  public addQuestionRecord(record: QuestionRecord) {
    const list = this.questions.get(record.datasetId) || [];
    list.push(record);
    this.questions.set(record.datasetId, list);
  }

  public getQuestionHistory(datasetId: string): QuestionRecord[] {
    return this.questions.get(datasetId) || [];
  }

  public saveReport(datasetId: string, report: ManagementReport) {
    this.reports.set(datasetId, report);
  }

  public getReport(datasetId: string): ManagementReport | undefined {
    return this.reports.get(datasetId);
  }
}

export const db = new DatabaseStore();
