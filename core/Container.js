export class Container {

    constructor() {
        this.bindings = new Map();
        this.instances = new Map();
    }

    bind(token, value) {
        this.bindings.set(token, {
            value,
            singleton: false
        });

        return this;
    }

    singleton(token, value) {
        this.bindings.set(token, {
            value,
            singleton: true
        });

        return this;
    }

    make(token) {

        if (this.instances.has(token)) {
            return this.instances.get(token);
        }

        if (this.bindings.has(token)) {

            const binding =
                this.bindings.get(token);

            const instance =
                this.build(binding.value);

            if (binding.singleton) {
                this.instances.set(
                    token,
                    instance
                );
            }

            return instance;
        }

        if (typeof token === "function") {
            return this.build(token);
        }

        throw new Error(
            `Unable to resolve "${String(token)}"`
        );
    }

    build(Class) {

        const dependencies =
            Class.dependencies || [];

        const resolved =
            dependencies.map(
                dependency =>
                    this.make(dependency)
            );

        return new Class(...resolved);
    }
}
