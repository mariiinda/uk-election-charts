import { SET_UK_SEATS } from "../constants/action-types";

const initialState = [];

const ukSeatsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_UK_SEATS:
      return action.seats;

    default:
      return state;
  }
};

export default ukSeatsReducer;
