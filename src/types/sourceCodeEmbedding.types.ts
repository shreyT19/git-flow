export interface ICreateSourceCodeEmbedding {
  sourceCode: string;
  summary: string;
  fileName: string;
  projectId: string;
  summaryEmbedding: number[];
}
