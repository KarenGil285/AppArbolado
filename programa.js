let url ="http://127.0.0.1:8000/getjson"

let myAPI = url + "?Localidad"

let map = L.map('map').setView([4.65, -74.1], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

let capaArboles = null;

document.getElementById("getjson").addEventListener("click", function() {

    let localidadSeleccionada = Number(document.getElementById("Localidad").value)

    console.log("La localidad escogida es:", localidadSeleccionada)

    document.getElementById("resultado").textContent =
        "Código seleccionado: " + localidadSeleccionada
        descargarGeoJSON(localidadSeleccionada);
        cargarGeoJSON(localidadSeleccionada);
})

function descargarGeoJSON(idLocalidad) {

    fetch("http://127.0.0.1:8000/getjson?LocalidadSeleccionada=${idLocalidad}")
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
function cargarGeoJSON(idLocalidad) {

    fetch("http://127.0.0.1:8000/getjson?LocalidadSeleccionada=${idLocalidad}")
        .then(response => response.json())
        .then(data => {

            // Eliminar capa anterior si existe
            if (capaArboles) {
                map.removeLayer(capaArboles);
            }

            capaArboles = L.geoJSON(data, {
                onEachFeature: function (feature, layer) {
                    layer.bindPopup("ID Árbol: " + feature.properties.OBJECTID);
                }
            }).addTo(map);

            // Ajustar zoom al contenido
            map.fitBounds(capaArboles.getBounds());
        });
}