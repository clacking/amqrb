import { AMQAvater } from '../interface/AMQAvater.interface';

const getAvatarImg = (avatarName: string, outfitName: string, optionName: string, colorName: string) =>
`https://cdn.animemusicquiz.com/v1/avatars/${avatarName}/${outfitName}/${optionName}/${colorName}/500px/Basic.webp`;

export const getAvatar = (u: AMQAvater) => {
    const { avatarName , outfitName, optionName, colorName } = u.avatar;
    return getAvatarImg(avatarName, outfitName, optionName, colorName);
}

const getBackgroundImg = (ext: 'webp' | 'svg' | string, filename: string): string => {
    const type = (ext==='webp') ? '250px' : 'svg';
    return `https://cdn.animemusicquiz.com/v1/backgrounds/${type}/${filename}`;
}

export const getBackground = (u: AMQAvater, orientation: 'vert' | 'hori'): string => {
    const { backgroundHori, backgroundVert } = u.background;
    const link = orientation === 'vert' ? backgroundVert : backgroundHori;
    if (!link) return '';
    const ext = (link.split('.')[1] === 'webp') ? 'webp' : 'svg';
    return getBackgroundImg(ext, link);
}

export type EmojiSize = '150px' | '30px';

export const getEmojiImage = (emoteName: string, size: EmojiSize): string => 
    `https://cdn.animemusicquiz.com/emotes/${size}/${emoteName}.png`;
