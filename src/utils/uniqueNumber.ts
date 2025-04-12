export const getUniqueNumber = (() => {
    let lastSuffix = 0;
    let lastDate = '';
  
    return (): number => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const dateStr = `${year}${month}${day}`;
  
      if (dateStr !== lastDate) {
        lastDate = dateStr;
        lastSuffix = 0;
      }
  
      const msSinceMidnight = now.getTime() - new Date(year, now.getMonth(), now.getDate()).getTime();
  
      let suffix = msSinceMidnight % 10000;
  
      if (suffix <= lastSuffix) {
        suffix = lastSuffix + 1;
      }

      lastSuffix = suffix;
  
      const suffixStr = String(suffix).padStart(4, '0');

      return Number(dateStr + suffixStr);
    };
  })();
  