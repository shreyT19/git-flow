export interface ISourceCodeEmbedding {
  fileName: string;
  sourceCode: string;
  summary: string;
}

export interface ICreateSourceCodeEmbedding extends ISourceCodeEmbedding {
  projectId: string;
  summaryEmbedding: number[];
}
