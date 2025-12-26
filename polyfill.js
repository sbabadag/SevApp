// This file must be imported first in App.tsx
// It sets up URL polyfill before any other code runs

// Polyfill URL and URLSearchParams for React Native
if (typeof global !== 'undefined' && !global.URL) {
  // Simple URL polyfill
  global.URL = class URL {
    constructor(url, base) {
      if (!url) {
        throw new TypeError('Failed to construct \'URL\': 1 argument required, but only 0 present.');
      }
      
      // Handle base URL resolution
      let fullUrl = url;
      if (base) {
        if (typeof base === 'string') {
          const baseMatch = base.match(/^([^:]+):\/\/([^\/]+)(.*)$/);
          if (baseMatch) {
            const basePath = baseMatch[3] || '/';
            // Simple relative URL resolution
            if (url.startsWith('/')) {
              fullUrl = baseMatch[1] + '://' + baseMatch[2] + url;
            } else {
              const baseDir = basePath.substring(0, basePath.lastIndexOf('/') + 1);
              fullUrl = baseMatch[1] + '://' + baseMatch[2] + baseDir + url;
            }
          } else {
            fullUrl = base + url;
          }
        }
      }
      
      const match = fullUrl.match(/^([^:]+):\/\/([^\/]+)(.*)$/);
      
      if (!match) {
        throw new TypeError('Invalid URL');
      }
      
      this.protocol = match[1] + ':';
      this.host = match[2];
      this.hostname = match[2].split(':')[0];
      this.port = match[2].includes(':') ? match[2].split(':')[1] : '';
      this.pathname = match[3].split('?')[0] || '/';
      this.search = match[3].includes('?') ? '?' + match[3].split('?')[1].split('#')[0] : '';
      this.hash = match[3].includes('#') ? '#' + match[3].split('#')[1] : '';
      this.href = fullUrl;
      this.origin = this.protocol + '//' + this.host;
      
      // Create searchParams
      this.searchParams = new URLSearchParams(this.search.substring(1));
    }
    
    toString() {
      return this.href;
    }
  };
}

if (typeof global !== 'undefined' && !global.URLSearchParams) {
  global.URLSearchParams = class URLSearchParams {
    constructor(init) {
      this.params = {};
      
      if (typeof init === 'string') {
        init.split('&').forEach(param => {
          const [key, value] = param.split('=');
          if (key) {
            this.params[decodeURIComponent(key)] = decodeURIComponent(value || '');
          }
        });
      } else if (init) {
        Object.entries(init).forEach(([key, value]) => {
          this.params[key] = value;
        });
      }
    }
    
    get(name) {
      return this.params[name] || null;
    }
    
    set(name, value) {
      this.params[name] = value;
    }
    
    has(name) {
      return name in this.params;
    }
    
    delete(name) {
      delete this.params[name];
    }
    
    append(name, value) {
      if (this.params[name]) {
        this.params[name] += ',' + value;
      } else {
        this.params[name] = value;
      }
    }
    
    toString() {
      return Object.entries(this.params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    }
  };
}

// Also import the npm polyfill as backup
try {
  require('react-native-url-polyfill/auto');
} catch (e) {
  // Ignore if not available
}

