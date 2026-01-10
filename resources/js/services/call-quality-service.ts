import { WebRTCSignalingService } from './webrtc-signaling-service';

export interface NetworkCondition {
  bandwidth: number; // kbps
  latency: number; // ms
  packetLoss: number; // percentage
  jitter: number; // ms
  quality: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  timestamp: number;
}

export interface QualitySettings {
  video: {
    width: number;
    height: number;
    frameRate: number;
    bitrate: number; // kbps
  };
  audio: {
    bitrate: number; // kbps
    sampleRate: number;
  };
}

export interface QualityPreset {
  name: string;
  label: string;
  video: {
    width: number;
    height: number;
    frameRate: number;
    bitrate: number;
  };
  audio: {
    bitrate: number;
    sampleRate: number;
  };
  minBandwidth: number; // kbps required
}

export interface CallQualityMetrics {
  participantId: string;
  networkCondition: NetworkCondition;
  currentSettings: QualitySettings;
  recommendedSettings: QualitySettings;
  adaptationHistory: Array<{
    timestamp: number;
    from: QualitySettings;
    to: QualitySettings;
    reason: string;
  }>;
}

export class CallQualityService {
  private signalingService: WebRTCSignalingService;
  private qualityMetrics: Map<string, CallQualityMetrics> = new Map();
  private monitoringInterval: NodeJS.Timeout | null = null;
  private adaptationInProgress: Set<string> = new Set();
  private eventListeners: Map<string, Function[]> = new Map();

  // Quality presets for different network conditions
  private readonly qualityPresets: QualityPreset[] = [
    {
      name: 'ultra',
      label: 'Ultra HD (1080p)',
      video: { width: 1920, height: 1080, frameRate: 30, bitrate: 2500 },
      audio: { bitrate: 128, sampleRate: 48000 },
      minBandwidth: 3000,
    },
    {
      name: 'high',
      label: 'High Definition (720p)',
      video: { width: 1280, height: 720, frameRate: 30, bitrate: 1500 },
      audio: { bitrate: 96, sampleRate: 44100 },
      minBandwidth: 2000,
    },
    {
      name: 'medium',
      label: 'Standard Definition (480p)',
      video: { width: 854, height: 480, frameRate: 24, bitrate: 800 },
      audio: { bitrate: 64, sampleRate: 44100 },
      minBandwidth: 1000,
    },
    {
      name: 'low',
      label: 'Low Definition (360p)',
      video: { width: 640, height: 360, frameRate: 20, bitrate: 400 },
      audio: { bitrate: 48, sampleRate: 22050 },
      minBandwidth: 500,
    },
    {
      name: 'minimal',
      label: 'Audio Only',
      video: { width: 0, height: 0, frameRate: 0, bitrate: 0 },
      audio: { bitrate: 32, sampleRate: 16000 },
      minBandwidth: 100,
    },
  ];

  constructor(signalingService: WebRTCSignalingService) {
    this.signalingService = signalingService;
    this.setupEventListeners();
  }

  public startMonitoring(): void {
    if (this.monitoringInterval) {
      this.stopMonitoring();
    }

    // Monitor network conditions every 5 seconds
    this.monitoringInterval = setInterval(() => {
      this.monitorAllParticipants();
    }, 5000);

    this.emit('monitoring-started');
  }

