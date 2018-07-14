const callers = [];

export default {
    get root() {
        return callers[0];
    },
    get current() {
        return callers[callers.length - 1];
    },
    push(caller) {
        callers.push(caller);
    },
    pop() {
        callers.pop();
    },
};
