export class ControllerResolver {

    constructor(container) {
        this.container = container;
    }

    resolve(target) {

        if (!Array.isArray(target)) {
            return target;
        }

        const [Controller, method] =
            target;

        const instance =
            this.container.make(
                Controller
            );

        if (
            typeof instance[method] !==
            "function"
        ) {
            throw new Error(
                `${Controller.name}.${method}() does not exist.`
            );
        }

        return instance[method].bind(instance);
    }
}
