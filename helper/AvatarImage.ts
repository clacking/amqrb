import { AMQAvater } from '../interface/AMQAvater.interface';

export const getAvatarImg = (avatarName: string, outfitName: string, optionName: string, colorName: string) =>
`https://cdn.animemusicquiz.com/v1/avatars/${avatarName}/${outfitName}/${optionName}/${colorName}/500px/Basic.webp`;

export const getAvatar = (u: AMQAvater) => {
    const { avatarName , outfitName, optionName, colorName } = u.avatar;
    return getAvatarImg(avatarName, outfitName, optionName, colorName);
}
