import styled from 'styled-components';

const Bar = styled.div`
    -webkit-user-select: none;
    -webkit-app-region: drag;
    width: 100%;
    height: 28px;
    line-height: 28px;
    position: absolute;
    top: 0;
    background: #292f33;
`;

const Title = styled.p`
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
`;

const TitleBar = () => {
    const isMac = navigator.platform.includes('Mac');

    return (
        <Bar className="flex justify-between pl-8 text-gray-100 align-middle relative">
            <div></div>
            <Title className="font-thin">AMQ Redbook</Title>
            { !isMac ? (
            <div className="noDrag cursor-pointer flex">
                <div className="hover:bg-gray-600 px-4" onClick={_ => window.electron.invoke('minimize')}>_</div>
                <div className="hover:bg-red-600 px-4" onClick={_ => window.electron.invoke('quit')}>×</div>
            </div>
            ) : <div></div>}
        </Bar>
    )
}

export default TitleBar;
