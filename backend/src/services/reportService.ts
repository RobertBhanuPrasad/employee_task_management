import reportRepository, { ReportFilters, ReportSorting } from '../repositories/reportRepository';
import { JwtPayload } from '../utils/jwt';
import { Parser } from 'json2csv';
import ExcelJS from 'exceljs';
import { Response } from 'express';

export class ReportService {
  
  private applyAuthorization(filters: ReportFilters, user: JwtPayload): ReportFilters {
    if (user.role === 'EMPLOYEE') {
      filters.employeeId = user.id;
    }
    return filters;
  }

  async getCompletedTasks(filters: ReportFilters, sorting: ReportSorting, user: JwtPayload) {
    const authorizedFilters = this.applyAuthorization(filters, user);
    return await reportRepository.getCompletedTasks(authorizedFilters, sorting);
  }

  async getPendingTasks(filters: ReportFilters, sorting: ReportSorting, user: JwtPayload) {
    const authorizedFilters = this.applyAuthorization(filters, user);
    return await reportRepository.getPendingTasks(authorizedFilters, sorting);
  }

  async getEmployeeWiseReport(filters: ReportFilters, sorting: ReportSorting, user: JwtPayload) {
    const authorizedFilters = this.applyAuthorization(filters, user);
    return await reportRepository.getEmployeeWiseReport(authorizedFilters, sorting);
  }

  generateCSV(data: any[]): string {
    if (data.length === 0) return '';
    const fields = Object.keys(data[0]);
    const json2csvParser = new Parser({ fields });
    return json2csvParser.parse(data);
  }

  async generateExcel(res: Response, data: any[], sheetName: string, fileName: string): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      worksheet.columns = headers.map(header => ({
        header,
        key: header,
        width: header.length < 15 ? 15 : header.length + 5,
        style: { alignment: { vertical: 'middle', horizontal: 'left' } }
      }));

      // Add Data
      data.forEach(item => {
        worksheet.addRow(item);
      });

      // Format Header Row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' }
        };
      });
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}.xlsx"`);
    
    await workbook.xlsx.write(res);
    res.end();
  }
}

export default new ReportService();
