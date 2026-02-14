from fastapi import FastAPI
from fastapi.middleware.cors import CORSmiddleware
import requests
import json
from shapely.geometry import shape
from fastapi.responses import JSONResponse
app=FastAPI()
app.add_middleware(
    CORSmiddleware,
    allow_origins=["*"],
    allow_credential=True,
    allow_methods=["*"],
    allow_headers=["*"]
    )
with open("Localidades.geo.json", "r", encoding="utf-8") as f:
    LOCALIDADES = json.load(f)
@app.get("/buscar")

def obtener_bbox_localidad(LocalidadSeleccionada):
    for feature in LOCALIDADES["features"]:
        if feature["properties"]["ID_LOCAL"] == LocalidadSeleccionada:
            polygon = shape(feature["geometry"])
            xmin, ymin, xmax, ymax = polygon.bounds
            return consultar_arboles(xmin, ymin, xmax, ymax)
    return {"error": "Localidad no encontrada"}
def consultar_arboles(xmin, ymin, xmax, ymax):
    url = "https://geoportal.jbb.gov.co/agc/rest/services/JBB/CensoArbol_v0/MapServer/0/query"
    params = {
        "where": "1=1",
        "geometry": f"{xmin},{ymin},{xmax},{ymax}",
        "geometryType": "esriGeometryEnvelope",
        "spatialRel": "esriSpatialRelIntersects",
        "inSR": 4326,
        "outSR": 4326,
        "outFields": "*",
        "f": "geojson"
    }
    response = requests.get(url, params=params)

    if response.status_code == 200:
        return JSONResponse(
            content=response.json(),
            headers={
                "Content-Disposition": "attachment; filename=arboles.geojson"
            }
        )
    else:
        return {"error": "No se pudo consultar el servicio"}
        
        