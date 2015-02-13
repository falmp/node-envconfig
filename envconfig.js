var yaml = require('yamljs')
  , flat = require('flat')
  , Proxy = require('harmony-proxy');

var Config = {
    options: {},
    flatConfig: {},
    
    load: function(file, options) {
        options = options || {};
        Config.options = {
            preserveArrays: options.preserveArrays || true,
            environmentPrefix: options.environmentPrefix || ''
        };

        var yamlConfig = yaml.load(file);
        
        Config.flatConfig = flat(yamlConfig, { safe: Config.options.preserveArrays || true });

        return new Proxy(yamlConfig, Config.callTraceHandler())
    },

    callTraceHandler: function(prefix) {
        prefix = prefix || '';

        return {
            get: function(target, name) {
                var key = prefix + name;
                var value = target[name];

                if (typeof value == 'object' && !Array.isArray(value))
                    return new Proxy(value, Config.callTraceHandler(key + '.'));

                var envKey = Config.options.environmentPrefix + key.replace(/\./g, '__').toUpperCase();

                return process.env[envKey] || process.env[key] || Config.flatConfig[key];
            }
        }
    }
}

module.exports.load = Config.load;
