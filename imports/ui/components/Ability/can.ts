import { Consumer } from 'react';
import { createContextualCan } from '@casl/react';
import { AnyAbility } from '@casl/ability';

import { AbilityContext } from '/imports/ui/context/authentication.context';

export const Can = createContextualCan(
  AbilityContext.Consumer as unknown as Consumer<AnyAbility>,
);
