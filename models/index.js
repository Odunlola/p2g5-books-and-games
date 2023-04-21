// const seededData = require("./seededData");

require("../config/connection");

module.exports = {
    Products : require("./Products"),
    seededData : require("./seededData"),
    Users : require("./Users"),
    Comments : require("./Comments")
};



