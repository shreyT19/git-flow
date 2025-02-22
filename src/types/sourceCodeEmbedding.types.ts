export interface ISourceCodeEmbeddingBase {
  fileName: string;
  sourceCode: string;
  summary: string;
}

export interface ICreateSourceCodeEmbedding extends ISourceCodeEmbeddingBase {
  projectId: string;
  summaryEmbedding: number[];
}
