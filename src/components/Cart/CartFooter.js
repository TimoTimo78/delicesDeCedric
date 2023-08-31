import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartTotal } from "../../lib/redux/selectors";

const styles = {
  disabled: {
    cursor: "not-allowed",
    opacity: 0.5,
  }
};

function CartFooter() {
  const total = useSelector(selectCartTotal);
  const items = useSelector((state) => state.cart.items);
  return (
    <>
      <td className="text-right mb-4">
        <h4>Total:</h4>
        <h1>€{total.toFixed(2)}</h1>
      </td>
      <td className="d-flex h-100 justify-content-between">
        <Link to="/">
          <i className="fas fa-arrow-left mr-2"></i> Continuez vos achats
        </Link>
        <Link
          className="btn btn-primary mb-4 btn-lg pl-5 pr-5"
          to="/checkout"
          style={!items.length ? styles.disabled : {}}
        >
          Valider
        </Link>
      </td>
    </>
  );
}
export default CartFooter;
