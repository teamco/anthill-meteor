import { createContextualCan } from '@casl/react';
import { AbilityContext } from '/imports/ui/context/authentication.context';

export const Can = createContextualCan(AbilityContext.Consumer);
