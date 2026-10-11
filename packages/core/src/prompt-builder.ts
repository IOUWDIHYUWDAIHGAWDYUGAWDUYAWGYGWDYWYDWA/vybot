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
  domainContext?: 'discord' | 'telegram' | 'slack' | 'github' | 'webhook' | 'mcp' | 'custom';
}

export interface TaskDecomposition {
  objective: string;
  triggerConditions: string[];
  executionSteps: string[];
  fallbackStrategy: string;
  requiredCapabilities: string[];
}

/**
 * Autonomous Prompt Engineer & Prompt Synthesizer for VyBot.
 * Crafts mathematically optimized, resilient system prompts designed specifically for
 * high-reliability tool execution on free-tier models (Groq, Cerebras, Gemini, DeepSeek, Mistral).
 */
export class PromptEngineer {
  /**
   * Automatically detect language of user task description
   */
  static detectLanguage(text: string): 'tr' | 'en' {
    const turkishChars = /[çğıöşüÇĞİÖŞÜ]/;
    const turkishWords = /\b(ve|bir|için|ile|bu|gelen|yap|gönder|kontrol|et|hata|kullanıcı|mesaj|dinle|aç|kapat|cevapla|yaz|bağlan|çalıştır|tetikle|görev)\b/i;
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
      ? 'VyBot Kurumsal Otonom Sistem Ajanı'
      : 'VyBot Enterprise Autonomous Agent');

    const toolsSection = options.availableTools && options.availableTools.length > 0
      ? this.formatToolsSection(options.availableTools, isTr)
      : (isTr ? 'Kullanılabilir harici araç tanımlanmadı.' : 'No external tools available.');

    const errorSection = options.previousErrors && options.previousErrors.length > 0
      ? this.formatErrorSection(options.previousErrors, isTr)
      : '';

    const domainDirectives = this.getDomainDirectives(options.domainContext, isTr);

    if (isTr) {
      return [
        `# ROL VE MİSYON`,
        `Sen ${persona} olarak görev yapıyorsun. VyBot 7/24 otonom olay işleme motorunun beynisin.`,
        `Amacın: Verilen görevi harici insan müdahalesi gerekmeksizin, sıfır halüsinasyon ve yüksek hatasızlıkla yürütmektir.`,
        ``,
        `# TEMEL HEDEF TANIMI`,
        `"${options.taskDescription}"`,
        ``,
        `# ÇALIŞMA PROTOKOLÜ (ReAct Döngüsü: Gözlemle -> Akıl Yürüt -> Eyleme Geç -> Doğrula)`,
        `1. GÖZLEMLE: Gelen olayı (event payload), kaynak platformu ve veri bağlamını dikkatle ayrıştır.`,
        `2. AKIL YÜRÜT: Görevin hedefine ulaşmak için bir işlem yapılması gerekiyor mu?`,
        `   - EYLEM GEREKİYORSA: Tanımlı araçlardan (tool) en uygun olanını şemaya tam uyumlu argümanlarla çağır.`,
        `   - EYLEM GEREKMİYORSA: Neden işlem yapılmadığını özetleyen net, kısa ve rasyonel bir çıktı üret.`,
        `3. DOĞRULUK VE GÜVENLİK: Eksik kimlikleri (channelId, userId, target) asla uydurma. Yalnızca doğrulanmış verileri kullan.`,
        `4. ÖZ-DÜZELTME (Self-Healing): Bir araç hatayla dönerse, parametreleri analiz et ve hatayı gidererek yeniden dene.`,
        ``,
        domainDirectives,
        ``,
        `# KULLANILABİLİR ARAÇLAR VE ARAYÜZLER`,
        toolsSection,
        errorSection,
        `# GÜNCEL ÇALIŞMA BAĞLAMI`,
        `- Görev ID: ${options.taskId}`,
        `- Tamamlanan Eylem Sayısı: ${options.totalActionsExecuted ?? 0}`,
        `- Çalışma Modu: ${options.executionMode ?? 'autonomous'}`,
        `- Donanım Seviyesi: AES-256-GCM HSM Enclave Korumalı`,
      ].filter(Boolean).join('\n');
    }

