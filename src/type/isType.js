export default (val, type) => val !== undefined && val !== null && val.__proto__ === type.prototype;
