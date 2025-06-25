import React, { useState, useEffect, useRef } from 'react';
import signalVaultBg from '@assets/ChatGPT Image Jun 25, 2025, 03_34_57 PM_1750845904457.png';

interface SignalVaultSceneProps {
  onComplete: () => void;
  onDetected: () => void;
  onReturnToChoices: () => void;
}

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'start' | 'checkpoint' | 'component' | 'end';
  connected: boolean;
  requiredComponent?: string;
}

interface Component {
  id: string;
  label: string;
  x: number;
  y: number;
  isDragging: boolean;
  placed: boolean;
}

export default function SignalVaultScene({ onComplete, onDetected, onReturnToChoices }: SignalVaultSceneProps) {
  const [level, setLevel] = useState(1);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [completedConnections, setCompletedConnections] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeLevel(level);
  }, [level]);

  const initializeLevel = (currentLevel: number) => {
    switch (currentLevel) {
      case 1:
        setNodes([
          { id: 'start', label: 'Signal Origin', x: 100, y: 200, type: 'start', connected: true },
          { id: 'firewall', label: 'Firewall Node', x: 300, y: 200, type: 'checkpoint', connected: false, requiredComponent: 'access' },
          { id: 'security', label: 'Security Check', x: 500, y: 200, type: 'checkpoint', connected: false, requiredComponent: 'decrypt' },
          { id: 'end', label: 'Data Vault', x: 700, y: 200, type: 'end', connected: false }
        ]);
        setComponents([
          { id: 'access', label: 'Access Key', x: 150, y: 350, isDragging: false, placed: false },
          { id: 'decrypt', label: 'Decrypt Module', x: 250, y: 350, isDragging: false, placed: false },
          { id: 'cipher', label: 'Cipher Block', x: 350, y: 350, isDragging: false, placed: false }
        ]);
        break;
      case 2:
        setNodes([
          { id: 'start', label: 'Neural Core', x: 100, y: 150, type: 'start', connected: true },
          { id: 'router1', label: 'Data Router', x: 250, y: 100, type: 'checkpoint', connected: false, requiredComponent: 'protocol' },
          { id: 'router2', label: 'Backup Router', x: 250, y: 200, type: 'checkpoint', connected: false, requiredComponent: 'bypass' },
          { id: 'processor', label: 'AI Processor', x: 400, y: 150, type: 'checkpoint', connected: false, requiredComponent: 'neural' },
          { id: 'memory', label: 'Memory Bank', x: 550, y: 100, type: 'checkpoint', connected: false, requiredComponent: 'index' },
          { id: 'end', label: 'Archive Core', x: 700, y: 150, type: 'end', connected: false }
        ]);
        setComponents([
          { id: 'protocol', label: 'Data Protocol', x: 100, y: 350, isDragging: false, placed: false },
          { id: 'bypass', label: 'System Bypass', x: 200, y: 350, isDragging: false, placed: false },
          { id: 'neural', label: 'Neural Link', x: 300, y: 350, isDragging: false, placed: false },
          { id: 'index', label: 'Memory Index', x: 400, y: 350, isDragging: false, placed: false },
          { id: 'firewall', label: 'Firewall', x: 500, y: 350, isDragging: false, placed: false }
        ]);
        break;
      case 3:
        setNodes([
          { id: 'start', label: 'Core Matrix', x: 80, y: 200, type: 'start', connected: true },
          { id: 'encrypt', label: 'Encryption Gate', x: 200, y: 120, type: 'checkpoint', connected: false, requiredComponent: 'quantum' },
          { id: 'auth', label: 'Auth Server', x: 200, y: 280, type: 'checkpoint', connected: false, requiredComponent: 'biometric' },
          { id: 'junction', label: 'Data Junction', x: 350, y: 200, type: 'checkpoint', connected: false, requiredComponent: 'merger' },
          { id: 'filter', label: 'Signal Filter', x: 500, y: 150, type: 'checkpoint', connected: false, requiredComponent: 'analyzer' },
          { id: 'backup', label: 'Backup Node', x: 500, y: 250, type: 'checkpoint', connected: false, requiredComponent: 'redundancy' },
          { id: 'vault', label: 'Vault Core', x: 650, y: 200, type: 'end', connected: false }
        ]);
        setComponents([
          { id: 'quantum', label: 'Quantum Key', x: 50, y: 380, isDragging: false, placed: false },
          { id: 'biometric', label: 'Bio Scanner', x: 150, y: 380, isDragging: false, placed: false },
          { id: 'merger', label: 'Data Merger', x: 250, y: 380, isDragging: false, placed: false },
          { id: 'analyzer', label: 'Signal Analyzer', x: 350, y: 380, isDragging: false, placed: false },
          { id: 'redundancy', label: 'Redundancy Core', x: 450, y: 380, isDragging: false, placed: false },
          { id: 'phantom', label: 'Phantom Module', x: 550, y: 380, isDragging: false, placed: false }
        ]);
        break;
    }
    setCompletedConnections(0);
    setAttempts(0);
    setShowHint(false);
    setGameOver(false);
    setSelectedComponent(null);
  };

  const getHint = () => {
    switch (level) {
      case 1:
        return "Connect Access Key to Firewall Node and Decrypt Module to Security Check to establish signal flow.";
      case 2:
        return "Route through Data Router with Protocol, then AI Processor with Neural Link, finally Memory Bank with Index.";
      case 3:
        return "Quantum encryption paths require Bio Scanner at Auth Server and Signal Analyzer at Filter Node.";
      default:
        return "Follow the signal path and match components to their corresponding checkpoints.";
    }
  };

  const handleComponentClick = (componentId: string) => {
    if (selectedComponent === componentId) {
      setSelectedComponent(null);
    } else {
      setSelectedComponent(componentId);
    }
  };

  const handleNodeClick = (nodeId: string) => {
    if (!selectedComponent) return;
    
    const component = components.find(c => c.id === selectedComponent);
    const node = nodes.find(n => n.id === nodeId);
    
    if (component && node && !component.placed && !node.connected) {
      if (node.requiredComponent === component.id) {
        // Correct connection
        setNodes(prev => prev.map(n => 
          n.id === nodeId ? { ...n, connected: true } : n
        ));
        setComponents(prev => prev.map(c => 
          c.id === selectedComponent ? { ...c, placed: true } : c
        ));
        setCompletedConnections(prev => prev + 1);
        setSelectedComponent(null);
      } else {
        // Wrong connection - play siren sound and increase attempts
        setAttempts(prev => {
          const newAttempts = prev + 1;
          if (newAttempts >= 3) {
            setGameOver(true);
          }
          return newAttempts;
        });
        // Play siren sound
        const audio = new Audio('/sounds/siren.mp3');
        audio.play().catch(() => {}); // Ignore audio errors
        setSelectedComponent(null);
      }
    }
  };

  useEffect(() => {
    const requiredConnections = nodes.filter(node => node.requiredComponent).length;
    if (completedConnections === requiredConnections && requiredConnections > 0) {
      if (level < 3) {
        setTimeout(() => setLevel(prev => prev + 1), 1500);
      } else {
        setTimeout(() => onComplete(), 2000);
      }
    }
  }, [completedConnections, nodes, level, onComplete]);

  const renderConnection = (from: Node, to: Node) => {
    if (!from || !to) return null;
    const isActive = from.connected && to.connected;
    return (
      <line
        key={`${from.id}-${to.id}`}
        x1={from.x + 50}
        y1={from.y + 25}
        x2={to.x + 50}
        y2={to.y + 25}
        stroke={isActive ? "#00ff88" : "#444"}
        strokeWidth="3"
        className={isActive ? "animate-pulse" : ""}
      />
    );
  };

  return (
    <div 
      className="relative min-h-screen overflow-hidden"
      style={{ 
        backgroundImage: `url('${signalVaultBg}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {gameOver && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-8 text-center max-w-md">
            <h2 className="text-3xl font-bold text-red-400 mb-4">PUZZLE FAILED</h2>
            <p className="text-red-300 mb-6">Too many incorrect attempts. Signal routing compromised.</p>
            <button
              onClick={onReturnToChoices}
              className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Return to Investigation Paths
            </button>
          </div>
        </div>
      )}
      
      <div className="relative z-10 h-screen flex flex-col bg-black/50">
        <div className="text-center py-4 bg-black/80">
          <h1 className="text-4xl font-bold text-green-400 mb-2">SIGNAL VAULT</h1>
          <h2 className="text-2xl text-cyan-400">Level {level}/3</h2>
          <p className="text-lg text-gray-300 mt-2">Route the signal through the network by placing components</p>
          <div className="mt-2 flex justify-center gap-6">
            <span className="text-yellow-400">Attempts: {attempts}/3</span>
            <button 
              onClick={() => setShowHint(!showHint)}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
          </div>
          {showHint && (
            <div className="mt-4 p-4 bg-black/60 rounded-lg max-w-2xl mx-auto">
              <p className="text-cyan-300 text-sm">{getHint()}</p>
            </div>
          )}
        </div>

        <div 
          ref={containerRef}
          className="relative flex-1 border border-cyan-500/30 overflow-hidden bg-black/20"
        >
          {/* SVG for connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {nodes.slice(0, -1).map((node, index) => {
              const nextNode = nodes[index + 1];
              if (level === 1) {
                return renderConnection(node, nextNode);
              } else if (level === 2) {
                // Custom routing for level 2
                if (node.id === 'start') {
                  return [
                    renderConnection(node, nodes.find(n => n.id === 'router1')!),
                    renderConnection(node, nodes.find(n => n.id === 'router2')!)
                  ];
                } else if (node.id === 'router1' || node.id === 'router2') {
                  return renderConnection(node, nodes.find(n => n.id === 'processor')!);
                } else if (node.id === 'processor') {
                  return renderConnection(node, nodes.find(n => n.id === 'memory')!);
                } else if (node.id === 'memory') {
                  return renderConnection(node, nodes.find(n => n.id === 'end')!);
                }
              } else if (level === 3) {
                // Complex routing for level 3
                if (node.id === 'start') {
                  return [
                    renderConnection(node, nodes.find(n => n.id === 'encrypt')!),
                    renderConnection(node, nodes.find(n => n.id === 'auth')!)
                  ];
                } else if (node.id === 'encrypt' || node.id === 'auth') {
                  return renderConnection(node, nodes.find(n => n.id === 'junction')!);
                } else if (node.id === 'junction') {
                  return [
                    renderConnection(node, nodes.find(n => n.id === 'filter')!),
                    renderConnection(node, nodes.find(n => n.id === 'backup')!)
                  ];
                } else if (node.id === 'filter' || node.id === 'backup') {
                  return renderConnection(node, nodes.find(n => n.id === 'vault')!);
                }
              }
              return null;
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              onClick={() => handleNodeClick(node.id)}
              className={`absolute w-32 h-16 rounded border-2 flex items-center justify-center text-xs font-bold cursor-pointer transition-all hover:scale-105 ${
                node.connected 
                  ? 'bg-green-500/30 border-green-400 text-green-300 shadow-lg shadow-green-400/20' 
                  : node.type === 'start' 
                    ? 'bg-blue-500/30 border-blue-400 text-blue-300 shadow-lg shadow-blue-400/20'
                    : node.type === 'end'
                      ? 'bg-purple-500/30 border-purple-400 text-purple-300 shadow-lg shadow-purple-400/20'
                      : 'bg-red-500/30 border-red-400 text-red-300 hover:bg-red-400/30 shadow-lg shadow-red-400/20'
              }`}
              style={{ left: node.x, top: node.y }}
            >
              {node.label}
            </div>
          ))}

          {/* Components at bottom */}
          <div className="absolute bottom-8 left-8 right-8">
            <h3 className="text-cyan-400 font-bold mb-4 text-center text-lg">Available Components</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {components.map((component) => (
                <button
                  key={component.id}
                  onClick={() => !component.placed && handleComponentClick(component.id)}
                  disabled={component.placed}
                  className={`px-6 py-3 rounded border-2 font-bold text-sm transition-all ${
                    component.placed 
                      ? 'bg-green-600/30 border-green-400 text-green-300 cursor-not-allowed opacity-50' 
                      : selectedComponent === component.id
                        ? 'bg-yellow-500/40 border-yellow-400 text-yellow-300 shadow-lg shadow-yellow-400/30 scale-105'
                        : 'bg-cyan-500/30 border-cyan-400 text-cyan-300 hover:bg-cyan-400/40 hover:scale-105 shadow-lg shadow-cyan-400/20'
                  }`}
                >
                  {component.label}
                  {selectedComponent === component.id && <span className="ml-2">◄</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="py-4 bg-black/80 text-center border-t border-cyan-500/30">
          <p className="text-gray-400 mb-2">
            {selectedComponent ? `Selected: ${components.find(c => c.id === selectedComponent)?.label} - Click a node to connect` : 'Select a component, then click its matching node'}
          </p>
          <div className="flex justify-center gap-6">
            <span className="text-green-400">Connections: {completedConnections}/{nodes.filter(n => n.requiredComponent).length}</span>
            <span className="text-yellow-400">Failed Attempts: {attempts}/3</span>
          </div>
        </div>
      </div>
    </div>
  );
}