    return [
      `# ROLE & IDENTITY`,
      `You are the ${persona}, the intelligent core of the VyBot 24/7 autonomous event-processing engine.`,
      `Your mission: Execute the assigned task with high precision, self-healing resilience, zero hallucination, and uninterrupted autonomy.`,
      ``,
      `# PRIMARY OBJECTIVE`,
      `"${options.taskDescription}"`,
      ``,
      `# OPERATIONAL PROTOCOL (ReAct: Observe -> Reason -> Act -> Verify)`,
      `1. OBSERVE: Thoroughly parse incoming event payloads, origin channel, and payload metadata.`,
      `2. REASON: Decide whether an action is mandatory to satisfy the objective.`,
      `   - ACTION REQUIRED: Select and invoke the appropriate tool with exact schema-compliant arguments.`,
      `   - NO ACTION NEEDED: Output a concise rationale explaining why no action was triggered.`,
      `3. PRECISION & INTEGRITY: Never hallucinate missing identifiers. Rely strictly on verified event data.`,
      `4. SELF-HEALING: If an executed tool returns an error, analyze the error signature and self-heal automatically.`,
      ``,
      domainDirectives,
      ``,
      `# AVAILABLE TOOLS & CAPABILITIES`,
      toolsSection,
      errorSection,
      `# EXECUTION CONTEXT`,
      `- Task ID: ${options.taskId}`,
      `- Total Actions Executed: ${options.totalActionsExecuted ?? 0}`,
      `- Execution Mode: ${options.executionMode ?? 'autonomous'}`,
      `- Enclave Standard: AES-256-GCM HSM Isolated`,
    ].filter(Boolean).join('\n');
  }

  /**
   * Decompose any high-level user goal into an autonomous execution blueprint.
   */
  static decomposeGoal(goal: string): TaskDecomposition {
    const isTr = this.detectLanguage(goal) === 'tr';

    return {
      objective: goal,
      triggerConditions: isTr
        ? ['Gelen yeni mesaj veya komut algılandığında', 'Harici webhook tetiklendiğinde', 'Periyodik zamanlayıcı (cron) ulaştığında']
        : ['On incoming message or command dispatch', 'On verified external webhook payload', 'On scheduled interval tick'],
      executionSteps: isTr
        ? [
            '1. Olay yükünü ve yetkilendirmeyi doğrula',
            '2. Kullanıcı niyetini ve gerekli bağlamı çözümle',
            '3. Hedef platform aracını doğru parametrelerle tetikle',
            '4. İşlem sonucunu kaydet ve geri bildirim sağla',
          ]
        : [
            '1. Authenticate and sanitize event payload',
            '2. Infer user intent and contextual state',
            '3. Dispatch targeted gateway action with validated schema',
            '4. Verify action outcome and record telemetry log',
          ],
      fallbackStrategy: isTr
        ? 'Araç çağrısı başarısız olursa, parametreleri temizle ve alternatif uç noktaya yönlen. Çözülemezse yöneticiye sessizce raporla.'
        : 'On tool failure, sanitize arguments and retry via fallback endpoint. If persistent, escalate to administrative alert.',
      requiredCapabilities: ['event_listen', 'state_read', 'action_dispatch', 'log_telemetry'],
    };
  }

  /**
   * Synthesize a meta-prompt for inspecting unknown APIs and extracting OpenAPI tools.
   */
  static synthesizeApiUnderstandingPrompt(rawPayload: string): string {
    return [
      `# GÖREV: BİLİNMEYEN API YAPISINI OTONOM ÇÖZÜMLE VE ARAÇ ÜRET`,
      `Aşağıda harici bir servisten alınan ham yanıt veya şema bulunmaktadır:`,
      `\`\`\`json`,
      rawPayload.slice(0, 4000),
      `\`\`\``,
      `TALİMAT:`,
      `1. Bu API'nin amacını, anahtar uç noktalarını (endpoints) ve HTTP metotlarını belirle.`,
      `2. Yapay zekanın doğrudan çağırabileceği JSON Schema uyumlu Tool tanımları üret.`,
      `3. Her tool için: 'name', 'description', ve 'parameters' alanlarını eksiksiz doldur.`,
    ].join('\n');
  }

  private static getDomainDirectives(domain?: string, isTr?: boolean): string {
    if (!domain) return '';

    if (domain === 'discord') {
      return isTr
        ? `# PLATFORM DİREKTİFİ (DISCORD)\n- Sunucu kurallarına tam uyum sağla.\n- Bot izinlerini kontrol et (SEND_MESSAGES, EMBED_LINKS).\n- Aşırı mesaj göndererek rate-limit yememek için gereksiz mesajları birleştir.`
        : `# PLATFORM DIRECTIVE (DISCORD)\n- Comply strictly with guild permission hierarchy.\n- Aggregate responses to prevent gateway rate-limiting.\n- Use structured embeds for clarity where supported.`;
    }

    if (domain === 'telegram') {
      return isTr
        ? `# PLATFORM DİREKTİFİ (TELEGRAM)\n- MarkdownV2 veya HTML etiketlerini doğru kapat.\n- Callback butonlarına hızlı yanıt ver (answerCallbackQuery).`
        : `# PLATFORM DIRECTIVE (TELEGRAM)\n- Properly escape MarkdownV2/HTML entities.\n- Acknowledge callback queries promptly.`;
    }

    if (domain === 'webhook') {
      return isTr
        ? `# PLATFORM DİREKTİFİ (WEBHOOK)\n- Gelen HMAC imzasını doğrulamadan işlem yapma.\n- Idempotency anahtarlarını kontrol ederek aynı işlemi iki kez yürütme.`
        : `# PLATFORM DIRECTIVE (WEBHOOK)\n- Validate HMAC signatures strictly.\n- Respect idempotency tokens to avoid duplicate state mutations.`;
    }

    return '';
  }

  private static formatToolsSection(tools: AITool[], isTr: boolean): string {
    return tools.map((t) => {
      const paramList = Object.entries(t.parameters?.properties || {})
        .map(([k, v]: [string, any]) => `  - ${k} (${v?.type || 'any'}): ${v?.description || ''}`)
        .join('\n');
      return `### ${t.name}\n${t.description}\nParametreler:\n${paramList || (isTr ? '  (Parametre yok)' : '  (No parameters)')}`;
    }).join('\n\n');
  }

  private static formatErrorSection(errors: string[], isTr: boolean): string {
    if (isTr) {
      return [
        `\n# DİKKAT: ÖNCEKİ ÇALIŞMA HATALARI VE ÖZ-DÜZELTME DİREKTİFİ`,
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
