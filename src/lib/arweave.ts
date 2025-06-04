async function UploadFileToBlockChain(
  file: File | Blob,
  fileTypeOverride?: string,
): Promise<string | undefined> {
  const isFileTypeSupported =
    file.type === "image/png" ||
    file.type === "image/jpeg" ||
    file.type === "application/json";
  const isFileSizeSupported = file.size <= 5000 * 1024; // 5MB

  if (!isFileTypeSupported || !isFileSizeSupported) {
    console.error("Unsupported file type or file size too large.");
    return undefined;
  }

  try {
    // FormData oluştur
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contentType', fileTypeOverride || file.type);

    // Server-side API'ye istek gönder
    const response = await fetch('/api/upload-arweave', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Upload API error:", errorData);
      return undefined;
    }

    const data = await response.json();
    
    if (data.success) {
      console.log("Successfully uploaded to Arweave:", data.url);
      return data.url;
    } else {
      console.error("Upload failed:", data.error);
      return undefined;
    }
  } catch (error) {
    console.error("Arweave upload error:", error);
    return undefined;
  }
}

export default UploadFileToBlockChain;
