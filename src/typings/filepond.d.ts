import * as ReactFilePond from "react-filepond";
declare module "react-filepond" {
  export interface FilePondProps {
    // Filepond PDF Preview Plugin
    allowPdfPreview: boolean;
    pdfPreviewHeight: number;
    pdfComponentExtraParams: string;
    // Add any other plugins you need in the same way
  }
}
