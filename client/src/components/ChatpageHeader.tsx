import { NotificationsNone, Search } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import { SetStateAction, useEffect, useRef, useState } from "react";
import NotificationsMenu from "./menus/NotificationsMenu";
import ProfileSettingsMenu from "./menus/ProfileSettingsMenu";
import SearchUsersDrawer from "./utils/SearchUsersDrawer";
import getCustomTooltip from "./utils/CustomTooltip";
import logo from "../animations/app_logo.json";
import LottieAnimation from "./utils/LottieAnimation";
import { useSelector } from "react-redux";
import { selectAppState } from "../store/slices/AppSlice";
import {
  ChatType,
  ClickEventHandler,
  DialogBodySetter,
  SpanRef,
} from "../utils/AppTypes";

interface Props {
  chats: ChatType[];
  setDialogBody: DialogBodySetter;
}

const arrowStyles = { color: "#666" };
const tooltipStyles = {
  maxWidth: 250,
  color: "#eee",
  fontFamily: "Trebuchet MS",
  fontSize: 16,
  padding: "5px 15px",
  backgroundColor: "#666",
};
const CustomTooltip = getCustomTooltip(arrowStyles, tooltipStyles);

const ChatpageHeader = ({ chats, setDialogBody }: Props) => {
  const { loggedInUser } = useSelector(selectAppState);
  const appGif = useRef<HTMLSpanElement>();
  const notifCount = loggedInUser?.notifications?.length || "";

  const [animateNotif, setAnimateNotif] = useState(false);
  const [notificationsMenuAnchor, setNotificationsMenuAnchor] =
    useState<HTMLElement | null>(null);
  const [profileSettingsMenuAnchor, setProfileSettingsMenuAnchor] =
    useState<HTMLElement | null>(null);

  const openNotificationMenu: ClickEventHandler = (e) =>
    setNotificationsMenuAnchor(e.target as SetStateAction<HTMLElement | null>);

  const openProfileSettingsMenu: ClickEventHandler = (e) =>
    setProfileSettingsMenuAnchor(
      e.target as SetStateAction<HTMLElement | null>
    );

  // For opening/closing 'search users' left drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (animateNotif) return;
    setAnimateNotif(true);
    let timeout = setTimeout(() => {
      setAnimateNotif(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [notifCount]);

  return (
    <div
      className={`chatpageHeader chatpageView col-1 d-flex flex-column justify-content-between align-items-center user-select-none`}
    >
      <div className={`align-items-center`}>
      {/* App Logo */}
      <div className={`mb-4`}>
        <LottieAnimation
          ref={appGif as SpanRef}
          className={"d-none d-sm-inline-block mt-2 me-sm-1 me-md-2"}
          style={{ width: "30px", height: "30px" }}
          animationData={logo}
        />
      </div>
      {/* User notification*/}
      <div className={`mb-1`}>
        <CustomTooltip title={`Notifications`} placement="top-end" arrow>
          <IconButton
            className="position-relative mx-1"
            onClick={openNotificationMenu}
            sx={{
              color: "#999999",
              ":hover": { backgroundColor: "#aaaaaa20" },
            }}
          >
            {notifCount && (
              <span
                className={`notifBadge ${
                  animateNotif ? "notifCountChange" : ""
                } badge rounded-circle bg-danger 
               position-absolute`}
                style={{
                  fontSize: notifCount > 99 ? 12 : 13,
                  top: -2,
                  right: notifCount > 99 ? -11 : notifCount > 9 ? -5 : -2,
                  padding:
                    notifCount > 99
                      ? "6px 5px"
                      : notifCount > 9
                      ? "4px 5px"
                      : "4px 7px",
                }}
              >
                {!notifCount ? "" : notifCount > 99 ? "99+" : notifCount}
              </span>
            )}
            <NotificationsNone className={`text-light`} />
          </IconButton>
        </CustomTooltip>
      </div>
      <NotificationsMenu
          chats={chats}
          anchor={notificationsMenuAnchor as HTMLElement}
          setAnchor={setNotificationsMenuAnchor}
      />

      {/* Search Users to create/access chat */}
      <CustomTooltip title="Search or Start a new chat" placement="bottom-end" arrow>
        <IconButton
          sx={{
            color: "#999999",
            ":hover": { backgroundColor: "#aaaaaa20" },
          }}
          className={`position-relative mx-1`}
          onClick={() => setIsDrawerOpen(true)}
        >
          <Search className={`text-light`}/>
        </IconButton>
      </CustomTooltip>
      <SearchUsersDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />
      </div>

      {/* Profile settings  */}
      <div>
        <CustomTooltip title="Profile Settings" placement="bottom-end" arrow>
          <IconButton
            className="mx-md-3 mx-lg-4"
            sx={{
              color: "#999999",
              ":hover": { backgroundColor: "#aaaaaa20" },
            }}
            onClick={openProfileSettingsMenu}
          >
            <Avatar
              alt="LoggedInUser"
              className="img-fluid"
              src={loggedInUser?.profilePic}
            />
          </IconButton>
        </CustomTooltip>
      </div>
      <ProfileSettingsMenu
          anchor={profileSettingsMenuAnchor as HTMLElement}
          setAnchor={setProfileSettingsMenuAnchor}
          setDialogBody={setDialogBody}
      />
    </div>
  );
};

export default ChatpageHeader;
