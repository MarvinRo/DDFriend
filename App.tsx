import { SafeAreaProvider } from 'react-native-safe-area-context';
import "./src/styles/global.css";
import Routes from '@/routes/routes';

export default function App() {
  return (
    <SafeAreaProvider>
      <Routes />
    </SafeAreaProvider>
  );
}
