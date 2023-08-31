import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PaypalExpressBtn from "react-paypal-express-checkout";
import { selectCartTotal } from "../../lib/redux/selectors";
import { resetCart } from '../../lib/redux/reducers/cart'
import { scrolltoTop } from "./utils";
import { useMutation } from '@apollo/client'
import { ADD_ORDER } from '../../lib/queries'
import Row from "./Row";
import Input from "./Input";
import Alert from "./Alert";
import { nextDaydelivery } from "./utils"

// const styles = {
//   width: "100%",
//   shape: "rect",
//   size: "large",
//   color: "gold",
// };
const client = {
  sandbox:
    "<ClientID>", /* remplacer avec votre CLIENT ID : à récupérer sur https://developer.paypal.com/developer/applications*/
  production: "<ClientID>",
  env: "sandbox" /* change to 'production' for production purposes */,
};

const STATUS = {
  PENDING: "pending",
  COMPLETE: "complete",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  FAILED: "error",
};
function Payment({ history }) {
  const dispatch = useDispatch()
  const items = useSelector((state) => state.cart.items);
  const { current } = useSelector(state => state.user)
  const total = useSelector(selectCartTotal);
  const [mutate, loading] = useMutation(ADD_ORDER)
  const [isValid, setValid] = useState(false);
  const [status, setStatus] = useState(STATUS.PENDING);

  const processPayment = (payment) => {
    return new Promise((resolve) => {
      const data = {
        cartDetails: items,
        paymentData: payment,
      };
      console.log("The payment was succeeded!", payment);
      resolve(data);
    });
  };
  const addOrder = () => {
    console.dir(current)
    return new Promise((resolve) => {
      const newOrder = {
        id: new Date().getMilliseconds(),
        ownerId: current.googleId,
        clientDetails: `${current.familyName}, ${current.givenName}`,
        date: new Date(),
        pickupDate: nextDaydelivery(),
        total: total,
        items: items,
      }
      mutate({ variables: newOrder })
      console.log("order successfully confirmed and added", newOrder);
      resolve();
    });
  };
  const confirmOrder = () => {
    return new Promise((resolve) => {
      setStatus(STATUS.CONFIRMED);
      dispatch(resetCart())
      resolve();
    });
  };

  const handleOnSubmit = async (e) => {
    console.log(e);
    e.preventDefault();
    await addOrder();
    await confirmOrder();
    await scrolltoTop();
    setTimeout(() => history.push('/'), 3000)
  };

  const onSuccess = async (payment) => {
    await processPayment(payment);
    setStatus(STATUS.COMPLETE);
  };
  const onCancel = async (data) => {
    console.log("The payment was cancelled!", data);
    setStatus(STATUS.CANCELLED);
  };
  const onError = async (err) => {
    console.log("Error!", err);
  };
  useEffect(() => setValid(status === STATUS.COMPLETE), [status]);
  return (
    <section className="pt-5 pb-5">
      <div className="container">
        {/* Alert messages HERE */}
        <Alert.Confirmed status={status === STATUS.CONFIRMED} />
        <Alert.Cancelled status={status === STATUS.CANCELLED} />
        <Alert.Error status={status === STATUS.FAILED} />
        <div className="py-5 text-center row justify-content-center">
          <div className="col-md-10">
            <h2>Checkout</h2>
          </div>
        </div>
        <div className="row justify-content-center rounded shadow pt-5 pb-5 bg-white ">
          <div className="col-md-4 offset-1 order-md-2 mb-4">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted">Your cart</span>
              <span className="badge badge-secondary badge-pill">3</span>
            </h4>
            <ul className="list-group mb-3">
              {items?.map((item) => (
                <Row key={item} {...item} />
              ))}
              <li className="list-group-item d-flex justify-content-between">
                <span>Total (EUR)</span>
                <strong>€{total.toFixed(2) || "0.00"}</strong>
              </li>
            </ul>
            <form className="card p-2">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Promo code"
                />
                <div className="input-group-append">
                  <button type="submit" className="btn btn-secondary">
                    Redeem
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="col-md-6 order-md-1">
            <form onSubmit={handleOnSubmit}>
              <h4 className="mb-3">Payment</h4>
              <hr className="mb-4" />
              <div className="row">
                <Input
                  label="Name on the card"
                  className="col-md-6 mb-3"
                  id="cc-name"
                >
                  Name on card is required
                </Input>
                <Input
                  label="Credit card number"
                  className="col-md-6 mb-3"
                  id="cc-number"
                >
                  Credit card number is required
                </Input>
              </div>
              <div className="row">
                <Input
                  className="col-md-3 mb-3"
                  label="Expiration"
                  id="cc-expiration"
                >
                  Expiration date required
                </Input>
                <Input className="col-md-3 mb-3" label="CVV" id="cc-cvv">
                  Security code required
                </Input>
              </div>
              {/* Paypal Button */}
              <PaypalExpressBtn
                env={client.env}
                client={client}
                currency="EUR"
                total={total}
                onError={onError}
                onSuccess={onSuccess}
                onCancel={onCancel}
              />
              <hr className="mb-4" />
              <button
                className="btn btn-primary btn-lg btn-block"
                type="submit"
                disabled={!isValid}
              >
                <i class="far fa-credit-card"></i> Confirm
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Payment;
