````markdown
# Guía para contribuir al proyecto Gestión Académica de Eventos

¡Gracias por interesarte en contribuir a este proyecto! 🙌

Para que tu aporte sea valioso y fluya sin problemas, por favor sigue las indicaciones de esta guía.

---

## 1. Reporte de errores (Issues)

- Antes de crear un nuevo issue, busca si alguien más ya lo reportó para evitar duplicados.
- Usa títulos descriptivos y claros.
- Proporciona la mayor cantidad de detalles posibles:
  - Pasos para reproducir el error.
  - Comportamiento esperado vs. comportamiento actual.
  - Capturas de pantalla, logs o mensajes de error si es posible.
- Etiqueta el issue con la categoría adecuada si tienes permisos.

---

## 2. Solicitud de nuevas funcionalidades

- Explica claramente la función que deseas agregar y el problema que resuelve.
- Justifica por qué es importante para el proyecto.
- Si tienes ideas de implementación, compártelas.
- Sé abierto a feedback y discusiones.

---

## 3. Estilo y convenciones de código

- Sigue la convención de código y formato que el proyecto utiliza (p. ej. [ESLint para JS], [Google Java Style] para Java).
- Escribe comentarios claros y útiles.
- Mantén el código limpio y legible.
- Realiza pruebas locales antes de enviar cambios.

---

## 4. Cómo contribuir con código

1. Haz un fork de este repositorio.
2. Crea una rama descriptiva basada en `develop`, por ejemplo:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/nombre-descriptivo
   ```
````

3. Realiza tus cambios en la nueva rama.
4. Asegúrate de que todos los tests pasen y que tu código no rompa funcionalidades existentes.
5. Haz commits claros y atómicos, con mensajes descriptivos. Ejemplo:

   ```bash
   git commit -m "Agrega validación de comprobante en inscripción"
   ```
6. Envía un Pull Request (PR) contra la rama `develop`.
7. Describe claramente qué hace tu PR y qué problema resuelve.
8. Responde a los comentarios y solicitudes de cambios que hagan los revisores.

---

## 5. Pruebas y validación

* Si agregas nuevas funcionalidades, incluye pruebas automatizadas cuando sea posible.
* Verifica que los flujos principales (inscripción, pago, generación de certificados) sigan funcionando correctamente.
* Usa el entorno de desarrollo para probar antes de enviar PR.

---

## 6. Código de conducta

Este proyecto se rige por un [Código de Conducta](CODE_OF_CONDUCT.md).
Se espera un comportamiento respetuoso, colaborativo y profesional en todas las interacciones.

---

## 7. Contacto y dudas

Si tienes preguntas, no dudes en abrir un issue o contactarnos directamente vía email o chat del equipo.

---

¡Gracias por ayudar a mejorar esta plataforma educativa! 🎉

---

