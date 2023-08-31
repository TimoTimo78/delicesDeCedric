import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Layout from "./components/Layout";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Orders from "./components/Orders";
import Payment from "./components/Payment";
import Product from "./components/Product";
import Home from "./components/Home";
import "./App.css";
function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/cart" component={Cart} />
          <Route path="/product" render={(props) => <Product {...props} />} /> {/* Utilisation de render */}
          <Route path="/checkout" component={Checkout} />
          <Route path="/orders" component={Orders} />
          <Route path="/payment" component={Payment} />
        </Switch>
      </Layout>
    </Router>
  );
}
export default App;