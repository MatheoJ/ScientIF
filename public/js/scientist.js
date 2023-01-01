function rechercherScientist(scientistName, callback){

    
    decodeURIComponent(scientistName);
    scientistName = scientistName.replaceAll('(', '\\(');
    scientistName = scientistName.replaceAll(')', '\\)');
    scientistName = scientistName.replaceAll(',', '\\,');
    scientistName = scientistName.replaceAll("&#39;", "\\'");
  
    //console.log(scientistName);
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
        SELECT GROUP_CONCAT(DISTINCT ?discipline;separator =";") AS ?disciplines 
        GROUP_CONCAT(DISTINCT ?doctoralStudent;separator =";") AS ?doctoralStudents
        GROUP_CONCAT(DISTINCT ?concept;separator =";") AS ?concepts
        GROUP_CONCAT(DISTINCT ?award;separator =";") AS ?awards
        ?name 
        ?description 
        ?conjoint 
        ?isPrimaryTopicOf 
        ?thumbnail 
        ?date
        ?conjointScientist
        ?birthPlace WHERE {
            
            :${scientistName} rdfs:label ?name.
            OPTIONAL{:${scientistName} dbo:academicDiscipline ?discipline}
            OPTIONAL{:${scientistName} dbo:birthDate ?date}
            OPTIONAL{:${scientistName} dbo:abstract ?description}
            OPTIONAL{:${scientistName} dbo:spouse ?conjointScientist.
                    ?conjointScientist rdf:type dbo:Scientist}
            OPTIONAL{:${scientistName} dbo:spouse ?conjoint}
            OPTIONAL{:${scientistName} foaf:isPrimaryTopicOf ?isPrimaryTopicOf}
            OPTIONAL{:${scientistName} dbo:thumbnail ?thumbnail}
            OPTIONAL{:${scientistName} dbo:doctoralStudent ?doctoralStudent}
            OPTIONAL{:${scientistName} dbo:knownFor ?concept}
            OPTIONAL{:${scientistName} dbo:award ?award}
            OPTIONAL{:${scientistName} dbo:birthPlace ?birthPlace}
            FILTER(langMatches(lang(?description),"EN"))
            FILTER(langMatches(lang(?name),"EN"))
        }`;
        
    
    //requete=encodeURIComponent(requete);
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
            console.log(response);
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


  // Affichage des résultats dans un tableau
function afficherScientist(response)
{
    var titre = document.querySelector('#titre');
    var nomPage = document.querySelector("#nomPage");
    var element = (response.results.bindings.length > 0) ? response.results.bindings[0] : { "name": { "value": "No name found" } };
    titre.innerHTML = nomPage.innerHTML = element.name.value;
    
    if(response.results.bindings[0].hasOwnProperty("isPrimaryTopicOf")){
        var lien = document.querySelector('#pageWikipedia');
        lien.setAttribute("href", response.results.bindings[0].isPrimaryTopicOf.value);
        lien.style.display = "block";
    }
    if(response.results.bindings[0].hasOwnProperty("description")){
        var text = response.results.bindings[0].description.value;
        // Attribution des deux parties de texte aux éléments #resume et #resume2
        document.getElementById('resume').innerText = text;
    } else{
        document.getElementById("resume").style.display = "none";
    }   
    if(response.results.bindings[0].hasOwnProperty("thumbnail")){
        var image = document.querySelector('#image');
        image.setAttribute("src", response.results.bindings[0].thumbnail.value);
        image.onerror = function (){
            image.setAttribute("src", "/assets/img/scientist.ico");
        }
    } else{
        document.querySelector('#image').setAttribute("src", "/assets/img/scientist.ico");
    }
    if(response.results.bindings[0].hasOwnProperty("date")){
        
        var date = document.querySelector('#dateNaissance');
        date.style.display = "block";
        date.innerHTML= "Born on the "+response.results.bindings[0].date.value;
    }
    if(response.results.bindings[0].hasOwnProperty("birthPlace")){
        var place = document.querySelector('#birthPlaceValue');
        place.style.display = "block";
        place.innerHTML= "Place of birth : "+response.results.bindings[0].birthPlace.value.replace('http://dbpedia.org/resource/', '').replaceAll('_', ' ');
    }
    if(response.results.bindings[0].hasOwnProperty("conjointScientist")){
        var lien = document.querySelector('#conjoint');
        var conjointLien = response.results.bindings[0].conjointScientist.value;
        lien.style.display = "block";
        lien.setAttribute("href", "/scientist/"+conjointLien.replace('http://dbpedia.org/resource/', ''));
        lien.innerHTML = "Life partner : " + response.results.bindings[0].conjointScientist.value.replace('http://dbpedia.org/resource/', '').replaceAll('_', ' ');
        
    } else if (response.results.bindings[0].hasOwnProperty("conjoint")){
        var lien = document.querySelector('#conjoint');
        lien.style.display = "block";
        lien.innerHTML = "Life partner : " + response.results.bindings[0].conjoint.value.replace('http://dbpedia.org/resource/', '').replaceAll('_', ' ');
    }
    if(response.results.bindings[0].disciplines.value != ''){        
        var data = response.results.bindings[0].disciplines.value.split(';');
        
        var data = `{ ${data.map(name => `(${name.replace('http://dbpedia.org/resource/', ':')
                                                .replaceAll("'", "\\'")
                                                .replaceAll("(", "\\(")
                                                .replaceAll(")", "\\)")
                                                .replaceAll(",","\\,")})`)
                                                .join(" ")} }`;
        console.log(data);
        obtenirDonneesTableau(data, function(response){
            document.querySelector('#tableauDisciplines').style.display = "block";
            document.querySelector('#titleTableDiscipline').style.display = "block";
            
            afficherInformations(response, "#disciplines", "domain");
        });
    }
    if(response.results.bindings[0].doctoralStudents.value != ''){   
        var data = response.results.bindings[0].doctoralStudents.value.split(';');
        var data = `{ ${data.map(name => `(${name
                                .replace('http://dbpedia.org/resource/', ':')
                                .replaceAll("'", "\\'")
                                .replaceAll("(", "\\(")
                                .replaceAll(")", "\\)")
                                .replaceAll(",","\\,")
                                    })`)
                                .join(" ")} }`;
        obtenirDonneesTableau(data, function(response){
            document.querySelector('#titleTableStudent').style.display = "block";
            document.querySelector('#tableauStudents').style.display = "block";
            
            afficherInformations(response, "#students", "scientist");
        });
    } 
    if(response.results.bindings[0].concepts.value != ''){        
        var data = response.results.bindings[0].concepts.value.split(';');

        data = `{ ${data.map(name => `(${name.replace('http://dbpedia.org/resource/', ':')
                                                .replaceAll("'","\\'")
                                                .replaceAll("(","\\(")
                                                .replaceAll(")","\\)")
                                                .replaceAll(",","\\,")
                                                })`)
                                                .join(" ")} }`;
        obtenirDonneesTableau(data, function(response){
            document.querySelector('#titleTableConcepts').style.display = "block";
            document.querySelector('#tableauConcepts').style.display = "block";
            
            afficherInformations(response, "#concepts", "concept");
        });
    } 
    if(response.results.bindings[0].awards.value != ''){        
        var data = response.results.bindings[0].awards.value.split(';');

        data = `{ ${data.map(name => `(${name.replace('http://dbpedia.org/resource/', ':')
                                                .replaceAll("'","\\'")
                                                .replaceAll("(","\\(")
                                                .replaceAll(")","\\)")
                                                .replaceAll(",","\\,")
                                                })`)
                                                .join(" ")} }`;
        obtenirDonneesTableau(data, function(response){
            document.querySelector('#titleTableAwards').style.display = "block";
            document.querySelector('#tableauAwards').style.display = "block";
            
            afficherInformations(response, "#awards", "award");
        });
    }
    if(response.results.bindings[0].doctoralStudents.value != ''){
        document.querySelector('#genetree_title').style.display = "block";
        const ul = document.querySelector('#genetree ul'); 
        const li = document.createElement('li');
        li.setAttribute("id", response.results.bindings[0].name.value.replaceAll(' ', '_'))
        ul.appendChild(li);
        
        const a = document.createElement('a');
        a.innerHTML = response.results.bindings[0].name.value;
        a.setAttribute("href", "/scientist/"+response.results.bindings[0].name.value.replaceAll(' ', '_'));
        li.appendChild(a);
        const ul2 = document.createElement('ul');
        li.appendChild(ul2);
        rechercherDoctoralSudent(response.results.bindings[0].name.value, 5);  
    }
}

function afficherDoctorant(response, increment, parentName){
    //console.log(response)
    const li_parent = document.querySelector('#'+parentName);
  /*   var img = document.createElement('img');
    img.setAttribute("onerror","this.src='/assets/img/scientist.ico'");
    img.setAttribute("src",response.results.bindings[0].image.value);
    li_parent.appendChild(img); */

    if(response.results.bindings[0].doctoralStudents.value != ''){
        var data = response.results.bindings[0].doctoralStudents.value.split(';');
        // Récupérez l'élément <tbody>
        //const tbody = document.querySelector('#genealogie tbody');
        var ul = document.querySelector('#'+parentName+' ul');
        console.log(parentName);
        if(ul==null){            
            ul = document.createElement('ul');
            li_parent.appendChild(ul);
        }
        // Insérez les données dans le tableau
        for (const row of data) {
            const li = document.createElement('li');
            li.setAttribute("id", row.replace('http://dbpedia.org/resource/', '').replaceAll(' ', '_'))
            ul.appendChild(li);
            const a = document.createElement('a');
            a.innerHTML = row.replace('http://dbpedia.org/resource/', '').replaceAll('_', ' ');
            a.setAttribute("href", "/scientist/"+row.replace('http://dbpedia.org/resource/', ''));
            li.appendChild(a);
            if(increment>0){
                rechercherDoctoralSudent(row.replace('http://dbpedia.org/resource/', ''), increment);
            }
        }
    }
}

function obtenirDonneesTableau(data,  callback){
       //console.log(scientistName);
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
  SELECT DISTINCT ?image ?p WHERE {
    VALUES (?p) ${data}
    ?p dbo:thumbnail ?image .
  }
  `;
  

//requete=encodeURIComponent(requete);
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
      console.log(response);
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

function afficherInformations(data, idTableau, redirectPage="scientist") {
    console.log(data);
    var contenuTableau = "";
    data.results.bindings.forEach(r => {
      contenuTableau +=
        `<div class='col-6 mb-3'>
          <div class='card card-lg card-sm-down-md' >`;
            if(redirectPage != "award") contenuTableau += `<a href="/${redirectPage}/${r.p.value.substring(r.p.value.lastIndexOf("/") + 1)}">`;
             contenuTableau += ` <img src="${r.image.value}" onerror="this.src='/assets/img/${redirectPage}.ico'" width="300" height="auto" class="card-img-top" alt="..." />`
            if(redirectPage != "award") contenuTableau += `</a>`;

            contenuTableau += `<div class='card-body'>
              <h5 class='card-title text-center'>`;
              contenuTableau += (redirectPage != "award")?  `<a class="link-dark " href="/${redirectPage}/${r.p.value.substring(r.p.value.lastIndexOf("/") + 1)}">`: `<p>`;
              contenuTableau += `${r.p.value.substring(r.p.value.lastIndexOf("/") + 1).replaceAll("_", " ")}`;
              contenuTableau += (redirectPage != "award")? `<p/>` :`</a>`;
              contenuTableau += `
                </h5>
                </div>
                </div>
                </div>`;
    });
    $(idTableau).html(contenuTableau);
    activerCollapsibleTexts();
  }