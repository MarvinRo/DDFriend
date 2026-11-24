import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { collection, doc, onSnapshot, setDoc, serverTimestamp, FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { db } from '@/lib/firebase';

import EntryRow from '@/components/magic/EntryRow';
import EntryInfoModal from '@/components/magic/EntryInfoModal';
import AddEntryModal, { EntryFormData } from '@/components/magic/AddEntryModal';
import UsageCounter from '@/components/magic/UsageCounter';
import SpellUseControls from '@/components/magic/SpellUseControls';
import {
    Ability,
    MagicEntry,
    MagicSheet,
    Spell,
    SpellLevel,
    clampSpellUses,
    emptySheet,
    levelSlotsUsed,
    newId,
    sheetFromFirestore,
    sheetToFirestore,
} from '@/components/magic/types';

// Ícones padronizados
const sheetIconXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-list"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>`;
const bagItensXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-backpack-icon lucide-backpack"><path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 10h8"/><path d="M8 18h8"/><path d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>`;
const bookIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open-text-icon lucide-book-open-text"><path d="M12 7v14"/><path d="M16 12h2"/><path d="M16 8h2"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/><path d="M6 12h2"/><path d="M6 8h2"/></svg>`;

/** Qual lista está sendo editada/visualizada */
type Target =
    | { section: 'ability' }
    | { section: 'cantrip' }
    | { section: 'spell'; level: number };

type EditorState = { target: Target; entryId: string | null } | null;

const AddButton = ({ label, onPress }: { label: string; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} className="border border-dashed border-gold-light rounded-lg py-2 items-center mt-1">
        <Text className="text-gold font-bold text-sm">+ {label}</Text>
    </TouchableOpacity>
);

export default function CharacterMagic({ route }: any) {
    const navigation = useNavigation<any>();
    const character = route?.params?.character || {};
    const isFromMaster: boolean = !!route?.params?.fromMaster;
    const campaign = route?.params?.campaign;
    const readOnly = isFromMaster;

    const [sheet, setSheet] = useState<MagicSheet>(emptySheet);
    const sheetRef = useRef<MagicSheet>(sheet);
    const docRef = useRef<FirebaseFirestoreTypes.DocumentReference | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [editor, setEditor] = useState<EditorState>(null);
    const [info, setInfo] = useState<EditorState>(null);

    // Escuta em tempo real: o mestre vê os usos atualizarem enquanto o jogador joga
    useEffect(() => {
        if (!character.id) return;
        const collectionRef = collection(db, 'characterSheets', character.id, 'spellsAndAbilities');

        const unsubscribe = onSnapshot(
            collectionRef,
            (snapshot) => {
                if (!snapshot) return;
                const magicDoc = snapshot.docs[0];
                if (magicDoc) docRef.current = magicDoc.ref;
                // Ignora o "eco" das próprias gravações locais para não sobrescrever cliques rápidos
                if (!snapshot.metadata.hasPendingWrites) {
                    const next = sheetFromFirestore(magicDoc?.data());
                    sheetRef.current = next;
                    setSheet(next);
                }
                setIsLoaded(true);
            },
            (error) => {
                console.error('Erro ao carregar magias:', error);
                setIsLoaded(true);
            }
        );
        return () => unsubscribe();
    }, [character.id]);

    const persist = async (next: MagicSheet) => {
        if (readOnly || !character.id) return;
        // Gera o ID no cliente para que cliques seguidos gravem no mesmo documento
        const targetRef = docRef.current ?? doc(collection(db, 'characterSheets', character.id, 'spellsAndAbilities'));
        docRef.current = targetRef;
        setIsSaving(true);
        try {
            await setDoc(
                targetRef,
                { ...sheetToFirestore(next), updatedAt: serverTimestamp() },
                { merge: true }
            );
        } catch (error) {
            console.error('Erro ao salvar magias:', error);
            Alert.alert('Erro', 'Não foi possível salvar o grimório do personagem.');
        } finally {
            setIsSaving(false);
        }
    };

    /** Aplica uma alteração sobre o estado mais recente e grava */
    const update = (mutate: (current: MagicSheet) => MagicSheet) => {
        if (readOnly) return;
        const next = mutate(sheetRef.current);
        sheetRef.current = next;
        setSheet(next);
        persist(next);
    };

    // ---------------------------------------------------------- helpers de lista

    const getEntries = (s: MagicSheet, target: Target): MagicEntry[] => {
        if (target.section === 'ability') return s.abilities;
        if (target.section === 'cantrip') return s.cantrips;
        return s.spellLevels.find(l => l.level === target.level)?.spells || [];
    };

    const setEntries = (s: MagicSheet, target: Target, entries: MagicEntry[]): MagicSheet => {
        if (target.section === 'ability') return { ...s, abilities: entries as Ability[] };
        if (target.section === 'cantrip') return { ...s, cantrips: entries };
        return {
            ...s,
            spellLevels: s.spellLevels.map(l => (l.level === target.level ? { ...l, spells: entries as Spell[] } : l)),
        };
    };

    const updateAbility = (id: string, change: (a: Ability) => Ability) =>
        update(s => ({ ...s, abilities: s.abilities.map(a => (a.id === id ? change(a) : a)) }));

    const updateLevel = (level: number, change: (l: SpellLevel) => SpellLevel) =>
        update(s => ({
            ...s,
            spellLevels: s.spellLevels.map(l => (l.level === level ? change(l) : l)),
        }));

    /** Usar: gasta um espaço do nível nesta magia, se ainda houver espaço livre */
    const useSpell = (level: number, spellId: string) =>
        updateLevel(level, l => levelSlotsUsed(l) >= l.slotsMax
            ? l
            : { ...l, spells: l.spells.map(sp => (sp.id === spellId ? { ...sp, used: sp.used + 1 } : sp)) });

    const changeSpellUses = (level: number, spellId: string, change: (used: number) => number) =>
        updateLevel(level, l => ({
            ...l,
            spells: l.spells.map(sp => (sp.id === spellId ? { ...sp, used: Math.max(0, change(sp.used)) } : sp)),
        }));

    // --------------------------------------------------------------- ações

    const handleSaveEntry = (data: EntryFormData) => {
        if (!editor) return;
        const { target, entryId } = editor;
        update(s => {
            const entries = getEntries(s, target);
            if (entryId) {
                return setEntries(s, target, entries.map(e => {
                    if (e.id !== entryId) return e;
                    const base = { ...e, name: data.name, description: data.description, apiIndex: data.apiIndex };
                    if (target.section !== 'ability') return base;
                    const prev = e as Ability;
                    return { ...base, maxUses: data.maxUses, used: data.maxUses === null ? 0 : Math.min(prev.used, data.maxUses) } as Ability;
                }));
            }
            const created: MagicEntry = { id: newId(), name: data.name, description: data.description, apiIndex: data.apiIndex };
            const entry = target.section === 'ability'
                ? ({ ...created, maxUses: data.maxUses, used: 0 } as Ability)
                : target.section === 'spell'
                    ? ({ ...created, used: 0 } as Spell)
                    : created;
            return setEntries(s, target, [...entries, entry]);
        });
        setEditor(null);
    };

    const handleDeleteEntry = () => {
        if (!info || !info.entryId) return;
        const { target, entryId } = info;
        update(s => setEntries(s, target, getEntries(s, target).filter(e => e.id !== entryId)));
        setInfo(null);
    };

    const handleLongRest = () => {
        Alert.alert('Descanso longo', 'Recuperar todos os espaços de magia e usos de habilidades?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Recuperar',
                onPress: () => update(s => ({
                    ...s,
                    abilities: s.abilities.map(a => ({ ...a, used: 0 })),
                    spellLevels: s.spellLevels.map(l => ({ ...l, spells: l.spells.map(sp => ({ ...sp, used: 0 })) })),
                })),
            },
        ]);
    };

    // ------------------------------------------------------- dados dos modais

    const editorInitialData = useMemo(() => {
        if (!editor?.entryId) return null;
        const entry = getEntries(sheet, editor.target).find(e => e.id === editor.entryId);
        if (!entry) return null;
        return {
            name: entry.name,
            description: entry.description,
            apiIndex: entry.apiIndex ?? null,
            maxUses: editor.target.section === 'ability' ? (entry as Ability).maxUses : null,
        };
        // Recalcula só quando o modal abre para outro item
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor]);

    const infoEntry = info?.entryId ? getEntries(sheet, info.target).find(e => e.id === info.entryId) : undefined;
    const infoSubtitle = info
        ? info.target.section === 'ability'
            ? 'Talento / Habilidade'
            : info.target.section === 'cantrip'
                ? 'Truque'
                : `Magia de Nível ${info.target.level}`
        : undefined;

    const visibleLevels = readOnly
        ? sheet.spellLevels.filter(l => l.slotsMax > 0 || l.spells.length > 0)
        : sheet.spellLevels;

    const isEmptyForMaster = readOnly && sheet.abilities.length === 0 && sheet.cantrips.length === 0 && visibleLevels.length === 0;

    return (
        <SafeAreaView className="flex-1 bg-background p-4">
            <View className="flex-1 items-center justify-center">
                <View className="w-full bg-card rounded-lg p-4 border border-gold mt-12 mb-18 flex-1">
                    <View className="flex-row justify-between items-center mb-4 border-b border-gold pb-2">
                        <View>
                            <Text className="text-gold font-bold text-lg">Grimório de Magias</Text>
                            <Text className="text-textColor-secondary text-xs">
                                {readOnly ? 'Visualização do mestre' : isSaving ? 'Salvando...' : 'Salvo automaticamente'}
                            </Text>
                        </View>
                        {readOnly ? null : (
                            <TouchableOpacity onPress={handleLongRest} className="bg-gold-light px-3 py-1 rounded">
                                <Text className="text-gold-dark font-bold text-sm">Descanso longo</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <ScrollView showsVerticalScrollIndicator nestedScrollEnabled className="flex-1">
                        {!isLoaded ? (
                            <Text className="text-textColor-secondary text-center mt-6">Carregando grimório...</Text>
                        ) : isEmptyForMaster ? (
                            <Text className="text-textColor-secondary text-center mt-6">Este personagem ainda não cadastrou magias ou habilidades.</Text>
                        ) : (
                            <>
                                {/* Talentos e habilidades: cada um com seu próprio limite de usos */}
                                {readOnly && sheet.abilities.length === 0 ? null : (
                                    <View className="mb-6 border-b border-gold pb-4">
                                        <Text className="text-gold font-bold mb-2">Talentos e Habilidades</Text>
                                        {sheet.abilities.map(ability => (
                                            <EntryRow
                                                key={ability.id}
                                                name={ability.name}
                                                onInfo={() => setInfo({ target: { section: 'ability' }, entryId: ability.id })}
                                            >
                                                {ability.maxUses ? (
                                                    <UsageCounter
                                                        used={ability.used}
                                                        max={ability.maxUses}
                                                        readOnly={readOnly}
                                                        onUse={() => updateAbility(ability.id, a => ({ ...a, used: Math.min((a.maxUses || 0), a.used + 1) }))}
                                                        onUndo={() => updateAbility(ability.id, a => ({ ...a, used: Math.max(0, a.used - 1) }))}
                                                        onReset={() => updateAbility(ability.id, a => ({ ...a, used: 0 }))}
                                                        onChangeMax={(max) => updateAbility(ability.id, a => ({ ...a, maxUses: max || null, used: Math.min(a.used, max) }))}
                                                    />
                                                ) : null}
                                            </EntryRow>
                                        ))}
                                        {readOnly ? null : (
                                            <AddButton label="Adicionar habilidade" onPress={() => setEditor({ target: { section: 'ability' }, entryId: null })} />
                                        )}
                                    </View>
                                )}

                                {/* Truques: uso ilimitado */}
                                {readOnly && sheet.cantrips.length === 0 ? null : (
                                    <View className="mb-6 border-b border-gold pb-4">
                                        <Text className="text-gold font-bold mb-2">Truques (Nível 0)</Text>
                                        {sheet.cantrips.map(cantrip => (
                                            <EntryRow
                                                key={cantrip.id}
                                                name={cantrip.name}
                                                onInfo={() => setInfo({ target: { section: 'cantrip' }, entryId: cantrip.id })}
                                            />
                                        ))}
                                        {readOnly ? null : (
                                            <AddButton label="Adicionar truque" onPress={() => setEditor({ target: { section: 'cantrip' }, entryId: null })} />
                                        )}
                                    </View>
                                )}

                                {/* Níveis 1–9: espaços de magia compartilhados pelo nível */}
                                {visibleLevels.map(lvl => {
                                    const levelUsed = levelSlotsUsed(lvl);
                                    return (
                                        <View key={lvl.level} className="mb-6 border-b border-gold pb-4">
                                            <Text className="text-gold font-bold mb-2">Magias de Nível {lvl.level}</Text>
                                            {/* Total do nível = soma dos usos de cada magia abaixo */}
                                            <View className="mb-3">
                                                <UsageCounter
                                                    label="Espaços"
                                                    actions="reset"
                                                    resetLabel="Resetar nível"
                                                    used={levelUsed}
                                                    max={lvl.slotsMax}
                                                    readOnly={readOnly}
                                                    onUse={() => {}}
                                                    onUndo={() => {}}
                                                    onReset={() => updateLevel(lvl.level, l => ({ ...l, spells: l.spells.map(sp => ({ ...sp, used: 0 })) }))}
                                                    onChangeMax={(newMax) => updateLevel(lvl.level, l => ({ ...l, slotsMax: newMax, spells: clampSpellUses(l.spells, newMax) }))}
                                                />
                                            </View>
                                            {lvl.spells.map(spell => (
                                                <EntryRow
                                                    key={spell.id}
                                                    name={spell.name}
                                                    onInfo={() => setInfo({ target: { section: 'spell', level: lvl.level }, entryId: spell.id })}
                                                >
                                                    <SpellUseControls
                                                        used={spell.used}
                                                        canUse={levelUsed < lvl.slotsMax}
                                                        hasSlots={lvl.slotsMax > 0}
                                                        readOnly={readOnly}
                                                        onUse={() => useSpell(lvl.level, spell.id)}
                                                        onUndo={() => changeSpellUses(lvl.level, spell.id, used => used - 1)}
                                                        onReset={() => changeSpellUses(lvl.level, spell.id, () => 0)}
                                                    />
                                                </EntryRow>
                                            ))}
                                            {readOnly ? null : (
                                                <AddButton label="Adicionar magia" onPress={() => setEditor({ target: { section: 'spell', level: lvl.level }, entryId: null })} />
                                            )}
                                        </View>
                                    );
                                })}
                            </>
                        )}

                        {/* Espaço para a barra de navegação inferior */}
                        <View className="h-4" />
                    </ScrollView>
                </View>

                {/* Barra de Navegação Inferior */}
                <View className="absolute bottom-0 flex-row justify-center w-full h-18 items-center bg-card rounded-lg p-2 border border-gold gap-2">
                    <TouchableOpacity className="w-[33%] border border-t-gold border-x-transparent border-b-transparent justify-center items-center flex-row gap-2"
                        onPress={() => navigation.navigate('CharacterSheet', { character, fromMaster: isFromMaster, campaign })}>
                        <SvgXml className="color-gold mb-3" xml={sheetIconXml} width="20px" height="20px" />
                        <Text className="text-gold font-bold text-lg mb-2 pb-1">Ficha</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="w-[33%] border border-t-gold border-x-transparent border-b-transparent justify-center items-center flex-row gap-2"
                        onPress={() => navigation.navigate('CharacterBag', { character, fromMaster: isFromMaster, campaign })}>
                        <SvgXml className="color-gold mb-3" xml={bagItensXml} width="20px" height="20px" />
                        <Text className="text-gold font-bold text-lg mb-2 pb-1">Bolsa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="w-[33%] border border-t-gold border-x-transparent border-b-transparent justify-center items-center flex-row gap-2"
                        onPress={() => navigation.navigate('Books', { isMaster: isFromMaster })}>
                        <SvgXml className="color-gold mb-3" xml={bookIcon} width="20px" height="20px" />
                        <Text className="text-gold font-bold text-lg mb-2 pb-1">Livros</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <EntryInfoModal
                visible={!!infoEntry}
                name={infoEntry?.name || ''}
                description={infoEntry?.description || ''}
                subtitle={infoSubtitle}
                readOnly={readOnly}
                onClose={() => setInfo(null)}
                onDelete={handleDeleteEntry}
                onEdit={() => {
                    if (!info) return;
                    setEditor(info);
                    setInfo(null);
                }}
            />

            <AddEntryModal
                visible={!!editor}
                kind={editor?.target.section === 'ability' ? 'ability' : 'spell'}
                level={editor?.target.section === 'spell' ? editor.target.level : 0}
                initialData={editorInitialData}
                onSave={handleSaveEntry}
                onClose={() => setEditor(null)}
            />
        </SafeAreaView>
    );
}
