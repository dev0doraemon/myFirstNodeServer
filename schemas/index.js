const mongoose = require("mongoose");
const DBNAME = "notice";

const connect = () => {
    // http://localhost로 시작하면 연결이 되는 버그 있음
    // 윈도우는 127.0.0.1로 시작하는 것을 권장
    mongoose.connect(`mongodb://127.0.0.1:27017/${DBNAME}`)
    .catch(err => console.log(err));

    console.log("MongoDB is connected!");
};

mongoose.connection.on("error", err => {
    console.error("Error occurred!!", err);
});

module.exports = connect;