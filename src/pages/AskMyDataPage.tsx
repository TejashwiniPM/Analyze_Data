import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  CornerDownRight,
  BarChart2,
  RefreshCw,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';
import { QuestionRecord, ChartDefinition, NavigationTab } from '../types';
import { AnalyticalChart } from '../components/AnalyticalChart';

interface AskMyDataPageProps {
  datasetId: string;
  initialQuery?: string;
  onNavigate?: (tab: NavigationTab) => void;
}

export const AskMyDataPage: React.FC<AskMyDataPageProps> = ({ datasetId, initialQuery, onNavigate }) => {
  const [questions, setQuestions] = useState<QuestionRecord[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [executingStep, setExecutingStep] = useState<string | null>(null);
  const [clarification, setClarification] = useState<{
    prompt: string;
    suggestions: string[];
  } | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Load existing conversation history
  useEffect(() => {
    if (datasetId) {
      api.getQuestions(datasetId).then((history) => {
        setQuestions(history);
      }).catch(console.error);
    }
  }, [datasetId]);

  // Handle initial query passed from dashboard
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleAsk(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [questions, executingStep, clarification]);

  const handleAsk = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim() || loading) return;

    setInputQuery('');
    setClarification(null);
    setLoading(true);

    try {
      setExecutingStep('Understanding analytical question & forming computation plan...');
      await new Promise((r) => setTimeout(r, 250));

      setExecutingStep('Executing Python/SQL deterministic calculation...');
      await new Promise((r) => setTimeout(r, 350));

      setExecutingStep('Grounded AI synthesizing verified facts into explanation...');
      const res = await api.askQuestion(datasetId, q);

      if (res.isAmbiguous) {
        setClarification({
          prompt: res.clarificationPrompt || 'This question cannot be answered without more specific constraints.',
          suggestions: res.suggestedFollowUps || [],
        });
      } else if (res.record) {
        setQuestions((prev) => [...prev, res.record!]);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
      setExecutingStep(null);
    }
  };

  const sampleSuggestions = [
    'What was our total revenue?',
    'Which region performed best?',
    'Why did revenue decline in March?',
    'Show me the top 10 products',
    'How did sales change over time?',
    'What about profit margins by category?',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header & Architectural Guarantee */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-100">Ask My Data</h1>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Verified Reasoning
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ask questions in plain English. The computation engine calculates the verified numbers before AI explains them.
          </p>
        </div>

        {/* Pipeline Badge */}
        <div className="hidden lg:flex items-center space-x-1.5 text-[10px] text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="text-indigo-400 font-mono">Query</span>
          <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
          <span className="text-cyan-400 font-mono">Plan</span>
          <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
          <span className="text-emerald-400 font-mono">SQL/Math</span>
          <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
          <span className="text-purple-400 font-mono">AI Explanation</span>
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="space-y-6 min-h-[400px]">
        {questions.length === 0 && !loading && (
          <div className="py-12 px-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center">
              <Bot className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-base font-bold text-slate-200">Start Your Conversational Exploration</h3>
              <p className="text-xs text-slate-400">
                You can ask about totals, top performers, comparisons, trends over time, or variance decompositions like &ldquo;Why did revenue decline in March?&rdquo;
              </p>
            </div>

            <div className="pt-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Suggested Questions to Try:
              </div>
              <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                {sampleSuggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAsk(s)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-300 hover:text-indigo-300 transition-all text-left"
                  >
                    &ldquo;{s}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Pairs */}
        {questions.map((q) => (
          <div key={q.id} className="space-y-4 animate-in fade-in">
            {/* User Message */}
            <div className="flex items-start justify-end space-x-3">
              <div className="max-w-xl p-4 rounded-2xl bg-indigo-600 text-white text-xs sm:text-sm font-medium shadow-lg shadow-indigo-600/20">
                {q.question}
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-slate-300" />
              </div>
            </div>

            {/* AI Assistant Grounded Response */}
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20 mt-1">
                <Bot className="w-4 h-4 text-white" />
              </div>

              <div className="flex-1 max-w-3xl space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                  {/* Calculation Plan Trace Badge */}
                  {q.calculationPlan && (
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center space-x-2 text-[11px] text-slate-400">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="font-semibold text-slate-300">Computation Plan:</span>
                      <span className="truncate font-mono text-[10px] text-slate-400">{q.calculationPlan}</span>
                    </div>
                  )}

                  {/* Primary Narrative Answer */}
                  <div className="text-sm text-slate-100 font-medium leading-relaxed">
                    {q.answer}
                  </div>

                  {/* Strict FACT / INTERPRETATION / LIMITATION Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                    {/* FACT */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20 space-y-1">
                      <div className="flex items-center space-x-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Fact</span>
                      </div>
                      <p className="text-slate-200 text-[11px] font-medium leading-relaxed">
                        {q.fact}
                      </p>
                    </div>

                    {/* INTERPRETATION */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-indigo-500/20 space-y-1">
                      <div className="flex items-center space-x-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        <span>Interpretation</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {q.interpretation}
                      </p>
                    </div>

                    {/* LIMITATION */}
                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                      <div className="flex items-center space-x-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        <HelpCircle className="w-3 h-3 text-amber-400" />
                        <span>Limitation</span>
                      </div>
                      <p className="text-amber-200/80 text-[11px] leading-relaxed">
                        {q.limitation}
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Supporting Chart */}
                  {q.chartSuggestion && (
                    <div className="pt-2">
                      <AnalyticalChart chart={q.chartSuggestion} height={240} />
                    </div>
                  )}

                  {/* Verified Computational Evidence Table */}
                  {q.calculatedResult && Object.keys(q.calculatedResult).length > 0 && (
                    <div className="pt-2 border-t border-slate-800">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Verified Fact Metrics
                      </div>
                      <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                        {Object.entries(q.calculatedResult)
                          .filter(([_, v]) => typeof v === 'number' || typeof v === 'string')
                          .slice(0, 6)
                          .map(([k, v]) => (
                            <span key={k} className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
                              <span className="text-slate-500">{k}:</span> {typeof v === 'number' ? v.toLocaleString() : String(v)}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Follow-Ups */}
                  {q.suggestedFollowUps && q.suggestedFollowUps.length > 0 && (
                    <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
                        Follow-up:
                      </span>
                      {q.suggestedFollowUps.map((fu, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAsk(fu)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] text-indigo-300 hover:text-white transition-colors"
                        >
                          &ldquo;{fu}&rdquo;
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Ambiguous Question Clarification Alert */}
        {clarification && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3 animate-in fade-in">
            <div className="flex items-start space-x-2.5 text-amber-300 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Ambiguous Question Clarification: </span>
                <span>{clarification.prompt}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {clarification.suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(s)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-amber-500/30 text-xs text-amber-200 hover:bg-slate-800 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Real-time Operation Step Trace */}
        {loading && executingStep && (
          <div className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse text-xs text-indigo-400">
            <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0" />
            <span className="font-medium">{executingStep}</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Query Input Bar */}
      <div className="sticky bottom-4 z-20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="p-2 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={loading}
            placeholder='Ask anything about your data... (e.g. "Why did revenue decline in March?" or "Top products")'
            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5 shrink-0"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
