# Skill: oferta-optima-contratacion-publica

Skill de Claude basada en la "Metodología para determinar una oferta óptima en contratación pública" (Friedman 1956, Gates 1967, simulación Monte Carlo, margen mínimo, evaluación por menor precio o por medias/puntajes).

Contenido:

- `oferta-optima-contratacion-publica/SKILL.md`: flujo de trabajo, reglas y entregable.
- `oferta-optima-contratacion-publica/references/metodologia.md`: documento completo.
- `oferta-optima-contratacion-publica/scripts/calcular_oferta.py`: calculadora (piso, tabla, montecarlo, puntajes). Solo Python estándar.
- `dist/oferta-optima-contratacion-publica.skill`: paquete listo para subir.

## Instalación global

### Opción 1: en tu cuenta de Claude (claude.ai, app de escritorio y Claude Code)

Sube `dist/oferta-optima-contratacion-publica.skill` (es un .zip) en claude.ai → Settings → Capabilities → Skills → Upload skill. Queda disponible en todas tus conversaciones y sesiones.

### Opción 2: solo Claude Code en tu PC (todas tus carpetas/proyectos)

```bash
git clone https://github.com/tematejaja/tes2.git && cd tes2
git checkout claude/clever-clarke-kbwuak
mkdir -p ~/.claude/skills
cp -r oferta-optima-contratacion-publica ~/.claude/skills/
```

En Windows (PowerShell): `Copy-Item -Recurse oferta-optima-contratacion-publica $env:USERPROFILE\.claude\skills\`.

Reinicia Claude Code. Se invoca con `/oferta-optima-contratacion-publica` o automáticamente al hablar de precios de ofertas en licitaciones.

## Regenerar el paquete

Desde la raíz del repositorio:

```bash
rm -f dist/oferta-optima-contratacion-publica.skill
python3 -m zipfile -c dist/oferta-optima-contratacion-publica.skill oferta-optima-contratacion-publica
```
