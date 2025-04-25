import dayjs from "dayjs";

import weekday from "dayjs/plugin/weekday";
import advancedFormat from "dayjs/plugin/advancedFormat";
import localeData from "dayjs/plugin/localeData";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";
import customParseFormat from "dayjs/plugin/customParseFormat";

export const initDayjs = () => {
  dayjs.extend(customParseFormat);
  dayjs.extend(advancedFormat);
  dayjs.extend(weekday);
  dayjs.extend(localeData);
  dayjs.extend(weekOfYear);
  dayjs.extend(weekYear);

  dayjs.locale("en");
};
