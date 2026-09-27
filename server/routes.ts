import { Router, Request, Response } from 'express';
import { db } from './db.js';
import { AnalyticsEngine } from './analyticsEngine.js';
import { AIService } from './aiService.js';
import { SAMPLE_SALES_CSV, SAMPLE_MARKETING_CSV, SAMPLE_HR_CSV } from './sampleData.js';

export const apiRouter = Router();

// GET /api/datasets
apiRouter.get('/datasets', (req: Request, res: Response) => {
  try {
    const list = db.getAllDatasets();
    res.json({ success: true, datasets: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/datasets/upload - Supports CSV, XLSX, XLS, JSON, JSONL, TSV, TXT
apiRouter.post('/datasets/upload', (req: Request, res: Response) => {
  try {
    const { filename, csvContent, fileContent, name, encoding = 'text' } = req.body;
    const content = fileContent || csvContent;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'File content is required (CSV, Excel .xlsx/.xls, JSON, JSONL, TSV, or TXT).',
      });
    }

    if (content.length > 50 * 1024 * 1024) {
      return res.status(400).json({ success: false, error: 'File size exceeds 50MB limit.' });
    }

    const trimmed = content.trim();
    if (!trimmed) {
      return res.status(400).json({ success: false, error: 'Uploaded file is empty.' });
    }

    const dsFilename = filename || 'dataset.csv';
    const dsName = name || dsFilename.replace(/\.[^/.]+$/, '') || 'Uploaded Dataset';

    const record = db.createDatasetFromFile(dsName, dsFilename, trimmed, encoding as 'text' | 'base64');

    res.json({
      success: true,
      datasetId: record.id,
      dataset: {
        id: record.id,
        name: record.name,
        filename: record.filename,
        format: record.format,
        rowCount: record.rowCount,
        columnCount: record.columnCount,
        qualityScore: record.qualityReport.score,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/datasets/sample
apiRouter.post('/datasets/sample', (req: Request, res: Response) => {
  try {
    const { type } = req.body;
    let csv = SAMPLE_SALES_CSV;
    let name = 'Sales & Profit Analytics';
    let filename = 'sales_data.csv';

    if (type === 'marketing') {
      csv = SAMPLE_MARKETING_CSV;
      name = 'Marketing Campaign Performance';
      filename = 'marketing_campaigns.csv';
    } else if (type === 'hr') {
      csv = SAMPLE_HR_CSV;
      name = 'Employee Talent & Compensation';
      filename = 'employee_analytics.csv';
    }

    const record = db.createDatasetFromCsv(name, filename, csv);
    res.json({ success: true, datasetId: record.id, dataset: record });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/datasets/:id
apiRouter.get('/datasets/:id', (req: Request, res: Response) => {
  try {
    const ds = db.getDataset(req.params.id);
    if (!ds) {
      return res.status(404).json({ success: false, error: 'Dataset not found.' });
    }
    // Return dataset metadata and top 200 rows for preview
    res.json({
      success: true,
      dataset: {
        id: ds.id,
        name: ds.name,
        filename: ds.filename,
        rowCount: ds.rowCount,
        columnCount: ds.columnCount,
        createdAt: ds.createdAt,
        headers: ds.headers,
        sampleRows: ds.data.slice(0, 200),
        qualityScore: ds.qualityReport.score,
        cleaningHistory: ds.cleaningHistory,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/datasets/:id/profile
apiRouter.get('/datasets/:id/profile', (req: Request, res: Response) => {
  try {
    const ds = db.getDataset(req.params.id);
    if (!ds) {
      return res.status(404).json({ success: false, error: 'Dataset not found.' });
    }
    res.json({
      success: true,
      datasetId: ds.id,
      rowCount: ds.rowCount,
      columnCount: ds.columnCount,
      profiles: ds.profiles,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/datasets/:id/quality
apiRouter.get('/datasets/:id/quality', (req: Request, res: Response) => {
  try {
    const ds = db.getDataset(req.params.id);
    if (!ds) {
      return res.status(404).json({ success: false, error: 'Dataset not found.' });
    }
    res.json({
      success: true,
      datasetId: ds.id,
      qualityReport: ds.qualityReport,
      cleaningHistory: ds.cleaningHistory,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/datasets/:id/clean
apiRouter.post('/datasets/:id/clean', (req: Request, res: Response) => {
  try {
    const ds = db.getDataset(req.params.id);
    if (!ds) {
      return res.status(404).json({ success: false, error: 'Dataset not found.' });
    }

    const { action } = req.body;
    if (!action || !['remove_duplicates', 'normalize_categories', 'drop_missing', 'all'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid clean action. Must be remove_duplicates, normalize_categories, drop_missing, or all.',
      });
    }

    const cleanResult = AnalyticsEngine.cleanDataset(ds.data, action);
    const updated = db.updateDatasetAfterCleaning(
      ds.id,
      cleanResult.cleanedData,
      action,
      cleanResult.summary
    );

    res.json({
      success: true,
      summary: cleanResult.summary,
      removedRows: cleanResult.removedRows,
      normalizedCells: cleanResult.normalizedCells,
      rowsBefore: ds.rowCount,
      rowsCurrent: updated?.rowCount || 0,
      newQualityScore: updated?.qualityReport.score,
      qualityReport: updated?.qualityReport,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/datasets/:id/dashboard
apiRouter.get('/datasets/:id/dashboard', (req: Request, res: Response) => {
  try {
    const ds = db.getDataset(req.params.id);
    if (!ds) {
      return res.status(404).json({ success: false, error: 'Dataset not found.' });
    }

    const quickQuestions = [
      'What was our total revenue and profit?',
      'Which region performed best?',
      'Why did revenue decline in March?',
      'Show me the top 10 products',
      'Are there any unusual outliers in the data?',
      'Give me a management summary',
    ];

    res.json({
      success: true,
      datasetId: ds.id,
      name: ds.name,
      rowCount: ds.rowCount,
      columnCount: ds.columnCount,
      qualityScore: ds.qualityReport.score,
      kpis: ds.kpis,
      charts: ds.charts,
      insights: ds.insights,
      quickQuestions,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/datasets/:id/analysis - Deep Statistical & Exploratory Analysis Dashboard
apiRouter.get('/datasets/:id/analysis', (req: Request, res: Response) => {
  try {
    const ds = db.getDataset(req.params.id);
    if (!ds) {
      return res.status(404).json({ success: false, error: 'Dataset not found.' });
    }

    const correlations = AnalyticsEngine.calculateCorrelationMatrix(ds.data, ds.profiles);
    const numericProfiles = ds.profiles.filter(p => p.type === 'numeric' && p.role === 'Measure');
    const categoricalProfiles = ds.profiles.filter(p => p.role === 'Category');
    const dateProfiles = ds.profiles.filter(p => p.role === 'Date');

    // Default cross-tab suggestion
    let defaultCrossTab = null;
    if (categoricalProfiles.length >= 2 && numericProfiles.length >= 1) {
      defaultCrossTab = AnalyticsEngine.calculateCrossTab(
        ds.data,
        categoricalProfiles[0].name,
        categoricalProfiles[1].name,
        numericProfiles[0].name
      );
    }

    // Measure distribution stats
    const distributions = numericProfiles.map(p => ({
      column: p.name,
      label: AnalyticsEngine.formatLabel(p.name),
      min: p.min ?? 0,
      max: p.max ?? 0,
      mean: p.mean ?? 0,
      median: p.median ?? 0,
      stdDev: p.stdDev ?? 0,
      q1: p.q1 ?? 0,
      q3: p.q3 ?? 0,
      outlierCount: p.outlierCount ?? 0,
      sampleValues: p.sampleValues.slice(0, 8),
    }));

    // Categorical breakdown
    const categoricalBreakdowns = categoricalProfiles.map(p => ({
      column: p.name,
      label: AnalyticsEngine.formatLabel(p.name),
      uniqueCount: p.uniqueCount,
      mode: p.mode,
      topValues: p.topValues || [],
    }));

    res.json({
      success: true,
      datasetId: ds.id,
      name: ds.name,
      rowCount: ds.rowCount,
      columnCount: ds.columnCount,
      correlations,
      distributions,
      categoricalBreakdowns,
      dimensions: categoricalProfiles.map(p => p.name),
      measures: numericProfiles.map(p => p.name),
      defaultCrossTab,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/datasets/:id/crosstab - Dynamic multi-dimensional pivot matrix
apiRouter.get('/datasets/:id/crosstab', (req: Request, res: Response) => {
  try {
    const ds = db.getDataset(req.params.id);
    if (!ds) {
      return res.status(404).json({ success: false, error: 'Dataset not found.' });
    }

    const rowDim = String(req.query.rowDim || '');
    const colDim = String(req.query.colDim || '');
    const measure = String(req.query.measure || '');

    if (!rowDim || !colDim || !measure) {
      return res.status(400).json({
        success: false,
        error: 'Missing required query parameters: rowDim, colDim, and measure are required.',
      });
    }

    const crossTab = AnalyticsEngine.calculateCrossTab(ds.data, rowDim, colDim, measure);
    res.json({ success: true, crossTab });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/datasets/:id/insights-bundle - Dedicated Insights Dashboard payload
apiRouter.get('/datasets/:id/insights-bundle', (req: Request, res: Response) => {
  try {
    const ds = db.getDataset(req.params.id);
    if (!ds) {
      return res.status(404).json({ success: false, error: 'Dataset not found.' });
    }

    // Group insights by type
    const insightsByType: Record<string, any[]> = {
      trend: [],
      comparison: [],
      ranking: [],
      contribution: [],
      anomaly: [],
      relationship: [],
    };

    ds.insights.forEach(item => {
      if (insightsByType[item.type]) {
        insightsByType[item.type].push(item);
      } else {
        insightsByType[item.type] = [item];
      }
    });

    // Provide actionable business recommendations linked to the verified insights
    const strategicActions = ds.insights.map((ins, idx) => {
      let impact: 'high' | 'medium' | 'low' = 'medium';
      let timeframe = '30-Day Focus';
      let title = `Strategic Action #${idx + 1}`;
      let recommendation = ins.interpretation;

      if (ins.type === 'trend') {
        impact = 'high';
        timeframe = 'Next Quarter';
        title = `Trend Response: Capitalize on Momentum`;
        recommendation = `Align resource allocation and campaign scheduling with the verified pattern observed in: ${ins.title}.`;
      } else if (ins.type === 'anomaly') {
        impact = 'high';
        timeframe = 'Immediate (7 Days)';
        title = `Anomaly Containment & Root-Cause Audit`;
        recommendation = `Investigate deviation details identified in "${ins.title}". Audit data logging and supply chains for sudden variances.`;
      } else if (ins.type === 'ranking' || ins.type === 'contribution') {
        impact = 'medium';
        timeframe = '60-Day Optimization';
        title = `Concentration & Pareto Optimization`;
        recommendation = `Double down on top quartile performers while re-evaluating bottom segment margins.`;
      } else if (ins.type === 'relationship') {
        impact = 'medium';
        timeframe = 'Quarterly Strategy';
        title = `Correlation Leverage`;
        recommendation = `Test hypothesis levers connecting these correlated drivers to maximize ROI.`;
      }

      return {
        id: `act_${ins.id}`,
        insightId: ins.id,
        title,
        impact,
        timeframe,
        recommendation,
        factSummary: ins.fact,
        limitationNote: ins.limitation,
      };
    });

    res.json({
      success: true,
      datasetId: ds.id,
      name: ds.name,
      insights: ds.insights,
      insightsByType,
      strategicActions,
      charts: ds.charts,
      stats: {
        totalInsights: ds.insights.length,
        trendCount: insightsByType.trend.length,
        anomalyCount: insightsByType.anomaly.length,
        comparisonCount: insightsByType.comparison.length,
        rankingCount: insightsByType.ranking.length,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/datasets/:id/ask
apiRouter.post('/datasets/:id/ask', async (req: Request, res: Response) => {
  try {
    const ds = db.getDataset(req.params.id);
    if (!ds) {
      return res.status(404).json({ success: false, error: 'Dataset not found.' });
    }

    const { question } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ success: false, error: 'Question string is required.' });
    }

    // Step 1: Execute Computational Plan on Verified Data
    const planResult = AnalyticsEngine.executeQueryPlan(question, ds.data, ds.profiles);

    // If ambiguous question
    if (planResult.isAmbiguous) {
      return res.json({
        success: true,
        isAmbiguous: true,
        clarificationPrompt: planResult.clarificationPrompt,
        question,
        suggestedFollowUps: [
          'What was total revenue by month?',
          'Which region has the lowest profit?',
          'Show top 5 products',
        ],
      });
    }

    // Step 2: Retrieve Recent Conversation History for Follow-up Context
    const history = db.getQuestionHistory(ds.id);
    const recentConvo = history.slice(-3).map(h => ([
      { role: 'user' as const, text: h.question },
      { role: 'assistant' as const, text: h.answer },
    ])).flat();

    // Step 3: Pass Verified Facts to AI Explanation Engine
    const aiExplanation = await AIService.explainCalculatedAnswer({
      question,
      calculationPlan: planResult.calculationPlan,
      calculatedFacts: planResult.calculatedFacts,
      datasetContext: {
        name: ds.name,
        rowCount: ds.rowCount,
        columns: ds.headers,
      },
      conversationHistory: recentConvo,
    });

    // Step 4: Record Question in Database
    const qRecord = {
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      datasetId: ds.id,
      question,
      intent: planResult.intent,
      calculationPlan: planResult.calculationPlan,
      calculatedResult: planResult.calculatedFacts,
      answer: aiExplanation.answer,
      fact: aiExplanation.fact,
      interpretation: aiExplanation.interpretation,
      limitation: aiExplanation.limitation,
      chartSuggestion: planResult.chartSuggestion,
      keyFindings: aiExplanation.keyFindings,
      suggestedFollowUps: aiExplanation.suggestedFollowUps,
      createdAt: new Date().toISOString(),
    };
    db.addQuestionRecord(qRecord);

    res.json({
      success: true,
      record: qRecord,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/datasets/:id/questions
apiRouter.get('/datasets/:id/questions', (req: Request, res: Response) => {
  try {
    const list = db.getQuestionHistory(req.params.id);
    res.json({ success: true, questions: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/datasets/:id/report
apiRouter.get('/datasets/:id/report', async (req: Request, res: Response) => {
  try {
    const ds = db.getDataset(req.params.id);
    if (!ds) {
      return res.status(404).json({ success: false, error: 'Dataset not found.' });
    }

    const cached = db.getReport(ds.id);
    if (cached && req.query.fresh !== 'true') {
      return res.json({ success: true, report: cached });
    }

    const report = await AIService.generateManagementReport({
      datasetName: ds.name,
      rowCount: ds.rowCount,
      kpis: ds.kpis,
      insights: ds.insights,
      charts: ds.charts,
      qualityScore: ds.qualityReport.score,
      qualityIssuesCount: ds.qualityReport.issues.length,
    });

    db.saveReport(ds.id, report);
    res.json({ success: true, report });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
