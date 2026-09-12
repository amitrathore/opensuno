import { describe, expect, test } from 'bun:test';
import {
  DEFAULT_MODEL,
  FALLBACK_DEFAULT_MODEL,
  SUNO_MODELS,
  getDefaultModel,
  resolveModel,
} from './models';

describe('Suno model selection', () => {
  test('includes the current V6 model family', () => {
    expect(SUNO_MODELS.V6).toBe('chirp-hawk');
    expect(SUNO_MODELS.V6_WILD).toBe('chirp-hawk-wild');
    expect(SUNO_MODELS.V6_MINI).toBe('chirp-goose');
  });

  test('defaults to V6 Standard', () => {
    expect(FALLBACK_DEFAULT_MODEL).toBe(SUNO_MODELS.V6);
    expect(getDefaultModel({ SUNO_DEFAULT_MODEL: undefined })).toBe(SUNO_MODELS.V6);
    expect(DEFAULT_MODEL).toBe(getDefaultModel());
  });

  test('allows V5 rollback through the environment', () => {
    expect(getDefaultModel({ SUNO_DEFAULT_MODEL: SUNO_MODELS.V5 })).toBe(SUNO_MODELS.V5);
  });

  test('prefers a per-request model over the configured default', () => {
    expect(
      resolveModel(SUNO_MODELS.V6_WILD, { SUNO_DEFAULT_MODEL: SUNO_MODELS.V5 })
    ).toBe(SUNO_MODELS.V6_WILD);
  });

  test('accepts future model IDs and ignores blank overrides', () => {
    expect(resolveModel('chirp-future', { SUNO_DEFAULT_MODEL: SUNO_MODELS.V5 })).toBe(
      'chirp-future'
    );
    expect(resolveModel('  ', { SUNO_DEFAULT_MODEL: SUNO_MODELS.V5 })).toBe(SUNO_MODELS.V5);
  });
});
