import React from 'react';
import { ISwipeableContext } from './types';

export const SwipeableContext = React.createContext<ISwipeableContext>(
  {} as ISwipeableContext
);

export const useSwipeableContext = (): ISwipeableContext =>
  React.useContext<ISwipeableContext>(SwipeableContext);
