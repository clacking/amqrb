import { useState, useContext, useRef, Fragment } from 'react';
import { useFormik } from 'formik';
import { Button, ButtonGroup, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react"
import { GameViewContext } from './AMQGame';
import { RoomSetting } from '../interface/AMQRoomSetting.interface';
import { HostRoom, HostSoloGame, AMQEventType } from '../helper/AMQEvents';
const { roombrowser } = AMQEventType;

const DefaultRoomValues: RoomSetting = {
    roomName: '',
    privateRoom: false,
    password: '',
    roomSize: 8,
    numberOfSongs: 20,
    teamSize: 1,
    modifiers: {
        skipGuessing: true,
        skipReplay: true,
        duplicates: true,
        queueing: false,
        lootDropping: true
    },
    songSelection: {
        standardValue: 3,
        advancedValue: {
            watched: 20,
            unwatched: 0,
            random: 0
        }
    },
    songType: {
        standardValue: {
            openings: true,
            endings: true,
            inserts: false
        },
        advancedValue: {
            openings: 0,
            endings: 0,
            inserts: 0,
            random: 20
        }
    },
    guessTime: {
        randomOn: false,
        standardValue: 20,
        randomValue: [
            5,
            60
        ]
    },
    scoreType: 1,
    showSelection: 1,
    inventorySize: {
        randomOn: false,
        standardValue: 20,
        randomValue: [
            1,
            90
        ]
    },
    lootingTime: {
        randomOn: false,
        standardValue: 90,
        randomValue: [
            10,
            150
        ]
    },
    lives: 5,
    samplePoint: {
        randomOn: true,
        standardValue: 1,
        randomValue: [
            0,
            100
        ]
    },
    playbackSpeed: {
        randomOn: false,
        standardValue: 1,
        randomValue: [
            true,
            true,
            true,
            true
        ]
    },
    songDifficulity: {
        advancedOn: false,
        standardValue: {
            easy: true,
            medium: true,
            hard: true
        },
        advancedValue: [
            0,
            100
        ]
    },
    songPopularity: {
        advancedOn: false,
        standardValue: {
            disliked: true,
            mixed: true,
            liked: true
        },
        advancedValue: [
            0,
            100
        ]
    },
    playerScore: {
        advancedOn: false,
        standardValue: [
            1,
            10
        ],
        advancedValue: [
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true
        ]
    },
    animeScore: {
        advancedOn: false,
        standardValue: [
            2,
            10
        ],
        advancedValue: [
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true
        ]
    },
    vintage: {
        standardValue: {
            years: [
                1944,
                2020
            ],
            seasons: [
                0,
                3
            ]
        },
        advancedValueList: []
    },
    type: {
        tv: true,
        movie: true,
        ova: true,
        ona: true,
        special: true
    },
    genre: [],
    tags: [],
    gameMode: 'Multiplayer'
}

const Form = ({submit}: {submit: (val: RoomSetting, solo: boolean) => void}) => {
    const obj = {...DefaultRoomValues};
    const [solo, setSolo] = useState(false);
    const form = useFormik({
        initialValues: obj,
        onSubmit: val => submit(val, solo)
    });

    return (
        <form className="text-center text-black" onSubmit={form.handleSubmit}>
            <h1 className="text-2xl">Create Room</h1>
            <div>
                <span>Solo room?</span>
                <input checked={solo} type="checkbox" onChange={e=>setSolo(!solo)} />
            </div>
            { solo ? '' : <Fragment>
            <div>
                Room name
                <input className="p-2 border" id="text-input" placeholder="Room name" name="roomName" value={form.values.roomName} onChange={form.handleChange} type="text" />
            </div>
            <div>
                Password
                <input className="p-2 border" id="text-input" placeholder="Password" name="password" value={form.values.password} onChange={form.handleChange} type="text" />
            </div>
            <div>
                <p>Room size</p>
                <input name="roomSize" value={form.values.roomSize} onChange={form.handleChange} type="number" min={1} max={8} step={1} />
                <input name="roomSize" value={form.values.roomSize} onChange={form.handleChange} type="range" min={1} max={8} step={1} />
            </div>
            <div>
                <p>Team size</p>
                <input name="teamSize" value={form.values.teamSize} onChange={form.handleChange} type="number" min={1} max={8} step={1} />
                <input name="teamSize" value={form.values.teamSize} onChange={form.handleChange} type="range" min={1} max={8} step={1} />
            </div>
            </Fragment>}
            <div>
                <p>Guess Time</p>
                <input name="guessTime.standardValue" value={form.values.guessTime.standardValue} onChange={form.handleChange} type="number" min={5} max={60} step={5} />
                <input name="guessTime.standardValue" value={form.values.guessTime.standardValue} onChange={form.handleChange} type="range" min={5} max={60} step={5} />
            </div>
            <div>
                <p>Song Selection</p>
                <div className="flex flex-row mx-auto">
                    <span>
                        op
                        <input name="songType.standardValue.openings" value="false" checked={form.values.songType.standardValue.openings} onChange={form.handleChange} type="checkbox" />
                    </span>
                    <span>
                        ed
                        <input name="songType.standardValue.endings" value="false" checked={form.values.songType.standardValue.endings} onChange={form.handleChange} type="checkbox" />
                    </span>
                    <span>
                        ins
                        <input name="songType.standardValue.inserts" value="false" checked={form.values.songType.standardValue.inserts} onChange={form.handleChange} type="checkbox" />
                    </span>
                </div>
            </div>
            <div>
                <p>Song Difficulty</p>
                <div className="flex flex-row mx-auto">
                    <span>
                        easy
                        <input name="songDifficulity.standardValue.easy" value="false" checked={form.values.songDifficulity.standardValue.easy} onChange={form.handleChange} type="checkbox" />
                    </span>
                    <span>
                        medium
                        <input name="songDifficulity.standardValue.medium" value="false" checked={form.values.songDifficulity.standardValue.medium} onChange={form.handleChange} type="checkbox" />
                    </span>
                    <span>
                        hard
                        <input name="songDifficulity.standardValue.hard" value="false" checked={form.values.songDifficulity.standardValue.hard} onChange={form.handleChange} type="checkbox" />
                    </span>
                </div>
            </div>
            <Button colorScheme="blue" type="submit">Submit</Button>
        </form>
    )
}

const AMQRoomSetting = ({isOpen, onClose, editable}:
{isOpen: boolean, onClose: any, editable?: boolean}) => {
    const { changeView } = useContext(GameViewContext);
    const parentUI = useRef(document.querySelector('#AMQGameUI') as HTMLElement)

    const submit = (val: RoomSetting, solo: boolean) => {
        const setting = {...val};
        const command = solo ? HostSoloGame : HostRoom;
        if (setting.password) setting.privateRoom = true;
        if (solo) {
            setting.roomName = 'Solo';
            setting.gameMode = 'Solo';
            setting.roomSize = 1;
            setting.privateRoom = true;
        }
        changeView('lobby');
        window.electron.send('amqEmit', {
            command, data: setting, type: roombrowser
        });
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            getContainer={() => parentUI.current }
        >
            <ModalOverlay />
            <ModalContent>
            <ModalCloseButton />
            <ModalBody>
                <Form submit={submit} />
            </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default AMQRoomSetting;
