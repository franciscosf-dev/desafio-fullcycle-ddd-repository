import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      let order = new Order("", "123", []);
    }).toThrowError("Id is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => {
      let order = new Order("123", "", []);
    }).toThrowError("CustomerId is required");
  });

  it("should throw error when items is empty", () => {
    expect(() => {
      let order = new Order("123", "123", []);
    }).toThrowError("Items are required");
  });

  it("should calculate total", () => {
    const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
    const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
    const order = new Order("o1", "c1", [item]);

    let total = order.total();

    expect(order.total()).toBe(200);

    const order2 = new Order("o1", "c1", [item, item2]);
    total = order2.total();
    expect(total).toBe(600);
  });

  it("should throw error if the item qte is less or equal zero 0", () => {
    expect(() => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 0);
      const order = new Order("o1", "c1", [item]);
    }).toThrowError("Quantity must be greater than 0");
  });

  it("should change customerId", () => {
    const orderItem = new OrderItem("1","Product 1",15,"P1",2);
    const order = new Order("O1", "C1", [orderItem]);

    order.changeCustomerId("C2");

    // Assert
    expect(order.customerId).toBe("C2");
  });

  it("should additem", () => {
    const orderItem = new OrderItem("1","Product 1",15,"P1",2);
    const order = new Order("O1", "C1", [orderItem]);
    const orderItem2 = new OrderItem("2","Product 2",25,"P2",3);
    order.addItem(orderItem2);

    // Assert
    expect(order.items).toEqual([orderItem,orderItem2]);
    let total = order.total();
    expect(total).toBe(105);
  });

  it("should change itens", () => {
    const orderItem = new OrderItem("1","Product 1",15,"P1",2);
    const order = new Order("O1", "C1", [orderItem]);
    const orderItem2 = new OrderItem("2","Product 2",25,"P2",3);

    const orderItem3 = new OrderItem("3","Product 3",20,"P3",1);
    const orderItem4 = new OrderItem("4","Product 4",30,"P4",4);
    
    order.changeItens([orderItem3,orderItem4]);

    // Assert
    expect(order.items).toEqual([orderItem3,orderItem4]);
    let total = order.total();
    expect(total).toBe(140);
  });
});