  public stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    this.emit('monitoring-stopped');
  }

  public async getNetworkCondition(participantId: string): Promise<NetworkCondition> {
    try {
      const stats = await this.signalingService.getConnectionStats(participantId);
      return this.analyzeConnectionStats(stats);
    } catch (error) {
      console.error('Failed to get network condition:', error);
      return this.getDefaultNetworkCondition();
    }
  }

  public getRecommendedQuality(networkCondition: NetworkCondition): QualitySettings {
    // Find the best quality preset that fits the current network conditions
    const availableBandwidth = networkCondition.bandwidth * 0.8; // Use 80% of available bandwidth for safety
    
    let selectedPreset = this.qualityPresets[this.qualityPresets.length - 1]; // Start with minimal
    
    // Select preset based on quality level and bandwidth
    switch (networkCondition.quality) {
      case 'excellent':
        selectedPreset = this.qualityPresets.find(p => p.name === 'ultra') || this.qualityPresets[0];
        break;
      case 'good':
        selectedPreset = this.qualityPresets.find(p => p.name === 'high') || this.qualityPresets[1];
        break;
      case 'fair':
        selectedPreset = this.qualityPresets.find(p => p.name === 'medium') || this.qualityPresets[2];
        break;
      case 'poor':
        selectedPreset = this.qualityPresets.find(p => p.name === 'low') || this.qualityPresets[3];
        break;
      case 'critical':
        selectedPreset = this.qualityPresets.find(p => p.name === 'minimal') || this.qualityPresets[4];
        break;
    }

    // Double-check bandwidth requirements
    if (selectedPreset.minBandwidth > availableBandwidth) {
      // Find a lower quality preset that fits
      for (let i = this.qualityPresets.length - 1; i >= 0; i--) {
        if (this.qualityPresets[i].minBandwidth <= availableBandwidth) {
          selectedPreset = this.qualityPresets[i];
          break;
        }
      }
    }

    // Create settings from preset
    const settings: QualitySettings = {
      video: { ...selectedPreset.video },
      audio: { ...selectedPreset.audio },
    };

    // Apply additional adjustments for specific network issues
    if (networkCondition.packetLoss > 5) {
      settings.video.frameRate = Math.max(15, Math.round(settings.video.frameRate * 0.7));
      settings.video.bitrate = Math.max(200, Math.round(settings.video.bitrate * 0.7));
    }

    if (networkCondition.latency > 200) {
      settings.video.frameRate = Math.max(15, Math.round(settings.video.frameRate * 0.8));
    }

    if (networkCondition.jitter > 50) {
      settings.audio.bitrate = Math.max(32, Math.round(settings.audio.bitrate * 0.8));
    }

    return settings;
  }

  public async adaptQuality(participantId: string, targetSettings: QualitySettings, reason: string): Promise<void> {
    if (this.adaptationInProgress.has(participantId)) {
      console.log(`Quality adaptation already in progress for participant ${participantId}`);
      return;
    }

    this.adaptationInProgress.add(participantId);

    try {
      const currentMetrics = this.qualityMetrics.get(participantId);
      const currentSettings = currentMetrics?.currentSettings || this.getDefaultQualitySettings();

      // Apply video quality changes
      if (targetSettings.video.bitrate > 0) {
        await this.adjustVideoQuality(participantId, targetSettings.video);
      } else {
        await this.disableVideo(participantId);
      }

      // Apply audio quality changes
      await this.adjustAudioQuality(participantId, targetSettings.audio);

      // Update metrics
      const updatedMetrics: CallQualityMetrics = {
        ...currentMetrics,
        participantId,
        currentSettings: targetSettings,
        adaptationHistory: [
          ...(currentMetrics?.adaptationHistory || []),
          {
            timestamp: Date.now(),
            from: currentSettings,
            to: targetSettings,
            reason,
          },
        ].slice(-10), // Keep last 10 adaptations
      } as CallQualityMetrics;

      this.qualityMetrics.set(participantId, updatedMetrics);

      this.emit('quality-adapted', {
        participantId,
        from: currentSettings,
        to: targetSettings,
        reason,
      });

    } catch (error) {
      console.error('Failed to adapt quality:', error);
      this.emit('quality-adaptation-failed', { participantId, error });
    } finally {
      this.adaptationInProgress.delete(participantId);
    }
  }

  public async enableAutoAdaptation(participantId: string): Promise<void> {
    const networkCondition = await this.getNetworkCondition(participantId);
    const recommendedSettings = this.getRecommendedQuality(networkCondition);
    
    await this.adaptQuality(participantId, recommendedSettings, 'Auto-adaptation enabled');
  }

  public getQualityMetrics(participantId: string): CallQualityMetrics | null {
    return this.qualityMetrics.get(participantId) || null;
  }

  public getAllQualityMetrics(): Map<string, CallQualityMetrics> {
    return new Map(this.qualityMetrics);
  }

  public getAvailablePresets(): QualityPreset[] {
    return [...this.qualityPresets];
  }

  public async setManualQuality(participantId: string, presetName: string): Promise<void> {
    const preset = this.qualityPresets.find(p => p.name === presetName);
    if (!preset) {
      throw new Error(`Quality preset '${presetName}' not found`);
    }

    const settings: QualitySettings = {
      video: { ...preset.video },
      audio: { ...preset.audio },
    };

    await this.adaptQuality(participantId, settings, `Manual quality set to ${preset.label}`);
  }

  private setupEventListeners(): void {
    this.signalingService.on('participant-joined', (participant: any) => {
      this.initializeParticipantMetrics(participant.id);
    });

    this.signalingService.on('participant-left', (participantId: string) => {
      this.qualityMetrics.delete(participantId);
      this.adaptationInProgress.delete(participantId);
    });

    this.signalingService.on('connection-state-changed', ({ participantId, state }: any) => {
      if (state === 'failed' || state === 'disconnected') {
        this.handleConnectionFailure(participantId);
      }
    });
  }

  private async monitorAllParticipants(): Promise<void> {
    const participants = this.signalingService.getParticipants();
    
    for (const participant of participants) {
      try {
        await this.monitorParticipant(participant.id);
      } catch (error) {
        console.error(`Failed to monitor participant ${participant.id}:`, error);
      }
    }
  }

  private async monitorParticipant(participantId: string): Promise<void> {
    const networkCondition = await this.getNetworkCondition(participantId);
    const currentMetrics = this.qualityMetrics.get(participantId);
    const currentSettings = currentMetrics?.currentSettings || this.getDefaultQualitySettings();
    const recommendedSettings = this.getRecommendedQuality(networkCondition);

    // Update metrics
    const updatedMetrics: CallQualityMetrics = {
      participantId,
      networkCondition,
      currentSettings,
      recommendedSettings,
      adaptationHistory: currentMetrics?.adaptationHistory || [],
    };

    this.qualityMetrics.set(participantId, updatedMetrics);

    // Check if adaptation is needed
    if (this.shouldAdaptQuality(currentSettings, recommendedSettings, networkCondition)) {
      await this.adaptQuality(
        participantId, 
        recommendedSettings, 
        `Network condition: ${networkCondition.quality}`
      );
    }

    this.emit('participant-monitored', updatedMetrics);
  }

  private shouldAdaptQuality(
    current: QualitySettings, 
    recommended: QualitySettings, 
    networkCondition: NetworkCondition
  ): boolean {
    // Don't adapt if the difference is minimal
    const videoBitrateDiff = Math.abs(current.video.bitrate - recommended.video.bitrate);
    const audioBitrateDiff = Math.abs(current.audio.bitrate - recommended.audio.bitrate);

    if (videoBitrateDiff < 100 && audioBitrateDiff < 16) {
      return false;
    }

    // Adapt if network quality is poor or critical
    if (networkCondition.quality === 'poor' || networkCondition.quality === 'critical') {
      return true;
    }

    // Adapt if we can significantly improve quality
    if (networkCondition.quality === 'excellent' || networkCondition.quality === 'good') {
      return recommended.video.bitrate > current.video.bitrate * 1.5;
    }

    return false;
  }

  private analyzeConnectionStats(stats: RTCStatsReport): NetworkCondition {
    let bandwidth = 0;
    let latency = 0;
    let packetLoss = 0;
    let jitter = 0;

    for (const [, stat] of stats) {
      if (stat.type === 'inbound-rtp' && stat.mediaType === 'video') {
        // Calculate bandwidth from bytes received (rough estimate)
        bandwidth = Math.max(bandwidth, (stat.bytesReceived * 8) / 1000 || 0); // Convert to kbps
        
        // Calculate packet loss percentage
        const totalPackets = (stat.packetsReceived || 0) + (stat.packetsLost || 0);
        if (totalPackets > 0) {
          packetLoss = Math.max(packetLoss, ((stat.packetsLost || 0) / totalPackets) * 100);
        }
        
        // Convert jitter to milliseconds
        jitter = Math.max(jitter, (stat.jitter || 0) * 1000);
      }

      if (stat.type === 'candidate-pair' && stat.state === 'succeeded') {
        // Convert RTT to milliseconds
        latency = Math.max(latency, (stat.currentRoundTripTime || 0) * 1000);
      }
    }

    // Determine quality based on metrics with more realistic thresholds
    let quality: NetworkCondition['quality'] = 'excellent';
    
    // Critical: Very poor conditions
    if (packetLoss > 15 || latency > 800 || bandwidth < 100) {
      quality = 'critical';
    }
    // Poor: Significant issues
    else if (packetLoss > 8 || latency > 400 || bandwidth < 300) {
      quality = 'poor';
    }
    // Fair: Some issues but usable
    else if (packetLoss > 3 || latency > 200 || bandwidth < 800) {
      quality = 'fair';
    }
    // Good: Minor issues
    else if (packetLoss > 1 || latency > 100 || bandwidth < 1500) {
      quality = 'good';
    }
    // Excellent: Great conditions
    else {
      quality = 'excellent';
    }

    return {
      bandwidth,
      latency,
      packetLoss,
      jitter,
      quality,
      timestamp: Date.now(),
    };
  }

  private async adjustVideoQuality(participantId: string, videoSettings: QualitySettings['video']): Promise<void> {
    // This would typically involve adjusting the video track constraints
    // For now, we'll simulate the adjustment
    console.log(`Adjusting video quality for ${participantId}:`, videoSettings);
    
    // In a real implementation, you would:
    // 1. Get the video track from the peer connection
    // 2. Apply new constraints using applyConstraints()
    // 3. Or replace the track with a new one with different settings
  }

  private async adjustAudioQuality(participantId: string, audioSettings: QualitySettings['audio']): Promise<void> {
    // This would typically involve adjusting the audio track constraints
    console.log(`Adjusting audio quality for ${participantId}:`, audioSettings);
  }

  private async disableVideo(participantId: string): Promise<void> {
    console.log(`Disabling video for ${participantId} due to poor network conditions`);
    // In a real implementation, you would disable the video track
  }

  private initializeParticipantMetrics(participantId: string): void {
    const defaultSettings = this.getDefaultQualitySettings();
    const defaultCondition = this.getDefaultNetworkCondition();

    const metrics: CallQualityMetrics = {
      participantId,
      networkCondition: defaultCondition,
      currentSettings: defaultSettings,
      recommendedSettings: defaultSettings,
      adaptationHistory: [],
    };

    this.qualityMetrics.set(participantId, metrics);
  }

  private async handleConnectionFailure(participantId: string): Promise<void> {
    // Attempt to recover by reducing quality to minimal
    const minimalSettings = this.getRecommendedQuality({
      bandwidth: 100,
      latency: 500,
      packetLoss: 15,
      jitter: 100,
      quality: 'critical',
      timestamp: Date.now(),
    });

    await this.adaptQuality(participantId, minimalSettings, 'Connection failure recovery');
  }

  private getDefaultQualitySettings(): QualitySettings {
    const mediumPreset = this.qualityPresets.find(p => p.name === 'medium')!;
    return {
      video: { ...mediumPreset.video },
      audio: { ...mediumPreset.audio },
    };
  }

  private getDefaultNetworkCondition(): NetworkCondition {
    return {
      bandwidth: 1500,
      latency: 50,
      packetLoss: 0,
      jitter: 10,
      quality: 'good',
      timestamp: Date.now(),
    };
  }

  // Event system
  public on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  public off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  public destroy(): void {
    this.stopMonitoring();
    this.qualityMetrics.clear();
    this.adaptationInProgress.clear();
    this.eventListeners.clear();
  }
}