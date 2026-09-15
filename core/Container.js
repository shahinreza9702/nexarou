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
        // Singleton instance আগে থেকেই আছে?
        if (this.instances.has(token)) {
            return this.instances.get(token);
        }

        // Registered binding আছে?
        if (this.bindings.has(token)) {
            const binding = this.bindings.get(token);

            const instance =
                this.resolveValue(binding.value);

            if (binding.singleton) {
                this.instances.set(
                    token,
                    instance
                );
            }

            return instance;
        }

        // সরাসরি class দিলে instantiate করার চেষ্টা
        if (typeof token === "function") {
            return this.build(token);
        }

        throw new Error(
            `Service "${String(token)}" is not registered.`
        );
    }

    resolveValue(value) {
        if (typeof value === "function") {
            return this.build(value);
        }

        return value;
    }

    build(Class) {
        const dependencies =
            this.getDependencies(Class);

        const resolvedDependencies =
            dependencies.map(
                dependency =>
                    this.make(dependency)
            );

        return new Class(
            ...resolvedDependencies
        );
    }

    getDependencies(Class) {
        const constructor =
            Class.toString();

        const match =
            constructor.match(
                /constructor\s*\(([^)]*)\)/
            );

        if (!match) {
            return [];
        }

        const parameters =
            match[1]
                .split(",")
                .map(param =>
                    param.trim()
                )
                .filter(Boolean);

        return parameters.map(
            name => {
                const dependency =
                    globalThis[name];

                if (!dependency) {
                    throw new Error(
                        `Cannot resolve dependency "${name}".`
                    );
                }

                return dependency;
            }
        );
    }
}
