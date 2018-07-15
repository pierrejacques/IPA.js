import { IPALike } from "./peer-classes";

const callers: Array<IPALike> = [];

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
