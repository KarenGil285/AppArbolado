let url ="http://127.0.0.1:8000/getjson"

let myAPI = url + "?Localidad"

document.getElementById("getjson").addEventListener("click", function() {

    let localidadSeleccionada = Number(document.getElementById("Localidad").value)

    console.log("La localidad escogida es:", localidadSeleccionada)

    document.getElementById("resultado").textContent =
        "Código seleccionado: " + localidadSeleccionada
        descargarGeoJSON(localidadSeleccionada);
})

function descargarGeoJSON(idLocalidad) {

    fetch("http://127.0.0.1:8000/buscar?LocalidadSeleccionada=${idLocalidad}")
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "arboles.geojson";
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
}
