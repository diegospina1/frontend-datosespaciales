'use strict';

const url = 'http://localhost:8080';
const tableBody = document.querySelector('#studentsTable tbody');
const sortAscButton = document.getElementById('sortAsc');
const sortDescButton = document.getElementById('sortDesc');

let map;
let marker1, marker2;
let geocoder;

let estudiantesArray = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 4.713292163053211, lng: -74.0652548199008},
        zoom: 12
    });

    marker1 = new google.maps.Marker({
        position: { lat: 4.713292163053211, lng:-74.0652548199008 },
        map: map,
        draggable: true,
        label: "A"
    });

    marker2 = new google.maps.Marker({
        position: { lat: 4.7064488942387115, lng:-74.05186523249866 },
        map: map,
        draggable: true,
        label: "B"
    });

    geocoder = new google.maps.Geocoder();

    google.maps.event.addListener(marker1, 'dragend', function(event) {
        document.getElementById('lat1').value = event.latLng.lat();
        document.getElementById('lng1').value = event.latLng.lng();
    });

    google.maps.event.addListener(marker2, 'dragend', function(event) {
        document.getElementById('lat2').value = event.latLng.lat();
        document.getElementById('lng2').value = event.latLng.lng();
    });
}

function geocodeAddress(marker, latField, lngField, addressField) {
    const address = document.getElementById(addressField).value;
    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            marker.setPosition(results[0].geometry.location);
            document.getElementById(latField).value = results[0].geometry.location.lat();
            document.getElementById(lngField).value = results[0].geometry.location.lng();
        } else {
            alert('Geocodificación fallida debido a: ' + status);
        }
    });
}

function geocodeAddress1() {
    if (event) event.preventDefault();
    geocodeAddress(marker1, 'lat1', 'lng1', 'direccionR');
}

function geocodeAddress2() {
    if (event) event.preventDefault();
    geocodeAddress(marker2, 'lat2', 'lng2', 'direccionT');
}

async function sendStudent() {

    geocodeAddress1();
    geocodeAddress2();

    await new Promise(resolve => setTimeout(resolve, 500));

    const formData = new FormData(document.getElementById('studentForm'));

    const DocNumber = formData.get('ndocumento');
    const names = formData.get('nombres');
    const lastnames = formData.get('apellidos');
    const latR = formData.get('lat1');
    const lngR = formData.get('lng1');
    const latT = formData.get('lat2');
    const lngT = formData.get('lng2');

    if (!latR || !lngR || !latT || !lngT) {
        alert("Por favor, asegúrese de obtener las coordenas de residencia y trabajo.");
        return;
    }

    const data = {
        estudiante: {
            cedula: DocNumber,
            nombres: names,
            apellidos: lastnames
        },
        residencia: {
            longitud: parseFloat(lngR),
            latitud: parseFloat(latR)
        },
        trabajo: {
            longitud: parseFloat(lngT),
            latitud: parseFloat(latT)
        }
    };

    fetch(`${url}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(errorData => {
                    console.error('Error en el resgitro:', errorData);
                    throw new Error('Error en el registro');
                });
            }
        })
        .then(data => {
            console.log('Estudiante registrado:', data);
            alert("Estudiante registrado exitosamente.");
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Hubo un problema al registrar el estudiante.");
        })
}

async function fethStudents() {
    try {
        const response = await fetch(url + "/ordenar");
        if (!response.ok) throw new Error('Error al obtener los datos.');
        const data = await response.json();
        estudiantesArray = data;
        populateTable(estudiantesArray);
    } catch (error) {
        console.error('Error al cargar los estudiantes.',  error);
        alert('Hubo un problema al cargar los estudiantes.');
    }
}

function populateTable(data) {
    tableBody.innerHTML = '';

    data.forEach(student => {
       const row = document.createElement('tr');

       const nameCell = document.createElement('td');
       nameCell.textContent = student.nombres;

       const lastNameCell = document.createElement('td');
       lastNameCell.textContent = student.apellidos;

       const buttonBorrar = document.createElement("button");
       buttonBorrar.classList.add('buscar-btn');
       buttonBorrar.textContent = "Borrar";
       buttonBorrar.id = student.cedula;
       buttonBorrar.addEventListener('click', () => {
           borrarEstudiante();
       })

       const optionCell = document.createElement('td');
       optionCell.appendChild(buttonBorrar);

       const distanceCell = document.createElement('td');
       distanceCell.textContent = (student.distancia / 1000).toFixed(2);

       row.appendChild(nameCell);
       row.appendChild(lastNameCell);
       row.appendChild(distanceCell);
       row.appendChild(optionCell);

       tableBody.appendChild(row);
    });
}

function sortTable(order) {
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    const sortedRows = rows.sort((a, b) => {
        const distanceA = parseFloat(a.cells[2].textContent);
        const distanceB = parseFloat(b.cells[2].textContent);

        return order === 'asc' ? distanceA - distanceB : distanceB - distanceA;
    });

    tableBody.innerHTML = '';
    sortedRows.forEach(row => tableBody.appendChild(row));
}

sortAscButton.addEventListener('click', () => sortTable('asc'));
sortDescButton.addEventListener('click', () => sortTable('desc'));

document.addEventListener('DOMContentLoaded', initMap);
document.addEventListener('DOMContentLoaded', fethStudents);

function navigateToStudentsList() {
    window.location.href = './pages/studentsList.html';
}

function navigateToForm() {
    window.location.href = '../index.html';
}

let borrarEstudiante = async () => {
    const cedula = event.target.id;
    try {
        const response = await fetch(url + `/${cedula}`, {method: 'DELETE'});
        if (!response.ok) throw new Error('Error al obtener los datos.');
    } catch (error) {
        console.error('Error al borrar el estudiante.',  error);
        alert('Hubo un problema al borrar el estudiante.');
    }
    window.location.reload();
}

