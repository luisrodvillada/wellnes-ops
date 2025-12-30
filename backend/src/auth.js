const bcrypt = require("bcryptjs");

const USER = {
    id: 1,
    username: "admin",
    passwordHash: bcrypt.hashSync("admin123", 10)
};

module.exports = { USER };
