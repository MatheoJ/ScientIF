/* Requête générale, permettant de rechercher par nom uniquement */



function rechercher(name) {
  rechercherDomaine(name);
  rechercherNom(name);
  rechercherInvention(name);
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
                              SELECT DISTINCT ?p ?resume ?birthday ?image (GROUP_CONCAT(DISTINCT ?nomDiscipline; separator = ", ") AS ?disciplines) WHERE {
                                ?p a dbo:Species .

                                { ?p foaf:name ?name . }
                                  UNION
                                { ?p dbp:name ?name . }
                              
                                ?p dbo:abstract ?resume .
                                FILTER LANGMATCHES(lang(?resume), 'en') 
                                ?p dbo:thumbnail ?image.
                                { ?p dbo:academicDiscipline ?discipline .
                                  ?discipline rdfs:label ?nomDiscipline . 
                                  FILTER LANGMATCHES(lang(?nomDiscipline), 'en')
                                }

                                  UNION
                                   
                                { ?p gold:hypernym ?hypernym 
                                  FILTER(regex(?hypernym, dbr:Philosopher) || regex(?hypernym, dbr:Inventor))
                                }
                              
                                FILTER(regex(?name, "`
                                
  var contenu_requete = name;
  var fin_requete =             `", "i"))
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
        afficherResultats(response, "nom");
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

function rechercherDomaine(domaine) {
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

                          SELECT DISTINCT ?type ?name ?label WHERE {
                            ?n dbo:academicDiscipline ?type .
                            ?type rdfs:label ?label ;
                                  gold:hypernym ?hypernym .
                            
                            filter(regex(?label, "`
                            
  var contenu_requete = domaine;
                            
  var fin_requete = `", "i") && langMatches(lang(?label),"en"))
                      filter(!regex(?hypernym, dbr:System, "i") && !regex(?hypernym, dbr:Journal, "i") && !regex(?hypernym, dbr:Studies, "i")  && !regex(?hypernym, dbr:Name, "i"))
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
        console.log(response);
        afficherResultats(response, "domaine");
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
}

function rechercherInvention(name) {
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
                              
                              SELECT DISTINCT ?n ?image ?resume WHERE {
                                ?p dbo:knownFor ?n ;
                                   rdf:type dbo:Scientist .
                                OPTIONAL { ?n dbo:thumbnail ?image } .
                                ?n dbo:abstract ?resume .
                                FILTER(regex(?n, "`
                                
  var contenu_requete = name;
  var fin_requete =             `", "i") && langMatches(lang(?resume), "en"))
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
        afficherResultats(response, "concept");
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

function rechercherConcept(sujet, idTableau, callback) {
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
                              SELECT ?p ?image WHERE {
                              ${sujet} rdfs:seeAlso ?p.
                              ?p dbo:thumbnail ?image
                              }
                              `;


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
      //beforeSend: afficherChargement($(idTableau), "Chargement")
    })

      /*Ce code sera exécuté en cas de succès - La réponse du serveur est passée à done().
        On peut par exemple convertir cette réponse en chaine JSON et insérer
        cette chaine dans un div id="res"
      */
      .done(function (response) {
        // let data = (response);
        console.log("rep ", response);
        
        if(response.results.bindings.length>0){
          afficherInformations(response, idTableau, "concept");
          callback();
        }
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

function rechercherScientifique(objet, idTableau, callback, predicat = "dbo:academicDiscipline") {
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
                              SELECT ?p ?name ?image WHERE {
                              ?p ${predicat} ${objet}.
                              ?p rdf:type foaf:Person.
                              ?p rdf:type dbo:Scientist.            
                              ?p dbo:wikiPageWikiLink ?links.
                              ?p dbo:thumbnail ?image
                              }
                              ORDER BY desc(COUNT(?links))`;


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
      //beforeSend: afficherChargement($(idTableau), "Chargement")
    })

      /*Ce code sera exécuté en cas de succès - La réponse du serveur est passée à done().
        On peut par exemple convertir cette réponse en chaine JSON et insérer
        cette chaine dans un div id="res"
      */
      .done(function (response) {
        // let data = (response);
        console.log("rep ", response);
        
        if(response.results.bindings.length>0){
          afficherInformations(response, idTableau);
          callback();
        }
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

function rechercherDoctoralSudent(scientistName, increment){
  increment -= 1;
  decodeURIComponent(scientistName);
  scientistName = scientistName.replaceAll(' ', '_');  
  scientistName = scientistName.replaceAll('(', '\\(');
  scientistName = scientistName.replaceAll(')', '\\)');
  scientistName = scientistName.replaceAll(',', '\\,');  
  scientistName = scientistName.replaceAll("&#39;", "\\'");
  scientistName = scientistName.replaceAll("'", "\\'");
  scientistName = scientistName.replaceAll(".", "\\.");
  console.log(scientistName);
  var requete = `
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
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
        SELECT GROUP_CONCAT(DISTINCT ?doctoralStudent;separator =";") AS ?doctoralStudents
        ?image
        WHERE {
          OPTIONAL{:${scientistName} dbo:doctoralStudent ?doctoralStudent}
          OPTIONAL{:${scientistName} dbo:thumbnail ?image }
        }`;
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
    afficherDoctorant(response, increment, scientistName);
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

function rechercherInventeur(sujet, idTableau, callback) {
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

                              SELECT ?p  ?image WHERE {
                                {
                                  ${sujet} dbo:wikiPageWikiLink ?p.
                                  ?p rdf:type foaf:Person.  
                                  ?p rdf:type dbo:Scientist.                                                    
                                  ?p dbo:wikiPageWikiLink ?links.
                                  ?p dbo:thumbnail ?image.
                                }
                                UNION
                                {
                                  ${sujet} dbo:wikiPageWikiLink ?o1.
                                  ?o1 dbo:wikiPageRedirects ?p.
                                  ?p rdf:type foaf:Person.  
                                  ?p rdf:type dbo:Scientist.                                                               
                                  ?p dbo:wikiPageWikiLink ?links.
                    
                                  ?p dbo:thumbnail ?image.
                                  FILTER(?p != ?o1)
                       
                                }
                              }
                              ORDER BY desc(COUNT(?links))`;


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
      beforeSend: afficherChargement($(idTableau), "Chargement")
    })

      /*Ce code sera exécuté en cas de succès - La réponse du serveur est passée à done().
        On peut par exemple convertir cette réponse en chaine JSON et insérer
        cette chaine dans un div id="res"
      */
      .done(function (response) {
        // let data = (response);
        console.log("rep ", response);
        if(response.results.bindings.length>0){
          console.log("ouioui");
          afficherInformations(response, idTableau);
          callback();
        }
        
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

function afficherChargement(zone, texte) {
  zone.html(
    ` <div>
    <div class="spinner-border spinner-border-sm" role="status">
     <span class="visually-hidden">${texte}...</span>
    </div>
    ${texte}...
    </div>`);

}
function cacherChargement(zone) {
  zone.html('');

}

function afficherInformations(data, idTableau, redirectPage="scientist") {
  var contenuTableau = "";

  data.results.bindings.forEach(r => {
    contenuTableau +=
      `<div class='col-6 mb-3'>
        <div class='card card-lg card-sm-down-md'>
          <a href="/${redirectPage}/${r.p.value.substring(r.p.value.lastIndexOf("/") + 1)}">
            <img src="${r.image.value}" onerror="this.src='/assets/img/${redirectPage}.ico'" width="300" height="auto" class="card-img-top" alt="..." /> 
          </a>
          <div class='card-body'>
            <h5 class='card-title text-center'>
              <a class="link-dark " href="/${redirectPage}/${r.p.value.substring(r.p.value.lastIndexOf("/") + 1)}">${r.p.value.substring(r.p.value.lastIndexOf("/") + 1).replaceAll("_", " ")}</a>
            </h5>
          </div>
        </div>
      </div>`;
  });

  $(idTableau).html(contenuTableau);
  activerCollapsibleTexts();
}

// Affichage des résultats dans un tableau
function afficherResultats(data, typeRecherche, idTableau = "#zone-resultats-recherche", afficherDescription = true) {
  // Tableau pour mémoriser l'ordre des variables
  console.log('donnees',data);

  var titre = "";
  var contenuTableau = "";

  if(typeRecherche == "nom" && data) {
    
    titre = "<h1>Scientifiques</h1>";

    data.results.bindings.forEach(r => {

      contenuTableau +=
        `<div class='col mb-3'>
          <div class='card'>
          <a  href="/scientist/${r.p.value.substring(r.p.value.lastIndexOf("/")+1)}">
            <img src="${r.image.value}" tag="img-responsive" onerror="this.src='/assets/img/scientist.ico'" width="300" height ="250" class="card-img-top" style="object-fit:cover;" alt="..." /> 
          </a>
            <div class='card-body'>
              <h5 class='card-title text-center'>
                <a class="link-dark " href="/scientist/${r.p.value.substring(r.p.value.lastIndexOf("/")+1)}">${r.p.value.substring(r.p.value.lastIndexOf("/") + 1).replaceAll("_", " ")}</a>
              </h5>`;

        if(afficherDescription) {
          disciplines = r.disciplines.value.split(", ");
        
          contenuTableau+= `<div class="card-subtitle mb-2 text-center">`;

          disciplines.forEach(element => {
            contenuTableau += 
              `<span class="badge bg-secondary mx-1">
                <a href="/domain/${element.replaceAll(" ", "_")}" class="link-light">
                ${element}
                </a>
              </span>`;
          });      
          contenuTableau +=
                `</div>
                <p class='card-text'><span class='more'> ${r.resume.value} </p>
                <!--div class="text-center">
                  <a href='${r.p.value}' class='btn btn-primary' target='_blank'>DBpedia</a>
                </div-->`;
      }
      contenuTableau+=`

            </div>
          </div>
        </div>
        </div>`
    });

    if(contenuTableau != "") {
      $('#zone-nom-sci').html(titre);
      $(idTableau).html(""); // enlève le chargement
      $('#zone-resultats-recherche-sci').html(contenuTableau);
    }
  } else if(typeRecherche == "domaine" && data) {

    titre = "<h1>Domaines scientifiques</h1>";

    data.results.bindings.forEach(r => {
      contenuTableau +=
        `<div class='col mb-3'>
          <div class='card'>
            <div class='card-body'>
              <h5 class='card-title text-center'>
                <a class="link-dark text-decoration-none" href="/domain/${r.type.value.substring(r.type.value.lastIndexOf("/")+1)}">${r.type.value.substring(r.type.value.lastIndexOf("/") + 1).replaceAll("_", " ")}</a>
              </h5>`;
             
        contenuTableau +=
            `</div>
          </div>
        </div>`;
    });

    if(contenuTableau != "") {
      $('#zone-nom-dom').html(titre);
      $(idTableau).html("");
      $('#zone-resultats-recherche-dom').html(contenuTableau);
    }
  }
  else if(typeRecherche == "concept" && data) {
    // On place le titre
    titre = "<h1>Inventions</h1>";

    // On boucle sur les résultats
    data.results.bindings.forEach(r => {

      contenuTableau +=
        `<div class='col mb-3'>
          <div class='card'>`

      if(r.image != undefined) {
        contenuTableau += `
        <a  href="/concept/${r.n.value.substring(r.n.value.lastIndexOf("/")+1)}">
        <img src="${r.image.value}" tag="img-responsive" onerror="this.src='/assets/img/concept.ico'" width="300" height ="250" class="card-img-top" style="object-fit:cover;" alt="..." />
        </a>`;
      }
      else {
        contenuTableau += `
        <a href="/concept/${r.n.value.substring(r.n.value.lastIndexOf("/")+1)}">
        <img src="/assets/img/concept.ico" tag="img-responsive" width="300" height ="250" class="card-img-top" style="object-fit:cover;" alt="..." />
        </a>`;
      }
          contenuTableau += `          
            <div class='card-body'>
              <h5 class='card-title text-center'>
                <a class="link-dark" href="/scientist/${r.n.value.substring(r.n.value.lastIndexOf("/")+1)}">${r.n.value.substring(r.n.value.lastIndexOf("/") + 1).replaceAll("_", " ")}</a>
              </h5>`;

          contenuTableau +=
            `</div>
            <p class='card-text'><span class='more'> ${r.resume.value} </p>
            <!--div class="text-center">
              <a href='${r.n.value}' class='btn btn-primary' target='_blank'>DBpedia</a>
            </div-->`;

      contenuTableau +=`

            </div>
          </div>
        </div>
        </div>`
    });

    if(contenuTableau != "") {
      $(idTableau).html(""); // enlève le chargement   
      $('#zone-nom-con').html(titre);
      $('#zone-resultats-recherche-con').html(contenuTableau);   
    } 
  } else {
    data.results.bindings.forEach(r => {
      contenuTableau +=
            `</div>`;
      contenuTableau+= `<p class='card-text'><span class='more'> ${r.resume.value} </span></p>`;
      contenuTableau += `
            <div class="text-center">
              <a href='${r.wikipedia.value}' class='btn btn-primary' target='_blank'>Wikipedia</a>
            </div>
          </div>
        </div>
       </div>
       </div>`
    });
  }

  if(contenuTableau == "") {
    // $(idTableau).html("Aucun résultat.");
  }

  activerCollapsibleTexts();
}
