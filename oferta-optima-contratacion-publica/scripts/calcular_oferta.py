#!/usr/bin/env python3
"""Calculadora de apoyo para la metodología de oferta óptima en contratación pública.

Subcomandos:
  piso        Piso económico y equivalencias margen/recargo.
  tabla       Utilidad esperada para puntos (precio:probabilidad) dados.
  montecarlo  Adjudicación por menor precio, simulada.
  puntajes    Adjudicación por puntaje total (económico + técnico), simulada,
              con el puntaje económico por menor valor o por medias.

Supuestos de la simulación (ajustables por argumentos):
  - Ofertas rivales ~ Normal(media, desv), con un factor común opcional (--rho)
    que las correlaciona; el costo propio puede compartir ese factor (--rho-costo).
  - Cada rival participa y es admisible con probabilidad --p-participa.
  - Los empates en el criterio de adjudicación se cuentan como pérdida (conservador).
  - Se usan los mismos escenarios para todos los precios (números aleatorios comunes).

Los resultados dependen por completo de los supuestos de entrada; no son una garantía.
Solo usa la biblioteca estándar.
"""
import argparse
import math
import random
import sys


def piso(costo, m_min):
    if not 0 <= m_min < 1:
        sys.exit("margen-min debe estar en [0, 1)")
    return costo / (1 - m_min)


def margen(p, costo):
    return (p - costo) / p


def parse_pairs(items, name):
    out = []
    for it in items:
        try:
            a, b = it.split(":")
            out.append((float(a), float(b)))
        except ValueError:
            sys.exit(f"{name}: formato inválido '{it}', use A:B")
    return out


def cmd_piso(a):
    p = piso(a.costo, a.margen_min)
    r = p / a.costo - 1
    print(f"Costo C                 : {a.costo:,.6f}")
    print(f"Margen mínimo s/ventas  : {a.margen_min:.2%}")
    print(f"Piso = C/(1-m_min)      : {p:,.6f}")
    print(f"Recargo equivalente s/C : {r:.2%}  (m = r/(1+r))")
    if a.unidad:
        u = a.unidad
        print(f"Piso redondeado hacia arriba a múltiplos de {u}: {math.ceil(p / u - 1e-12) * u:,.6f}")
    if a.maximo is not None:
        ok = p <= a.maximo
        print("Región factible         :",
              "existe" if ok else "VACÍA: piso > máximo admisible (revisar costos o no participar)")


def cmd_tabla(a):
    pts = parse_pairs(a.puntos, "--puntos")
    pf = piso(a.costo, a.margen_min)
    print(f"Piso económico: {pf:,.4f}\n")
    print(f"{'Precio':>10} {'Util. si gana':>14} {'Margen':>8} {'q':>7} {'Util. esp. neta':>16}  Estado")
    cand = []
    for p, q in pts:
        u = p - a.costo
        m = margen(p, a.costo)
        ue = q * u - a.k
        ok = p + 1e-9 >= pf
        if ok:
            cand.append((p, q, ue))
        print(f"{p:>10,.2f} {u:>14,.2f} {m:>8.2%} {q:>7.1%} {ue:>16,.2f}  {'ok' if ok else 'descartado (margen)'}")
    if cand:
        best_ue = max(cand, key=lambda x: x[2])
        best_q = max(cand, key=lambda x: x[1])
        print(f"\nMax utilidad esperada (entre los puntos dados): precio {best_ue[0]:,.2f} -> {best_ue[2]:,.2f}")
        print(f"Max probabilidad de adjudicación (con margen)  : precio {best_q[0]:,.2f} -> q={best_q[1]:.1%}")
        if best_ue[2] <= 0:
            print("Utilidad esperada no positiva en todos los puntos: evaluar no participar.")
        print("Aviso: solo se compararon los puntos dados; explorar valores intermedios y reportar rango/sensibilidad.")
    else:
        print("\nNingún punto cumple el margen mínimo.")


# ---------------------------------------------------------------- simulación

def generar_escenarios(a, rivales, tecnicos):
    """Genera S escenarios: lista de (rivales_presentes, costo).

    rivales_presentes es una lista de (oferta, puntaje_técnico) de los rivales que
    participan y son admisibles en ese escenario.
    """
    rng = random.Random(a.semilla)
    sr, sr1 = math.sqrt(a.rho), math.sqrt(1 - a.rho)
    escenarios = []
    for _ in range(a.n):
        z = rng.gauss(0, 1)  # factor común de mercado
        presentes = []
        for j, (mu, sd) in enumerate(rivales):
            e = rng.gauss(0, 1)
            oferta = mu + sd * (sr * z + sr1 * e)
            tmu, tsd = tecnicos[j]
            tec = rng.gauss(tmu, tsd) if tsd > 0 else tmu
            if rng.random() < a.p_participa and oferta > 0:
                presentes.append((oferta, tec))
        if a.sigma_costo > 0:
            ez = a.rho_costo * z + math.sqrt(1 - a.rho_costo ** 2) * rng.gauss(0, 1)
            c = a.costo * math.exp(a.sigma_costo * ez)
        else:
            c = a.costo
        escenarios.append((presentes, c))
    return escenarios


