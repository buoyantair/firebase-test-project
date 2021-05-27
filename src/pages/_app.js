import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { AuthProvider } from '../lib/auth';

import initFirebaseApp from '../lib/firebase';

initFirebaseApp();

function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;