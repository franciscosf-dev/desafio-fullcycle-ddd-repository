import { Sequelize } from "sequelize-typescript";
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import Product from "../../domain/entity/product";
import CustomerModel from "../db/sequelize/model/customer.model";
import CustomerRepository from "./customer.repository";
import ProductModel from "../db/sequelize/model/product.model";
import ProductRepository from "./product.repository";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("C1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("P1", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "OI1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("O1", "C1", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const customer2 = new Customer("C2", "Customer 2");
    const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
    customer2.changeAddress(address2);
    await customerRepository.create(customer2);   

    order.changeCustomerId(customer2.id);
    
    await orderRepository.update(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "O1",
      customer_id: "C2",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "O1",
          product_id: "P1",
        },
      ],
    });

  });

  it("should find a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("C1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("P1", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "OI1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("O1", "C1", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderResult = await orderRepository.find(order.id);

    expect(order).toStrictEqual(orderResult);
  });

  it("should find all orders", async () => {
    
    const customerRepository = new CustomerRepository();

    const customer = new Customer("C1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);

    await customerRepository.create(customer);

    const customer2 = new Customer("C2", "Customer 2");
    const address2 = new Address("Street 2", 1, "Zipcode 2", "City 1");
    customer2.changeAddress(address2);

    await customerRepository.create(customer2);
    
    const productRepository = new ProductRepository();

    const product = new Product("P1", "Product 1", 10);
    await productRepository.create(product);
    const product2 = new Product("P2", "Product 2", 15);
    await productRepository.create(product2);

    const orderRepository = new OrderRepository();

    const orderItem = new OrderItem(
      "OI1",
      product.name,
      product.price,
      product.id,
      1
    );
    const order = new Order("O1", "C1", [orderItem]);

    await orderRepository.create(order);

    const orderItem2 = new OrderItem(
      "OI2",
      product2.name,
      product2.price,
      product2.id,
      2
    );

    const order2 = new Order("O2", "C2", [orderItem2]);
    
    await orderRepository.create(order2);

    const orders = await orderRepository.findAll();

    expect(orders).toHaveLength(2);
    expect(orders).toContainEqual(order);
    expect(orders).toContainEqual(order2);
  });

});
