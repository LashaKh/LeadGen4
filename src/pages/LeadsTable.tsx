import React, { useState } from 'react';
import { ListChecks, UserPlus, Loader2, ExternalLink } from 'lucide-react';
import { GoogleSheetsEmbed } from '../components/GoogleSheetsEmbed';
import { enrichLeads } from '../lib/api';
import { useToast } from '../hooks/useToast';

export default function LeadsTablePage() {
  const [isEnriching, setIsEnriching] = useState(false);
  const { showToast } = useToast();

  const handleEnrichLeads = async () => {
    setIsEnriching(true);
    try {
      await enrichLeads();
      showToast('Started enriching leads with contact information', 'success');
    } catch (error) {
      showToast('Failed to start lead enrichment', 'error');
    } finally {
      setIsEnriching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-2 bg-purple-500/10 rounded-xl mb-4">
          <ListChecks className="h-6 w-6 text-purple-400" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Generated Leads
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Review and manage your AI-generated leads through the Google Sheets integration.
        </p>
      </div>

      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Google Sheets View</h2>
          <div className="flex gap-4">
            <a
              href="https://docs.google.com/spreadsheets/d/1qBtEbgW3aWPZlTQot5JQBSVoVBCOeGgnS-eWLjIvgDU/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-purple-500 rounded-lg shadow-sm text-sm font-medium text-purple-500 hover:bg-purple-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              <ExternalLink className="-ml-1 mr-2 h-4 w-4" />
              Open in Google Sheets
            </a>
            <button
              onClick={handleEnrichLeads}
              disabled={isEnriching}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEnriching ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Enriching...
                </>
              ) : (
                <>
                  <UserPlus className="-ml-1 mr-2 h-4 w-4" />
                  Enrich with Contacts
                </>
              )}
            </button>
          </div>
        </div>
        <GoogleSheetsEmbed 
          spreadsheetId="2PACX-1vQbJl0bpti-3O241zmU64kgmUg6MS-I6_UW0g2F6kz-3Kdc8eSfbOsbw0nILRHdS_DpPVpveAA4Todw"
        />
      </div>
    </div>
  );
}
