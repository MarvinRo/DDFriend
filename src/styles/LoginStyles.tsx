import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Um cinza bem escuro, quase preto
    justifyContent: 'space-between',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: { // Estilo para o seu logo real
    width: 190,
    height: 190,
    resizeMode: 'contain',
    marginBottom: 0,
    backgroundColor: 'transparent',
    borderRadius:500
  },
  logoPlaceholder: { // Estilo para o placeholder do logo
    width: 200,
    height: 200,
    borderRadius: 500,
    backgroundColor: '#282828',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#333'
  },
  logoPlaceholderText: {
    color: '#777',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A9A9A9', // Um cinza mais claro
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 14,
    elevation: 2, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#121212',
  },
  footerText: {
    marginTop: 20,
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
});
