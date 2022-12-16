let http = require('http')
const jsdom = require('jsdom')
const dom = new jsdom.JSDOM("")
const jquery = require('jquery')(dom.window)

class Requetes {
    static rechercherNom(name, cb) {
        var requete = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
                      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
                      PREFIX dc: <http://purl.org/dc/elements/1.1/>
                      PREFIX : <http://dbpedia.org/resource/>
                      PREFIX dbpedia2: <http://dbpedia.org/property/>
                      PREFIX dbpedia: <http://dbpedia.org/>
                      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
                      \n
                      SELECT ?p ?name ?resume ?birthday (GROUP_CONCAT(DISTINCT ?nomDiscipline; separator = ", ") AS ?disciplines) WHERE {
                      ?p foaf:name ?name .
                      ?p dbo:abstract ?resume .
                      ?p dbo:birthDate ?birthday .
                      ?p dbo:academicDiscipline ?discipline .
                      ?discipline rdfs:label ?nomDiscipline .
                      FILTER CONTAINS(lcase(?name), lcase("${name}"))
                      FILTER LANGMATCHES(lang(?resume), 'en')
                      FILTER LANGMATCHES(lang(?nomDiscipline), 'en')
                      }`;
      
        // Encodage de l'URL à transmettre à DBPedia
        var url_base = "http://dbpedia.org/sparql/";
        
        $.ajax({
          //L'URL de la requête 
          url: url_base,
    
          //La méthode d'envoi (type de requête)
          method: "GET",
    
          //Le format de réponse attendu
          dataType: "json",
          data: { query: requete },
          //beforeSend: afficherChargement($("#zone-resultats-recherche"), "Chargement")
        })
    
          /*Ce code sera exécuté en cas de succès - La réponse du serveur est passée à done().
            On peut par exemple convertir cette réponse en chaine JSON et insérer
            cette chaine dans un div id="res"
          */
          .done(function (response) {
            // let data = (response);
            //afficherResultats(response);
            cb(response)
          })
    
          /* Ce code sera exécuté en cas d'échec - L'erreur est passée à fail()
            On peut afficher les informations relatives à la requête et à l'erreur 
          */
          .fail(function (error) {
            console.log("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
            //alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
          })
    
          // Ce code sera exécuté que la requête soit un succès ou un échec
          .always(function () {
            //alert("Requête effectuée");
          });
        
      }

      static random(cb) {
        var requete = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
                      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
                      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
                      PREFIX dc: <http://purl.org/dc/elements/1.1/>
                      PREFIX : <http://dbpedia.org/resource/>
                      PREFIX dbpedia2: <http://dbpedia.org/property/>
                      PREFIX dbpedia: <http://dbpedia.org/>
                      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
                      \n
                      SELECT ?p WHERE {
                      ?p foaf:name ?name .
                      ?p dbo:abstract ?resume .
                      ?p dbo:birthDate ?birthday .
                      ?p dbo:academicDiscipline ?discipline .
                      ?discipline rdfs:label ?nomDiscipline .
                      FILTER LANGMATCHES(lang(?resume), 'en')
                      FILTER LANGMATCHES(lang(?nomDiscipline), 'en')
                      }`;
      
        // Encodage de l'URL à transmettre à DBPedia
        var url_base = "http://dbpedia.org/sparql/";

        jquery.ajax({
          //L'URL de la requête 
          url: url_base,
    
          //La méthode d'envoi (type de requête)
          method: "GET",
    
          //Le format de réponse attendu
          dataType: "json",
          data: { query: requete },
          //beforeSend: afficherChargement($("#zone-resultats-recherche"), "Chargement")
        })
    
          /*Ce code sera exécuté en cas de succès - La réponse du serveur est passée à done().
            On peut par exemple convertir cette réponse en chaine JSON et insérer
            cette chaine dans un div id="res"
          */
          .done(function (response) {
            let indice = Math.floor(Math.random() * response.results.bindings.length); 
            let valeur = response.results.bindings[indice].p.value
            let valeur_substring = valeur.substring(valeur.lastIndexOf("/")+1)
            console.log(valeur_substring)
            // let data = (response);
            //afficherResultats(response);
            cb(valeur_substring)
          })
    
          /* Ce code sera exécuté en cas d'échec - L'erreur est passée à fail()
            On peut afficher les informations relatives à la requête et à l'erreur 
          */
          .fail(function (error) {
            console.log("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
            //alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
          })
    
          // Ce code sera exécuté que la requête soit un succès ou un échec
          .always(function () {
            //alert("Requête effectuée");
          });
        
      }
}

module.exports = Requetes