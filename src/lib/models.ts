export const SUNO_MODELS = {
  V3_5: 'chirp-v3-5',
  V4: 'chirp-v4',
  V4_5_PLUS: 'chirp-bluejay',
  V4_5_PRO: 'chirp-auk',
  V5: 'chirp-crow',
  V6: 'chirp-hawk',
  V6_WILD: 'chirp-hawk-wild',
  V6_MINI: 'chirp-goose',
} as const;

export const FALLBACK_DEFAULT_MODEL = SUNO_MODELS.V6;

type ModelEnvironment = {
  SUNO_DEFAULT_MODEL?: string;
};

export function getDefaultModel(
  env: ModelEnvironment = process.env
): string {
  return env.SUNO_DEFAULT_MODEL?.trim() || FALLBACK_DEFAULT_MODEL;
}

export function resolveModel(
  requestedModel?: string,
  env: ModelEnvironment = process.env
): string {
  return requestedModel?.trim() || getDefaultModel(env);
}

export const DEFAULT_MODEL = getDefaultModel();
