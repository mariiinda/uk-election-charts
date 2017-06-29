import { SET_ACTIVE_YEAR } from "../constants/action-types";

const initialState = "";

const activeYearReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_YEAR:
      return action.activeYear;

    default:
      return state;
  }
};

export default activeYearReducer;
