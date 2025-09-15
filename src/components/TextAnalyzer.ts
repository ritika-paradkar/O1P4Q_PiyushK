import type { AnalysisResult } from '../App';

export class TextAnalyzer {
  private argumentativeMarkers = [
    'therefore', 'thus', 'hence', 'consequently', 'as a result',
    'because', 'since', 'due to', 'given that', 'as',
    'however', 'but', 'yet', 'nevertheless', 'although',
    'furthermore', 'moreover', 'additionally', 'in addition',
    'for example', 'for instance', 'specifically', 'namely',
    'in conclusion', 'to summarize', 'in summary', 'finally',
    'evidently', 'clearly', 'obviously', 'undoubtedly',
    'on the other hand', 'conversely', 'in contrast', 'whereas'
  ];

  private evidenceMarkers = [
    'according to', 'research shows', 'studies indicate', 'data suggests',
    'statistics reveal', 'evidence suggests', 'experts believe',
    'as reported by', 'documented in', 'cited in', 'referenced in',
    'survey results', 'findings indicate', 'analysis reveals'
  ];

  private claimMarkers = [
    'I believe', 'I argue', 'I contend', 'I propose', 'I suggest',
    'it is clear that', 'it is evident that', 'it is obvious that',
    'the fact is', 'the truth is', 'undeniably', 'certainly',
    'without doubt', 'unquestionably', 'definitely'
  ];

  async analyze(text: string): Promise<AnalysisResult> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const sentences = this.tokenizeSentences(text);
    const analyzedArguments = this.identifyArguments(sentences);
    const claims = this.extractClaims(sentences);
    const mainThesis = this.identifyMainThesis(sentences, analyzedArguments);
    const statistics = this.calculateStatistics(sentences, analyzedArguments);

