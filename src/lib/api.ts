import { FormData } from '../types';

interface WebhookResponse {
  success: boolean;
  sheetLink?: string;
  error?: string;
}

export async function generateLeads(formData: FormData): Promise<WebhookResponse> {
  try {
    console.log('Sending webhook request with data:', formData);
    
    const response = await fetch('https://hook.eu2.make.com/8xqjvc4pyrhei7f1nc3w6364sqahzkj5', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        productName: formData.productName,
        productDescription: formData.productDescription,
        location: formData.location
      })
    });

    console.log('Webhook response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Webhook error response:', errorText);
      throw new Error(`Webhook failed with status ${response.status}: ${errorText}`);
    }

    const responseData = await response.json();
    console.log('Webhook response data:', responseData);
    
    if (!responseData.success) {
      throw new Error(responseData.error || 'Webhook request failed');
    }

    return responseData;
  } catch (error) {
    console.error('Webhook request failed:', error);
    throw error;
  }
}

export async function enrichLeads(): Promise<boolean> {
  try {
    const response = await fetch('https://hook.eu2.make.com/onkwar3s8ivyyz8wjve5g4x4pnp1l18j', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to enrich leads: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error enriching leads:', error);
    throw error;
  }
}
