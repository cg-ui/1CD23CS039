const axios = require("axios");
require("dotenv").config();

async function Log(stack, level, packageName, message) {
    const response = await axios.post(
        process.env.LOG_API_URL,
        {
            stack,
            level,
            package: packageName,
            message
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.LOG_API_TOKEN}`,
                "Content-Type": "application/json"
            }
        }
    );

    return response.data;
}

module.exports = Log;