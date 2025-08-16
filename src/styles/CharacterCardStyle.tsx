import { StyleSheet } from 'react-native';

export const CharacterCardStyle = StyleSheet.create({
    card: {
        borderRadius: 8, // Um pouco mais suave
        backgroundColor: "#1f1e1e",
        borderWidth: 1,
        borderColor: "#f5f5f5", // Um pouco mais sutil
        marginHorizontal: 10,
        marginVertical: 10,
        flex: 1, 
        minHeight: 160,
        minWidth: 160,
        flexDirection: 'column', // Garante que o corpo e o rodapé fiquem um sobre o outro
    },
    cardBody: {
        flexDirection: 'row', // Coluna de info e de ações lado a lado
        padding: 12,
        flex: 1, // Faz o corpo do card crescer para preencher o espaço vertical
    },

    // --- Coluna da Esquerda (Informações) ---
    infoColumn: {
        flex: 1, // A MÁGICA! Faz esta coluna ocupar todo o espaço disponível
        justifyContent: 'center',
        paddingRight: 10, // Espaço para não colar nos ícones
    },
    cardTextName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        flexWrap: 'wrap', // Garante a quebra de linha
    },
    cardTextSecondary: {
        color: "#ccc",
        fontSize: 14,
        flexWrap: 'wrap', // Garante a quebra de linha
        marginTop: 4,
    },

    // --- Coluna da Direita (Ações) ---
    actionsColumn: {
        width: 50, // Largura fixa para manter os ícones alinhados
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    cardTextLevel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    iconButton: {
        padding: 4, // Área de toque um pouco maior
    },
    
    // --- Rodapé ---
    cardFooter: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
    },
    footerButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'center',
        paddingVertical: 10,
        gap: 8, // Espaço entre o ícone e o texto
    },
    footerButtonText: {
        color: "#f5f5f5",
        fontSize: 14,
    },
});