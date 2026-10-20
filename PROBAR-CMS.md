# Cómo probar el panel de edición

Cada plantilla de este proyecto tiene un panel desde el que se puede cambiar el contenido de la web (textos, precios, fotos, horarios) sin tocar código. Esta guía explica cómo probarlo, tanto si solo quieres echarle un vistazo como si quieres verlo funcionar de verdad en tu ordenador.

## Opción 1: probarlo en línea (sin instalar nada)

Es la forma más rápida. No hace falta registrarse y no se guarda nada, así que no puedes romper nada.

1. Abre el panel de pruebas de la plantilla que quieras:

   - [Barbería](https://guillermosnt.github.io/plantillas-web/demos/barberia/probar/)
   - [Librería](https://guillermosnt.github.io/plantillas-web/demos/libreria/probar/)
   - [Peluquería](https://guillermosnt.github.io/plantillas-web/demos/peluqueria/probar/)
   - [Restaurante](https://guillermosnt.github.io/plantillas-web/demos/restaurante/probar/)
   - [Clínica de perros](https://guillermosnt.github.io/plantillas-web/demos/clinica-perros/probar/)
   - [Tienda de ropa](https://guillermosnt.github.io/plantillas-web/demos/tienda-ropa/probar/)

2. Si aparece un botón de **Login**, púlsalo. No pide usuario ni contraseña.
3. En la pantalla principal verás la colección **Mi web**. Entra en **Contenido de la web**.
4. Se abre un formulario con todo el contenido de la plantilla. Cambia lo que quieras: el nombre del negocio, el precio de un servicio, un horario, una foto.
5. Arriba a la derecha pulsa **Publicar** y, en el menú que aparece, **Publicar ahora**.

### Qué esperar

- El panel acepta los cambios, pero **la web no cambia**. Es una demostración: todo se guarda solo en la memoria de tu navegador.
- Si recargas la página, todo vuelve al principio.
- Puedes subir una foto desde tu ordenador. Se verá en el panel mientras no recargues, y no se sube a ningún servidor.

## Opción 2: verlo funcionar en tu ordenador

Si quieres ver cómo la web cambia al editar desde el panel, puedes ejecutar el proyecto en local. Necesitas tener instalados:

- [Node.js](https://nodejs.org)
- [Git](https://git-scm.com)
- [Visual Studio Code](https://code.visualstudio.com) con la extensión **Live Server**

Pasos:

1. Descarga el proyecto y entra en la carpeta:

```
   git clone https://github.com/guillermosnt/plantillas-web.git
   cd plantillas-web
```

2. Arranca el servidor del panel. Déjalo abierto mientras pruebas:

```
   npx decap-server
```

3. Abre la carpeta en Visual Studio Code, haz clic derecho sobre `demos/barberia/index.html` y elige **Open with Live Server**. Se abre la barbería en el navegador.
4. En esa misma pestaña, cambia el final de la dirección por `/demos/barberia/admin/`. Por ejemplo: `http://127.0.0.1:5500/demos/barberia/admin/`.
5. Pulsa **Login**, entra en **Contenido de la web**, cambia un precio y pulsa **Publicar**.
6. Vuelve a la pestaña de la barbería. La web se recarga sola y muestra el precio nuevo.

Los cambios se guardan en el archivo `content.json` de tu copia, y solo existen en tu ordenador. Para otra plantilla, sustituye `barberia` por el nombre de su carpeta en `demos`.

## Preguntas frecuentes

**¿Por qué no veo los cambios en la web de la demo?**
Porque el panel de pruebas no guarda nada. Para ver la web cambiar, usa la opción 2.

**¿Puedo estropear algo?**
No. En la opción 1 todo queda en tu navegador, y en la opción 2 solo en tu copia local.

**Me sale una pantalla en blanco al abrir el panel de pruebas.**
Recarga la página con `Ctrl + F5`. Si sigue igual, prueba en otro navegador o en una ventana de incógnito.

**¿Y el panel de verdad, el que usaría el dueño de un negocio?**
Se encuentra en la carpeta `admin` de cada demo y guarda los cambios directamente en el repositorio de GitHub, tras iniciar sesión con una cuenta con permiso de escritura. Por eso no está abierto al público: es el que usaría quien lleve el negocio.

## Cómo funciona por dentro

Cada plantilla lee todo su contenido de un único archivo, `content.json`. El panel (Decap CMS) construye sus formularios a partir de ese archivo y, al publicar, guarda el cambio en él. La web, al cargarse, lee el archivo actualizado. No hay base de datos ni servidor propio.