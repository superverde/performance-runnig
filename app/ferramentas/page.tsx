import type { Metadata } from 'next'
import { CalculadorasClient } from './CalculadorasClient'

export const metadata: Metadata = {
  title: 'Calculadoras para Corredores — VDOT, Pace e Previsão de Prova',
  description:
    'Ferramentas gratuitas para corredores: calculadora VDOT de Jack Daniels para zonas de treino, calculadora de pace e previsão de tempos de prova com a fórmula de Riegel.',
  keywords: [
    'calculadora vdot', 'calculadora pace corrida', 'zonas de treino corrida',
    'previsão tempo prova', 'fórmula riegel', 'ritmo corrida', 'calculadora maratona',
  ],
  alternates: { canonical: 'https://www.performancerunning.pt/ferramentas' },
}

export default function FerramentasPage() {
  return <CalculadorasClient />
}
