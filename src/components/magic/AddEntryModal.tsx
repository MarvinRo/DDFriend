import React, { useEffect, useMemo, useState } from 'react';
import { Modal, View, Text, ScrollView, TextInput, TouchableOpacity, Pressable, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/components/ui/Input';
import {
    AbilityListItem,
    ApiListItem,
    fetchAbilityDetail,
    fetchAbilityList,
    fetchSpellDetail,
    fetchSpellList,
} from '@/lib/dndApi';

export type EntryFormData = {
    name: string;
    description: string;
    apiIndex: string | null;
    /** Só para habilidades; null = ilimitado */
    maxUses: number | null;
};

type AddEntryModalProps = {
    visible: boolean;
    kind: 'spell' | 'ability';
    /** Nível da magia (0 = truque). Ignorado para habilidades. */
    level?: number;
    initialData?: Partial<EntryFormData> | null;
    onSave: (data: EntryFormData) => void;
    onClose: () => void;
};

export default function AddEntryModal({ visible, kind, level = 0, initialData, onSave, onClose }: AddEntryModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [apiIndex, setApiIndex] = useState<string | null>(null);
    const [maxUses, setMaxUses] = useState('');

    const [search, setSearch] = useState('');
    const [apiList, setApiList] = useState<(ApiListItem | AbilityListItem)[]>([]);
    const [isLoadingList, setIsLoadingList] = useState(false);
    const [listError, setListError] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const isEditing = !!initialData?.name;
    const title = kind === 'ability'
        ? (isEditing ? 'Editar Habilidade' : 'Nova Habilidade')
        : level === 0
            ? (isEditing ? 'Editar Truque' : 'Novo Truque')
            : (isEditing ? `Editar Magia (Nível ${level})` : `Nova Magia (Nível ${level})`);

    // Preenche o formulário ao abrir
    useEffect(() => {
        if (!visible) return;
        setName(initialData?.name || '');
        setDescription(initialData?.description || '');
        setApiIndex(initialData?.apiIndex ?? null);
        setMaxUses(initialData?.maxUses ? String(initialData.maxUses) : '');
        setSearch('');
    }, [visible, initialData]);

    // Carrega a lista da API para o auto-completar
    useEffect(() => {
        if (!visible) return;
        let cancelled = false;
        setIsLoadingList(true);
        setListError(false);
        const load = kind === 'spell' ? fetchSpellList(level) : fetchAbilityList();
        load
            .then(list => { if (!cancelled) setApiList(list); })
            .catch(err => {
                console.error('Erro ao carregar lista da D&D API:', err);
                if (!cancelled) setListError(true);
            })
            .finally(() => { if (!cancelled) setIsLoadingList(false); });
        return () => { cancelled = true; };
    }, [visible, kind, level]);

    const results = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (term.length < 2) return [];
        return apiList.filter(item => item.name.toLowerCase().includes(term)).slice(0, 8);
    }, [search, apiList]);

    const handleImport = async (item: ApiListItem | AbilityListItem) => {
        setSearch('');
        setIsImporting(true);
        try {
            const imported = kind === 'spell'
                ? await fetchSpellDetail(item.index)
                : await fetchAbilityDetail(item as AbilityListItem);
            setName(imported.name);
            setDescription(imported.description);
            setApiIndex(imported.apiIndex);
        } catch (error) {
            console.error('Erro ao importar da D&D API:', error);
            Alert.alert('Erro', 'Não foi possível importar os dados da API. Você pode preencher manualmente.');
        } finally {
            setIsImporting(false);
        }
    };

    const handleSave = () => {
        if (!name.trim()) {
            Alert.alert('Aviso', 'Informe o nome.');
            return;
        }
        const parsedMax = Number(maxUses.replace(/[^0-9]/g, ''));
        onSave({
            name: name.trim(),
            description: description.trim(),
            apiIndex,
            maxUses: kind === 'ability' && parsedMax > 0 ? Math.min(parsedMax, 99) : null,
        });
    };

    const sourceLabel = (item: ApiListItem | AbilityListItem) =>
        'source' in item ? (item.source === 'feature' ? 'Classe' : 'Raça') : null;

    return (
        <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
            <SafeAreaView className="flex-1 bg-black/80">
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View className="bg-card border border-gold rounded-[10px] p-5 w-11/12 max-h-[85%]">
                        <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled showsVerticalScrollIndicator={false}>
                            <Text className="text-textColor-primary text-[22px] font-bold mb-4 text-center">{title}</Text>

                            {/* Auto-completar pela D&D 5e API */}
                            <View className="mb-5">
                                <Text className="text-gold font-bold text-xs mb-1 text-center">Importar da D&D 5e (nomes em inglês)</Text>
                                <Input
                                    className="border-gold border-[1px] bg-background rounded-lg w-full text-center"
                                    placeholder={kind === 'spell' ? 'Buscar magia (ex: Fireball...)' : 'Buscar habilidade (ex: Rage, Darkvision...)'}
                                    value={search}
                                    onChangeText={setSearch}
                                    autoCapitalize="none"
                                />
                                {isLoadingList ? <Text className="text-textColor-secondary mt-1 text-center text-xs">Carregando lista...</Text> : null}
                                {listError ? <Text className="text-destructive mt-1 text-center text-xs">API indisponível — preencha manualmente.</Text> : null}
                                {isImporting ? (
                                    <View className="flex-row justify-center items-center mt-2 gap-2">
                                        <ActivityIndicator size="small" color="#C49A4A" />
                                        <Text className="text-gold text-xs">Importando e traduzindo...</Text>
                                    </View>
                                ) : null}
                                {results.length > 0 ? (
                                    <View className="bg-background border border-gold rounded-lg w-full mt-1">
                                        {results.map(item => (
                                            <TouchableOpacity key={`${item.url}`} className="p-3 border-b border-gray-800 flex-row justify-between" onPress={() => handleImport(item)}>
                                                <Text className="text-textColor-primary font-bold flex-1">{item.name}</Text>
                                                {sourceLabel(item) ? <Text className="text-textColor-secondary text-xs">{sourceLabel(item)}</Text> : null}
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                ) : null}
                            </View>

                            <Text className="text-textColor-secondary text-xs mb-1">Nome</Text>
                            <Input className="border-gold border-[1px] rounded-lg w-full mb-3" placeholder="Nome" value={name} onChangeText={setName} />

                            {kind === 'ability' ? (
                                <>
                                    <Text className="text-textColor-secondary text-xs mb-1">Usos máximos (deixe vazio se for ilimitado)</Text>
                                    <Input
                                        className="border-gold border-[1px] rounded-lg w-full mb-3 text-center"
                                        placeholder="ex: 3"
                                        keyboardType="numeric"
                                        value={maxUses}
                                        onChangeText={(val) => setMaxUses(val.replace(/[^0-9]/g, ''))}
                                        maxLength={2}
                                    />
                                </>
                            ) : null}

                            <Text className="text-textColor-secondary text-xs mb-1">O que faz</Text>
                            <TextInput
                                multiline
                                textAlignVertical="top"
                                className="text-textColor-primary text-[15px] min-h-[140px] border border-gold rounded-lg p-3 bg-background mb-4"
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Efeito, alcance, duração, dano..."
                                placeholderTextColor="#666"
                            />
                        </ScrollView>

                        <View className="flex-row gap-4 items-center justify-center mt-2">
                            <Pressable className="bg-gold-light rounded-[40px] px-4 py-2 w-[120px] items-center" onPress={handleSave} disabled={isImporting}>
                                <Text className="text-gold-dark font-bold">Salvar</Text>
                            </Pressable>
                            <Pressable className="bg-gold-dark rounded-[40px] px-4 py-2 w-[120px] items-center" onPress={onClose}>
                                <Text className="text-textColor-primary font-bold">Cancelar</Text>
                            </Pressable>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
}
