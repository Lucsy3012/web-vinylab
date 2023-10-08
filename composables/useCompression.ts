type CompressedFile = {
  dependsOn: [
    {
      output: {
        path: string;
        name: string;
        ext: string;
        size: number;
        baseName: string;
        url: string;
        userFileName: string;
      };
      result: {
        url: string;
      };
    },
  ];
};

// todo continue here
export function useCompression() {
  const runtimeConfig = useRuntimeConfig();
  const header = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${runtimeConfig?.public?.freeconvert?.key}`,
  };

  async function importFileForCompression(fileUrl: string, fileName: string) {
    console.log("Start importFileForCompression");

    const importedFile = await useFetch(
      "https://api.freeconvert.com/v1/process/import/url",
      {
        method: "POST",
        headers: header,
        body: JSON.stringify({
          url: fileUrl,
          filename: fileName,
        }),
      },
    )
      .then(function (res: any) {
        return res.json();
      })
      .then(function (body: any) {
        console.log(body);
      });

    console.log("importedFile", importedFile);

    return importedFile;
  }

  async function convertFileForCompression(
    inputId: string,
    inputFormat: string,
  ) {
    console.log("Start convertFileForCompression");

    const compressedFile = await useFetch(
      "https://api.freeconvert.com/v1/process/compress",
      {
        method: "POST",
        headers: header,
        body: JSON.stringify({
          input: inputId,
          input_format: inputFormat,
        })
          .then(function (res: any) {
            return res.json();
          })
          .then(function (body: any) {
            console.log(body);
          }),
      },
    );

    console.log(compressedFile);

    return compressedFile;
  }

  async function compress(
    fileUrl: string,
    fileName: string,
    inputFormat: string,
  ) {
    console.log("Start compression");

    const importedFile = await importFileForCompression(fileUrl, fileName).then(
      (result) => {
        console.log("importedFile result", result);
        return result;
      },
    );
    const compressedFile = await convertFileForCompression(
      importedFile?.id,
      inputFormat,
    );

    console.log(compressedFile);
    console.log(compressedFile?.dependsOn?.output?.url);

    return compressedFile;
  }

  return {
    compress,
  };
}
