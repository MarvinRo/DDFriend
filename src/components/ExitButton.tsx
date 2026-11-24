import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { signOut } from '@react-native-firebase/auth';
import { auth } from '@/lib/firebase';
import { cn } from '@/lib/utils';

// exit.png tem 677x369, mas a arte (cavaleiro saindo pelo portal) ocupa só x 198–451, y 39–322.
// Para a arte preencher o ícone, a imagem é ampliada e as margens transparentes ficam fora do recorte.
const IMAGE = { width: 677, height: 369 };
const ART = { centerX: 324.5, centerY: 180.5, height: 284 };
const ICON_SIZE = 38;
const ART_FILL = 0.9; // arte ocupa 90% da altura do ícone
const scale = (ICON_SIZE * ART_FILL) / ART.height;

type ExitButtonProps = {
    /** true = renderiza no fluxo (dentro de uma barra); false = fixo no canto superior direito */
    inline?: boolean;
};

export default function ExitButton({ inline = false }: ExitButtonProps) {
    const logout = async () => {
        try {
            await signOut(auth);
            await GoogleSignin.signOut();
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível fazer o logout.");
        }
    };

    // Confirma antes de sair, para evitar logout por toque acidental
    const handleLogout = () => {
        Alert.alert("Sair", "Deseja sair da sua conta?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Sair", style: "destructive", onPress: logout },
        ]);
    };

    return (
        <View className={cn(!inline && 'absolute top-12 right-4 z-50')}>
            <TouchableOpacity
                onPress={handleLogout}
                className="flex-row items-center bg-card border border-gold-dark rounded-full pl-3 pr-1 py-1"
                accessibilityLabel="Sair da conta"
                hitSlop={6}
            >
                <Text className="text-textColor-primary text-sm font-bold mr-2">Sair</Text>
                <View
                    className="rounded-full bg-background overflow-hidden"
                    style={{ width: ICON_SIZE, height: ICON_SIZE }}
                >
                    <Image
                        source={require('@/assets/images/exit.png')}
                        style={{
                            position: 'absolute',
                            width: IMAGE.width * scale,
                            height: IMAGE.height * scale,
                            left: ICON_SIZE / 2 - ART.centerX * scale,
                            top: ICON_SIZE / 2 - ART.centerY * scale,
                        }}
                    />
                </View>
            </TouchableOpacity>
        </View>
    );
}
