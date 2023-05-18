// Utilizar fetch para obtener el archivo JSON
fetch('https://www.el-tiempo.net/api/json/v2/home')
    .then(response => response.json()) // Convertir la respuesta a JSON
    .then(data => {
        // Acceder a los datos dentro del objeto JSON
        const ciudades = data.ciudades;
        const today = data.today;
        const tomorrow = data.tomorrow;
        //Creamos la tabla y la descipcion del dia de hoy y de mañana
        document.getElementById('coso').innerHTML = `
    <table class="table">
    <thead>
            <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Provincia</th>
                <th scope="col">Temperaturas</th>
                <th scope="col">Estado del cielo</th>
            </tr>
        </thead>
        <tbody>
    ${ciudades.map(ciudad => `
        <tr>
            <td>${ciudad.name}</td>
            <td>${ciudad.nameProvince}</td>
            <td>Maxima: ${ciudad.temperatures.max} grados, Minima: ${ciudad.temperatures.min} grados</td> 
            <td>${ciudad.stateSky.description}</td>
        </tr>
    `).join('')}
        </tbody>
    </table>
        <section>
        <h2>Estado del dia Hoy</h2>
        <p>${today.p.join('<br>')}</p>

        <h2>Estado del dia de Mañana</h2>
        <p>${tomorrow.p.join('<br>')}</p>
        </section>
`;
    })

