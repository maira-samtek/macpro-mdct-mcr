// components
import { Alert } from "components";
// types
import { BannerData } from "@enterprise-cmcs/mdct-core/types";

export const Banner = ({ bannerData, ...props }: Props) => {
  if (bannerData) {
    const { title, description, link } = bannerData;
    return (
      bannerData && (
        <Alert title={title} description={description} link={link} {...props} />
      )
    );
  } else return <></>;
};

interface Props {
  bannerData: BannerData | undefined;
  [key: string]: any;
}
