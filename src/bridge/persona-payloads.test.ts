import { describe, expect, test } from 'bun:test';
import { buildGeneratePayload } from './api-handler';
import { buildPayload } from './mcp-bridge';

describe('Persona generation payloads', () => {
  test('REST bridge threads a supplied Persona ID into custom generation', () => {
    const payload = buildGeneratePayload({
      prompt: '[Verse]\nHello',
      tags: 'art pop',
      title: 'Test',
      persona_id: ' persona-1 ',
    }, true);

    expect(payload.persona_id).toBe('persona-1');
    expect(payload.prompt).toBe('[Verse]\nHello');
    expect(payload.tags).toBe('art pop');
  });

  test('MCP bridge threads a supplied Persona ID into custom generation', () => {
    const payload = buildPayload({
      prompt: '[Verse]\nHello',
      tags: 'art pop',
      title: 'Test',
      persona_id: 'persona-2',
    }, true);

    expect(payload.persona_id).toBe('persona-2');
  });

  test('omitted Persona remains null for backward compatibility', () => {
    expect(buildGeneratePayload({ prompt: 'test' }, false).persona_id).toBeNull();
    expect(buildPayload({ prompt: 'test' }, false).persona_id).toBeNull();
  });
});
