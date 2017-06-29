import { SET_YEARS } from "../constants/action-types";

const initialState = [];

const yearsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_YEARS:
      return action.years;

    default:
      return state;
  }
};

export default yearsReducer;
