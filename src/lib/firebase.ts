// Instâncias únicas do Firebase usando a API modular (padrão desde o React Native Firebase v22).
// A API "namespaced" antiga (auth(), firestore().collection(...)) está deprecated e será removida.
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export const auth = getAuth();
export const db = getFirestore();

/** Converte o resultado de uma consulta em objetos { id, ...dados } */
export const docsWithId = (snapshot: FirebaseFirestoreTypes.QuerySnapshot): any[] =>
    snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
