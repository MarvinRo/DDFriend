import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';

export const infoIconXml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C49A4A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;

type EntryRowProps = {
    name: string;
    onInfo: () => void;
    /** Conteúdo extra abaixo do nome (ex.: contador de usos) */
    children?: React.ReactNode;
};

export default function EntryRow({ name, onInfo, children }: EntryRowProps) {
    return (
        <View className="bg-background border border-gold-dark rounded-lg px-3 py-2 mb-2">
            <View className="flex-row items-center justify-between">
                <Text className="text-textColor-primary text-[15px] font-bold flex-1 mr-2" numberOfLines={2}>
                    {name}
                </Text>
                <TouchableOpacity onPress={onInfo} hitSlop={10} accessibilityLabel={`Ver detalhes de ${name}`}>
                    <SvgXml xml={infoIconXml} width="22" height="22" />
                </TouchableOpacity>
            </View>
            {children ? <View className="mt-2">{children}</View> : null}
        </View>
    );
}
