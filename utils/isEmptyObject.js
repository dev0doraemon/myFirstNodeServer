function isEmptyObejct(obj) {
    if (typeof(obj) !== 'object') {
        try {
            throw Error("The input of checkEmptyObject is not an object");
        } catch (err) {
            console.error(err);
        }
    }

    if (Object.keys(obj).length > 0) {
        return false;
    }

    return true;
}

module.exports = isEmptyObejct;