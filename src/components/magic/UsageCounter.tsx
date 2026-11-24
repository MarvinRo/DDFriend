import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { cn } from '@/lib/utils';

type UsageCounterProps = {
    used: number;
    max: number;
    /** Mestre: só visualiza */
    readOnly?: boolean;
    onUse: () => void;
    onUndo: () => void;
    onReset: () => void;
    onChangeMax: (max: number) => void;
    /** Texto ao lado do máximo (ex.: "Espaços", "Usos") */
    label?: string;
    /** 'all' = Resetar/Retroceder/Usar; 'reset' = só Resetar (usar fica em cada magia) */
    actions?: 'all' | 'reset';
    resetLabel?: string;
};

export const CounterButton = ({ label, onPress, disabled, variant }: { label: string; onPress: () => void; disabled?: boolean; variant: 'use' | 'undo' | 'reset' }) => (
    <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        className={cn(
            'flex-1 py-1.5 rounded-full items-center border',
            variant === 'use' && 'bg-gold-light border-gold',
            variant === 'undo' && 'bg-background border-gold-light',
            variant === 'reset' && 'bg-background border-gold-dark',
            disabled && 'opacity-40'
        )}
    >
        <Text className={cn('font-bold text-xs', variant === 'use' ? 'text-gold-dark' : 'text-gold')}>{label}</Text>
    </TouchableOpacity>
);

export default function UsageCounter({ used, max, readOnly, onUse, onUndo, onReset, onChangeMax, label = 'Usos', actions = 'all', resetLabel = 'Resetar' }: UsageCounterProps) {
    const [maxText, setMaxText] = useState(String(max || ''));

    useEffect(() => {
        setMaxText(max ? String(max) : '');
    }, [max]);

    const commitMax = () => {
        const parsed = Math.max(0, Math.min(99, Number(maxText.replace(/[^0-9]/g, '')) || 0));
        setMaxText(parsed ? String(parsed) : '');
        if (parsed !== max) onChangeMax(parsed);
    };

    const remaining = Math.max(0, max - used);

    return (
        <View className="w-full">
            <View className="flex-row items-center justify-between mb-2">
                {/* Bolinhas: preenchidas = disponíveis, vazias = gastas */}
                <View className="flex-row flex-wrap flex-1 gap-1 items-center">
                    {max > 0 && max <= 12 ? (
                        Array.from({ length: max }, (_, i) => (
                            <View
                                key={i}
                                className={cn('w-3.5 h-3.5 rounded-full border border-gold', i < remaining ? 'bg-gold' : 'bg-transparent')}
                            />
                        ))
                    ) : null}
                    <Text className="text-textColor-secondary text-xs ml-1">
                        {max > 0 ? `${remaining}/${max} disponíveis` : `Sem ${label.toLowerCase()} definidos`}
                    </Text>
                </View>

                {readOnly ? null : (
                    <View className="flex-row items-center gap-1 ml-2">
                        <Text className="text-textColor-secondary text-xs">{label} máx.</Text>
                        <TextInput
                            className="bg-background border border-gold-light text-textColor-primary text-center rounded w-9 h-8 p-0"
                            keyboardType="numeric"
                            value={maxText}
                            onChangeText={(val) => setMaxText(val.replace(/[^0-9]/g, ''))}
                            onBlur={commitMax}
                            placeholder="0"
                            placeholderTextColor="#666"
                            maxLength={2}
                        />
                    </View>
                )}
            </View>

            {readOnly || max === 0 ? null : actions === 'reset' ? (
                <View className="flex-row">
                    <CounterButton label={resetLabel} variant="reset" onPress={onReset} disabled={used === 0} />
                </View>
            ) : (
                <View className="flex-row gap-2">
                    <CounterButton label={resetLabel} variant="reset" onPress={onReset} disabled={used === 0} />
                    <CounterButton label="Retroceder" variant="undo" onPress={onUndo} disabled={used === 0} />
                    <CounterButton label="Usar" variant="use" onPress={onUse} disabled={used >= max} />
                </View>
            )}
        </View>
    );
}
