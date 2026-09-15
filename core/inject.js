export function inject(...dependencies) {
    return function (Class) {
        Class.dependencies = dependencies;

        return Class;
    };
}
