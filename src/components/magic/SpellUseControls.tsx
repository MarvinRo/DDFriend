import React from 'react';
import { View, Text } from 'react-native';
import { CounterButton } from '@/components/magic/UsageCounter';

type SpellUseControlsProps = {
    /** Quantos espaços do nível esta magia já gastou */
    used: number;
    /** Ainda há espaço livre no nível? */
    canUse: boolean;
    /** O nível tem espaços definidos? */
    hasSlots: boolean;
    readOnly?: boolean;
    onUse: () => void;
    onUndo: () => void;
    onReset: () => void;
};

export default function SpellUseControls({ used, canUse, hasSlots, readOnly, onUse, onUndo, onReset }: SpellUseControlsProps) {
    return (
        <View className="w-full">
            <View className="flex-row items-center gap-1 mb-2">
                {/* Uma esfera por espaço que esta magia consumiu */}
                {Array.from({ length: Math.min(used, 12) }, (_, i) => (
                    <View key={i} className="w-3 h-3 rounded-full bg-gold border border-gold" />
                ))}
                <Text className="text-textColor-secondary text-xs ml-1">
                    {used === 0 ? 'Ainda não usada' : `Usada ${used}x`}
                </Text>
            </View>

            {readOnly ? null : hasSlots ? (
                <View className="flex-row gap-2">
                    <CounterButton label="Resetar" variant="reset" onPress={onReset} disabled={used === 0} />
                    <CounterButton label="Retroceder" variant="undo" onPress={onUndo} disabled={used === 0} />
                    <CounterButton label="Usar" variant="use" onPress={onUse} disabled={!canUse} />
                </View>
            ) : (
                <Text className="text-textColor-secondary text-[11px]">Defina os espaços do nível para usar.</Text>
            )}
        </View>
    );
}
