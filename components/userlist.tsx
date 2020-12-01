import { useState, useContext } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useDispatch } from 'react-redux';
import currentListSlice, { AniListStatus } from '../store/listSlice';
import AnimeData from '../components/animedata';
import { AuthContext } from './AnilistAuth';

const UAL = gql`
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
      }
    }
  }

  fragment mediaListEntry on MediaList {
    id
    mediaId
    status
    score
    progress
    progressVolumes
    repeat
    priority
    private
    hiddenFromStatusLists
    customLists
    advancedScores
    notes
    updatedAt
    startedAt {
      year
      month
      day
    }
    completedAt {
      year
      month
      day
    }
    media {
      id
      title {
        userPreferred
        romaji
        english
        native
      }
      coverImage {
        extraLarge
        large
      }
      type
      format
      status
      episodes
      volumes
      chapters
      averageScore
      popularity
      isAdult
      countryOfOrigin
      genres
      bannerImage
      startDate {
        year
        month
        day
      }
    }
  }
`

const UserAnimeLIst = () => {
    const { anilistID } = useContext(AuthContext);
    const dispatch = useDispatch();
    const { loading, error, data } = useQuery(UAL, { variables: { "userId": anilistID,"type": "ANIME" } });
    const [added, addList] = useState([] as number[]);

    if (loading) return <p className="midCenter">Loading...</p>;
    if (error) return <p>Error :(</p>;

    // @ts-ignore
    const lists = data.MediaListCollection.lists;

    const addDrop = (id: number, change: AniListStatus) => {
        dispatch(currentListSlice.actions.addList({ name: '', id, change }));
        addList([...added, id]);
    }

    return (
        <div className="MainList">
            <div className="md:flex h-24 justify-center bg-gray-600 rounded-md m-4 p-2">
                <img className="h-20 w-20 bg-gray-800 mx-2 rounded-lg" src={data.MediaListCollection.user.avatar.large} />
                <div>
                    <h3 className="text-center">{data.MediaListCollection.user.name}</h3>
                    <div className="flex mx-4">
                        { // @ts-ignore
                        lists.map(list => (
                            <div className="px-2" key={list.name}>
                                <p>{list.name}</p>
                                <p className="text-center text-2xl">{list.entries.length}</p>
                            </div>
                        ))
                        }
                    </div>
                </div>
            </div>
            <div className="p-4">
            { // @ts-ignore
                lists.map(list => (
                    <div className="relative" key={list.name}>
                        <h2 className="text-3xl sticky top-0">{list.name}</h2>
                        { // @ts-ignore
                            list.entries.map(ent => {
                                const { id } = ent;
                                const { native, romaji, english} = ent.media.title;
                                const coverImage = ent.media.coverImage.large;

                                return (
                                <div className="animeList" key={ent.id}>
                                    <AnimeData
                                        animeId={id} coverImage={coverImage} titleNative={native} titleEnglish={english} titleRomaji={romaji} selected={added.includes(ent.id)} />
                                    <div className="updateList">
                                        <p className="updateButton" onClick={_ => addDrop(ent.id, 'CURRENT')}>Watching</p>
                                        <p className="updateButton" onClick={_ => addDrop(ent.id, 'PLANNING')}>Planning</p>
                                        <p className="updateButton" onClick={_ => addDrop(ent.id, 'COMPLETED')}>Completed</p>
                                        <p className="updateButton" onClick={_ => addDrop(ent.id, 'DROPPED')}>Dropped</p>
                                        <p className="updateButton" onClick={_ => addDrop(ent.id, 'PAUSED')}>Paused</p>
                                    </div>
                                </div>
                                )
                            })
                        }
                    </div>
                    )
                )
            }
            </div>
        </div>
    )
}

export default UserAnimeLIst;
