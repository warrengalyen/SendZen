import { useRouter } from "next/router";
import { MouseEventHandler, useEffect, useMemo, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import Button from "~/components/Button";
import CampaignInputFields from "~/components/CampaignInputFields";
import DescriptionRow from "~/components/DescriptionRow";
import LineTabs from "~/components/LineTabs";
import AdminLayout from "~/layouts/AdminLayout";
import { api } from "~/utils/api";

const initialInputValues = {
  campaignName: "",
  emailSubject: "",
  fromName: "",
};

function CampaignDetails() {
  const router = useRouter();
  const { campaignId } = router.query;
  const getCampaignInfo = api.campaigns.getCampaignInfo.useQuery({
    campaignId: campaignId as string,
  });

  const [inputValues, setInputValues] = useState(initialInputValues);

  const lists = api.lists.getLists.useQuery();
  const listData = lists?.data ?? [];

  const [selectedList, setSelectedList] = useState({ id: "", value: "" });

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
    if (lists.data && lists.data[0]) {
      setSelectedList({
        id: getCampaignInfo.data?.list?.id ?? "",
        value: getCampaignInfo.data?.list?.name ?? "",
      });
    }
  }, [lists.data]);

  const utils = api.useContext();

  const updateCampaign = api.campaigns.updateCampaign.useMutation({
    onSuccess: () => utils.campaigns.invalidate(),
  });

  const handleSaveCampaign = () => {
    toast.promise(
      updateCampaign.mutateAsync({
        campaignId: campaignId as string,
        campaignName: inputValues.campaignName,
        emailSubject: inputValues.emailSubject,
        sendFromName: inputValues.fromName,
        listId: selectedList.id,
      }),
      {
        loading: "Updating campaign...",
        success: () => {
          setTabs(tabs.map((tab) => ({ ...tab, current: !tab.current })));
          return "Campaign updated!";
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

  return (
    <>
      <Toaster />
      {getCampaignInfo.isLoading || lists.isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="mt-6 ">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="flex flex-1 flex-col gap-4 rounded-md bg-white p-6 shadow">
              <div className="mb-3">
                <LineTabs tabs={tabs} setTabs={setTabs} />
              </div>
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
                    title="From Name"
                    value={getCampaignInfo.data?.sendFromName ?? ""}
                  />
                  <DescriptionRow
                    title="Selected list"
                    value={getCampaignInfo.data?.list?.name ?? ""}
                  />
                </div>
              ) : (
                <>
                  <CampaignInputFields
                    inputValues={inputValues}
                    setInputValues={setInputValues}
                    listData={listData}
                    selectedList={selectedList}
                    setSelectedList={setSelectedList}
                  />
                  <div className="flex flex-row-reverse justify-start gap-2">
                    <Button
                      appearance="primary"
                      size="md"
                      onClick={handleSaveCampaign}
                      disabled={updateCampaign.isLoading}
                    >
                      Save
                    </Button>
                    <Button appearance="secondary" size="md">
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>
            <div className="flex-1 rounded-md bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-gray-900">
                Manage Campaign
              </h2>
              <p>Blorp</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function () {
  const router = useRouter();
  const { campaignId } = router.query;
  const getCampaignInfo = api.campaigns.getCampaignInfo.useQuery({
    campaignId: campaignId as string,
  });
  const campaignName = getCampaignInfo.data?.name ?? "";

  const pages = useMemo(() => {
    return [
      { name: "Campaigns", href: "/admin/campaigns", current: false },
      { name: campaignName ?? "", href: "#", current: true },
    ];
  }, [getCampaignInfo.data]);

  return (
    <AdminLayout pageHeading={campaignName} pages={pages}>
      <CampaignDetails />
    </AdminLayout>
  );
}
