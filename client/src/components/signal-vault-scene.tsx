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
    setSelectedConnection(null);
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

  const handleMouseDown = (e: React.MouseEvent, componentId: string) => {
    setIsDragging(componentId);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const component = components.find(c => c.id === componentId);
      if (component) {
        setDragOffset({
          x: e.clientX - rect.left - component.x,
          y: e.clientY - rect.top - component.y
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const newX = e.clientX - rect.left - dragOffset.x;
        const newY = e.clientY - rect.top - dragOffset.y;
        
        setComponents(prev => prev.map(component => 
          component.id === isDragging 
            ? { ...component, x: newX, y: newY, isDragging: true }
            : component
        ));
      }
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      const component = components.find(c => c.id === isDragging);
      if (component) {
        // Check if component is dropped on a compatible node
        const targetNode = nodes.find(node => {
          const distance = Math.sqrt(
            Math.pow(node.x - component.x, 2) + Math.pow(node.y - component.y, 2)
          );
          return distance < 60 && node.requiredComponent === component.id && !node.connected;
        });

        if (targetNode) {
          // Successful connection
          setNodes(prev => prev.map(node => 
            node.id === targetNode.id ? { ...node, connected: true } : node
          ));
          setComponents(prev => prev.map(comp => 
            comp.id === component.id ? { ...comp, placed: true, x: targetNode.x, y: targetNode.y } : comp
          ));
          setCompletedConnections(prev => prev + 1);
        } else {
          // Wrong placement - increase attempt counter
          setAttempts(prev => {
            const newAttempts = prev + 1;
            if (newAttempts >= 3) {
              setGameOver(true);
            }
            return newAttempts;
          });
        }
      }
      setIsDragging(null);
      setComponents(prev => prev.map(component => ({ ...component, isDragging: false })));
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
      <div className="absolute inset-0 bg-black/60" />
      
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
      
      <div className="relative z-10 p-4">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-green-400 mb-2">SIGNAL VAULT</h1>
          <h2 className="text-2xl text-cyan-400">Level {level}/3</h2>
          <p className="text-lg text-gray-300 mt-2">Route the signal through the network by placing components</p>
          <div className="mt-2">
            <span className="text-yellow-400">Attempts: {attempts}/3</span>
            <button 
              onClick={() => setShowHint(!showHint)}
              className="ml-4 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
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
          className="relative w-full h-[500px] bg-black/20 rounded-lg border border-cyan-500/30 overflow-hidden mx-auto max-w-5xl"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
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
              className={`absolute w-24 h-12 rounded border-2 flex items-center justify-center text-xs font-bold cursor-pointer transition-all ${
                node.connected 
                  ? 'bg-green-500/20 border-green-400 text-green-300' 
                  : node.type === 'start' 
                    ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                    : node.type === 'end'
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                      : 'bg-red-500/20 border-red-400 text-red-300'
              }`}
              style={{ left: node.x, top: node.y }}
            >
              {node.label}
            </div>
          ))}

          {/* Components */}
          {components.map((component) => (
            <div
              key={component.id}
              className={`absolute w-20 h-10 rounded border-2 flex items-center justify-center text-xs font-bold cursor-grab transition-all ${
                component.placed 
                  ? 'bg-green-600/30 border-green-400 text-green-300 cursor-not-allowed' 
                  : component.isDragging
                    ? 'bg-yellow-500/30 border-yellow-400 text-yellow-300 cursor-grabbing z-50'
                    : 'bg-cyan-500/30 border-cyan-400 text-cyan-300 hover:bg-cyan-400/40'
              }`}
              style={{ left: component.x, top: component.y }}
              onMouseDown={(e) => !component.placed && handleMouseDown(e, component.id)}
            >
              {component.label}
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Drag components from the bottom to their matching checkpoints to complete the signal path
          </p>
          <div className="mt-2">
            <span className="text-green-400">Connections: {completedConnections}/{nodes.filter(n => n.requiredComponent).length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}