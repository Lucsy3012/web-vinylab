export function useCompound() {
  function compoundArray(array: [] = []) {
    return array.reduce((last, current) => {
      if (last.length === 0) {
        return [current];
      } else {
        const lastSum = last[last.length - 1];
        // @ts-ignore
        last.push(lastSum + current);
        return last;
      }
    }, []);
  }
  return {
    compoundArray,
  };
}
