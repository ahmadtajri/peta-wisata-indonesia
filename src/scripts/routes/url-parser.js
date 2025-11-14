class UrlParser {
  static parseActiveUrlWithCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    const splitedUrl = this._urlSplitter(url);

    let combiner = '/';
    if (splitedUrl.resource) {
      combiner = `/${splitedUrl.resource}`;
      if (splitedUrl.id) {
        combiner += '/:id';
      }
      if (splitedUrl.verb) {
        combiner += `/${splitedUrl.verb}`;
      }
    }

    return combiner;
  }

  static parseActiveUrlWithoutCombiner() {
    const hash = window.location.hash || '';
    const url = hash.startsWith('#') ? hash.slice(1).toLowerCase() : hash.toLowerCase();
    return this._urlSplitter(url);
  }

  static _urlSplitter(url) {
    // pastikan tidak ada double slash, lalu bagi berdasarkan "/"
    const cleanUrl = url.replace(/\/+/g, '/');
    const urlsSplits = cleanUrl.split('/').filter(Boolean);

    return {
      resource: urlsSplits[0] || null,
      id: urlsSplits[1] || null,
      verb: urlsSplits[2] || null,
    };
  }
}

export default UrlParser;
