
type EnumMethods<T extends string | number> = {
  getKeys: () => string[];
  getValues: () => T[];
  entries: () => [string, T][];
};

type EnumObject<T extends string | number> = Readonly<
  Record<string, T> &
  Record<T, string> &
  EnumMethods<T>
>;

export function useEnum<T extends string | number>(
  obj: Record<string, T>
): EnumObject<T> {
  const valueMap = new Map<T, string>();
  const data: Record<string, T> = {};

  // 初始化数据及反向映射（严格不可枚举）
  Object.entries(obj).forEach(([key, value]) => {
    // 正向映射（可枚举）
    data[key] = value;

    // 反向映射（不可枚举）
    Object.defineProperty(data, value, {
      value: key,
      writable: false,
      configurable: false,
      enumerable: false
    });

    valueMap.set(value, key);
  });

  // 定义不可枚举的方法
  const methods: EnumMethods<T> = {
    getKeys: () => Object.keys(obj), // 直接读取原始对象
    getValues: () => Object.values(obj),
    entries: () => Object.entries(obj)
  };

  Object.entries(methods).forEach(([methodName, fn]) => {
    Object.defineProperty(data, methodName, {
      value: fn,
      writable: false,
      configurable: false,
      enumerable: false
    });
  });

  return Object.freeze(data) as EnumObject<T>;
}
