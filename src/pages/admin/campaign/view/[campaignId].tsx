import { PencilSquareIcon, WindowIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { parseAndGenerateBlocks } from "~/campaignEditor/utils/campaignEditorUtils";
import renderToHtml from "~/campaignEditor/utils/renderToHtml";
import Button from "~/components/Button";
import CampaignInputFields from "~/components/CampaignInputFields";
import DescriptionRow from "~/components/DescriptionRow";
import LineTabs from "~/components/LineTabs";
import SendEmailModal from "~/components/SendEmailModal";
import VerticalSteps from "~/components/VerticalSteps";
import AdminLayout from "~/layouts/AdminLayout";
import { api } from "~/utils/api";
import formatDateTime from "~/utils/formatDateTime";

const initialInputValues = {
  campaignName: "",
  emailSubject: "",
  fromName: "",
};

function CampaignDetails() {
  const router = useRouter();
  const utils = api.useContext();
  const { campaignId } = router.query;
  const getCampaignInfo = api.campaigns.getCampaignInfo.useQuery({
    campaignId: campaignId as string,
  });

  const [inputValues, setInputValues] = useState(initialInputValues);

  const scheduleCampaign = api.campaigns.scheduleCampaign.useMutation({
    onSuccess: () => utils.campaigns.invalidate(),
  });

  const lists = api.lists.getLists.useQuery();
  const listData = lists?.data ?? [];

  const [selectedList, setSelectedList] = useState({ id: "", value: "" });
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState(false);

  useEffect(() => {
    if (getCampaignInfo.data) {
      setInputValues({
        campaignName: getCampaignInfo.data.name,
        emailSubject: getCampaignInfo.data.subject,
        fromName: getCampaignInfo.data.sendFromName,
      });
    }
  }, [getCampaignInfo.data]);

  useEffect(() => {
    if (getCampaignInfo.data) {
      setSelectedList({
        id: getCampaignInfo.data?.list?.id ?? "",
        value: getCampaignInfo.data?.list?.name ?? "",
      });
    }
  }, [getCampaignInfo.data]);

  const updateCampaign = api.campaigns.updateCampaign.useMutation({
    onSuccess: () => utils.campaigns.invalidate(),
  });

  const handleSaveCampaign = () => {
    void toast.promise(
      updateCampaign.mutateAsync({
        campaignId: campaignId as string,
        campaignName: inputValues.campaignName,
        emailSubject: inputValues.emailSubject,
        sendFromName: inputValues.fromName,
        listId: selectedList.id,
      }),
      {
        loading: "Saving changes...",
        success: () => {
          setTabs(tabs.map((tab) => ({ ...tab, current: !tab.current })));
          return "Changes saved!";
        },
        error: "Error updating campaign",
      },
      {
        position: "bottom-center",
      }
    );
  };

  const [tabs, setTabs] = useState([
    { name: "Saved Details", current: true },
    { name: "Edit Details", current: false },
  ]);

  const [blocks, setBlocks] = useState([]);
  const [globalStyles, setGlobalStyles] = useState({});

  useEffect(() => {
    if (getCampaignInfo.data?.blocks && blocks.length === 0) {
      const newBlocks = parseAndGenerateBlocks(getCampaignInfo.data.blocks);
      if (newBlocks) {
        setBlocks(newBlocks);
      }
      if (getCampaignInfo.data.globalStyles) {
        const globalStyles = JSON.parse(getCampaignInfo.data.globalStyles);

        if (globalStyles) {
          setGlobalStyles(globalStyles);
        }
      }
    }
  }, [getCampaignInfo.data]);

  return (
    <>
      {getCampaignInfo.isLoading || lists.isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <SendEmailModal
            open={isSendEmailModalOpen}
            setOpen={setIsSendEmailModalOpen}
            sendFromName={getCampaignInfo.data?.sendFromName ?? ""}
            subject={getCampaignInfo.data?.subject ?? ""}
            list={getCampaignInfo.data?.list ?? null}
            htmlContentFunc={() => renderToHtml(blocks, globalStyles)}
            campaignName={getCampaignInfo.data?.name ?? ""}
            campaignId={getCampaignInfo.data?.id ?? ""}
          />
          <div className="mt-6">
            <div className="flex flex-col gap-8 md:flex-row">
              <div className="flex flex-1 flex-col gap-4 rounded-md bg-white p-6 shadow">
                {getCampaignInfo.data?.hasSent ? (
                  <h2 className="ml-6 text-xl font-semibold">Details</h2>
                ) : (
                  <div className="mb-3">
                    <LineTabs tabs={tabs} setTabs={setTabs} />
                  </div>
                )}
                {tabs[0]?.current ? (
                  <div className="flex flex-col gap-3">
                    <DescriptionRow
                      title="Campaign Name"
                      value={getCampaignInfo.data?.name ?? ""}
                    />
                    <DescriptionRow
                      title="Email Subject"
                      value={getCampaignInfo.data?.subject ?? ""}
                    />
                    <DescriptionRow
                      title="Sender Name"
                      value={getCampaignInfo.data?.sendFromName ?? ""}
                    />
                    <DescriptionRow
                      title="Selected list"
                      value={getCampaignInfo.data?.list?.name ?? ""}
                    />
                  </div>
                ) : tabs[1]?.current && !getCampaignInfo.data?.hasSent ? (
                  <>
                    <CampaignInputFields
                      inputValues={inputValues}
                      setInputValues={setInputValues}
                      listData={listData}
                      selectedList={selectedList}
                      setSelectedList={setSelectedList}
                    />
                    <div className="mt-4 flex flex-row-reverse justify-start gap-2">
                      <Button
                        appearance="primary"
                        size="md"
                        onClick={handleSaveCampaign}
                        disabled={updateCampaign.isLoading}
                      >
                        Save
                      </Button>
                      <Button
                        appearance="secondary"
                        size="md"
                        onClick={() => {
                          setTabs(
                            tabs.map((tab) => ({
                              ...tab,
                              current: !tab.current,
                            }))
                          );
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
              <div className="flex-1 rounded-md bg-white p-6 shadow">
                <h2 className="text-xl font-semibold text-gray-900">
                  Manage Campaign
                </h2>
                <div className="mt-6 flex flex-col gap-4">
                  <div className="flex w-full items-center justify-start rounded-md bg-gray-100 p-8">
                    <VerticalSteps
                      steps={[
                        {
                          name: "Step 1",
                          description:
                            "Create a new campaign and enter your campaign details",
                          status: "complete",
                        },
                        {
                          name: "Step 2",
                          description:
                            "Design your campaign with our drag and drop editor",
                          status: `${
                            getCampaignInfo.data?.hasSent
                              ? "complete"
                              : "current"
                          }`,
                        },
                        {
                          name: "Step 3",
                          description:
                            "Send your campaign and have it delivered to your recipients",
                          status: `${
                            getCampaignInfo.data?.hasSent
                              ? "complete"
                              : "upcoming"
                          }`,
                        },
                      ]}
                    />
                  </div>
                  <div
                    className={`${
                      getCampaignInfo.data?.hasSent
                        ? "grid-cols-1"
                        : "grid-cols-2"
                    } grid gap-4`}
                  >
                    {!getCampaignInfo.data?.hasSent && (
                      <Button
                        appearance="secondary"
                        size="md"
                        disabled={
                          getCampaignInfo.isLoading ||
                          getCampaignInfo.data?.hasSent ||
                          getCampaignInfo.data?.scheduledSend
                        }
                        onClick={() =>
                          void router.push(
                            `/admin/campaign/edit/${String(campaignId)}`
                          )
                        }
                      >
                        <div className="flex items-center justify-center gap-2">
                          <p className="col-span-1">Edit</p>
                          <PencilSquareIcon className="mb-[1px] h-4 w-4" />
                        </div>
                      </Button>
                    )}
                    <Button
                      appearance="secondary"
                      size="md"
                      onClick={() => {
                        void router.push(
                          `/admin/campaign/preview/${String(campaignId)}`
                        );
                      }}
                      disabled={!getCampaignInfo?.data?.blocks}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <p className="col-span-1">Preview</p>
                        <WindowIcon className="mb-[1px] h-4 w-4" />
                      </div>
                    </Button>
                  </div>
                  {getCampaignInfo.data?.hasSent ? (
                    <Button appearance="success" size="md">
                      Campaign sent
                    </Button>
                  ) : getCampaignInfo.data?.scheduledSend ? (
                    <Button
                      appearance="success"
                      size="md"
                      onClick={() => {
                        void toast.promise(
                          scheduleCampaign.mutateAsync({
                            scheduledSend: null,
                            campaignId: String(campaignId),
                            unschedule: true,
                          }),
                          {
                            loading: "Unscheduling...",
                            success: "Campaign unscheduled",
                            error: "Error unscheduling campaign",
                          },
                          {
                            position: "bottom-center",
                          }
                        );
                      }}
                    >
                      Unschedule
                    </Button>
                  ) : (
                    <Button
                      appearance="primary"
                      size="md"
                      disabled={
                        !getCampaignInfo?.data?.blocks ||
                        getCampaignInfo.data?.hasSent
                      }
                      onClick={() => setIsSendEmailModalOpen(true)}
                    >
                      <p className="col-span-1">Send or Schedule Campaign</p>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default function CampaignIdPage() {
  const router = useRouter();
  const { campaignId } = router.query;
  const getCampaignInfo = api.campaigns.getCampaignInfo.useQuery({
    campaignId: campaignId as string,
  });
  const campaignName = getCampaignInfo.data?.name ?? "";

  const pages = useMemo(() => {
    return [
      { name: "Campaigns", href: "/admin/campaigns", current: false },
      {
        name: `${campaignName}` ?? "",
        href: "#",
        current: true,
      },
    ];
  }, [campaignName, getCampaignInfo.data]);

  return (
    <AdminLayout pageHeading={`${campaignName}`} pages={pages}>
      <CampaignDetails />
    </AdminLayout>
  );
}
