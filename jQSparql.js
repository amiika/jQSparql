function jQSparql() {
    
this.namespace = {
        'rdf' : 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
        'owl' : 'http://www.w3.org/2002/07/owl#',
        'xsd' : 'http://www.w3.org/2001/XMLSchema#',
        'foaf' : 'http://xmlns.com/foaf/0.1/',
        'dct' : 'http://purl.org/dc/terms/',
        'geo' : 'http://www.w3.org/2003/01/geo/wgs84_pos#', 
        'db-owl'  : 'http://dbpedia.org/ontology/',
    };

this.query = function(db,q) {
    return $.ajax({
        headers: { Accept : 'application/sparql-results+json' },
        url: db,
        dataType: 'json',
        data: { query: q, format: 'json'}
    });
}

this.toObjectArray = function(data) {
        var results = new Array();
        var vars = data.head.vars;
        data = data.results.bindings;
    for (item in data) {
        var obj = {};
        for (id in vars) {
            obj[vars[id]] = data[item][vars[id]].value;
        }
        results.push(obj);
    }
        return results;
}

this.addPrefix = function (prefix,namespace) {
      this.namespace[prefix] = namespace;
}
    
this.prefix = function () {
        var prefixString = "";
        for(ns in sparql.namespaces) 
            prefixString+="prefix "+ns+": <"+this.namespace[ns]+"> ";
        return prefixString;
    };
    
this.prefixToString = function () {
        var prefixString = "";
        for(ns in this.namespace) 
            prefixString+="prefix "+ns+": "+this.namespace[ns]+"\n";
        return prefixString;
    };


this.prefixify = function (url) {
        var ns = null;
        for (ns in this.namespace) {
            if (this.namespace.hasOwnProperty(ns) &&
                    url.lastIndexOf(this.namespace[ns], 0) === 0) {
                return url.replace(this.namespace[ns], ns + ":");
            }
        }
        return url;
    };
    

this.unprefixify = function (qname) {
        var ns = null;
        for (ns in this.namespace) {
            if (this.namespace.hasOwnProperty(ns) &&
                    qname.lastIndexOf(ns + ":", 0) === 0) {
                return qname.replace(ns + ":", this.namespace[ns]);
            }
        }
        return qname;
    };

    this.googleType = function (stype, sdatatype) {
        if (typeof stype !== 'undefined' && (stype === 'typed-literal' || stype === 'literal')) {
            switch(sdatatype) {
                case "http://www.w3.org/2001/XMLSchema#float":
                case "http://www.w3.org/2001/XMLSchema#decimal":
                case "http://www.w3.org/2001/XMLSchema#int":
                case "http://www.w3.org/2001/XMLSchema#integer":
                case "http://www.w3.org/2001/XMLSchema#long":
                case "http://www.w3.org/2001/XMLSchema#gYearMonth":
                case "http://www.w3.org/2001/XMLSchema#gYear":
                case "http://www.w3.org/2001/XMLSchema#gMonthDay":
                case "http://www.w3.org/2001/XMLSchema#gDay":
                case "http://www.w3.org/2001/XMLSchema#gMonth": return "number"; 
                case "http://www.w3.org/2001/XMLSchema#boolean": return "boolean"; 
                case "http://www.w3.org/2001/XMLSchema#date": return "date";
                case "http://www.w3.org/2001/XMLSchema#dateTime": return "datetime";
                case "http://www.w3.org/2001/XMLSchema#time": return "timeofday";
                default: return "string";
            }
        } else return "string";
    };

}
