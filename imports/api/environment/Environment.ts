import { TLayout, TEnvironment, IUser, IMetadata, TStatus, TWidget } from "/imports/config/types";

import CommonUtils from "/imports/utils/common.util";
import { catchClassErrorMsg } from "/imports/utils/message.util";

import Layout from "./Layout";

/**
 * Represents an environment configuration that extends common utilities and implements the TEnvironment interface.
 * Manages the creation and updating of environment layouts and maintains metadata and status information.
 * 
 * @property {string} name - The name of the environment.
 * @property {string} [description] - An optional description of the environment.
 * @property {TLayout} layout - The layout associated with the environment.
 * @property {TStatus} status - The current status of the environment.
 * @property {IMetadata} metadata - Metadata containing creation and update information.
 * 
 * @method create - Initializes the environment with a name, type, and user, optionally including a description.
 * @method createLayout - Creates and initializes the environment layout with user information.
 * @method updateLayout - Updates the environment with a specified layout.
 */
export default class Environment extends CommonUtils implements TEnvironment {

  name: string;
  description?: string;
  layout: TLayout;
  status: Pick<TStatus, 'isDraft' | 'isActive'> = {
    isDraft: false,
    isActive: false
  };
  assignedWidgets: TWidget[] = [];
  metadata: IMetadata = {
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '',
    updatedBy: ''
  };

  constructor(name: string, user: IUser, optional: { description?: string } = {}) {
    super();

    this.create(name, user, optional);
  }

  /**
   * Creates a new environment with a single empty widget
   *
   * @param {string} name - The name of the environment
   * @param {IUser} user - The user creating the environment
   * @param {Object} [optional] - An object containing optional description
   * @param {string} [optional.description] - The description of the environment
   */
  create(name: string, user: IUser, optional: { description?: string } = {}): void {
    if (!user) return catchClassErrorMsg({ message: 'User is required' });

    this.name = name;
    this.description = optional?.description;
    this.status = {
      ...this.status,
      isDraft: true,
    }
    this.metadata = {
      ...this.metadata,
      createdBy: user?._id,
      updatedBy: user?._id
    }
  }

  /**
   * Initializes the environment with an empty layout.
   * The layout is created with the given user information.
   *
   * @param {IUser} user - The user creating the environment.
   * @returns {TLayout} The created layout.
   */
  createLayout(user: IUser): TLayout {
    this.layout = new Layout(user);
    return this.layout;
  }

  /**
   * Updates the environment with the given layout.
   * @param {TLayout} layout - The layout to update the environment with.
   * @returns {TLayout} The updated layout.
   */
  updateLayout(layout: TLayout): TLayout {
    this.layout = layout;
    return this.layout;
  }
}