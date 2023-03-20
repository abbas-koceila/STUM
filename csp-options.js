let options = {};

if(process.env.NODE_ENV === 'development'){
    options = {
        contentSecurityPolicy: {
            directives: { 
               defaultSrc: ["'self'","https://www.donneesquebec.ca/recherche/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20%22b256f87f-40ec-4c79-bdba-a23e9c50e741%22%20WHERE%20_id%20%3D73"],
            
                blockAllMixedContent: [],
                fontSrc: ["'self'", "https:", "data:"],
                frameAncestors: ["'self'"],
                imgSrc: ["'self'", "data:"],
                objectSrc: ["'none'"],
                scriptSrc: ["'self'",  "'nonce-browser-sync'"],
                scriptSrcAttr: ["'none'"],
                styleSrc: ["'self'", "https:", "'unsafe-inline'"],
                upgradeInsecureRequests: []
            }
        }
    }
}

export default options;

