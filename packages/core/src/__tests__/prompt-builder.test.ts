import { describe, it, expect } from 'vitest';
import { PromptEngineer } from '../index';

describe('PromptEngineer', () => {
  it('detects Turkish language from task description', () => {
    expect(PromptEngineer.detectLanguage('Discord üzerinden gelen soruları cevapla')).toBe('tr');
    expect(PromptEngineer.detectLanguage('Yeni bir üye katılınca hoş geldin mesajı gönder')).toBe('tr');
    expect(PromptEngineer.detectLanguage('API webhook dinle ve veritabanına kaydet')).toBe('tr');
  });

  it('detects English language from task description', () => {
    expect(PromptEngineer.detectLanguage('Monitor server uptime and notify admin on 500 errors')).toBe('en');
  });

  it('generates rich Turkish system prompt with tools', () => {
    const prompt = PromptEngineer.generateSystemPrompt({
      taskId: 'test_task_1',
      taskDescription: 'Destek talebi açıldığında kullanıcıya yardımcı ol',
      availableTools: [
        {
          name: 'reply_ticket',
          description: 'Kullanıcının biletine cevap yaz',
          parameters: {
            type: 'object',
            properties: {
              ticketId: { type: 'string', description: 'Bilet ID' },
              message: { type: 'string', description: 'Cevap metni' },
            },
          },
        },
      ],
      totalActionsExecuted: 5,
    });

    expect(prompt).toContain('VyBot Otonom Sistem Ajanı');
    expect(prompt).toContain('Destek talebi açıldığında kullanıcıya yardımcı ol');
    expect(prompt).toContain('reply_ticket');
    expect(prompt).toContain('Şimdiye kadar tamamlanan işlem sayısı: 5');
  });

  it('injects previous error mitigation rules when errors exist', () => {
    const prompt = PromptEngineer.generateSystemPrompt({
      taskId: 'test_task_error',
      taskDescription: 'Webhook dinle ve kaydet',
      targetLanguage: 'tr',
      previousErrors: ['Rate limit aşıldı', 'Parametre eksik'],
    });

    expect(prompt).toContain('ÖNCEKİ ÇALIŞMA HATALARI VE ÖZ-DÜZELTME');
    expect(prompt).toContain('Rate limit aşıldı');
  });

  it('injects English error mitigation rules for English tasks', () => {
    const prompt = PromptEngineer.generateSystemPrompt({
      taskId: 'test_task_error_en',
      taskDescription: 'Listen to webhook and record to db',
      targetLanguage: 'en',
      previousErrors: ['Timeout error occurred'],
    });

    expect(prompt).toContain('PREVIOUS ERRORS & SELF-HEALING DIRECTIVE');
    expect(prompt).toContain('Timeout error occurred');
  });
});
