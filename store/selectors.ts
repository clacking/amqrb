import { useSelector } from 'react-redux';
import { CurrentListState } from './listSlice';
import { UserStatusState } from './userStatusSlice';

export const useAnilistChangeState = () => {
  return useSelector((state: { currentList: CurrentListState }) => state);
}

export const useUserStatus = () => {
  return useSelector((state: { userStatus: UserStatusState }) => state.userStatus);
}
