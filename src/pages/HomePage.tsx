
import React from 'react';
import { FileImporter } from '@/components/import/FileImporter';

export default function HomePage() {
  return (
    <div className="container mx-auto py-12">
      <div className="grid-container">
        <div className="col-span-12 md:col-span-8 md:col-start-3 mb-12">
          <h1 className="text-center bg-gradient-to-r from-coral via-terracotta to-gold bg-clip-text text-transparent mb-4">
            Import Danych Projektu
          </h1>
          <p className="text-center text-[#999] max-w-lg mx-auto">
            Zaimportuj pliki CSV, XLSX lub JSON, aby rozpocząć analizę projektu. System automatycznie przetworzy dane i przygotuje widok projektu.
          </p>
        </div>

        <div className="col-span-12 md:col-span-10 md:col-start-2">
          <FileImporter />
        </div>

        <div className="col-span-12 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-new">
              <h3 className="font-heading text-xl mb-4">Formaty Danych</h3>
              <p className="text-[#999]">
                System obsługuje popularne formaty plików: CSV, XLSX oraz JSON. Możesz skorzystać z szablonów do przygotowania danych.
              </p>
            </div>

            <div className="card-new">
              <h3 className="font-heading text-xl mb-4">Przetwarzanie</h3>
              <p className="text-[#999]">
                Po zaimportowaniu, dane są analizowane i przygotowywane do wyświetlenia w dashboardzie oraz widokach szczegółowych.
              </p>
            </div>

            <div className="card-new">
              <h3 className="font-heading text-xl mb-4">Analiza</h3>
              <p className="text-[#999]">
                Automatyczne wykrywanie typów danych, weryfikacja, i przygotowanie do edycji w sekcjach projektu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