    return {
      id: `analysis_${Date.now()}`,
      text,
      timestamp: new Date(),
      mainThesis,
      arguments: analyzedArguments,
      claims,
      statistics
    };
  }

  private tokenizeSentences(text: string): string[] {
    // Enhanced sentence tokenization
    const sentences = text
      .replace(/([.!?])\s+/g, '$1|SPLIT|')
      .split('|SPLIT|')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    return sentences;
  }

  private identifyArguments(sentences: string[]): AnalysisResult['arguments'] {
    const analyzedArguments: AnalysisResult['arguments'] = [];
    let currentPosition = 0;

    sentences.forEach((sentence, index) => {
      const lowerSentence = sentence.toLowerCase();
      let confidence = 0;
      let type: 'premise' | 'conclusion' | 'evidence' = 'premise';

      // Check for argumentative markers
      const hasArgumentMarkers = this.argumentativeMarkers.some(marker => 
        lowerSentence.includes(marker)
      );
      if (hasArgumentMarkers) confidence += 30;

      // Check for evidence markers
      const hasEvidenceMarkers = this.evidenceMarkers.some(marker => 
        lowerSentence.includes(marker)
      );
      if (hasEvidenceMarkers) {
        confidence += 40;
        type = 'evidence';
      }

      // Check for conclusion indicators
      const conclusionWords = ['therefore', 'thus', 'hence', 'consequently', 'in conclusion'];
      const hasConclusion = conclusionWords.some(word => lowerSentence.includes(word));
      if (hasConclusion) {
        confidence += 35;
        type = 'conclusion';
      }

      // Check sentence structure and length
      if (sentence.length > 50 && sentence.length < 200) confidence += 15;
      if (sentence.includes(',') || sentence.includes(';')) confidence += 10;

      // Add randomness to simulate real NLP confidence
      confidence += Math.random() * 20;
      confidence = Math.min(confidence, 95);

      if (confidence > 40) {
        analyzedArguments.push({
          id: `arg_${index}`,
          type,
          text: sentence,
          confidence: Math.round(confidence),
          position: { start: currentPosition, end: currentPosition + sentence.length },
          sources: this.extractSources(sentence)
        });
      }

      currentPosition += sentence.length + 1;
    });

    return analyzedArguments;
  }

  private extractClaims(sentences: string[]): AnalysisResult['claims'] {
    const claims: AnalysisResult['claims'] = [];

    sentences.forEach((sentence, index) => {
      const lowerSentence = sentence.toLowerCase();
      let confidence = 0;

      // Check for claim markers
      const hasClaimMarkers = this.claimMarkers.some(marker => 
        lowerSentence.includes(marker)
      );
      if (hasClaimMarkers) confidence += 40;

      // Check for strong language
      const strongWords = ['must', 'should', 'will', 'always', 'never', 'all', 'every'];
      const hasStrongLanguage = strongWords.some(word => lowerSentence.includes(word));
      if (hasStrongLanguage) confidence += 25;

      // Check for comparative language
      const comparatives = ['better', 'worse', 'more', 'less', 'superior', 'inferior'];
      const hasComparatives = comparatives.some(word => lowerSentence.includes(word));
      if (hasComparatives) confidence += 20;

      confidence += Math.random() * 15;

      if (confidence > 35) {
        claims.push({
          id: `claim_${index}`,
          text: sentence,
          confidence: Math.round(confidence),
          evidence: this.findSupportingEvidence(sentence, sentences),
          contradictions: this.findContradictions(sentence, sentences)
        });
      }
    });

    return claims;
  }

  private identifyMainThesis(sentences: string[], analyzedArguments: AnalysisResult['arguments']): string {
    // Find the most confident conclusion or the first strong argumentative sentence
    const conclusions = analyzedArguments.filter(arg => arg.type === 'conclusion');
    if (conclusions.length > 0) {
      return conclusions.sort((a, b) => b.confidence - a.confidence)[0].text;
    }

    const strongArguments = analyzedArguments.filter(arg => arg.confidence > 75);
    if (strongArguments.length > 0) {
      return strongArguments[0].text;
    }

    // Fallback to first sentence if no strong arguments
    return sentences[0] || 'No clear thesis identified';
  }

  private extractSources(sentence: string): string[] {
    const sources: string[] = [];
    
    // Simple source extraction patterns
    const urlRegex = /https?:\/\/[^\s]+/g;
    const urls = sentence.match(urlRegex);
    if (urls) sources.push(...urls);

    // Check for common source indicators
    if (sentence.toLowerCase().includes('according to')) {
      sources.push('External source mentioned');
    }
    if (sentence.toLowerCase().includes('study') || sentence.toLowerCase().includes('research')) {
      sources.push('Research study referenced');
    }

    return sources;
  }

  private findSupportingEvidence(claim: string, sentences: string[]): string[] {
    const evidence: string[] = [];
    const claimWords = claim.toLowerCase().split(' ');

    sentences.forEach(sentence => {
      if (sentence === claim) return;

      const sentenceWords = sentence.toLowerCase().split(' ');
      const overlap = claimWords.filter(word => sentenceWords.includes(word)).length;
      const similarity = overlap / Math.max(claimWords.length, sentenceWords.length);

      if (similarity > 0.3 && this.hasEvidenceMarkers(sentence)) {
        evidence.push(sentence);
      }
    });

    return evidence.slice(0, 3); // Limit to 3 pieces of evidence
  }

  private findContradictions(claim: string, sentences: string[]): string[] {
    const contradictions: string[] = [];
    const negationWords = ['not', 'never', 'no', 'false', 'incorrect', 'wrong', 'however', 'but'];

    sentences.forEach(sentence => {
      if (sentence === claim) return;

      const hasNegation = negationWords.some(word => sentence.toLowerCase().includes(word));
      if (hasNegation) {
        const claimWords = claim.toLowerCase().split(' ');
        const sentenceWords = sentence.toLowerCase().split(' ');
        const overlap = claimWords.filter(word => sentenceWords.includes(word)).length;

        if (overlap > 2) {
          contradictions.push(sentence);
        }
      }
    });

    return contradictions.slice(0, 2); // Limit to 2 contradictions
  }

  private hasEvidenceMarkers(sentence: string): boolean {
    return this.evidenceMarkers.some(marker => 
      sentence.toLowerCase().includes(marker)
    );
  }

  private calculateStatistics(sentences: string[], analyzedArguments: AnalysisResult['arguments']): AnalysisResult['statistics'] {
    const totalSentences = sentences.length;
    const argumentativeSentences = analyzedArguments.length;
    const neutralSentences = totalSentences - argumentativeSentences;
    const averageConfidence = analyzedArguments.length > 0 
      ? analyzedArguments.reduce((sum, arg) => sum + arg.confidence, 0) / analyzedArguments.length
      : 0;

    return {
      totalSentences,
      argumentativeSentences,
      neutralSentences,
      averageConfidence
    };
  }
}