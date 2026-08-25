#!/usr/bin/env python3
"""
Procesa el libro 'Pitágoras: Auto-Aprendizaje de Vida' de María Amelia Ruiz de Motto
Convierte de texto plano a Markdown estructurado para knowledge base RAG
"""

import re
import sys

def process_book(input_path, output_path):
    """Procesa el libro completo y genera Markdown estructurado"""
    
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Iniciar documento Markdown
    md = []
    md.append("# Pitágoras: Auto-Aprendizaje de Vida\n")
    md.append("**Autora**: María Amelia Ruiz de Motto\n")
    md.append("**Género**: Filosofía Pitagórica, Desarrollo Espiritual\n")
    md.append("**Descripción**: Doce lecciones de auto-aprendizaje de vida basadas en las enseñanzas de Pitágoras\n")
    md.append("\n---\n\n")
    
    # Dividir en líneas
    lines = content.split('\n')
    
    # Procesar línea por línea
    i = 0
    current_section = None
    buffer = []
    
    while i < len(lines):
        line = lines[i].strip()
        
        # Detectar títulos principales
        if line.upper() == "PRESENTACIÓN":
            if buffer:
                md.append('\n'.join(buffer) + '\n\n')
                buffer = []
            md.append("## Presentación\n\n")
            current_section = "presentacion"
            i += 1
            continue
            
        elif line.upper() == "INTRODUCCIÓN":
            if buffer:
                md.append('\n'.join(buffer) + '\n\n')
                buffer = []
            md.append("## Introducción\n\n")
            current_section = "introduccion"
            i += 1
            continue
        
        # Detectar capítulos
        elif line.startswith("CAPÍTULO"):
            if buffer:
                md.append('\n'.join(buffer) + '\n\n')
                buffer = []
            md.append(f"## {line}\n\n")
            current_section = "capitulo"
            i += 1
            continue
        
        # Detectar subtítulos (líneas en mayúsculas seguidas de contenido)
        elif len(line) > 0 and line.isupper() and len(line) < 100:
            # Verificar si no es parte de un párrafo
            if i > 0 and lines[i-1].strip() == "":
                if buffer:
                    md.append('\n'.join(buffer) + '\n\n')
                    buffer = []
                md.append(f"### {line.title()}\n\n")
                i += 1
                continue
        
        # Líneas vacías
        elif line == "":
            if buffer:
                md.append('\n'.join(buffer) + '\n\n')
                buffer = []
            i += 1
            continue
        
        # Contenido normal
        else:
            # Limpiar líneas de paginación
            if re.match(r'^\s*\d+\s*$', line):
                i += 1
                continue
            
            # Limpiar líneas de encabezado repetitivo
            if "Auto-Aprendizaje de" in line or "Vida de Pitágoras" in line:
                i += 1
                continue
            
            # Agregar al buffer
            buffer.append(line)
            i += 1
    
    # Agregar último buffer
    if buffer:
        md.append('\n'.join(buffer) + '\n\n')
    
    # Escribir archivo de salida
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(''.join(md))
    
    print(f"✅ Libro procesado exitosamente")
    print(f"   Input: {input_path}")
    print(f"   Output: {output_path}")
    print(f"   Tamaño: {len(''.join(md))} caracteres")

if __name__ == "__main__":
    input_file = "/Users/manuelcadena/Fight For Life Club Dropbox/Manuel Cadena/Mi Mac (MacBook-Pro.localdomain)/Downloads/424018532-Pitagoras-Auto-Aprendizaje-de-Vida.txt"
    output_file = "/Users/manuelcadena/My Drive/Manuel Cadena/New Life/APPS/AION/pitagoricos-ai/knowledge-base/pitagoras-auto-aprendizaje-de-vida.md"
    
    process_book(input_file, output_file)
