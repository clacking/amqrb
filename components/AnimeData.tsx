
export type AnimeBoxData = {
    animeId: number | string;
    coverImage: string;
    titleNative: string;
    titleRomaji: string;
    titleEnglish: string;
    selected?: boolean;
}

const AnimeData = ({...props}: AnimeBoxData) => {
    return (
        <div className={"flex my-2 p-2 rounded animedata" + ( props.selected ? ' bg-green-800' : ' bg-gray-600' )}>
            <img className="rounded-lg w-12 mr-2" loading="lazy" src={props.coverImage} />
            <div>
                <p>{props.titleNative}</p>
                <p>{props.titleRomaji}</p>
                <p>{props.titleEnglish}</p>
            </div>
        </div>
    )
}

export default AnimeData;
