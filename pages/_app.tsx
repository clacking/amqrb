import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import createStore from '../store/store';
import './main.css'
import 'react-tabs/style/react-tabs.css';

const TitleBar = dynamic(() => import('../components/Titlebar'), {ssr: false});
const AnilistAuthProvider = dynamic(() => import('../components/AnilistAuth'), {ssr: false});

function App({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider>
            <div className="App relative bg-gray-900 text-white">
                <Provider store={createStore()}>
                    <TitleBar />
                    <AnilistAuthProvider>
                        <Component {...pageProps} />
                    </AnilistAuthProvider>
                </Provider>
            </div>
        </ChakraProvider>
    )
}

export default App
