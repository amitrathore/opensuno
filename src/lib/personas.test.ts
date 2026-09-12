import { describe, expect, test } from 'bun:test';
import {
  normalizePersonaDetail,
  normalizePersonaId,
  normalizePersonaList,
  normalizePersonaPage,
} from './personas';

describe('Persona responses', () => {
  test('normalizes array and object list envelopes without dropping metadata', () => {
    const persona = { id: 'persona-1', name: 'Night Voice', custom: 'kept' };
    expect(normalizePersonaList([persona])).toEqual({ personas: [persona] });
    expect(normalizePersonaList({ personas: [persona], has_more: false })).toEqual({
      personas: [persona],
      has_more: false,
    });
    expect(normalizePersonaList({ results: [persona], page: 0 })).toEqual({
      results: [persona],
      personas: [persona],
      page: 0,
    });
    expect(normalizePersonaList({
      result: { '': { total_hits: 1, result: [persona], page_size: 20 } },
    })).toEqual({
      total_hits: 1,
      result: [persona],
      page_size: 20,
      personas: [persona],
    });
  });

  test('accepts detail responses and rejects malformed envelopes', () => {
    const detail = {
      persona: { id: 'persona-1', name: 'Night Voice' },
      total_results: 2,
    };
    expect(normalizePersonaDetail(detail)).toEqual(detail);
    expect(() => normalizePersonaDetail({ persona: { id: 'persona-1' } })).toThrow();
    expect(() => normalizePersonaList({ personas: [{ name: 'missing id' }] })).toThrow();
  });

  test('validates Persona IDs and page numbers', () => {
    expect(normalizePersonaId()).toBeNull();
    expect(normalizePersonaId(' persona-1 ')).toBe('persona-1');
    expect(() => normalizePersonaId('   ')).toThrow('persona_id must not be blank');
    expect(normalizePersonaPage()).toBe(0);
    expect(normalizePersonaPage(2)).toBe(2);
    expect(() => normalizePersonaPage(-1)).toThrow();
    expect(() => normalizePersonaPage(1.5)).toThrow();
  });
});
