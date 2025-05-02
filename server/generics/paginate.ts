import { TPaginateProps } from '/imports/config/types';

const DEFAULT_SORT: TPaginateProps['sort'] = [
  ['metadata', 'updatedAt'],
  'descend',
];

type TLog = {
  location?: { pathname: string };
  api?: { method: string; params: any };
  navType?: string;
};

type TProps = {
  Collection: Mongo.Collection<Document, Document>;
  args: TPaginateProps;
  log: TLog;
  owner?: string;
};

/**
 * Paginates a specified MongoDB collection based on the provided arguments.
 * Logs the request if a log object is provided.
 *
 * @param {Object} param - An object containing the collection, pagination arguments, and log details.
 * @param {Mongo.Collection<Document, Document>} param.Collection - The MongoDB collection to paginate.
 * @param {TPaginateProps} param.args - The pagination parameters, including current page, page size, and sort criteria.
 * @param {TLog} param.log - Optional logging details, including pathname and method.
 * @returns {any[]} An array of documents from the specified collection, fetched according to the pagination parameters.
 */
export const paginate = ({
  Collection,
  args,
  log,
  owner = Meteor.userId(),
}: TProps): any[] => {
  let [field, order] = args.sort;

  if (!field || field === 'metadata') field = DEFAULT_SORT[0];
  if (!order) order = DEFAULT_SORT[1];

  const data = {
    location: { pathname: log?.location?.pathname },
    api: {
      method: log?.api?.method,
      params: {
        skip: (args.current - 1) * args.pageSize,
        limit: args.pageSize,
        sort: [
          typeof field === 'string' ? field : field.join('.'),
          order === 'ascend' ? 1 : -1,
        ],
      },
    },
    navType: log?.navType,
  };

  if (log) Meteor.call('userLogInsert', { ...data });

  const query = owner ? { 'metadata.createdBy': owner } : {};

  return Collection.find(query, data.api.params).fetch();
};
