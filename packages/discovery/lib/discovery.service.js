"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoveryService = exports.withMetaAtKey = exports.getComponentMetaAtKey = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("@nestjs/common/constants");
const constants_2 = require("@nestjs/core/injector/constants");
const modules_container_1 = require("@nestjs/core/injector/modules-container");
const metadata_scanner_1 = require("@nestjs/core/metadata-scanner");
const lodash_1 = require("lodash");
/**
 * Attempts to retrieve meta information from a Nest DiscoveredClass component
 * @param key The meta key to retrieve data from
 * @param component The discovered component to retrieve meta from
 */
function getComponentMetaAtKey(key, component) {
    const dependencyMeta = Reflect.getMetadata(key, component.dependencyType);
    if (dependencyMeta) {
        return dependencyMeta;
    }
    if (component.injectType != null) {
        return Reflect.getMetadata(key, component.injectType);
    }
}
exports.getComponentMetaAtKey = getComponentMetaAtKey;
/**
 * A filter that can be used to search for DiscoveredClasses in an App that contain meta attached to a
 * certain key
 * @param key The meta key to search for
 */
const withMetaAtKey = (key) => (component) => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const metaTargets = [
        (0, lodash_1.get)(component, 'instance.constructor'),
        // eslint-disable-next-line @typescript-eslint/ban-types
        component.injectType,
    ].filter((x) => x != null);
    return (0, lodash_1.some)(metaTargets, (x) => Reflect.getMetadata(key, x));
};
exports.withMetaAtKey = withMetaAtKey;
let DiscoveryService = class DiscoveryService {
    constructor(modulesContainer, metadataScanner) {
        this.modulesContainer = modulesContainer;
        this.metadataScanner = metadataScanner;
    }
    /**
     * Discovers all providers in a Nest App that match a filter
     * @param filter
     */
    async providers(filter) {
        if (!this.discoveredProviders) {
            this.discoveredProviders = this.discover('providers');
        }
        return (await this.discoveredProviders).filter((x) => filter(x));
    }
    /**
     * Discovers all controller methods that either directly have a certain meta key attached to them
     * or belong to a controller that has the same meta key attached to them
     * @param metaKey The meta key to scan for
     * @param metaFilter An optional filter for the contents of the meta object
     */
    async methodsAndControllerMethodsWithMetaAtKey(metaKey, metaFilter = () => true) {
        const controllersWithMeta = (await this.controllersWithMetaAtKey(metaKey)).filter((x) => metaFilter(x.meta));
        const methodsFromDecoratedControllers = (0, lodash_1.flatMap)(controllersWithMeta, (controller) => {
            return this.classMethodsWithMetaAtKey(controller.discoveredClass, constants_1.PATH_METADATA);
        });
        const decoratedMethods = (await this.controllerMethodsWithMetaAtKey(metaKey)).filter((x) => metaFilter(x.meta));
        return (0, lodash_1.uniqBy)([...methodsFromDecoratedControllers, ...decoratedMethods], (x) => x.discoveredMethod.handler);
    }
    /**
     * Discovers all providers in an App that have meta at a specific key and returns the provider(s) and associated meta
     * @param metaKey The metakey to scan for
     */
    async providersWithMetaAtKey(metaKey) {
        const providers = await this.providers((0, exports.withMetaAtKey)(metaKey));
        return providers.map((x) => ({
            meta: getComponentMetaAtKey(metaKey, x),
            discoveredClass: x,
        }));
    }
    /**
     * Discovers all controllers in a Nest App that match a filter
     * @param filter
     */
    async controllers(filter) {
        if (!this.discoveredControllers) {
            this.discoveredControllers = this.discover('controllers');
        }
        return (await this.discoveredControllers).filter((x) => filter(x));
    }
    /**
     * Discovers all controllers in an App that have meta at a specific key and returns the controller(s) and associated meta
     * @param metaKey The metakey to scan for
     */
    async controllersWithMetaAtKey(metaKey) {
        const controllers = await this.controllers((0, exports.withMetaAtKey)(metaKey));
        return controllers.map((x) => ({
            meta: getComponentMetaAtKey(metaKey, x),
            discoveredClass: x,
        }));
    }
    /**
     * Discovers all method handlers matching a particular metakey from a Provider or Controller
     * @param component
     * @param metaKey
     */
    classMethodsWithMetaAtKey(component, metaKey) {
        const { instance } = component;
        if (!instance) {
            return [];
        }
        const prototype = Object.getPrototypeOf(instance);
        return this.metadataScanner
            .scanFromPrototype(instance, prototype, (name) => this.extractMethodMetaAtKey(metaKey, component, prototype, name))
            .filter((x) => !!x.meta);
    }
    /**
     * Discovers all the methods that exist on providers in a Nest App that contain metadata under a specific key
     * @param metaKey The metakey to scan for
     * @param providerFilter A predicate used to limit the providers being scanned. Defaults to all providers in the app module
     */
    async providerMethodsWithMetaAtKey(metaKey, providerFilter = () => true) {
        const providers = await this.providers(providerFilter);
        return (0, lodash_1.flatMap)(providers, (provider) => this.classMethodsWithMetaAtKey(provider, metaKey));
    }
    /**
     * Discovers all the methods that exist on controllers in a Nest App that contain metadata under a specific key
     * @param metaKey The metakey to scan for
     * @param controllerFilter A predicate used to limit the controllers being scanned. Defaults to all providers in the app module
     */
    async controllerMethodsWithMetaAtKey(metaKey, controllerFilter = () => true) {
        const controllers = await this.controllers(controllerFilter);
        return (0, lodash_1.flatMap)(controllers, (controller) => this.classMethodsWithMetaAtKey(controller, metaKey));
    }
    async toDiscoveredClass(nestModule, wrapper) {
        const instanceHost = wrapper.getInstanceByContextId(constants_2.STATIC_CONTEXT, wrapper && wrapper.id ? wrapper.id : undefined);
        if (instanceHost.isPending && !instanceHost.isResolved) {
            await instanceHost.donePromise;
        }
        return {
            name: wrapper.name,
            instance: instanceHost.instance,
            injectType: wrapper.metatype,
            dependencyType: (0, lodash_1.get)(instanceHost, 'instance.constructor'),
            parentModule: {
                name: nestModule.metatype.name,
                instance: nestModule.instance,
                injectType: nestModule.metatype,
                dependencyType: nestModule.instance.constructor,
            },
        };
    }
    extractMethodMetaAtKey(metaKey, discoveredClass, prototype, methodName) {
        const handler = prototype[methodName];
        const meta = Reflect.getMetadata(metaKey, handler);
        return {
            meta,
            discoveredMethod: {
                handler,
                methodName,
                parentClass: discoveredClass,
            },
        };
    }
    async discover(component) {
        const modulesMap = [...this.modulesContainer.entries()];
        return Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (0, lodash_1.flatMap)(modulesMap, ([key, nestModule]) => {
            const components = [...nestModule[component].values()];
            return components
                .filter((component) => component.scope !== common_1.Scope.REQUEST)
                .map((component) => this.toDiscoveredClass(nestModule, component));
        }));
    }
};
DiscoveryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [modules_container_1.ModulesContainer,
        metadata_scanner_1.MetadataScanner])
], DiscoveryService);
exports.DiscoveryService = DiscoveryService;
//# sourceMappingURL=discovery.service.js.map