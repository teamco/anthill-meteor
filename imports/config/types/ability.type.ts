export enum EAbilityAction {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
  ALL = 'all',
}

export type TAbility = {
  action?: EAbilityAction;
  subject: string;
};
