import { useState, useEffect, useContext } from 'react';
// @ts-ignore
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import styled from 'styled-components';
import { BsPeopleCircle, BsFileEarmarkArrowDown, BsPieChartFill, BsFillCollectionPlayFill, BsGear } from "react-icons/bs";
import AnilistMain from '../components/AnilistMain';
import FetchUserAnilist from '../components/FetchUserAnilist';
import AMQIndex from '../components/AMQIndex';
import AppSetting from '../components/AppSetting';

const Main = styled.main`
    position: absolute;
    left: 66px;
    height: 100%;
    width: calc(100% - 66px);
`;

// TODO: clean css
const TabButton = {
    height: '60px'
};

const color = {
    backgroundColor: '#292f33',
    borderColor: '#929292'
};

const icon = {
    verticalAlign: 'middle',
    margin: 'auto',
    height: '100%',
    fontSize: '1.2rem',
}

function MainPage() {
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState({});

    useEffect(() => {
        const fetcher = async () => {
            window.electron.send('windowLoaded');
            const settings = await window.electron.invoke('loadConfig');
            setConfig(settings);
            setLoading(false);
        }
        fetcher();
    }, [])

    if (loading) return <main className="main"><p>loading</p></main>

    return (
        <Tabs forceRenderTabPanel={true} className="flex flex-row bodyContainer">
            <TabList className="TabBar flex flex-col relative" style={color}>
                <img className="my-4 p-1" src="/amqrb.png" />
                <Tab className="px-2 text-center text-white hover:bg-gray-900 cursor-pointer" style={TabButton}>
                    <BsFillCollectionPlayFill style={icon} />
                </Tab>
                <Tab className="px-2 text-center text-white hover:bg-gray-900 cursor-pointer" style={TabButton}>
                    <BsPeopleCircle style={icon} />
                </Tab>
                <Tab className="px-2 text-center text-white hover:bg-gray-900 cursor-pointer" style={TabButton}>
                    <BsFileEarmarkArrowDown style={icon} />
                </Tab>
                <Tab className="px-2 text-center text-white hover:bg-gray-900 cursor-pointer" style={TabButton}>
                    <BsPieChartFill style={icon} />
                </Tab>
                <Tab className="px-2 text-center text-white hover:bg-gray-900 cursor-pointer" style={TabButton}>
                    <BsGear style={icon} />
                </Tab>
                <div className="text-center text-gray-400 absolute bottom-0 w-full font-light select-none">
                    0.0.1
                </div>
            </TabList>

            <Main>
                <TabPanel>
                    <AMQIndex />
                </TabPanel>
                <TabPanel>
                    <AnilistMain />
                </TabPanel>
                <TabPanel>
                    <FetchUserAnilist />
                </TabPanel>
                <TabPanel>
                    <p>nai</p>
                </TabPanel>
                <TabPanel>
                    <AppSetting />
                </TabPanel>
            </Main>
        </Tabs>
    )
}
  
export default MainPage
