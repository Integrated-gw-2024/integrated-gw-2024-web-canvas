export async function loadSVGFile(filePath: string): Promise<Document> {
  const response = await fetch(filePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response;
    })
    .catch((error) => {
      throw error;
    });

  const svgData = await response.text().catch((error) => {
    throw new Error(error);
  });

  // DOMParserを使用してSVGデータを解析
  const parser = new DOMParser();
  const svgDocument = parser.parseFromString(svgData, "image/svg+xml");

  return svgDocument;
}

export async function loadSVGFiles(filePaths: string[]): Promise<Document[]> {
  const svgDocuments: Document[] = [];
  for (const filePath of filePaths) {
    const response = await fetch(filePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response;
      })
      .catch((error) => {
        throw error;
      });

    const svgData = await response.text().catch((error) => {
      throw new Error(error);
    });
    // DOMParserを使用してSVGデータを解析
    const parser = new DOMParser();
    const svgDocument = parser.parseFromString(svgData, "image/svg+xml");

    svgDocuments.push(svgDocument);
  }

  return svgDocuments;
}
