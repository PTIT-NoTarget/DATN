import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  /**
   * Đặt độ rộng cột
   * @param data data excel
   * @param colData data cột excel
   * @param sheetName tên sheet
   * @param fileName tên file
   */
  exportExcel(
    data: any[],
    colData: IExcelCol[],
    sheetName: string,
    fileName: string
  ) {
    const headerKeys = colData.map((item) => item.key); // mảng chứa key của cột
    const headerNames = colData.map((item) => item.name); // mảng chứa tên của cột

    // Chuyển đổi dữ liệu (dựa vào header tùy chỉnh)
    const worksheetData = [
      headerNames, // Header ở hàng đầu tiên
      ...data.map((item) =>
        headerKeys.map((key) => item[key as keyof typeof item] || '')
      ), // Dữ liệu tương ứng theo thứ tự header
    ];

    // Tạo worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Thiết lập độ rộng cột
    const widthArr = colData.map((item) => item.width); // mảng chứa độ rộng của cột
    worksheet['!cols'] = this.setColumnWidths(widthArr);

    // Tạo workbook
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Xuất file Excel
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Lưu file
    this.saveExcelFile(excelBuffer, `${fileName}.xlsx`);
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/octet-stream',
    });
    saveAs(data, fileName);
  }

  /**
   * Đặt độ rộng cột
   * @param widths Mảng độ rộng cho các cột
   */
  private setColumnWidths(widths: number[]): { wch: number }[] {
    return widths.map((wch) => ({ wch }));
  }
}

export interface IExcelCol {
  key: string;
  name: string;
  width: number;
}
