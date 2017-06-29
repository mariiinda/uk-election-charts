import {
  INCREMENT_COUNTER,
  DECREMENT_COUNTER
} from "../constants/action-types";

export const incrementCounter = count => ({
  type: INCREMENT_COUNTER,
  count
});

export const decrementCounter = count => ({
  type: DECREMENT_COUNTER,
  count
});
