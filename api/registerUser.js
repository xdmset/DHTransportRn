//api/registerUser.js
import { apiURL } from './apiGlobal';


export const registerUser = async (
  nombre, 
  apellidoPaterno,
  apellidoMaterno,
  nombreDeUsuario,
  correoElectronico,
  numeroDeTelefono,
  password
) => {
  const _apiURL = `${apiURL}/loginExample/registerUser.php`;
  fetch('[URL de tu API]', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        nombre: nombre,
        apellidoPaterno: apellidoPaterno,
        apellidoMaterno: apellidoMaterno,
        nombreDeUsuario: nombreDeUsuario,
        correoElectronico: correoElectronico,
        numeroDeTelefono: numeroDeTelefono,
        password: password
    })
})
.then(response => response.json())
.then(data => console.log(data))
.catch((error) => {
    console.error('Error:', error);
});
};