def referencia(metodo, ofertas):
    """Valor de referencia del puntaje económico calculado sobre `ofertas`."""
    if metodo == "menor_valor":
        return min(ofertas)
    media = sum(ofertas) / len(ofertas)
    if metodo == "media_aritmetica":
        return media
    if metodo == "media_aritmetica_alta":
        return (max(ofertas) + media) / 2
    sys.exit(f"método desconocido: {metodo}")


def puntaje_economico(metodo, v, ref, pmax):
    """Puntaje económico de la oferta `v` frente a la referencia `ref`.

    Formas usadas en el modelo de pliego de Colombia Compra Eficiente (2016), como
    ejemplo. VERIFICAR contra el pliego vigente (qué ofertas entran en la media,
    redondeos, puntaje mínimo) y editar esta función y `referencia` si difieren.
    """
    if metodo == "menor_valor":
        return pmax * ref / v
    if v <= ref:
        s = pmax * (1 - (ref - v) / ref)
    else:
        s = pmax * (1 - 2 * (v - ref) / ref)
    return max(s, 0.0)


def gana_menor_precio(p, presentes, a):
    return all(p < o for o, _ in presentes)


def gana_puntajes(p, presentes, a):
    if not presentes:
        return True
    ofertas = [o for o, _ in presentes]
    # Cambiar el precio propio cambia la referencia cuando la propia oferta entra en ella.
    ref = referencia(a.metodo, [p] + ofertas if a.incluir_propia else ofertas)
    total_propio = puntaje_economico(a.metodo, p, ref, a.pmax) + a.tecnico_propio
    return all(total_propio > puntaje_economico(a.metodo, o, ref, a.pmax) + t for o, t in presentes)


def simular(a, gana, supuestos):
    rivales = parse_pairs(a.rivales_normal, "--rivales-normal")
    tecnicos = [(0.0, 0.0)] * len(rivales)
    if getattr(a, "tecnico_rivales", None):
        tecnicos = parse_pairs(a.tecnico_rivales, "--tecnico-rivales")
        if len(tecnicos) != len(rivales):
            sys.exit("--tecnico-rivales debe tener un par media:desv por cada rival")
    if not 0 <= a.rho <= 1 or not -1 <= a.rho_costo <= 1:
        sys.exit("--rho debe estar en [0, 1] y --rho-costo en [-1, 1]")
    escenarios = generar_escenarios(a, rivales, tecnicos)
    S = a.n
    pf = piso(a.costo, a.margen_min)
    lo = max(pf, a.minimo or pf)
    hi = a.maximo if a.maximo is not None else max(mu for mu, _ in rivales) * 1.1
    if hi < lo:
        sys.exit(f"Región factible vacía: piso {lo:,.4f} > máximo {hi:,.4f}")
    restr = a.alfa is not None or a.beta is not None
    print(f"S={S}  semilla={a.semilla}  piso={pf:,.4f}  rango=[{lo:,.2f}, {hi:,.2f}]")
    print(f"Supuestos: {supuestos}; participación/admisibilidad {a.p_participa:.0%}, "
          f"rho rivales {a.rho}, sigma costo (lognormal) {a.sigma_costo}, rho costo {a.rho_costo}, "
          f"empates = pérdida.\n")
    print(f"{'Precio':>9} {'q':>7} {'±EE':>6} {'UE neta':>10} {'P(pérd|gana)':>13} {'P(m<min|gana)':>14}")
    res = []
    i = 0
    while True:
        p = lo + i * a.paso
        if p > hi + 1e-9:
            break
        i += 1
        G = 0
        suma = 0.0
        perd = 0
        bajo = 0
        for presentes, c in escenarios:
            if gana(p, presentes, a):
                G += 1
                suma += p - c
                if p - c < 0:
                    perd += 1
                if (p - c) / p < a.margen_min:
                    bajo += 1
        q = G / S
        ee = math.sqrt(q * (1 - q) / S)
        ue = suma / S - a.k
        rp = f"{perd / G:.1%}" if G else "n/e"
        rm = f"{bajo / G:.1%}" if G else "n/e"
        ok = (not restr) or (G > 0 and (a.alfa is None or perd / G <= a.alfa)
                             and (a.beta is None or bajo / G <= a.beta))
        res.append((p, q, ue, ok))
        print(f"{p:>9,.2f} {q:>7.1%} {ee:>6.1%} {ue:>10,.2f} {rp:>13} {rm:>14}" + ("" if ok else "  ✗riesgo"))
    cand = [r for r in res if r[3]]
    if cand:
        bu = max(cand, key=lambda r: r[2])
        bq = max(cand, key=lambda r: (r[1], r[2]))
        print(f"\nMax utilidad esperada: precio {bu[0]:,.2f} (UE {bu[2]:,.2f}, q {bu[1]:.1%})")
        print(f"Max prob. adjudicación: precio {bq[0]:,.2f} (q {bq[1]:.1%}, UE {bq[2]:,.2f})")
        cerca = [r[0] for r in cand if r[2] >= bu[2] - abs(bu[2]) * 0.05]
        print(f"Rango con UE >= 95% del máximo: [{min(cerca):,.2f}, {max(cerca):,.2f}]")
        if bu[2] <= 0:
            print("Utilidad esperada no positiva en toda la región: evaluar no participar.")
    else:
        print("\nNingún precio cumple las restricciones de riesgo.")
    print("n/e = no estimable (G=0). El EE es solo error Monte Carlo, no de modelo ni de datos.")


