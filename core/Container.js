export class Container {
    constructor() {
        this.bindings = new Map();
        this.instances = new Map();
    }

    bind(name, factory) {
        this.bindings.set(name, factory);

        return this;
    }

    singleton(name, factory) {
        this.bindings.set(name, factory);

        return this;
    }

    make(name) {
        if (this.instances.has(name)) {
            return this.instances.get(name);
        }

        const factory = this.bindings.get(name);

        if (!factory) {
            throw new Error(
                `Service "${name}" is not registered.`
            );
        }

        const instance = factory(this);

        this.instances.set(name, instance);

        return instance;
    }
}
