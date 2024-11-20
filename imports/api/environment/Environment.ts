import { TLayout, TEnvironment, IUser, IMetadata, TStatus } from "/imports/config/types";
import CommonUtils from "../../utils/common.util";
import Layout from "./Layout";

export default class Environment extends CommonUtils implements TEnvironment {

  name: string;
  type: string;
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

  constructor(name: string, type: string, user: IUser) {
    super();

    this.create(name, type, user);
  }

  create(name: string, type: string, user: IUser): void {
    this.name = name;
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

  createLayout(user: IUser): TLayout {
    this.layout = new Layout(user);
    return this.layout;
  }

  updateLayout(layout: TLayout): TLayout {
    this.layout = layout;
    return this.layout;
  }
}