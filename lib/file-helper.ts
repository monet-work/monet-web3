import * as XLSX from "xlsx";

const readExcelFile = async (file: File): Promise<Record<string, any>[]> => {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  return new Promise((resolve, reject) => {
    reader.onload = (e) => {
      const data = new Uint8Array(e?.target?.result as ArrayBuffer);
      console.log(data);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet);
      console.log(rows, 'rows')
      resolve(rows as Record<string, any>[]);
    };
    reader.onerror = reject;
  });
};

export { readExcelFile };