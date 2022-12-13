/* Requête générale, permettant de rechercher par nom uniquement */

function rechercher(name) {
  rechercherNom(name);
  // rechercherDomaine(name);
}

function rechercherNom(name) {
  var debut_requete = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
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
                              FILTER CONTAINS(lcase(?name), lcase("`;
  var contenu_requete = name;
  var fin_requete = `"))
                    FILTER LANGMATCHES(lang(?resume), 'en')
                    FILTER LANGMATCHES(lang(?nomDiscipline), 'en')
                    }`;

  var requete = debut_requete + contenu_requete + fin_requete;

  // Encodage de l'URL à transmettre à DBPedia
  var url_base = "http://dbpedia.org/sparql/";
  $(document).ready(function () {
    $.ajax({
      //L'URL de la requête 
      url: url_base,

      //La méthode d'envoi (type de requête)
      method: "GET",

      //Le format de réponse attendu
      dataType: "json",
      data: { query: requete },
      beforeSend: afficherChargement($("#zone-resultats-recherche"), "Chargement")
    })

      /*Ce code sera exécuté en cas de succès - La réponse du serveur est passée à done().
        On peut par exemple convertir cette réponse en chaine JSON et insérer
        cette chaine dans un div id="res"
      */
      .done(function (response) {
        // let data = (response);
        afficherResultats(response);
      })

      /* Ce code sera exécuté en cas d'échec - L'erreur est passée à fail()
        On peut afficher les informations relatives à la requête et à l'erreur 
      */
      .fail(function (error) {
        alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
      })

      // Ce code sera exécuté que la requête soit un succès ou un échec
      .always(function () {
        //alert("Requête effectuée");
      });
  });
}

function rechercherTout(sujet, predicat, objet, callback) {
  var debut_requete = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
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
                          SELECT * WHERE {
                          `;

  var sujet_requete = (sujet == null) ? "?s" : sujet;
  var predicat_requete = (predicat == null) ? "?p" : predicat;
  var objet_requete = (objet == null) ? "?o" : objet
  var fin_requete = ` 
                          }`;

  var requete = debut_requete + " " + sujet_requete + " " + predicat_requete + " " + objet_requete + fin_requete;

  // Encodage de l'URL à transmettre à DBPedia
  var url_base = "http://dbpedia.org/sparql/";
  $(document).ready(function () {
    $.ajax({
      //L'URL de la requête 
      url: url_base,

      //La méthode d'envoi (type de requête)
      method: "GET",

      //Le format de réponse attendu
      dataType: "json",
      data: { query: requete }
    })
      /*Ce code sera exécuté en cas de succès - La réponse du serveur est passée à done()
        On peut par exemple convertir cette réponse en chaine JSON et insérer
        cette chaine dans un div id="res"
      */
      .done(function (response) {
        callback(response);
      })

      /* Ce code sera exécuté en cas d'échec - L'erreur est passée à fail()
        On peut afficher les informations relatives à la requête et à l'erreur
      */
      .fail(function (error) {
        resultats = null;
        alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
      })
      //Ce code sera exécuté que la requête soit un succès ou un échec
      .always(function () {
        //alert("Requête effectuée");
      });
  });
}

/* function rechercherDomaine(name) {
  var debut_requete = `PREFIX owl: <http://www.w3.org/2002/07/owl#>
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
                          SELECT * WHERE {
                          `;
  var contenu_requete = name;
  var fin_requete = ` dbo:abstract ?r
                          FILTER(langMatches(lang(?r),"FR"))
                          }`;

  var requete = debut_requete + contenu_requete + fin_requete;

  // Encodage de l'URL à transmettre à DBPedia
  var url_base = "http://dbpedia.org/sparql/";
  $(document).ready(function () {
    $.ajax({
      //L'URL de la requête 
      url: url_base,

      //La méthode d'envoi (type de requête)
      method: "GET",

      //Le format de réponse attendu
      dataType: "json",
      data: { query: requete }
    })
      // Ce code sera exécuté en cas de succès - La réponse du serveur est passée à done()
      // On peut par exemple convertir cette réponse en chaine JSON et insérer
      // cette chaine dans un div id="res"
      .done(function (response) {
        //let data = (response);
        console.log(response);
        afficherResultats(response);
      })

      //Ce code sera exécuté en cas d'échec - L'erreur est passée à fail()
      //On peut afficher les informations relatives à la requête et à l'erreur
      .fail(function (error) {
        alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
    })
    //Ce code sera exécuté que la requête soit un succès ou un échec
    .always(function(){
        //alert("Requête effectuée");
    });
});
}*/


function rechercherScientifique(objet, callback){
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
                          SELECT ?s, (COUNT(?p) as ?count) WHERE {
                          ?s dbo:academicDiscipline ${objet}.
                          ?s rdf:type foaf:Person.               
                          ?s dbo:wikiPageWikiLink ?p.
                          }
                          ORDER BY desc(?count)`;

  // Encodage de l'URL à transmettre à DBPedia
  var url_base = "http://dbpedia.org/sparql/";
  $(document).ready(function(){
      $.ajax({
          //L'URL de la requête 
          url: url_base,

          //La méthode d'envoi (type de requête)
          method: "GET",

          //Le format de réponse attendu
          dataType : "json",
          data : {query : requete}
      })
      //Ce code sera exécuté en cas de succès - La réponse du serveur est passée à done()
      /*On peut par exemple convertir cette réponse en chaine JSON et insérer
      * cette chaine dans un div id="res"*/
      .done(function(response){
          callback(response);
      })

      //Ce code sera exécuté en cas d'échec - L'erreur est passée à fail()
      //On peut afficher les informations relatives à la requête et à l'erreur
      .fail(function(error){
        resultats = null;
          alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
      })
      //Ce code sera exécuté que la requête soit un succès ou un échec
      .always(function(){
          //alert("Requête effectuée");
      });
  });
}

function rechercherInventeur(sujet, callback){
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
                          SELECT ?o WHERE {
                          ${sujet} dbo:wikiPageWikiLink ?o.
                          ?o rdf:type foaf:Person.               
                          
                          }
                          `;

  // Encodage de l'URL à transmettre à DBPedia
  var url_base = "http://dbpedia.org/sparql/";
  $(document).ready(function(){
      $.ajax({
          //L'URL de la requête 
          url: url_base,

          //La méthode d'envoi (type de requête)
          method: "GET",

          //Le format de réponse attendu
          dataType : "json",
          data : {query : requete}
      })
      //Ce code sera exécuté en cas de succès - La réponse du serveur est passée à done()
      /*On peut par exemple convertir cette réponse en chaine JSON et insérer
      * cette chaine dans un div id="res"*/
      .done(function(response){
          callback(response);
      })

      //Ce code sera exécuté en cas d'échec - L'erreur est passée à fail()
      //On peut afficher les informations relatives à la requête et à l'erreur
      .fail(function(error){
        resultats = null;
          alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
      })
      //Ce code sera exécuté que la requête soit un succès ou un échec
      .always(function(){
          //alert("Requête effectuée");
      });
  });
}

function afficherChargement(zone, texte) {
  zone.html(
  ` <div>
    <div class="spinner-border spinner-border-sm" role="status">
     <span class="visually-hidden">${texte}...</span>
    </div>
    ${texte}...
    </div>`);

}

// Affichage des résultats dans un tableau
function afficherResultats(data) {
  // Tableau pour mémoriser l'ordre des variables
  console.log(data);

  var contenuTableau = "";


  data.results.bindings.forEach(r => {
    disciplines = r.disciplines.value.split(", ");
    contenuTableau +=
      `<div class='col mb-3'>
        <div class='card'>
          <!-- <img src="..." class="card-img-top" alt="..."> -->
          <div class='card-body'>
            <h5 class='card-title text-center'>
              <a class="link-dark text-decoration-none" href="scientist.html?scientist_name=${r.p.value.substring(r.p.value.lastIndexOf("/")+1)}">${r.name.value}</a>
            </h5>
            <div class="card-subtitle mb-2 text-center">`;
      disciplines.forEach(element => {
        contenuTableau += 
          `<span class="badge bg-secondary mx-1">
            <a href="domaine.html?domain_name=${element.replaceAll(" ", "_")}" class="link-light">
            ${element}
            </a>
          </span>`;
      });      
      contenuTableau +=
            `</div>
            <p class='card-text'><span class='more'> ${r.resume.value} </span></p>
            <div class="text-center">
              <a href='${r.p.value}' class='btn btn-primary' target='_blank'>DBpedia</a>
            </div>
          </div>
        </div>
       </div>`
  });
  
  if(contenuTableau == "") {
    $("#zone-resultats-recherche").html("Aucun résultat.");
  }
  else {
    $("#zone-resultats-recherche").html(contenuTableau);
  }
  activerCollapsibleTexts();
}
