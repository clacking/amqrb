import { AMQAvater } from '../interface/AMQAvater.interface';

export const getAvatarImg = (avatarName: string, outfitName: string, optionName: string, colorName: string) =>
`https://cdn.animemusicquiz.com/v1/avatars/${avatarName}/${outfitName}/${optionName}/${colorName}/500px/Basic.webp`;

export const getAvatar = (u: AMQAvater) => {
    const { avatarName , outfitName, optionName, colorName } = u.avatar;
    return getAvatarImg(avatarName, outfitName, optionName, colorName);
}

// https://cdn.animemusicquiz.com/v1/backgrounds/250px/Miyu_Standard_dolce_hori.webp

const getBackgroundImg = (ext: 'webp' | '250px' | string, filename: string) =>
`https://cdn.animemusicquiz.com/v1/backgrounds/svg/Hibiki_standard_red_hori.svg`;

export const getBackground = (u: AMQAvater, orientation: 'vert' | 'hori') => {
    const { backgroundHori, backgroundVert } = u.background;
    const link = orientation === 'vert' ? backgroundVert : backgroundHori;
    const ext = link.split('.')[1] === 'webp' ? 'svg' : '250px';
    return getBackgroundImg(ext, link);
}
