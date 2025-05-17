import { IUser } from '/imports/config/types';

import {
  createMongoAbility,
  Subject,
  MongoQuery,
  AbilityBuilder,
  MongoAbility,
} from '@casl/ability';

type PossibleAbilities = [string, Subject];
type Conditions = MongoQuery;

const ability = createMongoAbility<PossibleAbilities, Conditions>();

/**
 * Defines the ability for a given user.
 * Grants the user the ability to manage all resources by default.
 *
 * @param {IUser} user - The user for whom the abilities are being defined.
 * @returns {MongoAbility} The MongoAbility instance representing the user's
 * abilities.
 */
export function defineAbilityFor(user: IUser | null): MongoAbility {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  can('manage', 'all');

  // cannot('access', 'signin');

  return build();
}
