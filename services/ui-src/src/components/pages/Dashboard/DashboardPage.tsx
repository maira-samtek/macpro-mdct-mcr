import { useContext, useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useFlags } from "launchdarkly-react-client-sdk";
// components
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Link,
  Text,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import {
  AddEditReportModal,
  DashboardTable,
  InstructionsAccordion,
  ErrorAlert,
  MobileDashboardTable,
  PageTemplate,
  ReportContext,
} from "components";
// utils
import { AnyObject, ReportMetadataShape, ReportKeys, ReportShape } from "types";
import {
  convertDateUtcToEt,
  parseCustomHtml,
  useBreakpoint,
  useStore,
} from "utils";
// verbiage
import mcparVerbiage from "verbiage/pages/mcpar/mcpar-dashboard";
import mcparVerbiageWithoutYoY from "verbiage/pages/mcpar/mcpar-dashboard-without-yoy";
import mlrVerbiage from "verbiage/pages/mlr/mlr-dashboard";
import accordion from "verbiage/pages/accordion";
// assets
import arrowLeftIcon from "assets/icons/icon_arrow_left_blue.png";

export const DashboardPage = ({ reportType }: Props) => {
  const {
    errorMessage,
    fetchReportsByState,
    fetchReport,
    reportsByState,
    clearReportSelection,
    setReportSelection,
    archiveReport,
    releaseReport,
  } = useContext(ReportContext);
  const navigate = useNavigate();
  const {
    state: userState,
    userIsEndUser,
    userIsAdmin,
  } = useStore().user ?? {};
  const { isTablet, isMobile } = useBreakpoint();
  const [reportsToDisplay, setReportsToDisplay] = useState<
    ReportMetadataShape[] | undefined
  >(undefined);
  const [reportId, setReportId] = useState<string | undefined>(undefined);
  const [archiving, setArchiving] = useState<boolean>(false);
  const [entering, setEntering] = useState<boolean>(false);
  const [releasing, setReleasing] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<AnyObject | undefined>(
    undefined
  );
  const yoyCopyFlag = useFlags()?.yoyCopy;

  const dashboardVerbiageMap: any = {
    MCPAR: yoyCopyFlag ? mcparVerbiage : mcparVerbiageWithoutYoY,
    MLR: mlrVerbiage,
  };

  const dashboardVerbiage = dashboardVerbiageMap[reportType]!;
  const { intro, body } = dashboardVerbiage;

  // if an admin has selected a state, retrieve it from local storage
  const adminSelectedState = localStorage.getItem("selectedState") || undefined;

  // if a user is an admin type, use the selected state, otherwise use their assigned state
  const activeState = userIsAdmin ? adminSelectedState : userState;

  useEffect(() => {
    // if no activeState, go to homepage
    if (!activeState) {
      navigate("/");
    }
    fetchReportsByState(reportType, activeState);
    clearReportSelection();
  }, []);

  useEffect(() => {
    let newReportsToDisplay = reportsByState;
    if (!userIsAdmin) {
      newReportsToDisplay = reportsByState?.filter(
        (report: ReportMetadataShape) => !report?.archived
      );
    }
    setReportsToDisplay(newReportsToDisplay);
  }, [reportsByState]);

  const enterSelectedReport = async (report: ReportMetadataShape) => {
    setReportId(report.id);
    setEntering(true);
    const reportKeys: ReportKeys = {
      reportType: report.reportType,
      state: report.state,
      id: report.id,
    };
    const selectedReport: ReportShape = await fetchReport(reportKeys);
    // set active report to selected report
    setReportSelection(selectedReport);
    setReportId(undefined);
    setEntering(false);
    const firstReportPagePath = selectedReport.formTemplate.flatRoutes![0].path;
    navigate(firstReportPagePath);
  };

  const openAddEditReportModal = (report?: ReportShape) => {
    let formData = undefined;
    let submittedOnDate = undefined;
    // Check and pre-fill the form if the user is editing an existing program
    if (report) {
      const copySourceReport: ReportMetadataShape | undefined =
        reportsByState?.find(
          (item: ReportMetadataShape) =>
            item.fieldDataId == report.copyFieldDataSourceId
        );
      const copyFieldDataSourceId = copySourceReport
        ? {
            label: `${copySourceReport?.programName} ${convertDateUtcToEt(
              report.reportingPeriodEndDate
            )}`,
            value: copySourceReport?.fieldDataId!,
          }
        : undefined;
      if (report.submittedOnDate) {
        submittedOnDate = convertDateUtcToEt(report.submittedOnDate);
      }
      formData = {
        fieldData: {
          programName: report.programName,
          reportingPeriodEndDate: convertDateUtcToEt(
            report.reportingPeriodEndDate
          ),
          reportingPeriodStartDate: convertDateUtcToEt(
            report.reportingPeriodStartDate
          ),
          combinedData: report.combinedData,
          copyFieldDataSourceId,
          programIsPCCM: report?.programIsPCCM,
        },
        state: report.state,
        id: report.id,
        submittedBy: report.submittedBy,
        submitterEmail: report.submitterEmail,
        submittedOnDate: submittedOnDate,
      };
    }
    setSelectedReport(formData);

    // use disclosure to open modal
    addEditReportModalOnOpenHandler();
  };

  // add/edit program modal disclosure
  const {
    isOpen: addEditReportModalIsOpen,
    onOpen: addEditReportModalOnOpenHandler,
    onClose: addEditReportModalOnCloseHandler,
  } = useDisclosure();

  const toggleReportArchiveStatus = async (report: ReportShape) => {
    if (userIsAdmin) {
      setReportId(report.id);
      setArchiving(true);
      const reportKeys = {
        reportType: reportType,
        state: adminSelectedState,
        id: report.id,
      };
      await archiveReport(reportKeys);
      await fetchReportsByState(reportType, activeState);
      setReportId(undefined);
      setArchiving(false);
    }
  };

  const toggleReportLockStatus = async (report: ReportShape) => {
    if (userIsAdmin) {
      setReportId(report.id);
      setReleasing(true);
      const reportKeys = {
        reportType: reportType,
        state: adminSelectedState,
        id: report.id,
      };
      await releaseReport!(reportKeys);
      await fetchReportsByState(reportType, activeState);
      setReportId(undefined);
      setReleasing(false);
    }
  };

  return (
    <PageTemplate type="report" sx={sx.layout}>
      <Link as={RouterLink} to="/" sx={sx.returnLink}>
        <Image src={arrowLeftIcon} alt="Arrow left" className="returnIcon" />
        Return Home
      </Link>
      {errorMessage && <ErrorAlert error={errorMessage} />}
      <Box sx={sx.leadTextBox}>
        <Heading as="h1" sx={sx.headerText}>
          {intro.header}
        </Heading>
        {reportType === "MLR" && (
          <InstructionsAccordion
            verbiage={
              userIsEndUser
                ? accordion.MLR.stateUserDashboard
                : accordion.MLR.adminDashboard
            }
          />
        )}
        {parseCustomHtml(intro.body)}
      </Box>
      <Box sx={sx.bodyBox}>
        {reportsToDisplay ? (
          isTablet || isMobile ? (
            <MobileDashboardTable
              reportsByState={reportsToDisplay}
              reportType={reportType}
              reportId={reportId}
              openAddEditReportModal={openAddEditReportModal}
              enterSelectedReport={enterSelectedReport}
              archiveReport={toggleReportArchiveStatus}
              archiving={archiving}
              entering={entering}
              releaseReport={toggleReportLockStatus}
              releasing={releasing}
              isStateLevelUser={userIsEndUser!}
              isAdmin={userIsAdmin!}
              sxOverride={sxChildStyles}
            />
          ) : (
            <DashboardTable
              reportsByState={reportsToDisplay}
              reportType={reportType}
              reportId={reportId}
              body={body}
              openAddEditReportModal={openAddEditReportModal}
              enterSelectedReport={enterSelectedReport}
              archiveReport={toggleReportArchiveStatus}
              archiving={archiving}
              entering={entering}
              releaseReport={toggleReportLockStatus}
              releasing={releasing}
              isStateLevelUser={userIsEndUser!}
              isAdmin={userIsAdmin!}
              sxOverride={sxChildStyles}
            />
          )
        ) : (
          !errorMessage && (
            <Flex sx={sx.spinnerContainer}>
              <Spinner size="md" />
            </Flex>
          )
        )}
        {!reportsToDisplay?.length && (
          <Text sx={sx.emptyTableContainer}>{body.empty}</Text>
        )}
        {/* only show add report button to state users */}
        {userIsEndUser && (
          <Box sx={sx.callToActionContainer}>
            <Button type="submit" onClick={() => openAddEditReportModal()}>
              {body.callToAction}
            </Button>
          </Box>
        )}
      </Box>
      <AddEditReportModal
        activeState={activeState!}
        selectedReport={selectedReport!}
        reportType={reportType}
        modalDisclosure={{
          isOpen: addEditReportModalIsOpen,
          onClose: addEditReportModalOnCloseHandler,
        }}
      />
    </PageTemplate>
  );
};

