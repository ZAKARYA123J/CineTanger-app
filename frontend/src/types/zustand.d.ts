declare module "zustand" {
  export function create<T>(initializer: any): any;
}

declare module "zustand/middleware" {
  export function persist<T>(initializer: any, options: any): any;
  export function createJSONStorage(getStorage: any): any;
}

