import { useDispatch, useSelector, useStore } from 'react-redux';
import type { RootState, AppDispatch } from './configStore';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<typeof import('./configStore').store>();
