export interface CrisisKeyword {
  id: string;
  word: string;
  category: 'suicide' | 'self_harm' | 'violence' | 'substance_abuse' | 'severe_depression' | 'panic' | 'eating_disorder' | 'trauma';
  severity: 'low' | 'medium' | 'high' | 'critical';
  weight: number; // 0-1 scale
  context?: string[]; // Required context words
  exclusions?: string[]; // Words that negate the crisis indicator
  language: string;
}

export interface CrisisPattern {
  id: string;
  name: string;
  description: string;
  pattern: RegExp;
  category: CrisisKeyword['category'];
  severity: CrisisKeyword['severity'];
  weight: number;
  minMatches: number;
  contextWindow: number; // Number of words to consider for context
}

export interface CrisisDetectionResult {
  id: string;
  messageId: string;
  userId: string;
  conversationId: string;
  content: string; // Sanitized content for logging
  detectedAt: Date;
  confidence: number; // 0-1 scale
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  categories: CrisisKeyword['category'][];
  triggers: Array<{
    type: 'keyword' | 'pattern' | 'ml_model';
    value: string;
    confidence: number;
    category: CrisisKeyword['category'];
    severity: CrisisKeyword['severity'];
  }>;
  contextFactors: {
    timeOfDay: number; // 0-23
    dayOfWeek: number; // 0-6
    recentActivity: 'low' | 'normal' | 'high';
    previousAlerts: number;
    userHistory: {
      hasHistory: boolean;
      lastIncident?: Date;
      frequency: number;
    };
  };
  recommendations: string[];
  requiresImmediate: boolean;
  escalationLevel: 'none' | 'therapist' | 'emergency' | 'crisis_team';
}

export interface MLModelConfig {
  modelUrl: string;
  threshold: number;
  batchSize: number;
  maxTokens: number;
  features: string[];
  preprocessing: {
    removePersonalInfo: boolean;
    normalizeText: boolean;
    removeStopWords: boolean;
  };
}

export interface CrisisDetectionConfig {
  enabled: boolean;
  realTimeAnalysis: boolean;
  batchAnalysis: boolean;
  keywordDetection: boolean;
  patternDetection: boolean;
  mlDetection: boolean;
  confidenceThreshold: number;
  escalationThreshold: number;
  contextAnalysis: boolean;
  userHistoryWeight: number;
  timeFactorWeight: number;
  falsePositiveReduction: boolean;
  languages: string[];
  mlModel?: MLModelConfig;
}

export interface CrisisAlert {
  id: string;
  detectionId: string;
  userId: string;
  conversationId: string;
  alertLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'acknowledged' | 'in_progress' | 'resolved' | 'false_positive';
  createdAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  notes: string[];
  actions: Array<{
    type: 'notification' | 'escalation' | 'intervention' | 'follow_up';
    timestamp: Date;
    performedBy: string;
    details: string;
  }>;
}

export class CrisisDetectionService {
  private baseUrl: string;
  private authToken: string;
  private config: CrisisDetectionConfig;
  private keywords: Map<string, CrisisKeyword[]> = new Map();
  private patterns: CrisisPattern[] = [];
  private mlModel: any = null;
  private eventListeners: Map<string, Function[]> = new Map();
  private analysisQueue: Array<{ messageId: string; content: string; userId: string; conversationId: string }> = [];
  private processingBatch = false;

  constructor(config: {
    baseUrl: string;
    authToken: string;
    detectionConfig: CrisisDetectionConfig;
  }) {
    this.baseUrl = config.baseUrl;
    this.authToken = config.authToken;
    this.config = config.detectionConfig;

    this.initializeDetectionEngine();
  }

  // Initialize the detection engine
  private async initializeDetectionEngine(): Promise<void> {
    try {
      await Promise.all([
        this.loadKeywords(),
        this.loadPatterns(),
        this.config.mlDetection ? this.loadMLModel() : Promise.resolve(),
      ]);

      if (this.config.batchAnalysis) {
        this.startBatchProcessor();
      }

      this.emit('engine_initialized', { config: this.config });
    } catch (error) {
      console.error('Failed to initialize crisis detection engine:', error);
      this.emit('engine_error', { error });
    }
  }

