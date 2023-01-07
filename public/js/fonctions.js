/* Requête générale, permettant de rechercher par nom uniquement */


function rechercher(name) {
  let completed = 0;

  function callback() {
    completed++;
    if (completed === 3 &&
      document.querySelector("#tableau_dom").style.display === "none" &&
      document.querySelector("#tableau_sci").style.display === "none" &&
      document.querySelector("#tableau_con").style.display === "none") {
      document.querySelector("#zone-resultats-recherche").innerHTML = "No result found";
    }
  }
  rechercherNom(name, callback);
  rechercherDomaine(name, callback);
  rechercherInvention(name, callback);

}

function rechercherNom(name, callback) {
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
                                ?p dbo:wikiPageWikiLink ?links.
                                FILTER(regex(?name, "`

  var contenu_requete = name;
  var fin_requete = `", "i"))
                              } ORDER BY DESC(COUNT(?links))`;

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
        callback();
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
        cacherChargement($("#zone-resultats-recherche"));
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

function rechercherDomaine(domaine, callback) {
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

                          SELECT DISTINCT ?type ?name ?label ?resume ?image WHERE {
                            ?n dbo:academicDiscipline ?type .
                            ?type rdfs:label ?label ;
                                  gold:hypernym ?hypernym .
                            ?type dbo:thumbnail ?image.
                            ?type dbo:abstract ?resume.
                            ?type dbo:wikiPageWikiLink ?links.
                            filter(regex(?label, "`

  var contenu_requete = domaine;

  var fin_requete = `", "i") && langMatches(lang(?label),"en") && langMatches(lang(?resume),"en") )
                      filter(!regex(?hypernym, dbr:System, "i") && !regex(?hypernym, dbr:Journal, "i") && !regex(?hypernym, dbr:Studies, "i")  && !regex(?hypernym, dbr:Name, "i"))
                    } ORDER BY DESC(COUNT(?links))`;

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
        console.log("domaine", response);
        afficherResultats(response, "domaine");
        callback();
      })

      //Ce code sera exécuté en cas d'échec - L'erreur est passée à fail()
      //On peut afficher les informations relatives à la requête et à l'erreur
      .fail(function (error) {
        alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
      })
      //Ce code sera exécuté que la requête soit un succès ou un échec
      .always(function () {
        //alert("Requête effectuée");
      });
  });
}

function rechercherInvention(name, callback) {
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
                                {?p a skos:Concept ;
                                   skos:broader dbc:Inventions_by_country .
                                ?n dbo:wikiPageWikiLink ?p ;
                                   a ?type .
                                }
                                UNION
                                {
                                  ?s a dbo:Scientist.
                                  ?s dbo:knownFor ?n.
                                }
                                UNION
                                {
                                  ?s a dbo:Scientist.
                                  ?s dbo:knownFor ?p1.
                                  ?n1 dbo:seeAlso ?n.
                                }                            
                                OPTIONAL { ?n dbo:thumbnail ?image } .
                                ?n dbo:abstract ?resume .
                                
                                FILTER(regex(?n, "`

  var contenu_requete = name;
  var fin_requete = `", "i") && langMatches(lang(?resume), "en"))
                              } `;

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
        callback();
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

        if (response.results.bindings.length > 0) {
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

        if (response.results.bindings.length > 0) {
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

function rechercherDoctoralSudent(scientistName, increment) {
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
        if (response.results.bindings.length > 0) {
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

function afficherInformations(data, idTableau, redirectPage = "scientist") {
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
function afficherResultats(data, typeRecherche, afficherDescription = true) {
  // Tableau pour mémoriser l'ordre des variables
  console.log('donnees', data);

  var contenuTableau = "";

  if (typeRecherche == "nom" && data) {
    data.results.bindings.forEach(r => {
      contenuTableau += genererHtmlResultat(
        r.image.value, 
        r.p.value.substring(r.p.value.lastIndexOf("/") + 1).replaceAll("_", " "),
        afficherDescription ? r.disciplines.value.split(", ") : undefined,
        afficherDescription ? r.resume.value : '',
        "/scientist/" + r.p.value.substring(r.p.value.lastIndexOf("/") + 1)
      );

    });

    $('#zone-resultats-recherche-sci').html(contenuTableau == '' ? "No results." : contenuTableau);
    activerCollapsibleTexts('zone-resultats-recherche-sci');
    $('#nb-sci-found').html('('+data.results.bindings.length+')');

  } else if (typeRecherche == "domaine" && data) {
    
    data.results.bindings.forEach(r => {
      contenuTableau += genererHtmlResultat(
        r.image.value,
        r.type.value.substring(r.type.value.lastIndexOf("/") + 1).replaceAll("_", " "),
        undefined,
        r.resume.value,
        "/domain/" + r.type.value.substring(r.type.value.lastIndexOf("/") + 1)
      );
    });

    $('#zone-resultats-recherche-dom').html(contenuTableau == '' ? "No results." : contenuTableau);
    activerCollapsibleTexts('zone-resultats-recherche-dom');
    $('#nb-dom-found').html('('+data.results.bindings.length+')');
  }
  else if (typeRecherche == "concept" && data) {

    // On boucle sur les résultats
    data.results.bindings.forEach(r => {
      contenuTableau += genererHtmlResultat(
        r.image != undefined ? r.image.value : "/assets/img/concept.ico" ,
        r.n.value.substring(r.n.value.lastIndexOf("/") + 1).replaceAll("_", " "),
        undefined,
        r.resume.value,
        "/concept/" + r.n.value.substring(r.n.value.lastIndexOf("/") + 1)
      )

      
    });

    $('#zone-resultats-recherche-con').html(contenuTableau == '' ? "No results." : contenuTableau);
    activerCollapsibleTexts('zone-resultats-recherche-con');
    $('#nb-con-found').html('('+data.results.bindings.length+')');
    
  } else {
    data.results.bindings.forEach(r => {
      contenuTableau +=
        `</div>`;
      contenuTableau += `<p class='card-text'><span class='more'> ${r.resume.value} </span></p>`;
      contenuTableau += `
            <div class="text-center">
              <a href='${r.wikipedia.value}' class='btn btn-primary' target='_blank'>Wikipedia</a>
            </div>
          </div>
        </div>
       </div>
       </div>`;
    });
  }

}

/**
 * 
 * @param {*} image lien vers l'image
 * @param {*} titre titre (nom de la personne, du domaine, du concept)
 * @param {*} domaine liste des disciplines (peut être undefined)
 * @param {*} resume résumé à afficher
 * @param {*} lien lien complet vers la page détaillée
 */
function genererHtmlResultat(image, titre, disciplines, resume, lien) {
  contenuTableau =
        `
        <div class='row mb-2 border rounded'>
          <div class='col-3'>
            <a  href="${lien}">
              <img src="${image}" tag="img-responsive" onerror="this.src='/assets/img/scientist.ico'" width="300" height ="250" class="card-img-top" style="object-fit:cover;" alt="..." /> 
            </a>
          </div> <!-- col image -->
          <div class='col-9 pt-1'>
            <h4 class=''>
              <a class="link-dark " href="${lien}">${titre}</a>
            </h4>
          
          
            <div class="mb-2">    `;

  if(disciplines != undefined) 
    disciplines.forEach(element => {
      if(element != undefined && element != '')
        contenuTableau +=
          `   <span class="badge bg-secondary mx-1">
                <a href="/domain/${element.replaceAll(" ", "_")}" class="link-light">
                  ${element}
                </a>
              </span>`;
    });

  contenuTableau +=
      `     </div>  
            <p class=''><span class='more'> ${resume} </p>
          
          </div> <!-- col texte -->
        </div> <!-- row --> `;

  return contenuTableau;
}