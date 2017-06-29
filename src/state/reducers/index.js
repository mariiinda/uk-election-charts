import { combineReducers } from "redux";

import years from "./years";
import activeYear from "./activeYear";
import ukSeats from "./ukSeats";

export default combineReducers({
  activeYear,
  years,
  ukSeats
});
