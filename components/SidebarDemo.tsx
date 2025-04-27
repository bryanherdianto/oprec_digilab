"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconUserBolt,
  IconFileText,
  IconAddressBook,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import PersonalInformation from "./dashboard/PersonalInformation";
import ContactsAndFiles from "./dashboard/ContactsFiles";
import Essays from "./dashboard/Essays";
import { getCurrentUser, signOut } from '../backend/googleServices';

export function SidebarDemo() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [user, setUser] = useState<any>(null);

  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      id: "dashboard",
    },
    {
      label: "Personal Info",
      href: "#",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      id: "personal",
    },
    {
      label: "Contacts & Files",
      href: "#",
      icon: (
        <IconAddressBook className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      id: "contacts",
    },
    {
      label: "Essays",
      href: "#",
      icon: (
        <IconFileText className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      id: "essays",
    },
    {
      label: "Logout",
      href: "",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      id: "logout",
    },
  ];
  const [open, setOpen] = useState(false);

  const handleLinkClick = (id: React.SetStateAction<string>) => {
    setActiveSection(id);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };

    fetchUser();
  }, []);

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen",
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <a
              href="#"
              className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
            >
              <img src="/Logo.svg" alt="" className="h-7 w-7 shrink-0 object-cover" />
              <AnimatePresence>
                {open && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                    className="font-medium whitespace-pre text-black dark:text-white overflow-hidden"
                  >
                    Digital Laboratory
                  </motion.span>
                )}
              </AnimatePresence>
            </a>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <div key={idx} onClick={() => handleLinkClick(link.id)}>
                  <SidebarLink link={link} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: user?.user_metadata?.full_name || user?.user_metadata?.display_name,
                href: "#",
                icon: (
                  <img
                    src={user?.user_metadata?.avatar_url || "/default-avatar.jpg"}
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                    referrerPolicy="no-referrer"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard activeSection={activeSection} />
    </div>
  );
}

const Dashboard = ({ activeSection }: { activeSection: string }) => {
  const router = useRouter();
  useEffect(() => {
    if (activeSection === 'logout') {
      const doLogout = async () => {
        await signOut();
        router.push('/login');
      };
      doLogout();
    }
  }, [activeSection, router]);
  const renderSection = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInformation />;
      case 'contacts':
        return <ContactsAndFiles />;
      case 'essays':
        return <Essays />;
      default:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[70%]">
            <div className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800 p-4 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Application Overview</h2>
              <p>Welcome to Digital Laboratory application system.</p>
              <p className="mt-2">Complete your application by filling out all required sections.</p>
              <div className="mt-4">
                <h3 className="font-medium">Application Progress</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 dark:bg-gray-700">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <p className="text-sm mt-1">45% Completed</p>
              </div>
            </div>
            <div className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800 p-4 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Recent Announcements</h2>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="font-medium">Application Deadline</h3>
                  <p className="text-sm text-gray-500">April 30, 2025</p>
                </div>
                <div className="border-b pb-2">
                  <h3 className="font-medium">Interview Schedule</h3>
                  <p className="text-sm text-gray-500">May 5-10, 2025</p>
                </div>
                <div>
                  <h3 className="font-medium">Results Announcement</h3>
                  <p className="text-sm text-gray-500">May 20, 2025</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-black overflow-hidden">
        <div className="p-4 md:p-10 flex-1 overflow-auto">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};
