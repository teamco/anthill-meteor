import React, { Dispatch, FC, SetStateAction } from 'react';
import { RightSquareTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import './layoutHeader.module.less';

type THeaderProps = {
  title: string; 
  onMenuOpen: Dispatch<SetStateAction<boolean>>
}

export const LayoutHeader: FC<THeaderProps> = (props): JSX.Element => {
  const { title, onMenuOpen } = props;

  const history = useNavigate();

  return (
    <div className='layoutHeader'>
      <div>
        <RightSquareTwoTone onClick={() => onMenuOpen(true)} />
        <h2 onClick={() => history('/dashboard')}>{title}</h2>
      </div>
    </div>
  );
};
