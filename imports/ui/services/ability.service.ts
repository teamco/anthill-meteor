import { createMongoAbility, AbilityBuilder, MongoAbility, MongoQuery, AbilityTuple } from '@casl/ability';
import { IUser } from '/imports/config/types';

export function defineAbilityFor(user: IUser): MongoAbility<AbilityTuple, MongoQuery> {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  can('manage', 'all');

  return build();
}