  // Load crisis keywords from API
  private async loadKeywords(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/crisis/keywords`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load keywords: ${response.status}`);
      }

      const result = await response.json();
      const keywords: CrisisKeyword[] = result.keywords;

      // Group keywords by language
      this.keywords.clear();
      keywords.forEach(keyword => {
        if (!this.keywords.has(keyword.language)) {
          this.keywords.set(keyword.language, []);
        }
        this.keywords.get(keyword.language)!.push(keyword);
      });
    } catch (error) {
      console.error('Failed to load crisis keywords:', error);
      throw error;
    }
  }

  // Load crisis patterns from API
  private async loadPatterns(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/crisis/patterns`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load patterns: ${response.status}`);
      }

      const result = await response.json();
      this.patterns = result.patterns.map((p: any) => ({
        ...p,
        pattern: new RegExp(p.pattern, 'gi'),
      }));
    } catch (error) {
      console.error('Failed to load crisis patterns:', error);
      throw error;
    }
  }

  // Load ML model for crisis detection
  private async loadMLModel(): Promise<void> {
    if (!this.config.mlModel) return;

    try {
      // This would typically load a TensorFlow.js or similar model
      // For now, we'll simulate the model loading
      const response = await fetch(this.config.mlModel.modelUrl);
      if (!response.ok) {
        throw new Error(`Failed to load ML model: ${response.status}`);
      }

      // Simulate model initialization
      this.mlModel = {
        predict: (text: string) => this.simulateMLPrediction(text),
        isLoaded: true,
      };
    } catch (error) {
      console.error('Failed to load ML model:', error);
      this.config.mlDetection = false;
    }
  }

  // Simulate ML model prediction (replace with actual model)
  private simulateMLPrediction(text: string): { confidence: number; categories: string[] } {
    const crisisWords = ['suicide', 'kill myself', 'end it all', 'worthless', 'hopeless'];
    const matches = crisisWords.filter(word => text.toLowerCase().includes(word));
    
    return {
      confidence: Math.min(matches.length * 0.3, 1.0),
      categories: matches.length > 0 ? ['suicide', 'severe_depression'] : [],
    };
  }

  // Analyze message for crisis indicators
  public async analyzeMessage(data: {
    messageId: string;
    content: string;
    userId: string;
    conversationId: string;
    language?: string;
    metadata?: Record<string, any>;
  }): Promise<CrisisDetectionResult | null> {
    if (!this.config.enabled) return null;

    try {
      const language = data.language || 'en';
      const sanitizedContent = this.sanitizeContent(data.content);

      // Perform different types of analysis
      const keywordResults = this.config.keywordDetection ? 
        this.analyzeKeywords(sanitizedContent, language) : [];
      
      const patternResults = this.config.patternDetection ? 
        this.analyzePatterns(sanitizedContent) : [];
      
      const mlResults = this.config.mlDetection && this.mlModel ? 
        await this.analyzeWithML(sanitizedContent) : [];

      // Combine all triggers
      const allTriggers = [...keywordResults, ...patternResults, ...mlResults];

      if (allTriggers.length === 0) return null;

      // Calculate overall confidence and risk level
      const confidence = this.calculateConfidence(allTriggers, data);
      
      if (confidence < this.config.confidenceThreshold) return null;

      // Get context factors
      const contextFactors = await this.getContextFactors(data.userId, data.conversationId);

      // Adjust confidence based on context
      const adjustedConfidence = this.adjustConfidenceForContext(confidence, contextFactors);

      // Determine risk level and escalation
      const riskLevel = this.determineRiskLevel(adjustedConfidence, allTriggers);
      const escalationLevel = this.determineEscalationLevel(riskLevel, contextFactors);

      // Create detection result
      const result: CrisisDetectionResult = {
        id: `crisis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        messageId: data.messageId,
        userId: data.userId,
        conversationId: data.conversationId,
        content: sanitizedContent,
        detectedAt: new Date(),
        confidence: adjustedConfidence,
        riskLevel,
        categories: [...new Set(allTriggers.map(t => t.category))],
        triggers: allTriggers,
        contextFactors,
        recommendations: this.generateRecommendations(riskLevel, allTriggers, contextFactors),
        requiresImmediate: riskLevel === 'critical' || escalationLevel === 'emergency',
        escalationLevel,
      };

      // Log the detection
      await this.logDetection(result);

      // Emit event for real-time handling
      this.emit('crisis_detected', result);

      return result;
    } catch (error) {
      console.error('Failed to analyze message for crisis:', error);
      this.emit('analysis_error', { messageId: data.messageId, error });
      return null;
    }
  }

  // Analyze keywords in content
  private analyzeKeywords(content: string, language: string): Array<{
    type: 'keyword';
    value: string;
    confidence: number;
    category: CrisisKeyword['category'];
    severity: CrisisKeyword['severity'];
  }> {
    const languageKeywords = this.keywords.get(language) || [];
    const results: any[] = [];
    const words = content.toLowerCase().split(/\s+/);

    languageKeywords.forEach(keyword => {
      const keywordLower = keyword.word.toLowerCase();
      
      // Check for exact matches and context
      if (words.includes(keywordLower)) {
        // Check context requirements
        if (keyword.context && keyword.context.length > 0) {
          const hasContext = keyword.context.some(ctx => 
            words.includes(ctx.toLowerCase())
          );
          if (!hasContext) return;
        }

        // Check exclusions
        if (keyword.exclusions && keyword.exclusions.length > 0) {
          const hasExclusion = keyword.exclusions.some(exc => 
            words.includes(exc.toLowerCase())
          );
          if (hasExclusion) return;
        }

        results.push({
          type: 'keyword',
          value: keyword.word,
          confidence: keyword.weight,
          category: keyword.category,
          severity: keyword.severity,
        });
      }
    });

    return results;
  }

  // Analyze patterns in content
  private analyzePatterns(content: string): Array<{
    type: 'pattern';
    value: string;
    confidence: number;
    category: CrisisKeyword['category'];
    severity: CrisisKeyword['severity'];
  }> {
    const results: any[] = [];

    this.patterns.forEach(pattern => {
      const matches = content.match(pattern.pattern);
      
      if (matches && matches.length >= pattern.minMatches) {
        results.push({
          type: 'pattern',
          value: pattern.name,
          confidence: pattern.weight * Math.min(matches.length / pattern.minMatches, 1),
          category: pattern.category,
          severity: pattern.severity,
        });
      }
    });

    return results;
  }

  // Analyze with ML model
  private async analyzeWithML(content: string): Promise<Array<{
    type: 'ml_model';
    value: string;
    confidence: number;
    category: CrisisKeyword['category'];
    severity: CrisisKeyword['severity'];
  }>> {
    if (!this.mlModel || !this.config.mlModel) return [];

    try {
      const prediction = this.mlModel.predict(content);
      
      if (prediction.confidence < this.config.mlModel.threshold) return [];

      return prediction.categories.map((category: string) => ({
        type: 'ml_model',
        value: 'ML Classification',
        confidence: prediction.confidence,
        category: category as CrisisKeyword['category'],
        severity: prediction.confidence > 0.8 ? 'critical' : 
                 prediction.confidence > 0.6 ? 'high' : 'medium',
      }));
    } catch (error) {
      console.error('ML analysis failed:', error);
      return [];
    }
  }

  // Calculate overall confidence score
  private calculateConfidence(triggers: any[], data: any): number {
    if (triggers.length === 0) return 0;

    // Weight by severity
    const severityWeights = { low: 0.25, medium: 0.5, high: 0.75, critical: 1.0 };
    
    let totalWeight = 0;
    let weightedSum = 0;

    triggers.forEach(trigger => {
      const severityWeight = severityWeights[trigger.severity];
      const weight = trigger.confidence * severityWeight;
      totalWeight += severityWeight;
      weightedSum += weight;
    });

    return totalWeight > 0 ? Math.min(weightedSum / totalWeight, 1.0) : 0;
  }

  // Get context factors for analysis
  private async getContextFactors(userId: string, conversationId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/crisis/context`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, conversationId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get context: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get context factors:', error);
      
      // Return default context
      const now = new Date();
      return {
        timeOfDay: now.getHours(),
        dayOfWeek: now.getDay(),
        recentActivity: 'normal',
        previousAlerts: 0,
        userHistory: {
          hasHistory: false,
          frequency: 0,
        },
      };
    }
  }

  // Adjust confidence based on context
  private adjustConfidenceForContext(confidence: number, contextFactors: any): number {
    let adjusted = confidence;

    // Time-based adjustments (higher risk during late night/early morning)
    if (contextFactors.timeOfDay >= 22 || contextFactors.timeOfDay <= 6) {
      adjusted *= 1.2;
    }

    // User history adjustments
    if (contextFactors.userHistory.hasHistory) {
      adjusted *= 1.3;
    }

    // Recent activity adjustments
    if (contextFactors.recentActivity === 'low') {
      adjusted *= 1.1;
    }

    // Previous alerts adjustment
    if (contextFactors.previousAlerts > 0) {
      adjusted *= 1.15;
    }

    return Math.min(adjusted, 1.0);
  }

  // Determine risk level
  private determineRiskLevel(confidence: number, triggers: any[]): CrisisDetectionResult['riskLevel'] {
    const hasCriticalTriggers = triggers.some(t => t.severity === 'critical');
    const hasHighTriggers = triggers.some(t => t.severity === 'high');

    if (confidence >= 0.9 || hasCriticalTriggers) return 'critical';
    if (confidence >= 0.7 || hasHighTriggers) return 'high';
    if (confidence >= 0.5) return 'medium';
    return 'low';
  }

  // Determine escalation level
  private determineEscalationLevel(
    riskLevel: CrisisDetectionResult['riskLevel'], 
    contextFactors: any
  ): CrisisDetectionResult['escalationLevel'] {
    if (riskLevel === 'critical') {
      return contextFactors.userHistory.hasHistory ? 'crisis_team' : 'emergency';
    }
    if (riskLevel === 'high') return 'emergency';
    if (riskLevel === 'medium') return 'therapist';
    return 'none';
  }

  // Generate recommendations
  private generateRecommendations(
    riskLevel: CrisisDetectionResult['riskLevel'],
    triggers: any[],
    contextFactors: any
  ): string[] {
    const recommendations: string[] = [];

    if (riskLevel === 'critical') {
      recommendations.push('Immediate intervention required');
      recommendations.push('Contact emergency services if imminent danger');
      recommendations.push('Ensure user safety and continuous monitoring');
    }

    if (riskLevel === 'high') {
      recommendations.push('Urgent therapeutic intervention needed');
      recommendations.push('Contact assigned therapist immediately');
      recommendations.push('Consider safety planning session');
    }

    if (triggers.some(t => t.category === 'suicide')) {
      recommendations.push('Conduct suicide risk assessment');
      recommendations.push('Implement suicide prevention protocol');
    }

    if (contextFactors.userHistory.hasHistory) {
      recommendations.push('Review previous intervention strategies');
      recommendations.push('Consider escalating care level');
    }

    return recommendations;
  }

  // Sanitize content for logging (remove PII)
  private sanitizeContent(content: string): string {
    // Remove potential PII patterns
    return content
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]') // SSN
      .replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[PHONE]') // Phone
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]') // Email
      .replace(/\b\d{1,5}\s+\w+\s+(Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd)\b/gi, '[ADDRESS]'); // Address
  }

  // Log detection result
  private async logDetection(result: CrisisDetectionResult): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/api/crisis/detections`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      });
    } catch (error) {
      console.error('Failed to log crisis detection:', error);
    }
  }

  // Batch processing for performance
  private startBatchProcessor(): void {
    setInterval(() => {
      if (this.analysisQueue.length > 0 && !this.processingBatch) {
        this.processBatch();
      }
    }, 5000); // Process every 5 seconds
  }

  private async processBatch(): Promise<void> {
    if (this.processingBatch || this.analysisQueue.length === 0) return;

    this.processingBatch = true;
    const batch = this.analysisQueue.splice(0, this.config.mlModel?.batchSize || 10);

    try {
      const results = await Promise.all(
        batch.map(item => this.analyzeMessage(item))
      );

      results.forEach(result => {
        if (result) {
          this.emit('crisis_detected', result);
        }
      });
    } catch (error) {
      console.error('Batch processing failed:', error);
    } finally {
      this.processingBatch = false;
    }
  }

  // Queue message for batch analysis
  public queueForAnalysis(data: {
    messageId: string;
    content: string;
    userId: string;
    conversationId: string;
  }): void {
    if (this.config.batchAnalysis) {
      this.analysisQueue.push(data);
    }
  }

  // Get detection history
  public async getDetectionHistory(filters?: {
    userId?: string;
    conversationId?: string;
    riskLevel?: CrisisDetectionResult['riskLevel'];
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
  }): Promise<CrisisDetectionResult[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.userId) params.append('userId', filters.userId);
      if (filters?.conversationId) params.append('conversationId', filters.conversationId);
      if (filters?.riskLevel) params.append('riskLevel', filters.riskLevel);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom.toISOString());
      if (filters?.dateTo) params.append('dateTo', filters.dateTo.toISOString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`${this.baseUrl}/api/crisis/detections?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get detection history: ${response.status}`);
      }

      const result = await response.json();
      return result.detections;
    } catch (error) {
      console.error('Failed to get detection history:', error);
      throw error;
    }
  }

  // Update detection configuration
  public async updateConfig(newConfig: Partial<CrisisDetectionConfig>): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/crisis/config`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfig),
      });

      if (!response.ok) {
        throw new Error(`Failed to update config: ${response.status}`);
      }

      this.config = { ...this.config, ...newConfig };
      this.emit('config_updated', this.config);
    } catch (error) {
      console.error('Failed to update crisis detection config:', error);
      throw error;
    }
  }

  // Event system
  public on(event: string, callback: Function): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
    
    return () => {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  public destroy(): void {
    this.eventListeners.clear();
    this.analysisQueue = [];
    this.processingBatch = false;
  }
}