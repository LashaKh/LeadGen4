import React, { useState } from 'react';
import { useGenerationHistory } from '../contexts/GenerationHistoryContext';
import { History, ExternalLink, Info } from 'lucide-react';
import Modal from '../components/Modal';

export default function GenerationHistory() {
  const { history } = useGenerationHistory();
  const [selectedEntry, setSelectedEntry] = useState<GenerationHistory | null>(null);

  const handleRowClick = (entry: GenerationHistory) => {
    setSelectedEntry(entry);
  };

  const closeModal = () => {
    setSelectedEntry(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ... (keep existing header code) */}

      <div className="mt-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-purple-900/30">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-purple-900/30">
                  <th className="px-6 py-3 text-left text-sm font-medium text-purple-400">Timestamp</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-purple-400">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-purple-400">Location</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-purple-400">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-purple-400">Sheet Link</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-purple-400">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/30">
                {history.map((entry) => (
                  <tr key={entry.id} className="hover:bg-white/5 cursor-pointer" onClick={() => handleRowClick(entry)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{entry.productName}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{entry.location}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        entry.status === 'success' 
                          ? 'bg-green-500/10 text-green-400' 
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {entry.sheetLink ? (
                        <a
                          href={entry.sheetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(entry);
                        }}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        <Info className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedEntry && (
        <Modal onClose={closeModal}>
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Generation Details</h2>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-400">Timestamp:</p>
                <p className="text-white">{new Date(selectedEntry.timestamp).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Product Name:</p>
                <p className="text-white">{selectedEntry.productName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Location:</p>
                <p className="text-white">{selectedEntry.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status:</p>
                <p className={`${
                  selectedEntry.status === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {selectedEntry.status}
                </p>
              </div>
              {selectedEntry.sheetLink && (
                <div>
                  <p className="text-sm text-gray-400">Google Sheet:</p>
                  <a
                    href={selectedEntry.sheetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    Open Sheet
                  </a>
                </div>
              )}
              {selectedEntry.errorMessage && (
                <div>
                  <p className="text-sm text-gray-400">Error:</p>
                  <p className="text-red-400">{selectedEntry.errorMessage}</p>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
