import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createRoot } from 'react-dom/client';

import dayjs from 'dayjs';

import weekday from 'dayjs/plugin/weekday';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import localeData from 'dayjs/plugin/localeData';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import App from '/imports/ui/App';
import { MongoInternals } from 'meteor/mongo';

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

dayjs.locale('en');

Meteor.startup(() => {
  const container = document.getElementById('react-target');
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App/>
    </React.StrictMode>
  );
});
