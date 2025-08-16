// Importe o objeto principal da biblioteca
import { GoogleSignin } from '@react-native-google-signin/google-signin';

/**
 * Este tipo é criado dinamicamente a partir do que a função
 * `GoogleSignin.signIn()` REALMENTE retorna no seu projeto.
 * Ele será sempre o tipo correto, independentemente da versão da biblioteca.
 */
export type GoogleSignInUser = Awaited<ReturnType<typeof GoogleSignin.signIn>>;