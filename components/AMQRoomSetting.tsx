import { useState, useContext, useRef } from 'react';
import { useForm } from 'react-hook-form';
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
        lootDropping: true,
        rebroadcastSongs: true,
        dubSongs: true,
    },
    songSelection: {
        standardValue: 3,
        advancedValue: {
            watched: 20,
            unwatched: 0,
            random: 0
        }
    },
    watchedDistribution: 1,
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
    insertTypes: {
        instrumental: true,
        chanting: true,
        character: true,
        standard: true
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
                2021
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

    const { register, watch, handleSubmit } = useForm<RoomSetting>({ defaultValues: DefaultRoomValues });
    const onSubmit = (val: RoomSetting) => {
        const setting = {...obj, ...val};
        // Add required options
        setting.guessTime.randomValue = [5, 60];
        setting.songDifficulity.advancedValue = [0, 50];
        submit(setting, solo);
    }

    const watchRoomSize = watch('roomSize');
    const watchTeamSize = watch('teamSize');
    const watchGuessTime = watch('guessTime.standardValue');

    return (
        <form className="text-center text-black" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-2xl">Create Room</h1>
            <div>
                <span>Solo room?</span>
                <input checked={solo} type="checkbox" onChange={e=>setSolo(!solo)} />
            </div>
            { solo ? '' : <>
            <div>
                Room name
                <input className="p-2 border" id="text-input" placeholder="Room name" {...register('roomName', { required: true })} type="text" />
            </div>
            <div>
                Password
                <input className="p-2 border" id="text-input" placeholder="Set to private room" {...register('password')} type="text" />
            </div>
            <div>
                <p>Room size</p>
                { watchRoomSize }
                <input {...register('roomSize')} type="range" min={1} max={8} step={1} />
            </div>
            <div>
                <p>Team size</p>
                { watchTeamSize }
                <input {...register('teamSize')} type="range" min={1} max={8} step={1} />
            </div>
            </>}
            <div>
                <p>Guess Time</p>
                <input {...register('guessTime.randomOn')} value="false" type="hidden" />
                { watchGuessTime }
                <input {...register('guessTime.standardValue')} type="range" min={5} max={60} step={5} />
                <input {...register('guessTime.randomValue')} value="false" type="hidden" />
            </div>
            <div>
                <p>Song Selection</p>
                <div className="flex flex-row mx-auto">
                    <span>
                        op
                        <input {...register('songType.standardValue.openings')} value="false" type="checkbox" />
                    </span>
                    <span>
                        ed
                        <input {...register('songType.standardValue.endings')} value="false" type="checkbox" />
                    </span>
                    <span>
                        ins
                        <input {...register('songType.standardValue.inserts')} value="false" type="checkbox" />
                    </span>
                    <div>
                        <input {...register('songType.advancedValue.openings')} value="false" type="hidden" />
                        <input {...register('songType.advancedValue.endings')} value="false" type="hidden" />
                        <input {...register('songType.advancedValue.inserts')} value="false" type="hidden" />
                        <input {...register('songType.advancedValue.random')} value="false" type="hidden" />
                    </div>
                </div>
            </div>
            <div>
                <p>Song Difficulty</p>
                <div className="flex flex-row mx-auto">
                    <input {...register('songDifficulity.advancedOn')} value="false" type="hidden" />
                    <span>
                        easy
                        <input {...register('songDifficulity.standardValue.easy')} value="false" type="checkbox" />
                    </span>
                    <span>
                        medium
                        <input {...register('songDifficulity.standardValue.medium')} value="false" type="checkbox" />
                    </span>
                    <span>
                        hard
                        <input {...register('songDifficulity.standardValue.hard')} value="false" type="checkbox" />
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
            setting.privateRoom = false;
        }
        console.log(setting);
        changeView!('lobby');
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