interface Props {
  reportType: string;
}

const sx = {
  layout: {
    ".contentFlex": {
      maxWidth: "appMax",
      marginTop: "1rem",
      marginBottom: "3.5rem",
    },
  },
  returnLink: {
    display: "flex",
    width: "8.5rem",
    svg: {
      height: "1.375rem",
      width: "1.375rem",
      marginTop: "-0.125rem",
      marginRight: ".5rem",
    },
    textDecoration: "none",
    _hover: {
      textDecoration: "underline",
    },
    ".returnIcon": {
      width: "1.25rem",
      height: "1.25rem",
      marginTop: "0.25rem",
      marginRight: "0.5rem",
    },
  },
  leadTextBox: {
    width: "100%",
    maxWidth: "55.25rem",
    margin: "2.5rem auto",
    ".tablet &, .mobile &": {
      margin: "2.5rem 0 1rem",
    },
  },
  headerText: {
    marginBottom: "1rem",
    fontSize: "4xl",
    fontWeight: "normal",
    ".tablet &, .mobile &": {
      fontSize: "xl",
      lineHeight: "1.75rem",
      fontWeight: "bold",
    },
  },
  bodyBox: {
    maxWidth: "55.25rem",
    margin: "0 auto",
    ".desktop &": {
      width: "100%",
    },
    ".tablet &, .mobile &": {
      margin: "0",
    },
    ".ds-c-spinner": {
      "&:before": {
        borderColor: "palette.black",
      },
      "&:after": {
        borderLeftColor: "palette.black",
      },
    },
  },
  emptyTableContainer: {
    maxWidth: "75%",
    margin: "0 auto",
    textAlign: "center",
  },
  callToActionContainer: {
    marginTop: "2.5rem",
    textAlign: "center",
  },
  spinnerContainer: {
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    padding: "10",
  },
};

const sxChildStyles = {
  editReportButtonCell: {
    width: "6.875rem",
    padding: 0,
    button: {
      width: "6.875rem",
      height: "1.75rem",
      borderRadius: "0.25rem",
      textAlign: "center",
      fontSize: "sm",
      fontWeight: "normal",
      color: "palette.primary",
    },
  },
  editReport: {
    padding: "0",
    width: "2.5rem",
    ".tablet &, .mobile &": {
      width: "2rem",
    },
    img: {
      height: "1.5rem",
      minWidth: "21px",
      marginLeft: "0.5rem",
      ".tablet &, .mobile &": {
        marginLeft: 0,
      },
    },
  },
  programNameText: {
    fontSize: "md",
    fontWeight: "bold",
    width: "13rem",
    maxWidth: "13rem",
    ".tablet &, .mobile &": {
      width: "100%",
    },
  },
  adminActionCell: {
    width: "2.5rem",
    ".tablet &, .mobile &": {
      display: "flex",
    },
  },
  adminActionButton: {
    minWidth: "4.5rem",
    fontSize: "sm",
    fontWeight: "normal",
  },
};
