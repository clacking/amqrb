import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import AnimeData from '../components/animedata';
import { title } from 'process';
import TitleBar from './titlebar';

const UserQuery = gql`
query ($userId: Int, $userName: String, $type: MediaType) {
    MediaListCollection(userId: $userId, userName: $userName, type: $type) {
      lists {
        name
        isCustomList
        isCompletedList: isSplitCompletedList
        entries {
          ...mediaListEntry
        }
      }
      user {
        id
        name
        avatar {
          large
        }
        mediaListOptions {
          scoreFormat
          rowOrder
          animeList {
            sectionOrder
            customLists
            splitCompletedSectionByFormat
            theme
          }
        }
      }
    }
  }

  fragment mediaListEntry on MediaList {
    status
    media {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        large
      }
    }
  }
  
`

const UserList = ({ username }: { username: string }) => {
    if (!username) return <p>入れてね</p>;
    const { loading, error, data } = useQuery(UserQuery, { variables: { "userName": username,"type": "ANIME" } });
    if (loading) return <p className="midCenter">Loading...</p>;
    if (error) return <p>Error :(</p>;

    // @ts-ignore
    const lists = data.MediaListCollection.lists;

    return (
        <div className="overflow-scroll h-full">
            { //@ts-ignore
            lists.map(({name, entries}) => (
                <div key={name}>
                    <h1 className="sticky top-0 bg-white">{name} ({entries.length})</h1>
                    { //@ts-ignore
                        entries.map(({media}) => (
                            <AnimeData key={media.id} animeId={media.id} coverImage={media.coverImage.large}
                                titleEnglish={media.title.english} titleNative={media.title.native} titleRomaji={media.title.romaji} />
                        ))
                    }
                </div>
            ))
            }
        </div>
    )
}

const FetchUserAnilist = () => {
    const [name, setName] = useState('');
    const [req, setReq] = useState('');

    const getUser = () => {
        setReq(name);
    }

    return (
        <div className="main">
            <p>
                <span>AniListのユーザー名を入れてね →</span>
                <input type="text" value={name} className="border px-4 py-2 mx-2" onChange={e => setName(e.target.value) } />
                <button className="bg-green-400 px-4 py-2 text-white" onClick={() => getUser()}>取得</button>
            </p>
            <UserList username={req} />
        </div>
    );
}

export default FetchUserAnilist;

