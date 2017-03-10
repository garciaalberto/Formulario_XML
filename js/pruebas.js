var formContainer = null;
var nota = 0.0;

var preguntasSelect = [];
var respuestasSelect = [];
var valorRespuestaSelect = [];

var preguntasText = [];
var respuestasText = [];

var preguntasCheckBox = [];
var respuestasCheckBox = [];
var valorRespuestasCheckBox =[];

var preguntasRadio = [];
var respuestasRadio = [];

var preguntasSelectMultiple = [];
var respuestasSelectMultiple = [];

window.onload = function(){ 
	formContainer=document.getElementById('myform');
	formContainer.onsubmit=function(){
		inicializar();
		if (comprobar()){
			corregirSelect();
			corregirText();
			corregirCheckBox();
			corregirRadio();
			corregirSelectMultiple();
			presentarNota();
	 	}
	 	return false;
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			gestionarXml(this);
		}
	};
	xhttp.open("GET", "xml/preguntas.xml", true);
	xhttp.send();
}

function gestionarXml(dadesXml){
	var xmlDoc = dadesXml.responseXML;
	var tipo = "";
	var numeroCajaTexto = 0;
	for (i = 0; i<10; i++) {
		tipo = xmlDoc.getElementsByTagName("type")[i].innerHTML;
		switch(tipo) {
			case "select":
				crearDivPregunta(i);
				imprimirTituloPregunta(i, xmlDoc);
				imprimirOpcionesSelect(i, xmlDoc);
				preguntasSelect.push(i);
				respuestasSelect.push(parseInt(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer")[0].innerHTML));
				valorRespuestaSelect.push(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("option")[respuestasSelect[i]].innerHTML);
				break;
			case "text":
				crearDivPregunta(i);
				imprimirTituloPregunta(i, xmlDoc);
				imprimirCajaText(numeroCajaTexto, xmlDoc);
				numeroCajaTexto++;
				preguntasText.push(i);
				respuestasText.push(parseInt(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer")[0].innerHTML));
				break;
			case "checkbox":
				crearDivPregunta(i);
				imprimirTituloPregunta(i, xmlDoc);
				imprimirCheckBox(i, xmlDoc);
				preguntasCheckBox.push(i);
				agregarRespuestas(i, xmlDoc, respuestasCheckBox, valorRespuestasCheckBox);
				break;
			case "radio":
				crearDivPregunta(i);
				imprimirTituloPregunta(i, xmlDoc);
				imprimirRadioButton(i, xmlDoc);
				preguntasRadio.push(i);
				respuestasRadio.push(parseInt(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer")[0].innerHTML));
				break;
			case "select multiple":
				crearDivPregunta(i);
				imprimirTituloPregunta(i, xmlDoc);
				imprimirSelectMultiple(i, xmlDoc);
				preguntasSelectMultiple.push(i);
				agregarRespuestas(i, xmlDoc, respuestasSelectMultiple);
				break;
		}
	}
	imprimirEspacios(3);
	imprimirBotonCorregir();
}
 
function imprimirTituloPregunta(i, xmlDoc){
	var tituloPregunta = document.createElement("h3");
	tituloPregunta.innerHTML=xmlDoc.getElementsByTagName("title")[i].innerHTML;
	document.getElementById('pregunta'+i).appendChild(tituloPregunta);
}

function imprimirOpcionesSelect(i, xmlDoc) {
	var numOpciones = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option').length;
	var opt = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option');
	var select = document.createElement("select");
	select.id = "select"+i;
	document.getElementById('pregunta'+i).appendChild(select);
	for (j = 0; j < numOpciones; j++) { 
		var option = document.createElement("option");
		option.text = opt[j].innerHTML;
		option.value = j ;
		select.options.add(option);
	}  
}

function imprimirCajaText(numeroCajaTexto, xmlDoc) {
	var cajaTexto = document.createElement("input");
	cajaTexto.type = "number";
	cajaTexto.id = "cajaTexto" + numeroCajaTexto;
	document.getElementById('pregunta'+i).appendChild(cajaTexto);
}


function imprimirCheckBox(i, xmlDoc) {
	var numOpciones = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option').length;
	var opt = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option');
	for (j = 0; j < numOpciones; j++) {
		var label = document.createElement("label");
		var input = document.createElement("input");
		label.innerHTML=opt[j].innerHTML;
		input.type="checkbox";
		input.name="preg"+i;
		input.id="preg"+i+"ans"+j;
		document.getElementById('pregunta'+i).appendChild(input);
		document.getElementById('pregunta'+i).appendChild(label);
		document.getElementById('pregunta'+i).appendChild(document.createElement("br"));
	}
}

function imprimirRadioButton(i, xmlDoc) {
	var numOpciones = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option').length;
	var opt = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option');
	for (j = 0; j < numOpciones; j++) {
		var input = document.createElement("input");
		var answerTitle = opt[j].innerHTML;
		var span = document.createElement("span");
		span.innerHTML = answerTitle;
		input.type="radio";
		input.name="preg"+i;
		input.id="preg"+i+"ans"+j;
		document.getElementById('pregunta'+i).appendChild(input);
		document.getElementById('pregunta'+i).appendChild(span);
		document.getElementById('pregunta'+i).appendChild(document.createElement("br"));
	}	
}

function imprimirSelectMultiple(i, xmlDoc) {
	var numOpciones = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option').length;
	var opt = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option');
	var selectMultiple = document.createElement("select");
	selectMultiple.multiple="true";
	for (j = 0; j < numOpciones; j++) {
		var answerTitle = opt[j].innerHTML;
		var option = document.createElement("option");
		option.innerHTML = answerTitle;
		selectMultiple.appendChild(option);
		}
	document.getElementById('pregunta'+i).appendChild(selectMultiple);
}

function imprimirEspacios(numeroEspacios) {
	for (i=0; i<numeroEspacios; i++) {
		var espacio = document.createElement("br");
		formContainer.appendChild(espacio);
	}
}

function imprimirBotonCorregir() {
	var botonCorregir = document.createElement("input");
	botonCorregir.type = "submit";
	botonCorregir.value = "Corregir";
	formContainer.appendChild(botonCorregir);
}

function corregirSelect() {
  for (i = 0; i<preguntasSelect.length; i++) {
  	var sel = document.getElementById("pregunta"+preguntasSelect[i]).getElementsByTagName("select")[0];
  	var respuesta = respuestasSelect[i];
  	if (sel.selectedIndex==respuesta) { 
  		darRespuestaHtml("P" +preguntasSelect[i]+": Correcto");
  		nota +=1;
  	}
  	else {
  		darRespuestaHtml("P" +preguntasSelect[i]+ ": Incorrecto");
  		darRespuestaHtml("La respuesta correcta es: "+valorRespuestaSelect[i]);
  	}
  }
}

function corregirText() {
	for (i = 0; i<preguntasText.length; i++) {
		var input = document.getElementById("pregunta"+preguntasText[i]).getElementsByTagName("input")[0];
		var respuesta = respuestasText[i];
		if (input.value == respuesta){
			darRespuestaHtml("P" +preguntasText[i]+": Correcto");
			nota += 1;
		} 
		else {
			darRespuestaHtml("P" +preguntasText[i] + ": Incorrecto");
			darRespuestaHtml("La respuesta correcta es: "+respuestasText[i]);
		}
	}
}

function corregirCheckBox(){
	for (i = 0; i<preguntasCheckBox.length; i++) {
		var inputs = document.getElementById("pregunta"+preguntasCheckBox[i]).getElementsByTagName("input");
	 	var bandera = 0; 
	  	for (j = 0; j < inputs.length; j++){
	  		var encontrado = false;
		  	if (inputs[j].checked) { 
		  		bandera = 1;
		  		for (k = 0; k < respuestasCheckBox[i].length; k++){
		  			if(j == respuestasCheckBox[i][k])	{
		  				nota += 1.0/respuestasCheckBox[i].length;
		  				darRespuestaHtml("P"+preguntasCheckBox[i]+" opcion "+j+": correcta");
		  				encontrado = true;
		  				break;
		  			} 
		  		}
		  		if (!encontrado){
		  			nota -= 1.0/respuestasCheckBox[i].length;
		  			darRespuestaHtml("P"+preguntasCheckBox[i]+" opcion "+j+": incorrecta");
		  		}
		  	}	
	  	}
	  	if (bandera == 0){
			darRespuestaHtml("P"+preguntasCheckBox[i]+": No has seleccionado ninguna respuesta");
		}
	}
}

function corregirRadio() {
	for (i = 0; i<preguntasRadio.length; i++) {
		var preguntaRadio = document.getElementById('pregunta'+preguntasRadio[i]);
		var bandera = 0;
		for (j = 0; j<preguntaRadio.getElementsByTagName('input').length; j++) {
			if (preguntaRadio.getElementsByTagName('input')[j].checked){
				bandera = 1;
				if (j == respuestasRadio[i]){
					nota +=1.0;
		    		darRespuestaHtml("P"+preguntasRadio[i]+" opcion "+j+": correcta");	
				} else{
					nota -= 1.0;
					darRespuestaHtml("P"+preguntasRadio[i]+" opcion "+j+": incorrecta");
				}
			} 				
		}
		if (bandera == 0){
			darRespuestaHtml("P"+preguntasRadio[i]+": No has seleccionado ninguna respuesta");
		}
	}
}

function corregirSelectMultiple() {
	for (i = 0; i<preguntasSelectMultiple.length; i++) {
	  	var sel = document.getElementById("pregunta"+preguntasSelectMultiple[i]).getElementsByTagName("select")[0];
	  	var bandera = 0; 
	  	for (j = 0; j < sel.length; j++){
	  		var encontrado = false;
		  	if (sel[j].selected) { 
		  		bandera = 1;
		  		for (k = 0; k < respuestasSelectMultiple[i].length; k++){
		  			if(j == respuestasSelectMultiple[i][k])	{
		  				nota += 1.0/respuestasSelectMultiple[i].length;
		  				darRespuestaHtml("P"+preguntasSelectMultiple[i]+" opcion "+j+": correcta");
		  				encontrado = true;
		  				break;
		  			} 
		  		}
		  		if (!encontrado){
		  			nota -= 1.0/respuestasSelectMultiple[i].length;
		  			darRespuestaHtml("P"+preguntasSelectMultiple[i]+" opcion "+j+": incorrecta");
		  		}
		  	}	
	  	}
	  	if (bandera == 0){
			darRespuestaHtml("P"+preguntasSelectMultiple[i]+": No has seleccionado ninguna respuesta");
		}
	}
}

function agregarRespuestas(i, xmlDoc, arrayRespuestas, arrayValorRespuestas) {
	var respuestasPregunta = [];
	var valorRespuesta = [];
	for (j= 0; j <xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer").length; j++) {
		respuestasPregunta.push(parseInt(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer")[j].innerHTML));
	}
	arrayRespuestas.push(respuestasPregunta);
}

function crearDivPregunta(i) {
	var div = document.createElement('div');
	div.id = "pregunta"+i;
	formContainer.appendChild(div);
}

function inicializar(){
	document.getElementById('resultadosDiv').innerHTML = "";
	nota=0.0;
}

function darRespuestaHtml(r){
	var p = document.createElement("p");
	var node = document.createTextNode(r);
	p.appendChild(node);
	document.getElementById('resultadosDiv').appendChild(p);
}

function presentarNota(){
	darRespuestaHtml("Nota: "+nota.toFixed(2)+" puntos sobre 10");
	if (nota.toFixed(2) > 5) {
		darRespuestaHtml("Enhorabuena!");
	} else {
		darRespuestaHtml("Más suerte la próxima vez...");
	}
				 
}

window.onmousedown = function (e) {
    var el = e.target;
    if (el.tagName.toLowerCase() == 'option' && el.parentNode.hasAttribute('multiple')) {
        e.preventDefault();

        if (el.hasAttribute('selected')) el.removeAttribute('selected');
        else el.setAttribute('selected', '');

        var select = el.parentNode.cloneNode(true);
        el.parentNode.parentNode.replaceChild(select, el.parentNode);
    }
}

function comprobar(){
	for (i = 0; i < preguntasText.length; i++){
		var input = document.getElementById("pregunta"+preguntasText[i]).getElementsByTagName("input")[0];
		if (input.value=="") {
			input.focus();
			alert("Escribe un numero en la pregunta "+preguntasText[i]);
			return false;
		}
	}
	return true;
}
