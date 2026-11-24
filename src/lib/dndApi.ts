// Cliente da D&D 5e API (https://www.dnd5eapi.co) — conteúdo do SRD 5.1 (CC-BY-4.0), em inglês.
// Os textos importados passam pelo tradutor antes de ir para o app.

export const DND_API_BASE = 'https://www.dnd5eapi.co';
// Regras de 2014 (SRD 5.1). O caminho antigo /api/... redireciona para cá.
const DND_API_PATH = `${DND_API_BASE}/api/2014`;

export type ApiListItem = {
    index: string;
    name: string;
    url: string;
};

/** Item de habilidade na busca: classe (feature) ou raça (trait) */
export type AbilityListItem = ApiListItem & { source: 'feature' | 'trait' };

export type ImportedEntry = {
    apiIndex: string;
    name: string;
    description: string;
};

const fetchJson = async (path: string) => {
    const res = await fetch(`${DND_API_PATH}${path}`);
    if (!res.ok) throw new Error(`D&D API respondeu HTTP ${res.status} em ${path}`);
    return res.json();
};

// Traduz textos em inglês para PT-BR usando o endpoint público (não oficial) do Google Tradutor.
// Em caso de falha, devolve o texto original.
export const translateText = async (text: string): Promise<string> => {
    if (!text) return '';
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt-br&dt=t`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `q=${encodeURIComponent(text)}`,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return data[0].map((item: any) => item[0]).join('');
    } catch (error) {
        console.error('Erro ao traduzir:', error);
        return text;
    }
};

// ------------------------------------------------------------------ Magias

const spellListCache = new Map<number, ApiListItem[]>();

/** Lista de magias de um nível (0 = truques). Fica em cache durante a sessão. */
export const fetchSpellList = async (level: number): Promise<ApiListItem[]> => {
    const cached = spellListCache.get(level);
    if (cached) return cached;
    const data = await fetchJson(`/spells?level=${level}`);
    const results: ApiListItem[] = data.results || [];
    spellListCache.set(level, results);
    return results;
};

const schoolMap: Record<string, string> = {
    Abjuration: 'Abjuração',
    Conjuration: 'Conjuração',
    Divination: 'Adivinhação',
    Enchantment: 'Encantamento',
    Evocation: 'Evocação',
    Illusion: 'Ilusão',
    Necromancy: 'Necromancia',
    Transmutation: 'Transmutação',
};

/** Busca os detalhes de uma magia e devolve nome e descrição já traduzidos. */
export const fetchSpellDetail = async (index: string): Promise<ImportedEntry> => {
    const data = await fetchJson(`/spells/${index}`);

    const school = data.school?.name ? schoolMap[data.school.name] || data.school.name : '';
    const levelLabel = data.level === 0 ? 'Truque' : `Nível ${data.level}`;
    const components = [
        ...(data.components || []),
    ].join(', ') + (data.material ? ` (${data.material})` : '');

    // Cabeçalho com os dados técnicos (em inglês, traduzido junto com o resto)
    const header = [
        `${levelLabel}${school ? ` — ${school}` : ''}${data.ritual ? ' (ritual)' : ''}`,
        `Casting time: ${data.casting_time || '-'}`,
        `Range: ${data.range || '-'}`,
        `Components: ${components || '-'}`,
        `Duration: ${data.concentration ? 'Concentration, ' : ''}${data.duration || '-'}`,
    ].join('\n');

    let body = (data.desc || []).join('\n\n');
    if (data.higher_level?.length) {
        body += `\n\nAt Higher Levels: ${data.higher_level.join('\n')}`;
    }

    const [name, description] = await Promise.all([
        translateText(data.name),
        translateText(`${header}\n\n${body}`),
    ]);

    return { apiIndex: data.index || index, name: name || data.name, description };
};

// ------------------------------------------------------- Habilidades

let abilityListCache: AbilityListItem[] | null = null;

/** Lista de habilidades de classe (features) e de raça (traits). */
export const fetchAbilityList = async (): Promise<AbilityListItem[]> => {
    if (abilityListCache) return abilityListCache;
    const [features, traits] = await Promise.all([
        fetchJson('/features'),
        fetchJson('/traits'),
    ]);
    const merged: AbilityListItem[] = [
        ...(features.results || []).map((r: ApiListItem) => ({ ...r, source: 'feature' as const })),
        ...(traits.results || []).map((r: ApiListItem) => ({ ...r, source: 'trait' as const })),
    ];
    // Features da API se repetem por nível (ex.: "Ability Score Improvement"); mantém nomes únicos
    const seen = new Set<string>();
    abilityListCache = merged.filter(item => {
        const key = item.name.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
    return abilityListCache;
};

/** Busca os detalhes de uma habilidade de classe ou raça e devolve traduzido. */
export const fetchAbilityDetail = async (item: AbilityListItem): Promise<ImportedEntry> => {
    const path = item.source === 'feature' ? `/features/${item.index}` : `/traits/${item.index}`;
    const data = await fetchJson(path);

    const origin = item.source === 'feature'
        ? [data.class?.name, data.level ? `level ${data.level}` : null].filter(Boolean).join(', ')
        : (data.races || []).map((r: { name: string }) => r.name).join(', ');

    const body = `${origin ? `(${origin})\n\n` : ''}${(data.desc || []).join('\n\n')}`;

    const [name, description] = await Promise.all([
        translateText(data.name),
        translateText(body),
    ]);

    return { apiIndex: data.index || item.index, name: name || data.name, description };
};
