import { createContext, useState, useEffect, FunctionComponent } from 'react';
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

export const AuthContext = createContext({ token: '', anilistID: 0 });
const cache = new InMemoryCache();

const useApolloClient = (authToken: string) => {
    const httpLink = createHttpLink({ uri: 'https://graphql.anilist.co' });
    const authLink = setContext((_, { headers }) => {
        return {
          headers: {
            ...headers,
            authorization: authToken ? `Bearer ${authToken}` : "",
          }
        }
    });
    return new ApolloClient({
        link: authLink.concat(httpLink), cache
    });
}

const AnilistAuthProvider: FunctionComponent = ({ children }) => {
    const [token, setToken] = useState('');
    const [anilistID, setAnilistID] = useState(0);

    const client = useApolloClient(token);

    useEffect(() => {
        window.electron.on('reciveConfig', (e, token) => {
            console.log(token);
            setToken(token[0]);
            setAnilistID(token[1]);
        });
    }, []);

    return (
        <AuthContext.Provider value={ {token, anilistID} }>
            <ApolloProvider client={client}>
                {children}
            </ApolloProvider>
        </AuthContext.Provider>
    )
}

export default AnilistAuthProvider;
