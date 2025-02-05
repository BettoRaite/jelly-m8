import { useEffect, useState } from "react";
import { UsersTab } from "./tabs/usersTab/UsersTab";
import { ProfilesTab } from "./tabs/profilesTab/ProfilesTab";

type Tab = "users" | "profiles";
const TABS: Tab[] = ["users", "profiles"];
const KEY = "dashboard-tab";

export function Tabs() {
  const [tab, setTab] = useState<Tab>("users");
  useEffect(() => {
    const t = localStorage.getItem(KEY) as Tab;
    setTab(t ?? "users");
    console.log(t);
  }, []);

  let selectedTab = <UsersTab />;
  switch (tab) {
    case "profiles": {
      selectedTab = <ProfilesTab />;
    }
  }
  function handleSelect(tab: Tab) {
    setTab(tab);
    localStorage.setItem(KEY, tab);
  }
  return (
    <>
      <div className="">
        <div className="flex border-b border-gray-300 mb-4 justify-center gap-10 bg-white shadow-lg p-4 rounded-md">
          {TABS.map((tabValue, index) => (
            <button
              onClick={() => handleSelect(tabValue)}
              key={index}
              type="button"
              className={`capitalize py-2 px-4 text-lg font-medium transition-colors duration-300
                  ${
                    tab === tabValue
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-blue-600"
                  }`}
            >
              {tabValue}
            </button>
          ))}
        </div>
      </div>
      {selectedTab}
    </>
  );
}
