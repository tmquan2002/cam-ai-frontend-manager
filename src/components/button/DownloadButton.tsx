import { Button } from "@mantine/core";
import { useGetEmployeeTemplate, useGetShopTemplate } from "../../hooks/useFiles";
import { AxiosError } from "axios";
import { ResponseErrorDetail } from "../../models/Response";

const DownloadButton = ({ type }: { type: "shop" | "employee" }) => {
  const { error, isError, isLoading, refetch } = type === "shop" ? useGetShopTemplate() : useGetEmployeeTemplate()
  const errorMess = error as AxiosError<ResponseErrorDetail>;

  const handleDownload = async () => {
    refetch();
  }

  return (
    <>
      <Button onClick={handleDownload} loading={isLoading} size="sm">
        Download Template
      </Button>
      {isError && <div>Error: {errorMess.response?.data?.message}</div>}
    </>
  );
};

export default DownloadButton;
