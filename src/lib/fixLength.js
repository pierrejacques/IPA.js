export default ({ itemTemplate, targetLength, array, mocker }) => {
    if (array.length > targetLength) {
        array.splice(targetLength);
    } else {
        for (let i = 0; i < targetLength - array.length; i++) {
            array.push(mocker(itemTemplate));
        }
    }
};
