import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Play, 
  Terminal, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function AgentActivityDrawer({ isOpen, onClose, onActionExecuted }) {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState(null);
  const [isRunningSweep, setIsRunningSweep] = useState(false);
  const [executingActionId, setExecutingActionId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadAgentData();
      const interval = setInterval(loadAgentData, 4000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const loadAgentData = async () => {
    try {
      const [statusRes, logsRes] = await Promise.all([
        api.getAgentStatus(),
        api.getAgentLogs()
      ]);
      if (statusRes.success) setStatus(statusRes);
      if (logsRes.success) setLogs(logsRes.logs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExecuteAction = async (actionId) => {
    try {
      setExecutingActionId(actionId);
      const res = await api.executeAgentAction(actionId);
      if (res.success) {
        setLogs(res.logs);
        if (onActionExecuted) onActionExecuted();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExecutingActionId(null);
    }
  };

  const handleRunSweep = async () => {
    try {
      setIsRunningSweep(true);
      const res = await api.runAutonomousTriage();
      if (res.success) {
        setLogs(res.logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunningSweep(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-zinc-950/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-zinc-900 border-l border-zinc-800 h-full shadow-2xl flex flex-col text-zinc-100 font-sans animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold tracking-tight text-zinc-100">Autonomous Agent Runtime</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">v2.4-enterprise • Policy-enforced orchestrator</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Tools Bar */}
        <div className="px-6 py-3.5 bg-zinc-950 border-b border-zinc-800/80">
          <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
            Active Specialized Sub-Agents & Tools
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {status?.activeTools?.map((tool) => (
              <div
                key={tool.id}
                className="p-2 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-center justify-between"
              >
                <div className="truncate mr-2">
                  <div className="font-mono text-[11px] text-zinc-200 truncate">{tool.name}</div>
                  <div className="text-[10px] text-zinc-500 truncate">{tool.description}</div>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions Controls Bar */}
        <div className="px-6 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-zinc-400">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Telemetry & Execution Log</span>
          </div>

          <button
            onClick={handleRunSweep}
            disabled={isRunningSweep}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all shadow-xs"
          >
            <Play className={`w-3.5 h-3.5 ${isRunningSweep ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isRunningSweep ? 'Executing Sweep...' : 'Trigger Autonomous Sweep'}</span>
          </button>
        </div>

        {/* Real-time Agent Reasoning Timeline */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 font-mono text-xs">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 font-sans">
              No recent agent events. Incoming emails will produce live reasoning traces.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800/90 space-y-3"
              >
                {/* Agent & Thread title */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                      {log.agent}
                    </span>
                    <h4 className="text-xs font-sans font-semibold text-zinc-200 mt-1 line-clamp-1">
                      {log.threadSubject || log.action}
                    </h4>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                {/* Steps Trace */}
                <div className="space-y-1.5 pl-2 border-l border-zinc-800">
                  {log.steps?.map((step, sIdx) => (
                    <div key={sIdx} className="text-[11px] leading-relaxed">
                      {step.tool && (
                        <div className="text-zinc-400">
                          <span className="text-indigo-400">↳ [Tool: {step.tool}]</span>: {step.output}
                        </div>
                      )}
                      {step.decision && (
                        <div className="text-emerald-300 font-semibold mt-1">
                          ↳ [Decision]: {step.decision}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Proposed Actions */}
                {log.proposedActions?.length > 0 && (
                  <div className="pt-2 border-t border-zinc-800/60 space-y-1.5 font-sans">
                    <div className="text-[10px] font-mono uppercase text-zinc-500">
                      Autonomous Actions Pipeline:
                    </div>
                    {log.proposedActions.map((act) => (
                      <div
                        key={act.id}
                        className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between"
                      >
                        <span className="text-xs text-zinc-300 font-medium">{act.label}</span>
                        {act.executed ? (
                          <span className="inline-flex items-center text-[11px] text-emerald-400 font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Executed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleExecuteAction(act.id)}
                            disabled={executingActionId === act.id}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-all shadow-xs"
                          >
                            {executingActionId === act.id ? 'Running...' : 'Approve & Execute'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span>Confidence Gate: 85%</span>
          <span>Zero Unsupervised Writes</span>
        </div>

      </div>
    </div>
  );
}
