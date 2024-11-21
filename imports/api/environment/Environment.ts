import { TLayout, TEnvironment, IUser, IMetadata, TStatus } from "/imports/config/types";
import CommonUtils from "/imports/utils/common.util";

import Layout from "./Layout";

export default class Environment extends CommonUtils implements TEnvironment {

  name: string;
  type: string;
  description?: string;
  layout: TLayout;
  status: TStatus = {
    isDraft: false,
    isActive: false,
    isPending: false
  };
  metadata: IMetadata = {
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '',
    updatedBy: ''
  };

  constructor(name: string, type: string, user: IUser, optional: { description?: string } = {}) {
    super();

    this.create(name, type, user, optional);
  }

  /**
   * Creates a new environment with a single empty widget
   *
   * @param {string} name - The name of the environment
   * @param {string} type - The type of the environment
   * @param {IUser} user - The user creating the environment
   * @param {Object} [optional] - An object containing optional description
   * @param {string} [optional.description] - The description of the environment
   */
  create(name: string, type: string, user: IUser, optional: { description?: string } = {}): void {
    this.name = name;
    this.description = optional?.description;
    this.type = type;
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