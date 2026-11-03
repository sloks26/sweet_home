let homeDataCache = null;
let homeDataETag = null;

export const cacheService = {
  getHomeData() {
    return { data: homeDataCache, etag: homeDataETag };
  },

  setHomeData(data) {
    homeDataCache = data;
    homeDataETag = `W/"home_${Date.now()}_${Math.random().toString(36).substring(2, 9)}"`;
    return homeDataETag;
  },

  invalidateHome() {
    homeDataCache = null;
    homeDataETag = null;
  },

  clearPrefix(prefix) {
    this.invalidateHome();
  },

  clear() {
    this.invalidateHome();
  }
};

export default cacheService;
