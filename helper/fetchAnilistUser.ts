import fetch from 'node-fetch';

export interface UserToken {
    accsess_token: string;
    refresh_token: string;
}

const UserQuery = `
    query {
        Viewer {
            id
            name
            about
            avatar {large}
        }
    }
`

export const fetchUserByAccsess = async (accsess_token: string): Promise<{ name: string, id: number }> => {
    const body = { query: UserQuery }
    const res = await fetch ('https://graphql.anilist.co', {
        method: 'POST', body: JSON.stringify(body), headers: {
            'Authorization': `Bearer ${accsess_token}`,
            'Content-Type': 'application/json', 'Accept': 'application/json'
        }
    });
    const json = await res.json();

    if (json.errors) {
        console.error(json.errors);
        throw new Error('Failed to fetch User.');
    }

    const { name, id } = json.data.Viewer;

    return { name, id };
}

export const fetchAniListUserToken = async (token: string): Promise<UserToken> => {
    const body = {
        grant_type: 'authorization_code',
        client_id: 4043,
        client_secret: 'kLKN4vTf1sx46BTKsIEluNKlvILozFqeuAnGhqrr',
        redirect_uri: 'https://anilist.co/api/v2/oauth/pin',
        code: token
    }

    const res = await fetch ('https://anilist.co/api/v2/oauth/token', {
        method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    });
    const json = await res.json();
    if (json.error) throw new Error(`Invaled Token.: ${json.error}`);

    return { refresh_token: json.refresh_token, accsess_token: json.access_token };
}

export const fetchAniListAccsessToken = async (refresh_token: string): Promise<UserToken> => {
    const body = {
        grant_type: 'refresh_token',
        client_id: 4043,
        client_secret: 'kLKN4vTf1sx46BTKsIEluNKlvILozFqeuAnGhqrr',
        refresh_token
    }

    const res = await fetch ('https://anilist.co/api/v2/oauth/token', {
        method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    });
    const json = await res.json();
    if (json.error) throw new Error(`Invaled Token.: ${json.error}`);

    return { refresh_token: json.refresh_token, accsess_token: json.access_token };

}
