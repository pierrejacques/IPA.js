const key = Symbol('ipa-build-in-increaser-counter');

export default (subTemplate) => ({ compile, cache }) => {
    if (!cache.has(key)) {
        cache.set(key, 0);
    }
}
// TODO:
