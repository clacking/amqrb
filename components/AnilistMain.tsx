import dynamic from 'next/dynamic';
import { useState, useEffect, useContext } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useAnilistChangeState } from '../store/selectors';
import currentListSlice from '../store/listSlice';
import { useDispatch } from 'react-redux';
import { AuthContext } from '../components/AnilistAuth';

import SavedData from './datas';
import UserAnimes from './userlist';
import Login from '../components/login';

const updateChangeQuery = gql`
mutation ($mediaId: Int, $status: MediaListStatus) {
    NewEntry (mediaId: $mediaId, status: $status) {
        id
        status
    }
}
`;

const AnilistMain = () => {
    const state = useAnilistChangeState().currentList;
    const { token } = useContext(AuthContext);

    if (!token) return <main className="main"><Login /></main>;

    const updateChanges = () => {
        if (state.list.length === 0) return;
    }

    return (
    <section className="flex relative h-full">
        <div className="SideList h-screen">
            <SavedData />
            <div className="SideHeight bg-gray-600 text-center">
                <p><button className="my-2 w-11/12 py-2 rounded-lg font-thin text-white bg-indigo-600 hover:bg-indigo-700">ランダム20</button></p>
                <p><button className="my-2 w-11/12 py-2 rounded-lg font-thin text-white bg-indigo-600 hover:bg-indigo-700">ランダム30</button></p>
                <p><button className="my-2 w-11/12 py-2 rounded-lg font-thin text-white bg-blue-600 hover:bg-blue-700">バックアップ</button></p>
                <p><button className="my-2 w-11/12 py-2 rounded-lg font-thin text-white bg-red-600 hover:bg-red-700">All Watching</button></p>
                <p>変更: {state.list.length}</p>
                <p><button className="my-2 w-11/12 py-2 rounded-lg font-thin text-white bg-green-600 hover:bg-green-700"
                    onClick={_ => {}}>保存</button></p>
            </div>
        </div>
        <UserAnimes />
    </section>

    )
}

export default AnilistMain;
