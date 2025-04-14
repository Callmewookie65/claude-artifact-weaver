
import React from 'react';
import { FileImporter } from '@/components/import/FileImporter';

export default function HomePage() {
  return (
    <div className="container mx-auto py-12">
      <div className="grid-container">
        <div className="col-span-12 md:col-span-8 md:col-start-3 mb-12">
          <h1 className="text-center bg-gradient-custom mb-4">
            Import Project Data
          </h1>
          <p className="text-center text-[#777] max-w-lg mx-auto">
            Import CSV, XLSX or JSON files to start analyzing your project. The system will automatically process data and prepare a project view.
          </p>
        </div>

        <div className="col-span-12 md:col-span-10 md:col-start-2">
          <FileImporter />
        </div>

        <div className="col-span-12 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-new">
              <h3 className="font-heading text-xl mb-4">Data Formats</h3>
              <p className="text-[#777]">
                The system supports popular file formats: CSV, XLSX and JSON. You can use templates to prepare your data.
              </p>
            </div>

            <div className="card-new">
              <h3 className="font-heading text-xl mb-4">Processing</h3>
              <p className="text-[#777]">
                After importing, data is analyzed and prepared for display in the dashboard and detailed views.
              </p>
            </div>

            <div className="card-new">
              <h3 className="font-heading text-xl mb-4">Analysis</h3>
              <p className="text-[#777]">
                Automatic data type detection, verification, and preparation for editing in project sections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
