
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import type { Lead, Manufacturer, Order, Task } from '@shared/schema';

export class GoogleSheetsService {
  private client: JWT;
  private sheets: any;
  private spreadsheetId: string;

  constructor() {
    if (!process.env.GOOGLE_CLIENT_EMAIL || 
        !process.env.GOOGLE_PRIVATE_KEY || 
        !process.env.GOOGLE_SPREADSHEET_ID) {
      throw new Error('Google Sheets credentials missing. Set GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SPREADSHEET_ID environment variables.');
    }

    this.client = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth: this.client });
    this.spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  }

  async setupSheets() {
    // Create sheets for each data type if they don't exist
    const sheets = ['Leads', 'Manufacturers', 'Orders', 'Tasks'];
    const response = await this.sheets.spreadsheets.get({
      spreadsheetId: this.spreadsheetId,
    });

    const existingSheets = response.data.sheets.map((sheet: any) => sheet.properties.title);
    
    for (const sheet of sheets) {
      if (!existingSheets.includes(sheet)) {
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: this.spreadsheetId,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: sheet,
                  },
                },
              },
            ],
          },
        });
      }
    }
  }

  // Leads
  async getLeads(): Promise<Lead[]> {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: 'Leads!A2:J',
    });

    const rows = response.data.values || [];
    return rows.map((row: any[]) => ({
      id: parseInt(row[0]),
      name: row[1],
      email: row[2],
      phone: row[3],
      company: row[4],
      status: row[5],
      notes: row[6],
      createdAt: row[7] ? new Date(row[7]) : new Date(),
      updatedAt: row[8] ? new Date(row[8]) : new Date(),
      assignedTo: row[9] ? parseInt(row[9]) : null,
    }));
  }

  async saveLead(lead: Lead): Promise<void> {
    // Check if lead exists
    const leads = await this.getLeads();
    const exists = leads.some(l => l.id === lead.id);

    const values = [
      [
        lead.id,
        lead.name,
        lead.email,
        lead.phone,
        lead.company,
        lead.status,
        lead.notes,
        lead.createdAt.toISOString(),
        lead.updatedAt.toISOString(),
        lead.assignedTo,
      ],
    ];

    if (exists) {
      // Find the row index
      const rowIndex = leads.findIndex(l => l.id === lead.id) + 2; // +2 because of header row and 0-indexing
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `Leads!A${rowIndex}:J${rowIndex}`,
        valueInputOption: 'RAW',
        requestBody: {
          values,
        },
      });
    } else {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Leads!A:J',
        valueInputOption: 'RAW',
        requestBody: {
          values,
        },
      });
    }
  }

  // Similar methods for manufacturers, orders, and tasks
  // Implementing just one example for each type

  async getManufacturers(): Promise<Manufacturer[]> {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: 'Manufacturers!A2:E',
    });

    const rows = response.data.values || [];
    return rows.map((row: any[]) => ({
      id: parseInt(row[0]),
      name: row[1],
      contactPerson: row[2],
      email: row[3],
      phone: row[4],
    }));
  }

  async getOrders(): Promise<Order[]> {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: 'Orders!A2:I',
    });

    const rows = response.data.values || [];
    return rows.map((row: any[]) => ({
      id: parseInt(row[0]),
      leadId: parseInt(row[1]),
      manufacturerId: parseInt(row[2]),
      status: row[3],
      amount: parseFloat(row[4]),
      notes: row[5],
      createdAt: row[6] ? new Date(row[6]) : new Date(),
      updatedAt: row[7] ? new Date(row[7]) : new Date(),
      items: row[8] ? JSON.parse(row[8]) : [],
    }));
  }

  async getTasks(): Promise<Task[]> {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: 'Tasks!A2:H',
    });

    const rows = response.data.values || [];
    return rows.map((row: any[]) => ({
      id: parseInt(row[0]),
      title: row[1],
      description: row[2],
      dueDate: row[3] ? new Date(row[3]) : null,
      status: row[4],
      assignedTo: row[5] ? parseInt(row[5]) : null,
      createdAt: row[6] ? new Date(row[6]) : new Date(),
      updatedAt: row[7] ? new Date(row[7]) : new Date(),
    }));
  }
}

export const sheetsService = new GoogleSheetsService();
