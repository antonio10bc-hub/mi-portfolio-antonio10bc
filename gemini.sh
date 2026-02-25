#!/bin/bash

# Archivo temporal para ir guardando el texto
TEMP_FILE="/tmp/gemini_context.txt"

# 1. Generar la estructura de carpetas (Ignorando basura)
echo "Esta es la estructura actual de mi proyecto:" > "$TEMP_FILE"
echo '```text' >> "$TEMP_FILE"
find . -type f -not -path "*/node_modules/*" -not -path "*/\.git/*" -not -path "*/\.next/*" -not -path "*/dist/*" -not -name ".*" | sed 's|^\./||' | sort >> "$TEMP_FILE"
echo '```' >> "$TEMP_FILE"
echo -e "\n----------------------------------------\n" >> "$TEMP_FILE"

# 2. Comprobar si se han pasado archivos como argumentos
if [ $# -gt 0 ]; then
  # Recorrer todos los archivos que le pases
  for file in "$@"; do
    if [ -f "$file" ]; then
      echo "Aquí tienes el código del archivo: $file" >> "$TEMP_FILE"
      echo '```' >> "$TEMP_FILE"
      cat "$file" >> "$TEMP_FILE"
      echo -e '\n```\n' >> "$TEMP_FILE"
      echo "✅ Archivo añadido: $file"
    else
      echo "❌ Ojo: El archivo '$file' no existe o la ruta está mal. (Omitido)"
    fi
  done
  echo "🚀 ¡Estructura y código listos en tu portapapeles!"
else
  echo "✅ ¡Solo la estructura del proyecto se copió a tu portapapeles!"
fi

# 3. Enviar todo el texto al portapapeles del Mac
cat "$TEMP_FILE" | pbcopy