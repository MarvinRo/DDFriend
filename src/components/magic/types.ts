// Modelo do grimório salvo em characterSheets/{id}/spellsAndAbilities/{docId}.
// Os campos antigos (talents, cantrips, spellLevels em texto) ficam intactos no documento;
// a versão estruturada usa campos novos e schemaVersion = 2.

export type MagicEntry = {
    id: string;
    name: string;
    description: string;
    /** Identificador na D&D 5e API, quando importado */
    apiIndex?: string | null;
};

export type Ability = MagicEntry & {
    /** null = uso ilimitado (sem contador) */
    maxUses: number | null;
    used: number;
};

/** Magia de nível 1–9: conta quantos espaços do nível ela já gastou */
export type Spell = MagicEntry & {
    used: number;
};

export type SpellLevel = {
    level: number;
    /** Espaços de magia do nível — definido pelo jogador, varia por classe */
    slotsMax: number;
    /** Usos de cada magia; a soma é o total de espaços gastos no nível */
    spells: Spell[];
};

export type MagicSheet = {
    abilities: Ability[];
    cantrips: MagicEntry[];
    spellLevels: SpellLevel[];
};

export const SPELL_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export const emptySheet = (): MagicSheet => ({
    abilities: [],
    cantrips: [],
    spellLevels: SPELL_LEVELS.map(level => ({ level, slotsMax: 0, spells: [] })),
});

/** Total de espaços gastos no nível = soma dos usos de cada magia */
export const levelSlotsUsed = (level: SpellLevel): number =>
    level.spells.reduce((sum, spell) => sum + spell.used, 0);

/** Garante que a soma dos usos não passe do máximo, tirando das últimas magias primeiro */
export const clampSpellUses = (spells: Spell[], slotsMax: number): Spell[] => {
    let excess = spells.reduce((sum, spell) => sum + spell.used, 0) - slotsMax;
    if (excess <= 0) return spells;
    const result = [...spells];
    for (let i = result.length - 1; i >= 0 && excess > 0; i--) {
        const remove = Math.min(result[i].used, excess);
        if (remove > 0) {
            result[i] = { ...result[i], used: result[i].used - remove };
            excess -= remove;
        }
    }
    return result;
};

const toCount = (value: unknown): number => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
};

const MAX_NAME_LENGTH = 40;

// "Nome: descrição" ou "Nome - descrição" (o separador precisa de espaço depois, para não quebrar "Meio-Elfo")
const NAME_AND_DESCRIPTION = new RegExp(`^(.{1,${MAX_NAME_LENGTH}}?)\\s*(?::|\\s[-–—])\\s+(.+)$`);

// Linha curta, sem pontuação de frase no final, parece um nome
const looksLikeName = (line: string) => line.length <= MAX_NAME_LENGTH && !/[.!?]$/.test(line);

/**
 * Converte o texto livre antigo em itens, tentando não picotar descrições:
 * - "Nome: descrição" / "Nome - descrição" → um item com descrição;
 * - linha com lista curta separada por vírgula ("Luz, Prestidigitação") → um item por nome;
 * - linha curta → novo item;
 * - linha longa / frase → continua a descrição do item anterior.
 * IDs determinísticos para não mudarem a cada snapshot antes da primeira gravação.
 */
export const textToEntries = (text: unknown, prefix: string): MagicEntry[] => {
    if (typeof text !== 'string' || !text.trim()) return [];

    const entries: { name: string; description: string }[] = [];
    const appendToLast = (line: string) => {
        const last = entries[entries.length - 1];
        last.description = last.description ? `${last.description}\n${line}` : line;
    };

    for (const rawLine of text.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line) continue;

        const withDescription = line.match(NAME_AND_DESCRIPTION);
        if (withDescription) {
            entries.push({ name: withDescription[1].trim(), description: withDescription[2].trim() });
            continue;
        }

        const parts = line.split(/[,;]/).map(p => p.trim()).filter(Boolean);
        if (parts.length > 1 && parts.every(looksLikeName)) {
            parts.forEach(name => entries.push({ name, description: '' }));
            continue;
        }

        if (looksLikeName(line) || entries.length === 0) {
            // Primeira linha longa vira um item com nome resumido e o texto inteiro na descrição
            const name = line.length <= MAX_NAME_LENGTH ? line : `${line.slice(0, MAX_NAME_LENGTH).trim()}…`;
            entries.push({ name, description: line.length <= MAX_NAME_LENGTH ? '' : line });
            continue;
        }

        appendToLast(line);
    }

    return entries.map((e, i) => ({ id: `${prefix}-${i}`, ...e }));
};

const sanitizeEntry = (raw: any): MagicEntry => ({
    id: typeof raw?.id === 'string' && raw.id ? raw.id : newId(),
    name: String(raw?.name ?? ''),
    description: String(raw?.description ?? ''),
    apiIndex: raw?.apiIndex ?? null,
});

/** Converte o documento do Firestore (formato novo ou antigo) para o modelo da tela. */
export const sheetFromFirestore = (data: any): MagicSheet => {
    if (!data) return emptySheet();

    if (data.schemaVersion === 2) {
        const levels: any[] = Array.isArray(data.spellLevelList) ? data.spellLevelList : [];
        return {
            abilities: (data.abilityList || []).map((a: any) => {
                const maxUses = a?.maxUses === null || a?.maxUses === undefined ? null : toCount(a.maxUses);
                return {
                    ...sanitizeEntry(a),
                    maxUses,
                    used: maxUses === null ? 0 : Math.min(toCount(a?.used), maxUses),
                };
            }),
            cantrips: (data.cantripList || []).map(sanitizeEntry),
            spellLevels: SPELL_LEVELS.map(level => {
                const found = levels.find(l => Number(l?.level) === level);
                const slotsMax = toCount(found?.slotsMax);
                const spells: Spell[] = (found?.spells || []).map((raw: any) => ({ ...sanitizeEntry(raw), used: toCount(raw?.used) }));
                return { level, slotsMax, spells: clampSpellUses(spells, slotsMax) };
            }),
        };
    }

    return sheetFromLegacy(data);
};

/**
 * Formato antigo: talents/cantrips em texto e spellLevels com slotsMax.
 * Os espaços gastos antigos (slotsCurrent) não diziam qual magia foi usada, então começam zerados.
 */
export const sheetFromLegacy = (data: any): MagicSheet => {
    if (!data) return emptySheet();
    const legacyLevels: any[] = Array.isArray(data.spellLevels) ? data.spellLevels : [];
    return {
        abilities: textToEntries(data.talents, 'legacy-ability').map(e => ({ ...e, maxUses: null, used: 0 })),
        cantrips: textToEntries(data.cantrips, 'legacy-cantrip'),
        spellLevels: SPELL_LEVELS.map(level => {
            const found = legacyLevels.find(l => Number(l?.level) === level);
            return {
                level,
                slotsMax: toCount(found?.slotsMax),
                spells: textToEntries(found?.spells, `legacy-spell-${level}`).map(e => ({ ...e, used: 0 })),
            };
        }),
    };
};

/** Campos gravados no Firestore (merge: não apaga os campos antigos). */
export const sheetToFirestore = (sheet: MagicSheet) => ({
    schemaVersion: 2,
    abilityList: sheet.abilities,
    cantripList: sheet.cantrips,
    // slotsUsed é derivado, gravado só para consulta
    spellLevelList: sheet.spellLevels.map(l => ({ ...l, slotsUsed: levelSlotsUsed(l) })),
});
