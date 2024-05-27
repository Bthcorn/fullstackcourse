import React from "react";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import MyModal from "../component/MyModal";

export default function Index() {
  const [products, setProducts] = React.useState("");
  const [carts, setCarts] = React.useState([]);
  const [items, setItems] = React.useState(0);
  const [sumQty, setSumQty] = React.useState(0);
  const [sumPrice, setSumPrice] = React.useState(0);
  // const [firstRender, setFirstRender] = React.useState(false);

  React.useEffect(() => {
    fetchData();
    fetchDataFromLocal();
    // setItems(carts.length);
    // console.log(products);
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(config.apiPath + "/product/list");

      if (res.data.result !== undefined) {
        setProducts(res.data.result);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  };

  const showImage = (product) => {
    return product.img && product.img !== "" && product.img !== undefined ? (
      <img
        src={config.apiPath + "/uploads/" + product.img}
        className="card-img-top"
        height="300px"
        alt={product.name}
      />
    ) : (
      <img
        src="https://via.placeholder.com/150"
        className="card-img-top"
        height="300px"
        alt={product.name}
      />
    );
  };

  const addToCart = (product) => {
    let arr = carts ?? [];
    arr.push(product);

    setCarts(arr);
    setItems(carts.length);
    console.log(carts);
    localStorage.setItem("carts", JSON.stringify(carts));

    fetchDataFromLocal();

    // computeTotal();
    // const Cart = JSON.parse(localStorage.getItem("carts"));
    // localStorage.removeItem("carts");
    // console.log(Cart);
  };

  const fetchDataFromLocal = () => {
    const itemInCart = JSON.parse(localStorage.getItem("carts")) ?? [];
    console.log(itemInCart);
    // console.log(itemInCart.length);
    // console.log(carts)
    setCarts(itemInCart);
    setItems(itemInCart.length);

    computeTotal(itemInCart);
  };

  const computeTotal = (itemInCart) => {
    let sumQty = 0;
    let sumPrice = 0;
    if (itemInCart === undefined || itemInCart === null) {
      itemInCart = carts;
    }
    for (let i = 0; i < itemInCart.length; i++) {
      sumQty += 1;
      sumPrice += parseInt(itemInCart[i].price);
    }

    setSumQty(sumQty);
    setSumPrice(sumPrice);
  };


  return (
    <div className="container-fluid mt-3">
      <div className="h3 float-start">Our Products</div>
      <div className="h6 float-end">
        My Cart{" "}
        <button
          className="btn btn-outline-success ms-2 me-2"
          data-bs-toggle="modal"
          data-bs-target="#modalCart"
        >
          <i className="fa fa-shopping-cart me-2"></i> {items} items
        </button>
      </div>
      <div className="clearfix"></div>
      <div className="row">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div className="col-lg-3 col-md-6 col-sm-12 mt-3" key={product.id}>
              <div className="card m-2">
                {showImage(product)}
                <div className="card-header">{product.name}</div>
                <div className="card-body">
                  <div>Cost: {product.cost.toLocaleString("th-TH")} Baht</div>
                  <div>Price: {product.price.toLocaleString("th-TH")} Baht</div>
                </div>
                <div className="card-footer text-center">
                  <button
                    className="btn btn-primary"
                    onClick={(e) => addToCart(product)}
                  >
                    <i className="fa fa-shopping-cart me-2"></i>Add to Cart
                  </button>
                  {/* <button className='btn btn-danger'>Delete</button> */}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No products available</div>
        )}
      </div>
      <MyModal id="modalCart" title="My Cart">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th scope="col" >
                Name
              </th>
              {/* <th scope="col" className="text-right" width="200px">
                Cost
              </th> */}
              <th scope="col" className="text-right" >
                Price
              </th>
              <th scope="col" className="text-right" >
                Quantity
              </th>
              <th scope="col" className="text-center" width="60px"></th>
            </tr>
          </thead>
          <tbody>
            {carts.length > 0 ? (
              carts.map((product, index) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  {/* <td className="text-right">{product.cost}</td> */}
                  <td className="text-right">{product.price.toLocaleString('th-Th')}</td>
                  <td>1
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-danger ml-2"
                      // onClick={(e) => handleRemove(product)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <></>
            )}
          </tbody>
        </table>

        <div className="text-center">
          <div className="h4">Items: {sumQty} Total: {sumPrice.toLocaleString('th-TH')} Baht</div>
          {/* <div className="h6">Total: {sumPrice.toLocaleString('th-TH')} Baht</div> */}
          <div className="text-start mt-3 gap-2">
            <div className="alert alert-info">
              <div>
                Please transfer money to the following account
              </div>
              <div>
                <i className="fa fa-bank me-2"></i>Siam Commercial Bank
              </div>
              <div>
                <i className="fa fa-bank me-2"></i>123-4-56789-0
              </div>
              <div>
                <i className="fa fa-user me-2"></i>Bowornthat Chiangthong
              </div>
              <div>
                <i className="fa fa-info-circle me-2"></i>Fill in your information
              </div>
            </div>
            <div className="mt-3">
              <div>Name</div>
              <input type="text" className="form-control" />
            </div>
            <div className="mt-3">
              <div>Address</div>
              <textarea className="form-control"></textarea>
            </div>
            <div className="mt-3">
              <div>Phone</div>
              <input type="text" className="form-control" />
            </div>
            <div className="mt-3">
              <div></div>Email</div>
              <input type="text" className="form-control" />
            </div>
            <div className="text-start mt-3">
              <div>Payment Date</div>
              <input type="date" className="form-control" onChange={e => console.log(e.target.value)}/>
            </div>
            <div className="text-start mt-3 mb-3">
              <div>Payment Time</div>
              <input type="time" className="form-control" onChange={e => console.log(e.target.value)}/>
            </div>
          <button className="btn btn-success"><i className="fa fa-cart-shopping me-2"></i>Checkout</button>
        </div>
      </MyModal>
    </div>
  );
}
