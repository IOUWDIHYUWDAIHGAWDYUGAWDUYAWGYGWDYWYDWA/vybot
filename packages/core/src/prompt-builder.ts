import type { AITool } from './types';

export interface PromptGenerationOptions {
  taskId: string;
  taskDescription: string;
  availableTools?: AITool[];
  targetLanguage?: 'tr' | 'en' | 'auto';
  persona?: string;
  executionMode?: 'autonomous' | 'supervised' | 'cron';
  previousErrors?: string[];
  totalActionsExecuted?: number;
}

/**
 * Autonomous Prompt Engineer & Prompt Synthesizer for VyBot.
 * Crafts optimized system prompts designed specifically for high-reliability tool execution
 * on free-tier models (Gemini Flash, Llama 3.3, Mistral, Cerebras).
 */
export class PromptEngineer {
  /**
   * Automatically detect language of user task description
   */
  static detectLanguage(text: string): 'tr' | 'en' {
    const turkishChars = /[çğıöşüÇĞİÖŞÜ]/;
    const turkishWords = /\b(ve|bir|için|ile|bu|gelen|yap|gönder|kontrol|et|hata|kullanıcı|mesaj|dinle|aç|kapat|cevapla|yaz|bağlan|çalıştır|tetikle)\b/i;
    if (turkishChars.test(text) || turkishWords.test(text)) {
      return 'tr';
    }
    return 'en';
  }

  /**
   * Synthesize a complete, enterprise-grade system prompt from a task description.
   */
  static generateSystemPrompt(options: PromptGenerationOptions): string {
    const lang = options.targetLanguage === 'auto' || !options.targetLanguage
      ? this.detectLanguage(options.taskDescription)
      : options.targetLanguage;

    const isTr = lang === 'tr';
    const persona = options.persona || (isTr
      ? 'VyBot Otonom Sistem Ajanı'
      : 'VyBot Autonomous Agent');

    const toolsSection = options.availableTools && options.availableTools.length > 0
      ? this.formatToolsSection(options.availableTools, isTr)
      : (isTr ? 'Kullanılabilir harici araç tanımlanmadı.' : 'No external tools available.');

    const errorSection = options.previousErrors && options.previousErrors.length > 0
      ? this.formatErrorSection(options.previousErrors, isTr)
      : '';

    if (isTr) {
      return [
        `# ROL VE KİMLİK`,
        `Sen ${persona} olarak görev yapıyorsun. VyBot 7/24 otonom olay işleme motorunun beynisin.`,
        `Amacın: Verilen görevi harici insan müdahalesi gerekmeksizin, yüksek hassasiyet ve hatasızlıkla yürütmektir.`,
        ``,
        `# TEMEL GÖREV TANIMI`,
        `"${options.taskDescription}"`,
        ``,
        `# ÇALIŞMA PROTOKOLÜ (ReAct: Düşün -> Eyleme Geç -> Doğrula)`,
        `1. ANALİZ: Gelen olayı (event) ve içeriğini dikkatle incele.`,
        `2. KARAR: Görevin amacına ulaşmak için bir işlem yapılması gerekiyor mu?`,
        `   - GEREKİYORSA: Uygun aracı (tool) doğru parametrelerle çağır.`,
        `   - GEREKMİYORSA: Neden işlem yapılmadığını özetleyen net ve kısa bir yanıt üret.`,
        `3. DOĞRULUK: Parametreleri asla varsayımlarla uydurma. Yalnızca gelen olaydaki doğrulanmış verileri kullan.`,
        `4. DİL: Kullanıcıyla iletişimde Türkçe, profesyonel, yapıcı ve çözüm odaklı bir dil kullan.`,
        ``,
        `# KULLANILABİLİR ARAÇLAR`,
        toolsSection,
        errorSection,
        `# GÜNCEL DURUM VE İSTATİSTİKLER`,
        `- Görev ID: ${options.taskId}`,
        `- Şimdiye kadar tamamlanan işlem sayısı: ${options.totalActionsExecuted ?? 0}`,
        `- Mod: ${options.executionMode ?? 'autonomous'}`,
      ].filter(Boolean).join('\n');
    }

    return [
      `# ROLE & IDENTITY`,
      `You are the ${persona}, the intelligent core of the VyBot 24/7 autonomous event-processing engine.`,
      `Your mission: Execute the assigned task with high precision, self-healing resilience, and zero unnecessary human intervention.`,
      ``,
      `# PRIMARY OBJECTIVE`,
      `"${options.taskDescription}"`,
      ``,
      `# OPERATIONAL PROTOCOL (ReAct: Observe -> Reason -> Act -> Verify)`,
      `1. OBSERVE: Thoroughly inspect the incoming event data and source context.`,
      `2. REASON: Decide whether an action is mandatory to satisfy the objective.`,
      `   - ACTION REQUIRED: Select and invoke the appropriate tool with exact schema-compliant arguments.`,
      `   - NO ACTION NEEDED: Output a concise rationale explaining why no action was triggered.`,
      `3. PRECISION: Never hallucinate missing identifiers or parameters. Use verified event data only.`,
      `4. COMMUNICATION: Be concise, actionable, and clear.`,
      ``,
      `# AVAILABLE TOOLS`,
      toolsSection,
      errorSection,
      `# EXECUTION CONTEXT`,
      `- Task ID: ${options.taskId}`,
      `- Total Actions Executed: ${options.totalActionsExecuted ?? 0}`,
      `- Execution Mode: ${options.executionMode ?? 'autonomous'}`,
    ].filter(Boolean).join('\n');
  }

  private static formatToolsSection(tools: AITool[], isTr: boolean): string {
    return tools.map((t) => {
      const paramList = Object.entries(t.parameters?.properties || {})
        .map(([k, v]: [string, any]) => `  - ${k} (${v?.type || 'any'}): ${v?.description || ''}`)
        .join('\n');
      return `### ${t.name}\n${t.description}\nParametreler:\n${paramList || '  (Parametre yok)'}`;
    }).join('\n\n');
  }

  private static formatErrorSection(errors: string[], isTr: boolean): string {
    if (isTr) {
      return [
        `\n# DİKKAT: ÖNCEKİ ÇALIŞMA HATALARI VE ÖZ-DÜZELTME`,
        `Son döngülerde aşağıdaki hatalar tespit edildi:`,
        ...errors.map((e) => `- ${e}`),
        `TALİMAT: Aynı hatayı tekrarlamamak için parametrelerini iki kez doğrula ve alternatif yöntemleri dene.\n`,
      ].join('\n');
    }
    return [
      `\n# ATTENTION: PREVIOUS ERRORS & SELF-HEALING DIRECTIVE`,
      `The following errors occurred in recent cycles:`,
      ...errors.map((e) => `- ${e}`),
      `DIRECTIVE: Do not repeat these errors. Validate all arguments and consider alternative tools if needed.\n`,
    ].join('\n');
  }
}
