function rechercherScientist(scientistName){

    
    decodeURIComponent(scientistName);
    scientistName = scientistName.replaceAll('(', '\\(');
    scientistName = scientistName.replaceAll(')', '\\)');
    scientistName = scientistName.replaceAll(',', '\\,');
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
        ?name 
        ?description 
        ?conjoint 
        ?isPrimaryTopicOf 
        ?thumbnail 
        ?date WHERE {
            
            :${scientistName} rdfs:label ?name.
            OPTIONAL{:${scientistName} dbo:academicDiscipline ?discipline}
            OPTIONAL{:${scientistName} dbo:birthDate ?date}
            OPTIONAL{:${scientistName} dbo:abstract ?description}
            OPTIONAL{:${scientistName} dbo:spouse ?conjoint}
            OPTIONAL{:${scientistName} foaf:isPrimaryTopicOf ?isPrimaryTopicOf}
            OPTIONAL{:${scientistName} dbo:thumbnail ?thumbnail}
            OPTIONAL{:${scientistName} dbo:doctoralStudent ?doctoralStudent}
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
            afficherScientist(response);
            
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
    var element = response.results.bindings[0].name.value;
    titre.innerHTML = nomPage.innerHTML = element;
    
    if(response.results.bindings[0].hasOwnProperty("isPrimaryTopicOf")){
        var lien = document.querySelector('#pageWikipedia');
        lien.setAttribute("href", response.results.bindings[0].isPrimaryTopicOf.value);
    } else{
        document.getElementById("pageWikipedia").style.display = "none";
    }
    if(response.results.bindings[0].hasOwnProperty("description")){
        var resume = document.querySelector('#resume');
        element = response.results.bindings[0].description.value;
        resume.innerHTML = element;
    } else{
        document.getElementById("resume").style.display = "none";
    }   
    if(response.results.bindings[0].hasOwnProperty("thumbnail")){
        var image = document.querySelector('#image');
        image.setAttribute("src", response.results.bindings[0].thumbnail.value);
        image.onerror = function (){
            document.getElementById("image").style.display = "none";
        }
    } else{
        document.getElementById("image").style.display = "none";
    }
    if(response.results.bindings[0].hasOwnProperty("date")){
        var date = document.querySelector('#dateNaissance');
        date.innerHTML= "Né.e le :"+response.results.bindings[0].date.value;
    } else{
        document.getElementById("dateNaissance").style.display = "none";
    }
    if(response.results.bindings[0].hasOwnProperty("conjoint")){
        var lien = document.querySelector('#conjoint');
        var conjointLien = response.results.bindings[0].conjoint.value;
        lien.setAttribute("href", "/scientist/"+conjointLien.replace('http://dbpedia.org/resource/', ''));
        lien.innerHTML =response.results.bindings[0].conjoint.value.replace('http://dbpedia.org/resource/', '').replaceAll('_', ' ');
        
    } else{
        document.getElementById("conjointDiv").style.display = "none";
    }
    if(response.results.bindings[0].disciplines.value != ''){        
        var data = response.results.bindings[0].disciplines.value.split(';');
        // Récupérez l'élément <tbody>
        const tbody = document.querySelector('#disciplines tbody');
        // Insérez les données dans le tableau
        for (const row of data) {
            const tr = document.createElement('tr');

            const td = document.createElement('td');
            const a = document.createElement("a");
            a.href = "/domaine/"+row.replace('http://dbpedia.org/resource/', '');
            a.innerHTML = row.replace('http://dbpedia.org/resource/', '').replaceAll('_', ' ');
            td.appendChild(a);
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
    }else{
        document.getElementById("disciplines").style.display = "none";
    }
    if(response.results.bindings[0].doctoralStudents.value != ''){   

        var data = response.results.bindings[0].doctoralStudents.value.split(';');
        // Récupérez l'élément <tbody>
        const tbody2 = document.querySelector('#doctorants tbody');
        // Insérez les données dans le tableau
        for (const row of data) {
            const tr = document.createElement('tr');

            const td = document.createElement('td');
            const a = document.createElement("a");
            var name = row.replace('http://dbpedia.org/resource/', '');
            name = encodeURIComponent(name);
            a.href = "/scientist/"+name;
            a.innerHTML = row.replace('http://dbpedia.org/resource/', '').replaceAll('_', ' ');
            td.appendChild(a);
            tr.appendChild(td);
            tbody2.appendChild(tr);
        } 
    } else {
        document.getElementById("doctorants").style.display = "none";
    }
    
}