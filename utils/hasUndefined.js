function hasUndefined(data) {
    // data.forEach((element) => {
    //     console.log(element);
    //     console.log(typeof(element));
    //     console.log(`Is value undefined? ${element === undefined}`);
    //     if (element === undefined) {
    //         console.log("Yes, it was undefined.");
    //         return true;
    //     }
    // });
    for (let i = 0; i < data.length; i++) {
        if (data[i] === undefined) {
            console.log(i, data[i]);
            return true;
        }
    }
    
    return false;
}

module.exports = hasUndefined;


// for와 forEach의 명확한 차이를 느낄 수 있는 코드

// 다음 코드에서 콜백함수 안의 return의 종료 범위는 콜백함수인가?
// function hasUndefined(data) {
//     data.forEach((element) => {
//         console.log(element);
//         console.log(typeof(element));
//         console.log(`Is value undefined? ${element === undefined}`);
//         if (element === undefined) {
//             console.log("Yes, it was undefined.");
//             return true; // return의 종료 범위는 콜백함수인가? hasUndefined가 아니라?
//         }
//     });
//     console.log("No, it wasn't undefined");
//     return false;
// }