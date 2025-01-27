/// <reference types="jest" />
declare type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : unknown extends T[P]
    ? T[P]
    : DeepPartial<T[P]>;
};
export declare type PartialFuncReturn<T> = {
  [K in keyof T]?: T[K] extends (...args: infer A) => infer U
    ? (...args: A) => PartialFuncReturn<U>
    : DeepPartial<T[K]>;
};
export declare type DeepMocked<T> = {
  [K in keyof T]: Required<T>[K] extends (...args: any[]) => infer U
    ? jest.MockInstance<ReturnType<Required<T>[K]>, jest.ArgsType<T[K]>> &
        ((...args: jest.ArgsType<T[K]>) => DeepMocked<U>)
    : T[K];
} & T;
export declare type MockOptions = {
  name?: string;
};
export declare const createMock: <T extends object>(
  partial?: PartialFuncReturn<T>,
  options?: MockOptions
) => DeepMocked<T>;
export {};
//# sourceMappingURL=mocks.d.ts.map
