import { createContext } from 'react';
import { MongoAbility } from '@casl/ability';

import { IUser } from '/imports/config/types';

export const AuthenticationContext = createContext<IUser | null>(null);
export const AbilityContext = createContext<MongoAbility | null>(null);
