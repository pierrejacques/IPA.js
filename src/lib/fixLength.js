export default (target, arrayIn, mocker) => {
    const array = arrayIn;
    if (array.length > target) {
        array.splice(target);
    } else {
        for (let i = 0; i < target - array.length; i++) {
            array.push(mocker(template[0]));
        }
    }
};
