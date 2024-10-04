const db = require("../db.js"); // Assuming you have a DB connection setup

class Customers {
  // Get all customers (Basic info for listing)
  static async getCustomers() {
    const query = `
        SELECT
            customerID as id,
            username,
            email,
            phoneNumber,
            gender,
            dateOfBirth,
            (
                SELECT GROUP_CONCAT(address SEPARATOR ' | ')
                FROM ShippingAddresses
                WHERE customerID = c.customerID
            ) as shippingAddresses
        FROM Customers c;
    `;
    const [result] = await db.execute(query);
    return result;
}

  static async getCustomerById(id) {
    const query = `
      SELECT
        customerID as id,
        username,
        CONCAT(firstName, ' ', lastName) as name,  -- Concatenating firstName and lastName as name
        email,
        phoneNumber,
        gender,
        dateOfBirth,
        (
          SELECT GROUP_CONCAT(address SEPARATOR ' | ') 
          FROM ShippingAddresses 
          WHERE customerID = ?
        ) as shippingAddresses
      FROM Customers
      WHERE customerID = ?;
    `;
    const [result] = await db.execute(query, [id, id]);
    return result;
  }
  
  
  // Delete customer and their associated shipping addresses by customer ID
  static async deleteCustomer(id) {
    // Delete shipping addresses associated with the customer
    const deleteAddressesQuery =
      "DELETE FROM ShippingAddresses WHERE customerID = ?";
    await db.execute(deleteAddressesQuery, [id]);

    // Delete the customer
    const deleteCustomerQuery = "DELETE FROM Customers WHERE customerID = ?";
    await db.execute(deleteCustomerQuery, [id]);

    return {
      message:
        "Customer and their associated shipping addresses deleted successfully",
    };
  }
}

module.exports = Customers;
