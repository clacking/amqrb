import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import createStore from '../store/store';
import './main.css'
import 'react-tabs/style/react-tabs.css';
import TitleBar from '../components/Titlebar';
import AnilistAuthProvider from '../components/AnilistAuth';
import Layout from './layout';

function App() {
    return (
        <ChakraProvider>
            <div className="App relative bg-gray-900 text-white">
                <Provider store={createStore()}>
                    <TitleBar />
                    <AnilistAuthProvider>
                        <Layout />
                    </AnilistAuthProvider>
                </Provider>
            </div>
        </ChakraProvider>
    )
}

ReactDOM.render(<App />, document.querySelector('#root'));
