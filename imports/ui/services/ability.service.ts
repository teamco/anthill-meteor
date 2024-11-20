import { IUser } from '/imports/config/types';

import { createMongoAbility, Subject, MongoQuery, AbilityBuilder } from '@casl/ability';

type PossibleAbilities = [string, Subject];
type Conditions = MongoQuery;

const ability = createMongoAbility<PossibleAbilities, Conditions>();

export function defineAbilityFor(user: IUser) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  can('manage', 'all');

  return build();
}