def cmd_montecarlo(a):
    simular(a, gana_menor_precio, "menor precio, rivales Normales")


def cmd_puntajes(a):
    simular(a, gana_puntajes,
            f"puntaje total, método {a.metodo}, Pmax {a.pmax}, técnico propio {a.tecnico_propio}, "
            f"propia oferta {'incluida' if a.incluir_propia else 'excluida'} en la referencia")


def args_simulacion(s):
    s.add_argument("--costo", type=float, required=True)
    s.add_argument("--margen-min", type=float, required=True)
    s.add_argument("--k", type=float, default=0.0, help="costo incremental de ofertar")
    s.add_argument("--rivales-normal", nargs="+", required=True, help="media:desviación de la oferta de cada rival")
    s.add_argument("--p-participa", type=float, default=1.0, help="prob. de que cada rival participe y sea admisible")
    s.add_argument("--rho", type=float, default=0.0, help="correlación entre ofertas rivales vía factor común [0,1]")
    s.add_argument("--sigma-costo", type=float, default=0.0, help="desv. log del costo real (0 = determinístico)")
    s.add_argument("--rho-costo", type=float, default=0.0, help="correlación del costo propio con el factor común")
    s.add_argument("--minimo", type=float, help="precio mínimo a explorar (además del piso)")
    s.add_argument("--maximo", type=float, help="máximo admisible (presupuesto/tope)")
    s.add_argument("--paso", type=float, default=1.0)
    s.add_argument("--n", type=int, default=20000, help="número de escenarios")
    s.add_argument("--semilla", type=int, default=1)
    s.add_argument("--alfa", type=float, help="máx. P(utilidad<0 | gana)")
    s.add_argument("--beta", type=float, help="máx. P(margen<min | gana)")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("piso", help="piso económico y margen/recargo")
    s.add_argument("--costo", type=float, required=True)
    s.add_argument("--margen-min", type=float, required=True, help="fracción sobre ventas, p.ej. 0.15")
    s.add_argument("--unidad", type=float, help="unidad de redondeo hacia arriba")
    s.add_argument("--maximo", type=float, help="máximo admisible, para chequear factibilidad")
    s.set_defaults(f=cmd_piso)

    s = sub.add_parser("tabla", help="utilidad esperada para probabilidades dadas")
    s.add_argument("--costo", type=float, required=True)
    s.add_argument("--margen-min", type=float, required=True)
    s.add_argument("--k", type=float, default=0.0, help="costo incremental de ofertar")
    s.add_argument("--puntos", nargs="+", required=True, help="precio:probabilidad (0-1)")
    s.set_defaults(f=cmd_tabla)

    s = sub.add_parser("montecarlo", help="simulación, adjudicación por menor precio")
    args_simulacion(s)
    s.set_defaults(f=cmd_montecarlo)

    s = sub.add_parser("puntajes", help="simulación, adjudicación por puntaje total")
    args_simulacion(s)
    s.add_argument("--metodo", choices=["menor_valor", "media_aritmetica", "media_aritmetica_alta"],
                   required=True, help="fórmula del puntaje económico (verificar contra el pliego)")
    s.add_argument("--pmax", type=float, required=True, help="puntaje económico máximo")
    s.add_argument("--tecnico-propio", type=float, default=0.0, help="puntaje no económico propio")
    s.add_argument("--tecnico-rivales", nargs="+", help="media:desv del puntaje no económico de cada rival")
    s.add_argument("--excluir-propia", dest="incluir_propia", action="store_false",
                   help="la propia oferta NO entra en la media (solo si el pliego lo dice)")
    s.set_defaults(f=cmd_puntajes)

    a = ap.parse_args()
    if a.cmd == "puntajes" and a.metodo == "menor_valor" and not a.incluir_propia:
        sys.exit("--excluir-propia no aplica a menor_valor")
    a.f(a)


if __name__ == "__main__":
    main()
