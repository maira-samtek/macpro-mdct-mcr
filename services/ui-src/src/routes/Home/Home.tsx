import { useContext } from "react";
// components
import { Box, Collapse, Heading, Link, Text } from "@chakra-ui/react";
import {
  AdminBannerContext,
  Banner,
  BasicPage,
  TemplateCard,
} from "components";
// utils
import { checkDateRangeStatus } from "utils";
import verbiage from "verbiage/pages/home";

export const Home = () => {
  const { bannerData } = useContext(AdminBannerContext);
  const bannerIsActive = checkDateRangeStatus(
    bannerData?.startDate,
    bannerData?.endDate
  );
  const showBanner = !!bannerData.key && bannerIsActive;
  const { intro, cards } = verbiage;
  return (
    <>
      <Collapse in={showBanner}>
        <Banner bannerData={bannerData} />
      </Collapse>
      <BasicPage sx={sx.layout} data-testid="home-view">
        <Box sx={sx.introTextBox}>
          <Heading as="h1" sx={sx.headerText}>
            {intro.header}
          </Heading>
          <Text>
            {intro.body.preLinkText}
            <Link
              sx={sx.bodyLink}
              href={intro.body.linkLocation}
              target="_blank"
            >
              {intro.body.linkText}
            </Link>
            {intro.body.postLinkText}
          </Text>
        </Box>
        <TemplateCard
          templateName="MCPAR"
          verbiage={cards.MCPAR}
          cardprops={sx.card}
        />
        <TemplateCard
          templateName="MLR"
          verbiage={cards.MLR}
          cardprops={sx.card}
        />
        <TemplateCard
          templateName="NAAAR"
          verbiage={cards.NAAAR}
          cardprops={sx.card}
        />
      </BasicPage>
    </>
  );
};

const sx = {
  layout: {
    ".contentFlex": {
      marginTop: "3.5rem",
    },
  },
  introTextBox: {
    width: "100%",
    marginBottom: "2.25rem",
  },
  headerText: {
    marginBottom: "1rem",
    fontSize: "2rem",
    fontWeight: "normal",
  },
  bodyLink: {
    textDecoration: "underline !important",
    "&:hover": {
      textDecoration: "none !important",
    },
  },
  card: {
    marginBottom: "2rem",
  },
};
