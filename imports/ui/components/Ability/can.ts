import { createContextualCan } from '@casl/react';
import { AbilityContext } from '../../context/authentication.context';

export const Can = createContextualCan(AbilityContext.Consumer);