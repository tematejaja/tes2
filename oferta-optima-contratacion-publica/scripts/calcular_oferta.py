#!/usr/bin/env python3
"""Calculadora de apoyo para la metodología de oferta óptima en contratación pública.

Subcomandos:
  piso        Piso económico y equivalencias margen/recargo.
  tabla       Utilidad esperada para puntos (precio:probabilidad) dados.
  montecarlo  Menor precio con rivales ~ Normal(media:desv), costo opcionalmente incierto.

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
        ok = piso(a.costo, a.margen_min) <= a.maximo
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
        print("Aviso: solo se compararon los puntos dados; explorar valores intermedios y reportar rango/sensibilidad.")
    else:
        print("\nNingún punto cumple el margen mínimo.")


def cmd_montecarlo(a):
    rivales = parse_pairs(a.rivales_normal, "--rivales-normal")
    rng = random.Random(a.semilla)
    S = a.n
    # Mismos escenarios para todos los precios candidatos (números aleatorios comunes).
    escenarios = []
    for _ in range(S):
        mejor = min(
            (rng.gauss(mu, sd) if rng.random() < a.p_participa else math.inf)
            for mu, sd in rivales
        )
        c = a.costo * math.exp(rng.gauss(0, a.sigma_costo)) if a.sigma_costo > 0 else a.costo
        escenarios.append((mejor, c))
    pf = piso(a.costo, a.margen_min)
    lo = max(pf, a.minimo or pf)
    hi = a.maximo if a.maximo is not None else max(mu for mu, _ in rivales) * 1.1
    if hi < lo:
        sys.exit(f"Región factible vacía: piso {lo:,.4f} > máximo {hi:,.4f}")
    print(f"S={S}  semilla={a.semilla}  piso={pf:,.4f}  rango=[{lo:,.2f}, {hi:,.2f}]")
    print(f"Supuestos: rivales independientes ~ Normal, participación {a.p_participa:.0%}, "
          f"sigma costo (lognormal) {a.sigma_costo}, sin empates, todos admisibles.\n")
    print(f"{'Precio':>9} {'q':>7} {'±EE':>6} {'UE neta':>10} {'P(pérd|gana)':>13} {'P(m<min|gana)':>14}")
    res = []
    p = lo
    while p <= hi + 1e-9:
        G = 0
        suma = 0.0
        perd = 0
        bajo = 0
        for mejor, c in escenarios:
            if p < mejor:
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
        ok = (G > 0 and (a.alfa is None or perd / G <= a.alfa) and (a.beta is None or bajo / G <= a.beta))
        res.append((p, q, ue, ok))
        print(f"{p:>9,.2f} {q:>7.1%} {ee:>6.1%} {ue:>10,.2f} {rp:>13} {rm:>14}" + ("" if ok or (a.alfa is None and a.beta is None) else "  ✗riesgo"))
        p += a.paso
    cand = [r for r in res if r[3] or (a.alfa is None and a.beta is None)]
    if cand:
        bu = max(cand, key=lambda r: r[2])
        bq = max(cand, key=lambda r: r[1])
        print(f"\nMax utilidad esperada: precio {bu[0]:,.2f} (UE {bu[2]:,.2f}, q {bu[1]:.1%})")
        print(f"Max prob. adjudicación: precio {bq[0]:,.2f} (q {bq[1]:.1%}, UE {bq[2]:,.2f})")
        print("n/e = no estimable (G=0). El error estándar (EE) es solo error Monte Carlo, no de modelo ni de datos.")
    else:
        print("\nNingún precio cumple las restricciones de riesgo.")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("piso")
    s.add_argument("--costo", type=float, required=True)
    s.add_argument("--margen-min", type=float, required=True, help="fracción sobre ventas, p.ej. 0.15")
    s.add_argument("--unidad", type=float, help="unidad de redondeo hacia arriba")
    s.add_argument("--maximo", type=float, help="máximo admisible, para chequear factibilidad")
    s.set_defaults(f=cmd_piso)

    s = sub.add_parser("tabla")
    s.add_argument("--costo", type=float, required=True)
    s.add_argument("--margen-min", type=float, required=True)
    s.add_argument("--k", type=float, default=0.0, help="costo incremental de ofertar")
    s.add_argument("--puntos", nargs="+", required=True, help="precio:probabilidad (0-1)")
    s.set_defaults(f=cmd_tabla)

    s = sub.add_parser("montecarlo")
    s.add_argument("--costo", type=float, required=True)
    s.add_argument("--margen-min", type=float, required=True)
    s.add_argument("--k", type=float, default=0.0)
    s.add_argument("--rivales-normal", nargs="+", required=True, help="media:desviación de cada rival")
    s.add_argument("--p-participa", type=float, default=1.0, help="prob. de que cada rival participe y sea admisible")
    s.add_argument("--sigma-costo", type=float, default=0.0, help="desv. log del costo real (0 = determinístico)")
    s.add_argument("--minimo", type=float)
    s.add_argument("--maximo", type=float)
    s.add_argument("--paso", type=float, default=1.0)
    s.add_argument("--n", type=int, default=20000)
    s.add_argument("--semilla", type=int, default=1)
    s.add_argument("--alfa", type=float, help="máx. P(utilidad<0 | gana)")
    s.add_argument("--beta", type=float, help="máx. P(margen<min | gana)")
    s.set_defaults(f=cmd_montecarlo)

    a = ap.parse_args()
    a.f(a)


if __name__ == "__main__":
    main()
