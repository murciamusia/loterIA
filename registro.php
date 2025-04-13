<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registro - loterIA</title>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      font-family: 'Orbitron', sans-serif;
      background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .form-container {
      background: rgba(255, 255, 255, 0.05);
      padding: 2rem;
      border-radius: 20px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
    }
    h2 {
      text-align: center;
      margin-bottom: 1rem;
    }
    input[type="text"],
    input[type="email"],
    input[type="password"] {
      width: 100%;
      padding: 0.75rem;
      margin: 0.5rem 0;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background-color: #00ffc8;
      color: #000;
      font-weight: bold;
      border: none;
      border-radius: 10px;
      margin-top: 1rem;
      cursor: pointer;
      transition: background 0.3s;
    }
    button:hover {
      background-color: #00cc9e;
    }
    .link {
      text-align: center;
      margin-top: 1rem;
    }
    .link a {
      color: #00ffc8;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="form-container">
    <h2>Crear cuenta en loterIA</h2>
	  
	<?php if (isset($_GET['exito'])): ?>
  <p style="color: #00ff88; text-align: center;">¡Registro exitoso! 🎉</p>
<?php endif; ?>

    <form action="registro-procesar.php" method="POST">
      <input type="text" name="nombre" placeholder="Nombre completo" required />
      <input type="email" name="email" placeholder="Correo electrónico" required />
      <input type="password" name="password" placeholder="Contraseña" required />
      <input type="password" name="confirmar" placeholder="Confirmar contraseña" required />
      <button type="submit">Registrarse</button>
    </form>
    <div class="link">
      ¿Ya tienes cuenta? <a href="login.html">Inicia sesión</a>
    </div>
  </div>
</body>
</html>
