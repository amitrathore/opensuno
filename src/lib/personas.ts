export interface PersonaInfo {
  id: string;
  name: string;
  description?: string | null;
  image_s3_id?: string | null;
  root_clip_id?: string | null;
  clip?: unknown;
  user_display_name?: string | null;
  user_handle?: string | null;
  user_image_url?: string | null;
  persona_clips?: unknown[];
  is_suno_persona?: boolean;
  is_trashed?: boolean;
  is_owned?: boolean;
  is_public?: boolean;
  is_public_approved?: boolean;
  is_loved?: boolean;
  upvote_count?: number;
  clip_count?: number;
  [key: string]: unknown;
}

export interface PersonaListResponse {
  personas: PersonaInfo[];
  [key: string]: unknown;
}

export interface PersonaDetailResponse {
  persona: PersonaInfo;
  total_results?: number;
  current_page?: number;
  is_following?: boolean;
  [key: string]: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPersona(value: unknown): value is PersonaInfo {
  return isRecord(value) && typeof value.id === 'string' && typeof value.name === 'string';
}

/** Normalize known Suno list envelopes while retaining every upstream field. */
export function normalizePersonaList(data: unknown): PersonaListResponse {
  if (Array.isArray(data)) {
    if (!data.every(isPersona)) throw new Error('Invalid Persona list response');
    return { personas: data };
  }

  if (!isRecord(data)) throw new Error('Invalid Persona list response');

  // Current search API: { result: { "<term>": { result: Persona[], ... } } }
  if (isRecord(data.result)) {
    const searchResult = Object.values(data.result).find(
      (value) => isRecord(value) && Array.isArray(value.result)
    );
    if (isRecord(searchResult) && Array.isArray(searchResult.result)) {
      if (!searchResult.result.every(isPersona)) {
        throw new Error('Invalid Persona list response');
      }
      return { ...searchResult, personas: searchResult.result } as PersonaListResponse;
    }
  }

  const candidates = [data.personas, data.results, data.items];
  const personas = candidates.find(Array.isArray);
  if (!personas || !personas.every(isPersona)) {
    throw new Error('Suno Persona list response did not contain a valid personas array');
  }

  return { ...data, personas } as PersonaListResponse;
}

/** Validate a Persona detail envelope while retaining every upstream field. */
export function normalizePersonaDetail(data: unknown): PersonaDetailResponse {
  if (!isRecord(data) || !isPersona(data.persona)) {
    throw new Error('Invalid Suno Persona detail response');
  }
  return data as unknown as PersonaDetailResponse;
}

export function normalizePersonaId(personaId?: string | null): string | null {
  if (personaId == null) return null;
  const normalized = personaId.trim();
  if (!normalized) throw new Error('persona_id must not be blank');
  return normalized;
}

export function normalizePersonaPage(page: number = 0): number {
  if (!Number.isInteger(page) || page < 0) {
    throw new Error('page must be a non-negative integer');
  }
  return page;
}
