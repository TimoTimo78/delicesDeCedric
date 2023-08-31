import { createStore, combineReducers } from "redux";
import { cart } from "./cart";
import { user } from "./user";

const reducer = combineReducers({
  cart,
  user,
});
export const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
