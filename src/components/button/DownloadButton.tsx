import { Button } from "@mantine/core";

const DownloadButton = () => {
  // const { data, error, isError, isLoading } = useGetShopTemplate()
  const handleDownload = async () => {
    try {

      // if (isError) {
      // throw new Error('Failed to download file');
      // } else {
      // const filename = data.headers.get('content-disposition')
      //   ?.split(';')
      //   .find((part) => part.includes('filename='))
      //   ?.split('=')[1]
      //   .trim() || 'downloaded_file.txt';

      // // Get the blob data from the response
      // const blob = await data.blob();

      // // Create a temporary URL for the blob data
      // const blobUrl = URL.createObjectURL(blob);

      // // Create a temporary <a> element to trigger the download
      // const tempLink = document.createElement('a');
      // tempLink.href = blobUrl;
      // tempLink.setAttribute('download', filename);
      // tempLink.style.display = 'none'; // Hide the link

      // // Append the <a> element to the document body and trigger the click event
      // document.body.appendChild(tempLink);
      // tempLink.click();

      // // Clean up: remove the temporary <a> element and revoke the blob URL
      // document.body.removeChild(tempLink);
      // URL.revokeObjectURL(blobUrl);
      // }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };


  return (
    <Button onClick={handleDownload} size="sm">Download Template</Button>
  );
};

export default DownloadButton;
