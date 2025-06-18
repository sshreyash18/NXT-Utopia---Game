import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { promises as fs } from 'fs';
import path from 'path';

export class LogRetrievalAgent extends BaseAgent {
  constructor() {
    super('LogRetrievalAgent', 'Retrieves and analyzes system logs for security threats');
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    try {
      this.log('Starting log retrieval and analysis', { scene: context.scene });
      
      const playerLogs = await this.retrievePlayerLogs(context);
      const logFile = await this.generateLogFile(playerLogs, context);
      
      return {
        success: true,
        data: {
          logs: playerLogs,
          logFile: logFile,
          riskFlags: playerLogs.filter(log => this.assessRiskFlag(log))
        },
        metadata: {
          totalLogs: playerLogs.length,
          riskCount: playerLogs.filter(log => this.assessRiskFlag(log)).length
        }
      };
    } catch (error) {
      this.error('Log retrieval failed', error);
      return {
        success: false,
        error: 'Failed to retrieve system logs'
      };
    }
  }

  private async retrievePlayerLogs(context: AgentContext) {
    const logs = [
      {
        timestamp: new Date().toISOString(),
        source: 'neural_interface',
        level: 'INFO',
        message: `Player choice: ${context.userChoice || 'N/A'}`,
        metadata: {
          scene: context.scene,
          userId: context.userId,
          sessionId: context.sessionId
        }
      },
      {
        timestamp: new Date(Date.now() - 5000).toISOString(),
        source: 'behavior_monitor',
        level: 'WARN',
        message: 'Anomalous decision pattern detected',
        metadata: {
          pattern: this.generateRandomChoice(context.scene),
          confidence: Math.random() * 0.4 + 0.6
        }
      },
      {
        timestamp: new Date(Date.now() - 10000).toISOString(),
        source: 'security_scanner',
        level: 'ERROR',
        message: 'Unauthorized access attempt to core systems',
        metadata: {
          threat_level: 'HIGH',
          source_ip: '192.168.1.42'
        }
      },
      ...this.generateNetworkLogs()
    ];

    return logs;
  }

  private assessRiskFlag(log: any): boolean {
    const riskKeywords = ['unauthorized', 'anomalous', 'threat', 'breach', 'suspicious'];
    return riskKeywords.some(keyword => 
      log.message.toLowerCase().includes(keyword) || 
      log.level === 'ERROR' || 
      log.level === 'WARN'
    );
  }

  private async generateLogFile(logs: any[], context: AgentContext) {
    const filename = `system_logs_${context.sessionId}_${Date.now()}.txt`;
    const tempDir = path.join(process.cwd(), 'temp');
    
    // Ensure temp directory exists
    try {
      await fs.mkdir(tempDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
    
    const filepath = path.join(tempDir, filename);
    
    const logContent = logs.map(log => 
      `[${log.timestamp}] [${log.level}] ${log.source}: ${log.message}\n` +
      `  Metadata: ${JSON.stringify(log.metadata, null, 2)}`
    ).join('\n\n');
    
    await fs.writeFile(filepath, logContent);
    
    return {
      filename,
      downloadUrl: `/api/download/logs/${filename}`,
      size: logContent.length
    };
  }

  private generateNetworkLogs() {
    return [
      {
        timestamp: new Date(Date.now() - 15000).toISOString(),
        source: 'network_monitor',
        level: 'INFO',
        message: 'Neural link established',
        metadata: { bandwidth: '1.2GB/s', latency: '0.3ms' }
      },
      {
        timestamp: new Date(Date.now() - 20000).toISOString(),
        source: 'data_integrity',
        level: 'WARN',
        message: 'Memory fragmentation detected',
        metadata: { fragments: 47, integrity_score: 0.89 }
      }
    ];
  }

  private generateRandomChoice(scene: string): string {
    const choices = {
      awaken: ['investigate_pod', 'check_systems', 'ignore_warnings'],
      trust: ['trust_voice', 'question_identity', 'demand_proof'],
      leak: ['examine_corruption', 'trace_source', 'isolate_systems'],
      core: ['access_core', 'backup_data', 'emergency_shutdown']
    };
    
    const sceneChoices = choices[scene as keyof typeof choices] || ['unknown_action'];
    return sceneChoices[Math.floor(Math.random() * sceneChoices.length)];
  }
}